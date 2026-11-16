import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {parseHTML} from "linkedom";
import {fragments, embed, check, unitsFor} from "./_translation_html.mjs";
import {prepare} from "./pretranslate.mjs";

const fixture = '<!doctype html><html lang="ko"><head><title>한국어 제목</title><script>const untouched="한국어 코드";</script></head><body><nav>목차</nav><main><h1>테스트 제목</h1><p>본문 <a href="/chapter#anchor">링크</a>입니다.</p><pre><code>print("코드 보존")</code></pre><span translate="no">번역 제외</span></main></body></html>';
const toggle = (await readFile(new URL("../assets/language-toggle.html", import.meta.url), "utf8")).match(/<script>([\s\S]*)<\/script>/)[1];
const fixtureMap = {"테스트 제목":"Test title", "본문 <v0>링크</v0>입니다.":"This is a <v0>link</v0> in the text.", "목차":"Table of contents"};
const memoryStorage = () => { const values = new Map(); return {getItem: k => values.get(k) || null, setItem: (k,v) => values.set(k,String(v)), removeItem: k => values.delete(k)}; };

test("HTML collection excludes code, scripts and explicitly untranslated content", () => {
  assert.deepEqual(fragments(fixture), ["테스트 제목", "본문 <v0>링크</v0>입니다.", "목차"]);
  assert.equal(fragments(fixture.replace('lang="ko"','lang="en"')), null);
});

test("character references remain in the same text fragment as in a browser", () => {
  const html = '<html lang="ko"><body><p>저자 외, Expectation vs.&nbsp;Experience &amp; Tools</p></body></html>';
  assert.deepEqual(fragments(html), ["저자 외, Expectation vs.\u00a0Experience &amp; Tools"]);
});

test("saved translations are shared across pages and changed source requires a new translation", async () => {
  const page = texts => ({texts,translations:{}});
  const saved = {"공통 목차":"Shared contents", "첫 번째 본문":"First paragraph", "두 번째 본문":"Second paragraph"};
  const pages = [page(["공통 목차","첫 번째 본문"]),page(["공통 목차","두 번째 본문"])];
  await prepare(pages,saved);
  assert.equal(pages[0].translations["공통 목차"],pages[1].translations["공통 목차"]);
  await assert.rejects(prepare([page(["수정한 본문"])],saved), /Missing saved English translation/);
  saved["수정한 본문"] = "Revised paragraph";
  const changed = page(["수정한 본문"]);
  await prepare([changed],saved);
  assert.equal(changed.translations["수정한 본문"],"Revised paragraph");
});

test("incomplete output is rejected and embedded script-like text stays data", () => {
  assert.throws(() => check(embed(fixture, {})), /Missing translation/);
  const map = {...fixtureMap, "목차": '</script><script>alert(1)</script>'};
  const html = embed(fixture, map);
  assert.throws(() => check(html), /Unexpected translation markup/);
  check(embed(fixture, fixtureMap));
  const {document} = parseHTML(html);
  assert.equal(document.querySelectorAll("script").length, 2);
  assert.equal(JSON.parse(document.getElementById("vc-translation-data").textContent).translations["목차"], map["목차"]);
  assert.equal(document.querySelector("a").getAttribute("href"), "/chapter#anchor");
  assert.equal(document.querySelector("code").textContent, 'print("코드 보존")');
});

test("the reader toggles synchronously, keeps the URL and markup, and persists the choice without network/model access", () => {
  const map = fixtureMap;
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
  assert.equal(first.document.querySelector("h1").textContent,"Test title");
  assert.equal(first.document.querySelector("a").getAttribute("href"),"/chapter#anchor");
  assert.equal(first.document.querySelector("code").textContent,'print("코드 보존")');
  assert.equal(first.location.href,"https://example.test/reviews/sections/example.html#anchor");
  assert.match(first.document.querySelector('[role="status"]').textContent,/Leave feedback on the KO/);
  assert.equal(boot().document.documentElement.lang,"en");
  ko.click();
  assert.equal(first.document.querySelector("h1").textContent,"테스트 제목");
  assert.equal(boot().document.documentElement.lang,"ko");
});

test("translation quality gates reject corrupted section numbers, years, and tool/author names", async () => {
  const {validateTranslation} = await import("./_translation_quality.mjs");
  assert.throws(() => validateTranslation("§2.4 바이브 코딩의 정의와 범위", "•2b code by definition and range"), /§2.4/);
  assert.throws(() => validateTranslation("Karpathy (2025년 2월)", "(February 25, 2004)"), /2025|Karpathy/);
  assert.throws(() => validateTranslation("§1.4 Copilot, Cursor 등 AI 활용 코딩", "§1.4 AI-use coding, like.9.4vouts"), /Copilot/);
  validateTranslation("Karpathy (2025년 2월)", "Karpathy (February 2025)");
});

test("reviewed sidebar titles retain every section number and the reported labels", async () => {
  const glossary = JSON.parse(await readFile(new URL("../translations/glossary.ko-en.json", import.meta.url),"utf8"));
  const {validateTranslation} = await import("./_translation_quality.mjs");
  const titles = Object.entries(glossary).filter(([source]) => source.startsWith("§"));
  assert.ok(titles.length >= 70);
  for (const [source,target] of titles) validateTranslation(source,target);
  assert.equal(glossary["정의의 요지"],"Core definition");
  assert.equal(glossary["밝힌 적용 범위"],"Stated scope of use");
});


test("a paragraph is translated once across emphasis and links, with inline code protected", () => {
  const html = '<html lang="ko"><body><p>이것은 <strong>프로그램</strong>이다. <a href="/source#ref">출처</a>에서 <code>capacity &lt; 30</code>을 본다.</p></body></html>';
  const dom = unitsFor(html);
  assert.equal(dom.units.length,1);
  const unit = dom.units[0];
  assert.equal(unit.source,'이것은 <v0>프로그램</v0>이다. <v1>출처</v1>에서 <v2/>을 본다.');
  const translated = 'This is a <v0>program</v0>. See <v2/> in the <v1>source</v1>.';
  unit.node.replaceChildren(...dom.render(unit,translated));
  assert.equal(unit.node.textContent,'This is a program. See capacity < 30 in the source.');
  assert.equal(unit.node.querySelector('a').getAttribute('href'),'/source#ref');
  assert.equal(unit.node.querySelector('strong').textContent,'program');
  assert.equal(unit.node.querySelector('code').textContent,'capacity < 30');
  assert.throws(() => dom.render(unit,translated.replace('<v2/>','')),/Missing translation marker/);
  assert.throws(() => dom.render(unit,translated.replace('<v2/>','<img src=x onerror=alert(1)>')),/Unexpected translation markup/);
});

test("Quarto heading permalinks added after initialization survive EN and KO", () => {
  const {window} = parseHTML(embed(fixture,fixtureMap));
  const context = vm.createContext({document:window.document, location:{pathname:'/sections/example.html'},localStorage:memoryStorage(),sessionStorage:memoryStorage()});
  vm.runInContext(toggle,context);
  const anchor = window.document.createElement('a');
  anchor.className='anchorjs-link';anchor.href='#heading';anchor.textContent='Anchor';
  window.document.querySelector('h1').append(anchor);
  const [ko,en] = window.document.querySelectorAll('.vc-language button');
  en.click();
  assert.equal(window.document.querySelector('h1').textContent,'Test titleAnchor');
  assert.equal(window.document.querySelector('h1 a'),anchor);
  ko.click();
  assert.equal(window.document.querySelector('h1').textContent,'테스트 제목Anchor');
  assert.equal(window.document.querySelector('h1 a'),anchor);
});
