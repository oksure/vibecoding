import {readFileSync} from "node:fs";

// These labels are translated by an editor. SVGs are rendered in advance,
// so changing the reading language never needs a network call or a renderer.
const entries = JSON.parse(readFileSync(new URL("../translations/diagrams.ko-en.json",import.meta.url),"utf8"));
const diagrams = new Map(entries.map(entry => [entry.source.trim(),{
  ...entry,
  image:"data:image/svg+xml;base64," + readFileSync(new URL("../translations/diagrams/" + entry.svg,import.meta.url)).toString("base64")
}]));
const korean = text => /[\uac00-\ud7a3\u3131-\u318e]/.test(text);
const style = `
  .vc-translated-diagram { position: relative; }
  .vc-diagram-en { display: none; max-width: 100%; height: auto; margin: auto; }
  html[lang="en"] .vc-diagram-en { display: block; }
  /* Keep the original measurable while Quarto initializes Mermaid, even
     when a previously selected EN preference is restored on page load. */
  html[lang="en"] .vc-diagram-ko { position: absolute; top: 0; left: 0; width: 100%; visibility: hidden; pointer-events: none; }
`;

export function missingDiagrams(document,{requireEmbedded = false} = {}) {
  return [...document.querySelectorAll("pre.mermaid")]
    .filter(node => korean(node.textContent) && (!diagrams.has(node.textContent.trim()) ||
      (requireEmbedded && !node.closest(".vc-translated-diagram")?.querySelector(".vc-diagram-en"))))
    .map(node => "Mermaid diagram:\n" + node.textContent.trim());
}

export function embedDiagrams(document) {
  let count = 0;
  for (const node of document.querySelectorAll("pre.mermaid")) {
    const entry = diagrams.get(node.textContent.trim());
    if (!entry) continue;
    const existing = node.closest(".vc-translated-diagram")?.querySelector(".vc-diagram-en");
    if (existing) {
      existing.src = entry.image;
      existing.alt = entry.alt;
      continue;
    }
    const pair = document.createElement("div");
    pair.className = "vc-translated-diagram notranslate";
    pair.setAttribute("translate","no");
    const original = document.createElement("div");
    original.className = "vc-diagram-ko";
    original.lang = "ko";
    const image = document.createElement("img");
    image.className = "vc-diagram-en";
    image.lang = "en";
    image.alt = entry.alt;
    image.src = entry.image;
    node.replaceWith(pair);
    original.append(node);
    pair.append(original,image);
    count++;
  }
  if (count && !document.getElementById("vc-diagram-style")) {
    const css = document.createElement("style");
    css.id = "vc-diagram-style";
    css.textContent = style;
    document.head.append(css);
  }
}
