#!/usr/bin/env python3
"""Fail on broken internal links or anchors, missing thumbnails, or search-index gaps."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
CONCEPTS = ["consistent hashing", "geohash", "cap theorem", "fan-out", "idempotency", "websocket", "quorum", "saga"]
errors = []
pages = [ROOT / "index.html", ROOT / "404.html"] + sorted((ROOT / "topics").rglob("*.html"))
ids = {p: set(re.findall(r'\bid="([^"]+)"', p.read_text(encoding="utf-8"))) for p in pages}
for page in pages:
    if page.name == "404.html":
        continue  # uses absolute production URLs
    for ref in re.findall(r'(?:href|src)="([^"]+)"', page.read_text(encoding="utf-8")):
        if ref.startswith(("http", "mailto:", "data:")):
            continue
        parts = urlsplit(ref)
        target = (page.parent / parts.path).resolve() if parts.path else page
        if not target.exists():
            errors.append(f"{page.relative_to(ROOT)}: missing {ref}")
        elif parts.fragment and target in ids and parts.fragment not in ids[target] and parts.fragment not in {"topics"}:
            errors.append(f"{page.relative_to(ROOT)}: bad anchor {ref}")

raw = (ROOT / "assets/search-index.js").read_text(encoding="utf-8")
index = json.loads(raw[len("window.SD_SEARCH="):].rstrip().rstrip(";"))
haystack = " ".join(e["t"].lower() for e in index)
errors += [f"search index lacks concept: {c}" for c in CONCEPTS if c not in haystack]
for e in index:
    if not (ROOT / e["u"]).exists() or (e["i"] and e["i"] not in ids[ROOT / e["u"]]):
        errors.append(f"search entry points nowhere: {e['u']}#{e['i']}")
nav = (ROOT / "assets/nav.js").read_text(encoding="utf-8")
slugs = re.findall(r"slug: '([^']+)'", nav)
errors += [f"no thumbnail: {s}" for s in slugs if not (ROOT / "assets/thumbs" / f"{s}.svg").exists()]
disk = {p.stem for p in pages if "topics" in p.parts}
errors += [f"TOPICS out of sync: {s}" for s in disk ^ set(slugs)]

print("\n".join(errors) or f"OK: {len(pages)} pages, {len(index)} search entries, {len(slugs)} thumbnails")
sys.exit(1 if errors else 0)
