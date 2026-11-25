import test from "node:test";
import assert from "node:assert/strict";
import {readFile, writeFile, mkdir, mkdtemp, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import vm from "node:vm";
import {parseHTML} from "linkedom";
import {fragments, requiredFragments, embed, check, unitsFor, untranslatedDiagrams} from "./_translation_html.mjs";
import {prepare, translationReport} from "./pretranslate.mjs";

const fixture = '<!doctype html><html lang="ko"><head><title>한국어 제목</title><script>const untouched="한국어 코드";</script></head><body><nav>목차</nav><main><h1>테스트 제목</h1><p>본문 <a href="/chapter#anchor">링크</a>입니다.</p><pre><code>print("코드 보존")</code></pre><span translate="no">번역 제외</span></main></body></html>';
const toggle = (await readFile(new URL("../assets/language-toggle.html", import.meta.url), "utf8")).match(/<script>([\s\S]*)<\/script>/)[1];
const fixtureMap = {"테스트 제목":"Test title", "본문 <v0>링크</v0>입니다.":"This is a <v0>link</v0> in the text.", "목차":"Table of contents"};
const memoryStorage = () => { const values = new Map(); return {getItem: k => values.get(k) || null, setItem: (k,v) => values.set(k,String(v)), removeItem: k => values.delete(k)}; };

test("HTML collection excludes code, scripts and explicitly untranslated content", () => {
  assert.deepEqual(fragments(fixture), ["테스트 제목", "본문 <v0>링크</v0>입니다.", "목차"]);
  assert.equal(fragments(fixture.replace('lang="ko"','lang="en"')), null);
});

test("plain-text prompt examples switch languages while executable code remains intact", () => {
  const html = '<html lang="ko"><body><ul><li>예시<pre class="text"><code>파일을 읽어 줘.\n단위는 유지해 줘.</code></pre></li></ul><pre class="python"><code>print("코드 보존")</code></pre><pre class="text" translate="no"><code>보호된 예시</code></pre></body></html>';
  const map = {"예시":"Example", "파일을 읽어 줘.\n단위는 유지해 줘.":"Read the file.\nKeep the units."};
  assert.deepEqual(new Set(fragments(html)),new Set(Object.keys(map)));
  const {window} = parseHTML(embed(html,map));
  vm.runInContext(toggle,vm.createContext({document:window.document,location:{pathname:"/example.html"},localStorage:memoryStorage(),sessionStorage:memoryStorage()}));
  const [ko,en] = window.document.querySelectorAll(".vc-language button");
  en.click();
  assert.equal(window.document.documentElement.lang,"en");
  assert.equal(window.document.querySelector("pre.text code").textContent,"Read the file.\nKeep the units.");
  assert.equal(window.document.querySelector("pre.python code").textContent,'print("코드 보존")');
  assert.equal(window.document.querySelector('[translate="no"] code').textContent,"보호된 예시");
  ko.click();
  assert.equal(window.document.querySelector("pre.text code").textContent,"파일을 읽어 줘.\n단위는 유지해 줘.");
});

test("character references remain in the same text fragment as in a browser", () => {
  const html = '<html lang="ko"><body><p>저자 외, Expectation vs.&nbsp;Experience &amp; Tools</p></body></html>';
  assert.deepEqual(fragments(html), ["저자 외, Expectation vs.\u00a0Experience &amp; Tools"]);
});

test("a renamed sidebar label cannot disable English on an already translated article", async () => {
  const html = '<html lang="ko"><body><nav><a href="/new">새 목차 제목</a></nav><main><h1>기존 제목</h1><p>이미 번역한 본문</p></main></body></html>';
  const map = {"기존 제목":"Existing title","이미 번역한 본문":"Previously translated article"};
  const page = {file:"/site/article.html",texts:fragments(html),requiredTexts:requiredFragments(html),translations:{}};
  await prepare([page],map);
  assert.equal(translationReport([page],map).pendingPages.length,0);
  const output=embed(html,page.translations);
  assert.equal(check(output).pending,false);
  const {document}=parseHTML(output);
  vm.runInContext(toggle,vm.createContext({document,localStorage:memoryStorage(),sessionStorage:memoryStorage()}));
  const [ko,en]=document.querySelectorAll(".vc-language button");
  assert.equal(en.disabled,false);
  en.click();
  assert.equal(document.querySelector("main p").textContent,"Previously translated article");
  assert.equal(document.querySelector("nav a").textContent,"새 목차 제목");
  assert.equal(document.querySelector("nav a").getAttribute("href"),"/new");
  ko.click();
  assert.equal(document.querySelector("main p").textContent,"이미 번역한 본문");
  const changed=html.replace("이미 번역한 본문","새로 바뀐 본문");
  assert.throws(()=>check(embed(changed,map)),/Missing translation/);
  assert.equal(check(embed(changed,map,{pending:true}),{allowMissing:true}).pending,true);
});

test("explicit prose examples translate Markdown instructions without changing ordinary Markdown code", () => {
  const html = '<html lang="ko"><body><pre class="markdown vc-prose"><code>description: 발표 초안 작성\n1. 원고를 읽는다.</code></pre><pre class="markdown"><code># 코드 예시</code></pre></body></html>';
  const map = {"description: 발표 초안 작성\n1. 원고를 읽는다.":"description: Draft a presentation\n1. Read the manuscript."};
  assert.deepEqual(fragments(html),Object.keys(map));
  const {document} = parseHTML(embed(html,map));
  vm.runInContext(toggle,vm.createContext({document,localStorage:memoryStorage(),sessionStorage:memoryStorage()}));
  document.querySelector('.vc-language button[lang="en"]').click();
  assert.equal(document.querySelector("pre.vc-prose").textContent,map[Object.keys(map)[0]]);
  assert.equal(document.querySelector("pre:not(.vc-prose)").textContent,"# 코드 예시");
  document.querySelector('.vc-language button[lang="ko"]').click();
  assert.equal(document.querySelector("pre.vc-prose").textContent,Object.keys(map)[0]);
});

test("reviewed diagrams preserve graph structure and switch without rerendering or network access", async () => {
  const diagrams = JSON.parse(await readFile(new URL("../translations/diagrams.ko-en.json",import.meta.url),"utf8"));
  const topology = text => [...text.matchAll(/^\s*(\w+)(?:\[[^\]]*\]|\{[^}]*\})?\s*-->(?:\|[^|]*\|)?\s*(\w+)/gm)].map(m => [m[1],m[2]]);
  for (const diagram of diagrams) {
    assert.ok(topology(diagram.source).length > 0);
    assert.deepEqual(topology(diagram.english),topology(diagram.source));
    const {document} = parseHTML('<html lang="ko"><head></head><body><main><pre class="mermaid mermaid-js"></pre></main></body></html>');
    document.querySelector("pre").textContent = diagram.source;
    const html = embed(document.toString(),{});
    check(html);
    assert.deepEqual(untranslatedDiagrams(html),[]);
    const browser = parseHTML(html).document;
    const image = browser.querySelector(".vc-diagram-en");
    const svg = Buffer.from(image.src.split(",")[1],"base64").toString("utf8");
    assert.ok(!/[가-힣]/.test(svg));
    assert.match(svg,/<svg/);
    assert.match(svg,/viewBox="0 0 [\d.]+ [\d.]+"/);
    assert.ok(!svg.includes("<foreignobject"));
    assert.equal(image.alt,diagram.alt);
    assert.match(browser.getElementById("vc-diagram-style").textContent,/visibility: hidden/);
    vm.runInContext(toggle,vm.createContext({document:browser,localStorage:{getItem:()=>"en"},sessionStorage:memoryStorage()}));
    assert.equal(browser.documentElement.lang,"en");
    assert.equal(browser.querySelector(".vc-diagram-ko pre").textContent,diagram.source);
    browser.querySelector('.vc-language button[lang="ko"]').click();
    assert.equal(browser.documentElement.lang,"ko");
    assert.equal(browser.querySelectorAll(".vc-translated-diagram").length,1);
    assert.equal(parseHTML(embed(html,{})).document.querySelectorAll(".vc-translated-diagram").length,1);
  }
});

