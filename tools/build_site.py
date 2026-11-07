#!/usr/bin/env python3
"""Regenerate derived site files. Run from anywhere after adding or editing a page.

Writes: assets/search-index.js, assets/thumbs/<slug>.svg, sitemap.xml, robots.txt,
and the shared metadata block inside each page's <head>. Idempotent. Stdlib only.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://anuvik2401.github.io/system-design-prep/"
FONTS = ("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700"
         "&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap")

THUMB_STYLE = """<style>
text{font-family:'IBM Plex Sans',system-ui,sans-serif;fill:#0B1F3F;text-anchor:middle;dominant-baseline:middle}
.diag-label{font-size:12px;font-weight:600}.diag-sublabel,.diag-arrow-label{font-size:9.5px;fill:#4A5873}
.diag-box{fill:#fff;stroke:#0B1F3F;stroke-width:1.5;rx:7px}.role-cache{fill:#FBF5E6;stroke:#B8892B}
.role-async,.role-queue{fill:#FBF5E6;stroke:#9A5B13}.role-db{fill:#EEF2F9;stroke:#4A5873}
.diag-arrow-path{fill:none;stroke:#66728A;stroke-width:1.5}
</style>"""
SECTION_RE = re.compile(r'<section\b[^>]*\bid="([^"]+)"[^>]*>', re.I)
ATTR_TEXT_RE = re.compile(r'data-(?:mindmap|detail-[a-z]+|tip)=(?:"([^"]*)"|\'([^\']*)\')', re.S)


def pages():
    return [ROOT / "index.html"] + sorted((ROOT / "topics").rglob("*.html"))


def to_text(fragment):
    attrs = " ".join(a or b for a, b in ATTR_TEXT_RE.findall(fragment))
    attrs = re.sub(r'"(?:label|def|target|center|ring1|ring2)"\s*:|[\[\]{}",]', " ", html.unescape(attrs))
    body = re.sub(r"<(script|style)\b.*?</\1>", " ", fragment, flags=re.S | re.I)
    body = re.sub(r"<[^>]+>", " ", body)
    return re.sub(r"\s+", " ", html.unescape(body) + " " + attrs).strip()


def search_entries(page, source):
    title = html.unescape(re.search(r"<title>(.*?)</title>", source, re.S).group(1)).replace(" — SD Prep", "")
    main = re.search(r"<main\b.*?</main>", source, re.S)
    main_html = main.group(0) if main else source
    marks = list(SECTION_RE.finditer(main_html))
    url = page.relative_to(ROOT).as_posix()
    first = marks[0].start() if marks else len(main_html)
    entries = [{"u": url, "p": title, "i": "", "h": "Overview", "t": to_text(main_html[:first])}]
    for n, mark in enumerate(marks):
        end = marks[n + 1].start() if n + 1 < len(marks) else len(main_html)
        chunk = main_html[mark.start():end]
        heading = re.search(r"<h2\b[^>]*>(.*?)</h2>", chunk, re.S)
        entries.append({"u": url, "p": title, "i": mark.group(1),
                        "h": to_text(heading.group(1)) if heading else mark.group(1), "t": to_text(chunk)})
    return entries


def thumbnail(source):
    """Prefer the high-level design diagram, because it best identifies the page."""
    for anchor in ('id="step5-hld"', 'id="how-it-works"', 'class="diagram-wrap'):
        at = source.find(anchor)
        if at < 0:
            continue
        svg = re.search(r"<svg\b.*?</svg>", source[at:], re.S)
        if not svg:
            continue
        out = re.sub(r'\sdata-[a-z-]+=(?:"[^"]*"|\'[^\']*\')', "", svg.group(0))
        out = re.sub(r'<(circle|path)\b[^>]*diag-flow-dot.*?(?:/>|</\1>)', "", out, flags=re.S)
        out = out.replace("var(--text)", "#0B1F3F").replace("var(--muted)", "#4A5873")
        out = re.sub(r"var\(--[a-z0-9]+\)", "#8A6514", out)
        if "xmlns=" not in out:
            out = out.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
        return re.sub(r"(<svg\b[^>]*>)", lambda m: m.group(1) + THUMB_STYLE, out, count=1)
    labels = ["Requirements", "Entities", "API", "Data flow", "Design", "Deep dives"]
    boxes = "".join(f'<rect class="diag-box" x="{20+i*125}" y="50" width="105" height="50"/>'
                    f'<text class="diag-label" x="{72+i*125}" y="75">{t}</text>' for i, t in enumerate(labels))
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 150">{THUMB_STYLE}{boxes}</svg>'


def patch_head(page, source):
    rel = page.relative_to(ROOT).as_posix()
    prefix = "../" * rel.count("/")
    desc = re.search(r'<p class="sub">(.*?)</p>', source, re.S)
    text = to_text(desc.group(1)) if desc else "Search 57 system design interview pages: concepts, patterns, technologies, and 30 full question walkthroughs."
    title = re.search(r"<title>(.*?)</title>", source, re.S).group(1)
    url = BASE_URL + ("" if rel == "index.html" else rel)
    safe = html.escape(text[:300], quote=True)
    block = f"""<!-- site-head -->
  <meta name="description" content="{safe}">
  <meta name="theme-color" content="#0B1F3F">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{safe}">
  <meta property="og:url" content="{url}">
  <link rel="stylesheet" href="{FONTS.replace('&', '&amp;')}">
  <link rel="stylesheet" href="{prefix}assets/chrome.css">
  <!-- /site-head -->"""
    source = re.sub(r"<!-- site-head -->.*?<!-- /site-head -->\n?\s*", "", source, flags=re.S)
    source = source.replace('</head>', f"  {block}\n</head>", 1)
    tag = f'<script src="{prefix}assets/chrome.js"></script>'
    if tag not in source:
        nav = f'<script src="{prefix}assets/nav.js"></script>'
        if nav not in source:
            raise ValueError(f"{rel}: missing nav.js script tag")
        source = source.replace(nav, f"{nav}\n  {tag}", 1)
    sheet = f'<script src="{prefix}assets/sheet.js"></script>'
    if rel.startswith("topics/questions/") and sheet not in source:
        source = source.replace(tag, f"{tag}\n  {sheet}", 1)
    return source


def main():
    index, urls = [], []
    thumbs = ROOT / "assets" / "thumbs"
    thumbs.mkdir(exist_ok=True)
    for page in pages():
        source = patch_head(page, page.read_text(encoding="utf-8"))
        page.write_text(source, encoding="utf-8")
        rel = page.relative_to(ROOT).as_posix()
        urls.append(BASE_URL + ("" if rel == "index.html" else rel))
        if page.name != "index.html":
            index.extend(search_entries(page, source))
            (thumbs / f"{page.stem}.svg").write_text(thumbnail(source), encoding="utf-8")
    (ROOT / "assets" / "search-index.js").write_text(
        "window.SD_SEARCH=" + json.dumps(index, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    locs = "".join(f"<url><loc>{u}</loc></url>\n" for u in urls)
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{locs}</urlset>\n')
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE_URL}sitemap.xml\n")
    print(f"{len(urls)} pages, {len(index)} search entries")


if __name__ == "__main__":
    main()
