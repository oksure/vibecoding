import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {parseHTML} from "linkedom";
import {fragments, chunks, embed, check} from "./_translation_html.mjs";
import {prepare} from "./pretranslate.mjs";

const fixture = '<!doctype html><html lang="ko"><head><title>한국어 제목</title><script>const untouched="한국어 코드";</script></head><body><nav>목차</nav><main><h1>테스트 제목</h1><p>본문 <a href="/chapter#anchor">링크</a>입니다.</p><pre><code>print("코드 보존")</code></pre><span translate="no">번역 제외</span></main></body></html>';
const toggle = (await readFile(new URL("../assets/language-toggle.html", import.meta.url), "utf8")).match(/<script>([\s\S]*)<\/script>/)[1];
const memoryStorage = () => { const values = new Map(); return {getItem: k => values.get(k) || null, setItem: (k,v) => values.set(k,String(v)), removeItem: k => values.delete(k)}; };

test("long text is split without losing a character, including emoji and sentence boundaries", () => {
  const text = ("가나다🙂 ".repeat(90) + "문장입니다. 다음 문장입니다. ").repeat(3);
  const parts = chunks(text);
  assert.equal(parts.join(""), text);
  assert.ok(parts.every(part => Array.from(part).length <= 180 && part.length > 0));
});

test("HTML collection excludes code, scripts and explicitly untranslated content", () => {
  assert.deepEqual(fragments(fixture), ["목차", "테스트 제목", "본문", "링크", "입니다."]);
  assert.equal(fragments(fixture.replace('lang="ko"','lang="en"')), null);
});

test("a second build reuses translations and an edit translates only the changed text", async () => {
  const cache = {}; const calls = [];
  const translator = async text => { calls.push(text); return `English:${text}`; };
  const page = texts => ({texts, translations:{}});
  const initial = [page(["공통 목차", "첫 번째 본문"]), page(["공통 목차", "두 번째 본문"])];
  assert.equal(await prepare(initial, cache, translator), 3);
  const again = [page(["공통 목차", "첫 번째 본문"]), page(["공통 목차", "수정한 본문"])];
  calls.length = 0;
  assert.equal(await prepare(again, cache, translator), 1);
  assert.deepEqual(calls, ["수정한 본문"]);
  assert.equal(again[0].translations["첫 번째 본문"], "English:첫 번째 본문");
  assert.equal(again[1].translations["두 번째 본문"], undefined);
});

test("incomplete output is rejected and embedded script-like text stays data", () => {
  assert.throws(() => check(embed(fixture, {})), /Missing translation/);
  const map = Object.fromEntries(fragments(fixture).map((text,i) => [text, i === 0 ? '</script><script>alert(1)</script>' : `English ${i}`]));
  const html = embed(fixture, map);
  check(html);
  const {document} = parseHTML(html);
  assert.equal(document.querySelectorAll("script").length, 2);
  assert.equal(JSON.parse(document.getElementById("vc-translation-data").textContent).translations["목차"], map["목차"]);
  assert.equal(document.querySelector("a").getAttribute("href"), "/chapter#anchor");
  assert.equal(document.querySelector("code").textContent, 'print("코드 보존")');
});

test("reviewed wording applies only to exactly matching source text", async () => {
  const pages = [{texts:["서문","새 서문"],translations:{}}];
  const calls = [];
  await prepare(pages, {}, async text => { calls.push(text); return "New preface"; }, async()=>{}, {"서문":"Preface"});
  assert.equal(pages[0].translations["서문"],"Preface");
  assert.deepEqual(calls,["새 서문"]);
});

test("the reader toggles synchronously, keeps the URL and markup, and persists the choice without network/model access", () => {
  const map = Object.fromEntries(fragments(fixture).map((text,i) => [text, `English ${i}`]));
  const storage = memoryStorage();
  const boot = () => {
    const {window} = parseHTML(embed(fixture, map));
    const location = {pathname:"/reviews/sections/example.html",href:"https://example.test/reviews/sections/example.html#anchor"};
    const context = vm.createContext({document:window.document, location, localStorage:storage, sessionStorage:memoryStorage()});
    vm.runInContext(toggle, context);
    return {document:window.document, window, location};
  };
  const first = boot();
  const [ko,en] = first.document.querySelectorAll(".vc-language button");
  en.click();
  assert.equal(first.document.documentElement.lang,"en");
  assert.equal(first.document.querySelector("h1").textContent,"English 1");
  assert.equal(first.document.querySelector("a").getAttribute("href"),"/chapter#anchor");
  assert.equal(first.document.querySelector("code").textContent,'print("코드 보존")');
  assert.equal(first.location.href,"https://example.test/reviews/sections/example.html#anchor");
  assert.match(first.document.querySelector('[role="status"]').textContent,/Leave feedback on the KO/);
  assert.equal(boot().document.documentElement.lang,"en");
  ko.click();
  assert.equal(first.document.querySelector("h1").textContent,"테스트 제목");
  assert.equal(boot().document.documentElement.lang,"ko");
});
