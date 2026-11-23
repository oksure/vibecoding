#!/usr/bin/env node
// Attach saved English to the rendered Korean web edition. This command does
// not generate translations, call APIs, or run a translation model.
import {readFile, writeFile, readdir, mkdir, appendFile} from "node:fs/promises";
import {resolve, join, relative, dirname} from "node:path";
import {pathToFileURL} from "node:url";
import {hasKorean, fragments, embed, check, untranslatedDiagrams} from "./_translation_html.mjs";
import {validateTranslation} from "./_translation_quality.mjs";

async function htmlFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "site_libs") output.push(...await htmlFiles(path));
    } else if (entry.name.endsWith(".html")) output.push(path);
  }
  return output.sort();
}

function savedText(text, saved) {
  if (Object.hasOwn(saved,text)) return saved[text];
  // Quarto's date: today changes without a manuscript edit. Format only an
  // isolated display date; prose still requires an exact saved translation.
  const match = text.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (!match) return undefined;
  const [,year,month,day] = match;
  const date = new Date(Date.UTC(Number(year),Number(month)-1,Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month)-1 || date.getUTCDate() !== Number(day)) return undefined;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[Number(month)-1]} ${Number(day)}, ${year}`;
}

export function curatedTranslation(text, glossary) {
  const exact = savedText(text,glossary);
  if (exact !== undefined) return exact;
  // A title or label may be wrapped by an existing link or decorative span.
  const parts = text.split(/(<\/?v\d+\/?>)/g);
  if (!parts.every(part => part.startsWith("<") || !part.trim() || savedText(part.trim(),glossary) !== undefined || !hasKorean(part))) return undefined;
  return parts.map(part => {
    if (part.startsWith("<") || !part.trim()) return part;
    const translated = savedText(part.trim(),glossary);
    if (translated === undefined) return part;
    return part.match(/^\s*/)[0] + translated + part.match(/\s*$/)[0];
  }).join("");
}

export async function prepare(pages, saved, {allowMissing = false} = {}) {
  for (const text of new Set(pages.flatMap(page => page.texts))) {
    const english = curatedTranslation(text,saved);
    if (english === undefined && allowMissing) continue;
    if (typeof english !== "string" || !english.trim()) throw new Error(`Missing saved English translation: ${text.slice(0,160)}`);
    validateTranslation(text,english);
    for (const page of pages) if (page.texts.includes(text)) page.translations[text] = english;
  }
}

export function translationReport(pages, saved) {
  const missing = new Map();
  const pendingPages = [];
  for (const page of pages) {
    const file = relative(process.cwd(),page.file).split("\\").join("/");
    const texts = [...page.texts.filter(text => curatedTranslation(text,saved) === undefined),...(page.diagrams || [])];
    if (texts.length) pendingPages.push({file,missingCount:texts.length});
    for (const source of texts) {
      if (!missing.has(source)) missing.set(source,{source,pages:[]});
      missing.get(source).pages.push(file);
    }
  }
  return {version:1,totalPages:pages.length,readyPages:pages.length-pendingPages.length,pendingPages,missing:[...missing.values()]};
}

export function reportSummary(report) {
  const lines = ["## English translation readiness", "",
    `- Pages ready for EN: ${report.readyPages}/${report.totalPages}`,
    `- Pages awaiting translation: ${report.pendingPages.length}`,
    `- Unique text units awaiting translation: ${report.missing.length}`, "",
    "Missing English does not block the Korean manuscript build or publication. EN is disabled only on pages awaiting translation. Students submit the original manuscript; the teaching team adds English separately.", ""];
  for (const page of report.pendingPages) lines.push(`- \`${page.file.replace(/[\r\n`]/g," ")}\`: ${page.missingCount} missing text units`);
  lines.push("", "The translation-backlog artifact lists the exact source text and affected pages. No translation API or model was called.", "");
  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const directories = [], flags = new Set();
  let reportFile;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--report") {
      reportFile = args[++i];
      if (!reportFile || reportFile.startsWith("--")) throw new Error("--report requires a file path");
    } else if (["--check","--plan","--allow-missing"].includes(arg)) flags.add(arg);
    else if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    else directories.push(arg);
  }
  const allowMissing = flags.has("--allow-missing");
  if (!directories.length) directories.push("_site");
  const pages = [];
  for (const directory of directories) {
    for (const file of await htmlFiles(resolve(directory))) {
      const html = await readFile(file,"utf8"), texts = fragments(html);
      if (texts !== null) pages.push({file,html,texts,diagrams:untranslatedDiagrams(html),translations:{}});
    }
  }
  if (!pages.length) throw new Error("No Korean HTML pages found");
  if (flags.has("--check")) {
    let pending = 0;
    for (const page of pages) if (check(page.html,{allowMissing}).pending) pending++;
    console.log(`Verified ${pages.length-pending} English-ready pages and ${pending} Korean pages awaiting translation`);
    return;
  }
  const saved = {
    ...JSON.parse(await readFile(resolve("translations/glossary.ko-en.json"),"utf8")),
    ...JSON.parse(await readFile(resolve("translations/reviewed.ko-en.json"),"utf8"))
  };
  const report = translationReport(pages,saved);
  const texts = new Set(pages.flatMap(page => page.texts));
  console.log(`${pages.length} pages, ${texts.size} unique text units, ${report.missing.length} missing saved translations`);
  if (reportFile) {
    await mkdir(dirname(resolve(reportFile)),{recursive:true});
    await writeFile(resolve(reportFile),JSON.stringify(report,null,2)+"\n","utf8");
  }
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,reportSummary(report),"utf8");
  if (flags.has("--plan")) return;
  await prepare(pages,saved,{allowMissing});
  // Validate every output before touching any deployable file.
  const outputs = pages.map(page => {
    const pending = page.texts.some(text => !Object.hasOwn(page.translations,text));
    const html = embed(page.html,page.translations,{pending}); check(html,{allowMissing});
    return {file:page.file,html};
  });
  for (const output of outputs) await writeFile(output.file,output.html,"utf8");
  console.log(`English ready on ${report.readyPages} pages; ${report.pendingPages.length} pages remain Korean until translated; no model or API used`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {console.error(error);process.exitCode=1;});
}
