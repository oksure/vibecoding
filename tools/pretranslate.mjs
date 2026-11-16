#!/usr/bin/env node
// Translate the rendered Korean web edition at build time. Manuscripts and
// the separately maintained English/PDF edition are not modified.
import {readFile, writeFile, mkdir, rename, readdir} from "node:fs/promises";
import {resolve, join, dirname} from "node:path";
import {availableParallelism} from "node:os";
import {pathToFileURL} from "node:url";
import {MODEL, REVISION, VERSION, hasKorean, keyFor, fragments, chunks, embed, check} from "./_translation_html.mjs";

const CACHE = resolve(".cache/page-translations/ko-en.json");
async function atomicJson(file, data) {
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file + ".tmp", JSON.stringify(data), "utf8");
  await rename(file + ".tmp", file);
}
async function htmlFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "site_libs") output.push(...await htmlFiles(path));
    } else if (entry.name.endsWith(".html")) output.push(path);
  }
  return output.sort();
}

export async function prepare(pages, cache, translate, save = async () => {}, glossary = {}) {
  const texts = [...new Set(pages.flatMap(page => page.texts))];
  let added = 0;
  for (const text of texts) {
    if (Object.hasOwn(glossary, text) && typeof glossary[text] === "string" && glossary[text].trim()) {
      for (const page of pages) if (page.texts.includes(text)) page.translations[text] = glossary[text];
      continue;
    }
    const pieces = [];
    for (const part of chunks(text)) {
      if (!hasKorean(part)) { pieces.push(part); continue; }
      const source = part.trim();
      const key = keyFor(source);
      let entry = cache[key];
      if (entry?.source !== source || typeof entry.translation !== "string" || !entry.translation.trim()) {
        const translation = await translate(source);
        if (typeof translation !== "string" || !translation.trim()) throw new Error(`Empty translation: ${source.slice(0, 80)}`);
        entry = cache[key] = {source, translation: translation.trim()};
        added++;
        if (added % 10 === 0) { await save(); console.log(`translated ${added} new fragments`); }
      }
      pieces.push(part.match(/^\s*/)[0] + entry.translation + part.match(/\s*$/)[0]);
    }
    // Keep the completed fragments beside the source for this build only.
    for (const page of pages) if (page.texts.includes(text)) page.translations[text] = pieces.join(" ").trim();
  }
  await save();
  return added;
}

async function main() {
  const args = process.argv.slice(2);
  const directories = args.filter(arg => !arg.startsWith("--"));
  if (!directories.length) directories.push("_site");
  const pages = [];
  for (const directory of directories) {
    for (const file of await htmlFiles(resolve(directory))) {
      const html = await readFile(file, "utf8");
      const texts = fragments(html);
      if (texts !== null) pages.push({file, html, texts, translations: {}});
    }
  }
  if (!pages.length) throw new Error("No Korean HTML pages found");
  if (args.includes("--check")) {
    for (const page of pages) check(page.html);
    console.log(`Verified prebuilt English on ${pages.length} Korean pages`);
    return;
  }
  let entries = {};
  // The generated seed makes the first deployment (and cache eviction) reuse
  // the existing published text without another full translation pass.
  for (const file of [resolve("translations/ko-en.seed.json"), CACHE]) {
    try {
      const stored = JSON.parse(await readFile(file, "utf8"));
      if (stored.version === VERSION) Object.assign(entries, stored.entries);
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const glossary = JSON.parse(await readFile(resolve("translations/glossary.ko-en.json"), "utf8"));
  const sources = new Set(pages.flatMap(page => page.texts.filter(text => !Object.hasOwn(glossary, text)).flatMap(text => chunks(text).filter(hasKorean).map(part => part.trim()))));
  const missing = [...sources].filter(text => entries[keyFor(text)]?.source !== text);
  console.log(`${pages.length} pages, ${sources.size} unique fragments, ${missing.length} new/changed`);
  if (args.includes("--plan")) return;
  let model;
  const translate = async text => {
    if (!model) {
      const {pipeline, env} = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      env.cacheDir = resolve(".cache/translation-models");
      model = await pipeline("translation", MODEL, {
        revision: REVISION, dtype: "q8", device: "cpu",
        session_options: {intraOpNumThreads: Math.min(4, availableParallelism()), interOpNumThreads: 1}
      });
    }
    return (await model(text, {max_new_tokens: 512, num_beams: 1, do_sample: false}))[0].translation_text;
  };
  const save = () => atomicJson(CACHE, {version: VERSION, entries});
  try {
    const added = await prepare(pages, entries, translate, save, glossary);
    if (!args.includes("--cache-only")) {
      // Do not change any deployable page until every translation succeeded.
      for (const page of pages) {
        const html = embed(page.html, page.translations);
        check(html);
        await writeFile(page.file, html, "utf8");
      }
    }
    console.log(`English ready: ${pages.length} pages, ${added} new fragments; unchanged text reused`);
  } finally {
    await save();
    if (model) await model.dispose();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
