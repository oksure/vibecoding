#!/usr/bin/env python3
"""Assemble one language edition into a single Quarto document for Typst PDF.

Quarto book projects cannot render to Typst directly, so tools/build calls this
script to concatenate the chapters listed in <lang>/_quarto.yml into
_pdfbuild/<lang>/main.qmd, which is then rendered with `quarto render --to typst`.

Usage: tools/_pdf_assemble.py <ko|en>
"""

import re
import shutil
import sys
from pathlib import Path

import yaml

INC_RE = re.compile(r"\{\{<\s*include\s+(\S+)\s*>\}\}")

ROOT = Path(__file__).resolve().parent.parent

TITLES = {
    "ko": {"subtitle": "바이브 코딩의 역사, 기술, 개념", "appendix": "부록"},
    "en": {"subtitle": "The History, Art, and Concepts of Vibe Coding",
           "appendix": "Appendices"},
}


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            close = text.find("\n", end + 1)
            return text[: close + 1], text[close + 1 :]
    return "", text


def main():
    lang = sys.argv[1]
    src_dir = ROOT / lang
    cfg = yaml.safe_load((src_dir / "_quarto.yml").read_text())
    book = cfg["book"]

    out_dir = ROOT / "_pdfbuild" / lang
    shutil.rmtree(out_dir, ignore_errors=True)
    out_dir.mkdir(parents=True)
    if (src_dir / "images").is_dir():
        shutil.copytree(src_dir / "images", out_dir / "images")

    parts = [f"""---
title: "{book["title"]}"
subtitle: "{TITLES[lang]["subtitle"]}"
author: "{book["author"]}"
date: today
lang: {lang}
format:
  typst:
    papersize: a4
    mainfont: "Noto Sans CJK KR"
    toc: true
    toc-depth: 2
    number-sections: true
    section-numbering: "1.1"
---
"""]

    def read_expanded(path):
        # Quarto include shortcodes resolve relative to the including file;
        # expand them here because the concatenated document moves to _pdfbuild/.
        body = split_frontmatter(path.read_text())[1]
        return INC_RE.sub(
            lambda m: read_expanded((path.parent / m.group(1)).resolve()), body)

    def add_file(rel):
        parts.append(read_expanded(src_dir / rel).strip() + "\n")

    for item in book["chapters"]:
        if isinstance(item, str):
            add_file(item)
        else:
            parts.append(f"# {item['part']} {{.unnumbered}}\n")
            for rel in item["chapters"]:
                add_file(rel)

    if book.get("appendices"):
        parts.append(f"# {TITLES[lang]['appendix']} {{.unnumbered}}\n")
        for rel in book["appendices"]:
            add_file(rel)

    (out_dir / "main.qmd").write_text("\n".join(parts))
    print(f"assembled _pdfbuild/{lang}/main.qmd "
          f"({sum(len(p) for p in parts)} chars)")


if __name__ == "__main__":
    main()
