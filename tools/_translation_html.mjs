import {createHash} from "node:crypto";
import {parseHTML} from "linkedom";

export const MODEL = "Xenova/opus-mt-ko-en";
export const REVISION = "d9fa1ac6008242100fecb4fff9b0a5917a1be81f";
export const VERSION = `opus-q8-${REVISION}-sentences-v1`;
export const EXCLUDED = 'script,style,noscript,pre,code,kbd,samp,svg,math,mjx-container,textarea,input,select,iframe,.notranslate,[translate="no"],.vc-language,#quarto-search-results,.quarto-search-panel,hypothesis-sidebar,hypothesis-adder,hypothesis-notebook';
export const hasKorean = text => /[\uac00-\ud7a3\u3131-\u318e]/.test(text);
export const keyFor = text => createHash("sha256").update(VERSION + "\0" + text).digest("hex");

export function fragments(html) {
  const {document} = parseHTML(html);
  if (!document.documentElement.lang.startsWith("ko")) return null;
  // Match browser parsing: linkedom initially leaves character references
  // such as &nbsp; as separate adjacent text nodes.
  document.body.normalize();
  const texts = new Set();
  const walker = document.createTreeWalker(document.body, 4);
  let node;
  while ((node = walker.nextNode())) {
    if (hasKorean(node.data) && node.parentElement && !node.parentElement.closest(EXCLUDED)) texts.add(node.data.trim());
  }
  return [...texts];
}

export function chunks(text, limit = 180) {
  const output = [];
  let current = "";
  for (const {segment} of new Intl.Segmenter("ko", {granularity: "sentence"}).segment(text)) {
    const points = Array.from(segment);
    for (let i = 0; i < points.length; i += limit) {
      const part = points.slice(i, i + limit).join("");
      if (Array.from(current + part).length > limit) { output.push(current); current = ""; }
      current += part;
    }
  }
  if (current) output.push(current);
  return output;
}

export function embed(html, translations) {
  const {document} = parseHTML(html);
  document.getElementById("vc-translation-data")?.remove();
  const data = document.createElement("script");
  data.id = "vc-translation-data";
  data.type = "application/json";
  // JSON is text, never executable HTML, even if a source or translation
  // contains a literal closing script tag.
  data.textContent = JSON.stringify({version: 1, excluded: EXCLUDED, model: MODEL, translations}).replaceAll("<", "\\u003c");
  document.body.append(data);
  return document.toString();
}

export function check(html) {
  const texts = fragments(html);
  if (texts === null) return;
  const {document} = parseHTML(html);
  const data = JSON.parse(document.getElementById("vc-translation-data")?.textContent || "null");
  if (data?.version !== 1 || data.excluded !== EXCLUDED) throw new Error("Missing/invalid translation data");
  for (const text of texts) {
    if (!Object.hasOwn(data.translations, text) || typeof data.translations[text] !== "string" || !data.translations[text].trim()) throw new Error(`Missing translation: ${text.slice(0, 80)}`);
  }
}
