#!/usr/bin/env python3
"""Prepare a separate Quarto review edition from the current manuscript."""

import shutil
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent


def main():
    lang = sys.argv[1]
    if lang not in ("ko", "en"):
        sys.exit("usage: tools/_review_prepare.py <ko|en>")

    source = ROOT / lang
    destination = ROOT / "_reviewbuild" / lang
    shutil.rmtree(destination, ignore_errors=True)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns("_book", ".quarto"))

    cfg = yaml.safe_load((source / "_quarto.yml").read_text())
    root_url = yaml.safe_load((ROOT / "ko/_quarto.yml").read_text())["book"]["site-url"]
    root_url = root_url.rstrip("/") + "/"
    review_url = root_url + "reviews/"
    book = cfg["book"]
    book["title"] += " — " + ("리뷰" if lang == "ko" else "Reviews")
    book["site-url"] = review_url + ("en/" if lang == "en" else "")
    book["sidebar"]["tools"] = [
        {
            "icon": "book",
            "text": "일반 읽기 페이지" if lang == "ko" else "Reading edition",
            "href": root_url + ("en/" if lang == "en" else ""),
        },
        {
            "icon": "globe",
            "text": "English reviews" if lang == "ko" else "한국어 리뷰",
            "href": review_url + ("en/" if lang == "ko" else ""),
        },
    ]
    book["page-footer"]["center"] = (
        "리뷰 전용 · 문장 선택 → Annotate · Hypothesis 로그인 필요"
        if lang == "ko"
        else "Review edition · Select text → Annotate · Hypothesis sign-in required"
    )
    cfg["format"]["html"]["comments"] = {"hypothesis": True}
    if lang == "ko":
        cfg["format"]["html"]["include-after-body"] = str(
            ROOT / "assets" / "instant-translate.html"
        )
    (destination / "_quarto.yml").write_text(
        yaml.safe_dump(cfg, allow_unicode=True, sort_keys=False)
    )
    print(f"prepared _reviewbuild/{lang}/ for {book['site-url']}")


if __name__ == "__main__":
    main()
