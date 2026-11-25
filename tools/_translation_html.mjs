import {readFileSync} from "node:fs";
import vm from "node:vm";
import {validateTranslation} from "./_translation_quality.mjs";
import {parseHTML} from "linkedom";
import {embedDiagrams, missingDiagrams} from "./_translation_diagrams.mjs";

export const VERSION = "direct-ko-en-blocks-v1";
export const EXCLUDED = 'script,style,noscript,pre,code,kbd,samp,svg,math,mjx-container,textarea,input,select,iframe,.notranslate,[translate="no"],.vc-language,#quarto-search-results,.quarto-search-panel,hypothesis-sidebar,hypothesis-adder,hypothesis-notebook';
export const hasKorean = text => /[\uac00-\ud7a3\u3131-\u318e]/.test(text);

// Use exactly the same collector/renderer at build time and in the reader.
const helper = readFileSync(new URL("../assets/language-toggle.html", import.meta.url), "utf8").split("// BEGIN SHARED TRANSLATION DOM")[1].split("// END SHARED TRANSLATION DOM")[0];
const makeDOM = vm.runInNewContext(helper + "; translationDOM");
export function unitsFor(html) {
  const {document} = parseHTML(html);
  if (!document.documentElement.lang.startsWith("ko")) return null;
  document.body.normalize();
  return makeDOM(document, EXCLUDED);
}
export function fragments(html) {
  const dom = unitsFor(html);
  return dom === null ? null : [...new Set(dom.units.map(unit => unit.source))];
}
export function requiredFragments(html) {
  const dom = unitsFor(html);
  return dom === null ? null : [...new Set(dom.units.filter(unit => unit.required).map(unit => unit.source))];
}
export function untranslatedDiagrams(html) {
  const {document} = parseHTML(html);
  return missingDiagrams(document);
}
export function embed(html, translations, {pending = false} = {}) {
  const {document} = parseHTML(html);
  embedDiagrams(document);
  pending ||= missingDiagrams(document,{requireEmbedded:true}).length > 0;
  document.getElementById("vc-translation-data")?.remove();
  const data = document.createElement("script");
  data.id = "vc-translation-data";
  data.type = "application/json";
  // JSON is text, never executable HTML, even if a source or translation
  // contains a literal closing script tag.
  data.textContent = JSON.stringify({version: 2, generation: VERSION, excluded: EXCLUDED, method: "direct-ko-en", status: pending ? "pending" : "ready", translations}).replaceAll("<", "\\u003c");
  document.body.append(data);
  return document.toString();
}

export function check(html, {allowMissing = false} = {}) {
  const texts = fragments(html);
  if (texts === null) return;
  const {document} = parseHTML(html);
  const data = JSON.parse(document.getElementById("vc-translation-data")?.textContent || "null");
  if (data?.version !== 2 || data.generation !== VERSION || data.excluded !== EXCLUDED || !data.translations || typeof data.translations !== "object" || Array.isArray(data.translations)) throw new Error("Missing/invalid translation data");
  if (data.status !== undefined && !["ready","pending"].includes(data.status)) throw new Error("Invalid translation status");
  const dom = unitsFor(html);
  const missing = [...new Set(dom.units.filter(unit => unit.required && !Object.hasOwn(data.translations,unit.source)).map(unit=>unit.source)),...missingDiagrams(document,{requireEmbedded:true})];
  if (missing.length && (!allowMissing || data.status !== "pending")) throw new Error(`Missing translation: ${missing[0].slice(0, 80)}`);
  if (!missing.length && data.status === "pending") throw new Error("Complete translations must be marked ready");
  for (const unit of dom.units) {
    if (!Object.hasOwn(data.translations, unit.source)) continue;
    validateTranslation(unit.source, data.translations[unit.source]);
    dom.render(unit, data.translations[unit.source]);
  }
  return {pending: missing.length > 0, missing};
}