test("a changed Korean diagram stays published with EN pending until reviewed", () => {
  const html = '<html lang="ko"><head></head><body><pre class="mermaid">flowchart LR\n a[새 단계] --&gt;|변경| b[검토]</pre></body></html>';
  assert.equal(untranslatedDiagrams(html).length,1);
  const output = embed(html,{});
  assert.throws(()=>check(output),/Missing translation/);
  assert.equal(check(output,{allowMissing:true}).pending,true);
  const report = translationReport([{file:"/site/diagram.html",texts:[],diagrams:untranslatedDiagrams(html)}],{});
  assert.equal(report.pendingPages.length,1);
  assert.match(report.missing[0].source,/Mermaid diagram/);
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
  assert.equal(first.document.querySelector('[role="status"]').textContent,"");
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


test("Quarto publication dates can change without translating any new prose", async () => {
  const page = {texts:["2026년 11월 17일"],translations:{}};
  await prepare([page],{});
  assert.equal(page.translations["2026년 11월 17일"],"November 17, 2026");
  await assert.rejects(prepare([{texts:["새 원문은 2026년 11월 17일에 썼다."],translations:{}}],{}),/Missing saved English/);
});

test("missing English is reported separately without hiding invalid saved translations", async () => {
  const pages = [
    {file:"/site/ready.html",texts:["공통 제목"],translations:{}},
    {file:"/site/new.html",texts:["공통 제목","새 원문"],translations:{}},
    {file:"/site/reviews/new.html",texts:["공통 제목","새 원문"],translations:{}}
  ];
  const saved = {"공통 제목":"Shared title"};
  await prepare(pages,saved,{allowMissing:true});
  const report = translationReport(pages,saved);
  assert.equal(report.readyPages,1);
  assert.equal(report.pendingPages.length,2);
  assert.deepEqual(report.missing.map(x=>x.source),["새 원문"]);
  assert.equal(report.missing[0].pages.length,2);
  assert.equal(pages[1].translations["공통 제목"],"Shared title");
  await assert.rejects(prepare([{texts:["새 원문","§2.4 제목"],translations:{}}],{"§2.4 제목":"§2.5 Title"},{allowMissing:true}),/§2.4/);
});

test("pending pages stay entirely Korean without a banner or changing a saved EN preference", () => {
  const partial = {...fixtureMap};delete partial["본문 <v0>링크</v0>입니다."];
  const html = embed(fixture,partial,{pending:true});
  assert.throws(()=>check(html),/Missing translation/);
  assert.equal(check(html,{allowMissing:true}).pending,true);
  assert.throws(()=>check(embed(fixture,partial),{allowMissing:true}),/Missing translation/);
  assert.throws(()=>check(embed(fixture,{...partial,"테스트 제목":"<img src=x>"},{pending:true}),{allowMissing:true}),/Unexpected translation markup/);
  assert.throws(()=>check(embed(fixture,{...partial,"테스트 제목":""},{pending:true}),{allowMissing:true}),/Empty translation/);
  const storage=memoryStorage();storage.setItem("vc-reading-language","en");
  const boot = input => {
    const {window}=parseHTML(input);
    vm.runInContext(toggle,vm.createContext({document:window.document,location:{pathname:"/new.html"},localStorage:storage,sessionStorage:memoryStorage()}));
    return window.document;
  };
  const pending=boot(html);
  assert.equal(pending.documentElement.lang,"ko");
  assert.equal(pending.querySelector("h1").textContent,"테스트 제목");
  assert.equal(pending.querySelector("main p").textContent,"본문 링크입니다.");
  assert.equal(pending.querySelector('.vc-language button[lang="en"]').disabled,true);
  assert.match(pending.querySelector('.vc-language button[lang="en"]').getAttribute("aria-label"),/pending/);
  assert.equal(pending.querySelector('[role="status"]').textContent,"");
  assert.equal(storage.getItem("vc-reading-language"),"en");
  const ready=boot(embed(html,fixtureMap));
  assert.equal(ready.documentElement.lang,"en");
  assert.equal(ready.querySelector("h1").textContent,"Test title");
});

test("CLI publishes ready and pending pages, saves a deduplicated backlog, and retains strict checking", async () => {
  const root=await mkdtemp(join(tmpdir(),"vibe-translation-"));
  const run=promisify(execFile);
  const cli=fileURLToPath(new URL("./pretranslate.mjs",import.meta.url));
  const pending=fixture.replace("</main>","<p>새 원문</p></main>");
  try {
    await mkdir(join(root,"translations"));await mkdir(join(root,"site/reviews"),{recursive:true});
    await writeFile(join(root,"translations/glossary.ko-en.json"),"{}");
    await writeFile(join(root,"translations/reviewed.ko-en.json"),JSON.stringify(fixtureMap));
    await writeFile(join(root,"site/ready.html"),fixture);
    await writeFile(join(root,"site/pending.html"),pending);
    await writeFile(join(root,"site/reviews/pending.html"),pending);
    const opts={cwd:root,env:{...process.env,GITHUB_STEP_SUMMARY:join(root,"summary.md")}};
    await assert.rejects(run(process.execPath,[cli,"site"],opts),/Missing saved English/);
    assert.equal(await readFile(join(root,"site/pending.html"),"utf8"),pending);
    await run(process.execPath,[cli,"site","--allow-missing","--report","reports/backlog.json"],opts);
    await run(process.execPath,[cli,"site","--check","--allow-missing"],opts);
    const report=JSON.parse(await readFile(join(root,"reports/backlog.json"),"utf8"));
    assert.equal(report.totalPages,3);assert.equal(report.readyPages,1);
    assert.equal(report.missing.length,1);assert.equal(report.missing[0].source,"새 원문");
    assert.equal(report.missing[0].pages.length,2);
    assert.match(await readFile(join(root,"summary.md"),"utf8"),/Missing English does not block/);
    check(await readFile(join(root,"site/ready.html"),"utf8"));
    await assert.rejects(run(process.execPath,[cli,"site","--check"],opts),/Missing translation/);
  } finally {await rm(root,{recursive:true,force:true});}
});
