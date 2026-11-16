#!/usr/bin/env node
// Attach saved English to the rendered Korean web edition. This command does
// not generate translations, call APIs, or run a translation model.
import {readFile, writeFile, readdir} from "node:fs/promises";
import {resolve, join} from "node:path";
import {pathToFileURL} from "node:url";
import {hasKorean, fragments, embed, check} from "./_translation_html.mjs";
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

export function curatedTranslation(text, glossary) {
  if (Object.hasOwn(glossary,text)) return glossary[text];
  // A title or label may be wrapped by an existing link or decorative span.
  const parts = text.split(/(<\/?v\d+\/?>)/g);
  if (!parts.every(part => part.startsWith("<") || !part.trim() || Object.hasOwn(glossary,part.trim()) || !hasKorean(part))) return undefined;
  return parts.map(part => {
    if (part.startsWith("<") || !part.trim() || !Object.hasOwn(glossary,part.trim())) return part;
    return part.match(/^\s*/)[0] + glossary[part.trim()] + part.match(/\s*$/)[0];
  }).join("");
}

export async function prepare(pages, saved) {
  for (const text of new Set(pages.flatMap(page => page.texts))) {
    const english = curatedTranslation(text,saved);
    if (typeof english !== "string" || !english.trim()) throw new Error(`Missing saved English translation: ${text.slice(0,160)}`);
    validateTranslation(text,english);
    for (const page of pages) if (page.texts.includes(text)) page.translations[text] = english;
  }
}

async function main() {
  const args = process.argv.slice(2);
  for (const arg of args) if (arg.startsWith("--") && !["--check","--plan"].includes(arg)) throw new Error(`Unknown option: ${arg}`);
  const directories = args.filter(arg => !arg.startsWith("--"));
  if (!directories.length) directories.push("_site");
  const pages = [];
  for (const directory of directories) {
    for (const file of await htmlFiles(resolve(directory))) {
      const html = await readFile(file,"utf8"), texts = fragments(html);
      if (texts !== null) pages.push({file,html,texts,translations:{}});
    }
  }
  if (!pages.length) throw new Error("No Korean HTML pages found");
  if (args.includes("--check")) {
    for (const page of pages) check(page.html);
    console.log(`Verified saved English on ${pages.length} Korean pages`);
    return;
  }
  const saved = {
    ...JSON.parse(await readFile(resolve("translations/glossary.ko-en.json"),"utf8")),
    ...JSON.parse(await readFile(resolve("translations/reviewed.ko-en.json"),"utf8"))
  };
  const texts = [...new Set(pages.flatMap(page => page.texts))];
  const missing = texts.filter(text => !curatedTranslation(text,saved));
  console.log(`${pages.length} pages, ${texts.length} unique text units, ${missing.length} missing saved translations`);
  if (args.includes("--plan")) return;
  await prepare(pages,saved);
  // Validate every output before touching any deployable file.
  const outputs = pages.map(page => {
    const html = embed(page.html,page.translations); check(html);
    return {file:page.file,html};
  });
  for (const output of outputs) await writeFile(output.file,output.html,"utf8");
  console.log(`English ready on ${pages.length} pages; no model or API used`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {console.error(error);process.exitCode=1;});
}
