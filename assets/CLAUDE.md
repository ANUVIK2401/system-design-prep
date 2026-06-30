# CLAUDE.md — system-design-prep

## Purpose
Personal system design interview prep site on GitHub Pages.
Interview-only mode: no fluff, no theory for theory's sake.
Every page must make the reader faster and more confident in an interview.

## Stack
Vanilla HTML + CSS + JS. No frameworks, no build step.
Shared: `assets/style.css`, `assets/nav.js`
GitHub Pages: deploys from repo root, branch main.

---

## When user says "Add [topic]" or pastes a screenshot/link

1. Read this CLAUDE.md fully first.
2. Identify the topic and slug (kebab-case).
3. Generate `topics/[slug].html` using the template and rules below.
4. Add a card to `index.html` in the `<!-- TOPICS -->` comment block.
5. Add the topic to the `TOPICS` array in `assets/nav.js`.
6. Print: `git add . && git commit -m "add [topic]" && git push`

Never skip a section. Never use placeholder text. Never touch other topic files.

---

## Page structure (every topic)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Topic] — SD Prep</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
  <aside id="sidebar"></aside>
  <main>
    <header class="page-head">
      <div class="pill">[Category e.g. Foundations]</div>
      <h1>[Topic Name]</h1>
      <p class="sub">[One sentence: what this is and why it matters in interviews]</p>
      <div class="meta-row">
        <span class="badge green">[X-Y min]</span>
        <span class="badge blue">[Easy/Medium/Hard]</span>
      </div>
    </header>

    <div class="flash-card">
      <div class="flash-label">Say this in the first 2 minutes</div>
      <!-- 4-5 tight bullets: the things strong candidates say immediately -->
    </div>

    <!-- SECTIONS IN ORDER: -->
    <section id="mental-model">...</section>
    <section id="core-concepts">...</section>
    <section id="how-it-works">...</section>
    <section id="tradeoffs">...</section>
    <section id="when-to-use">...</section>
    <section id="interview-moves">...</section>
    <section id="follow-ups">...</section>
  </main>
  <script src="../assets/nav.js"></script>
</body>
</html>
```

---

## Content rules

### Mental model section
Open with a single crisp analogy that makes the concept stick.
Format: `<div class="analogy-block">`. One sentence.

### Core concepts section
Default to a tight definition table (term | one-line definition, max 8 rows, no sentence over 15 words) —
but if the concept is a spectrum, a magnitude comparison, or a scored signal, visualize it instead:
- A position-on-a-spectrum claim (e.g. "mostly consistent, leans available") → `.dial-wrap` decision dial.
- An order-of-magnitude comparison (e.g. latency numbers, throughput tiers) → `.latency-chart` bar chart.
- A 2-3 way relationship/triangle (e.g. CAP theorem) → small SVG diagram inside `.diagram-wrap`.
Definition tables and visuals are not mutually exclusive — use a table for the remaining flat facts
after the visual covers the headline relationship.

### How it works section
Default to an inline SVG diagram, not a table or a wall of text — this site is for visual learners.
Wrapper: `<div class="diagram-wrap"><svg viewBox="0 0 W H">...</svg></div>`.
Inside the SVG: `<rect class="diag-box [role-client|role-cache|role-db|role-async]">` boxes,
`<text class="diag-label">`/`<text class="diag-sublabel">` for names, `<path class="diag-arrow-path" marker-end="url(#someId)">`
for connectors. Each diagram defines its OWN locally-scoped `<marker id="...">` inside a `<defs>` block —
never reuse a marker id across diagrams/pages, since multiple SVGs can be in the DOM or cached at once.
Optional: `<div class="diag-legend">` with `<div class="diag-legend-item"><span class="diag-legend-dot [role]"></span>label</div>`
when box-role colors need explaining.
For sequential/cyclical processes (not architecture), an `<ol class="flow-steps-list">` numbered breakdown
belongs directly below the diagram — one line per step.
The older HTML-only `.flow`/`.flow-step` chip-chain still exists in CSS for backward compatibility but is
DEPRECATED for new content — always reach for an SVG `.diagram-wrap` diagram instead.

### Tradeoffs section
Always a 2-column compare grid: `<div class="compare-grid">`.
Each cell: `<div class="compare-card good">` or `<div class="compare-card bad">`.
Label: wins vs costs. Keep each point to one line.

### When to use section
Three scenarios: USE when / AVOID when / WATCH OUT for.
Format: `<div class="scenario-row">` with icon prefix (✓ / ✗ / ⚠).

### Interview moves section
This is the most important section.
Format: numbered list of concrete things to say/draw/ask in an interview.
Each move: bold trigger phrase + one-line explanation.
E.g.: **"Let me clarify scale first"** — sets you up to justify every decision.

### Follow-ups section
6 questions. Format: `<div class="qa-block">`.
Q in accent color. A in muted. Answers max 2 lines.

---

## Visual rules (enforce strictly)

- Background: `#0a0a0a` (near-black)
- Surface: `#111` cards, `#161616` hover
- Accent: `#6ee7b7` (mint green) — used for headings, active states, flash card border
- Secondary accent: `#93c5fd` (sky blue) — badges, links
- Warning: `#fbbf24` (amber) — tradeoff costs, watch-outs
- Text: `#f0f0f0` primary, `#888` muted, `#555` very muted
- Font: `Inter, system-ui` — loaded via Google Fonts
- Heading scale: h1 32px/600, h2 18px/600, h3 15px/500
- Body: 14px/400, line-height 1.65
- No border-radius above 10px anywhere
- No shadows — use border `1px solid #1e1e1e` for depth
- Flash card: left border 3px solid accent, bg `#0d1f17`
- Analogy block: italic, muted text, left border 3px solid `#333`
- Tables: no outer border, row separator `1px solid #1a1a1a`
- No decorative elements, no third-party icon libraries (Font Awesome etc.), no CSS gradients
- Hand-authored inline SVG diagrams ARE the icon/illustration system on this site — use them freely

### `.dial-wrap` decision dial
```html
<div class="dial-wrap">
  <div class="dial-title">[What's being judged]</div>
  <div class="dial-track"><div class="dial-marker" style="left:[0-100]%"></div></div>
  <div class="dial-labels"><span class="end-left">[left pole]</span><span class="end-right">[right pole]</span></div>
</div>
```
`left%` is a judgment call, not a measured value — pick the position that matches the claim in `dial-title`.

### `.latency-chart` log-scale bar chart
```html
<div class="latency-chart">
  <div class="latency-row">
    <div class="latency-name">[operation]</div>
    <div class="latency-track"><div class="latency-bar [tier-fast|tier-mid|tier-slow]" style="width:[0-100]%"></div></div>
    <div class="latency-val">[~Xns/µs/ms]</div>
  </div>
  <!-- one row per data point -->
</div>
```
`tier-fast` = accent (ns range), `tier-mid` = blue (µs–low ms), `tier-slow` = amber (ms+). Bar widths
should reflect relative log-scale magnitude, not be evenly spaced.

### `.diag-box` role colors (use consistently across all diagrams)
- `role-client` → blue — clients, gateways, entry points
- `role-cache` → accent/mint — caches, hot-path services, the thing being explained
- `role-db` → neutral gray — databases, durable storage
- `role-async` → amber — queues, workers, async/background paths

---

## Foundation curriculum (build in this order)

These 7 pages come from Hello Interview "Learn System Design — In a Hurry":

1. `topics/sd-introduction.html` — What system design interviews test and how they're scored
2. `topics/how-to-prepare.html` — Study strategy, timeline, resource priority
3. `topics/delivery-framework.html` — The exact framework to use during an interview (clarify → estimate → design → deep dive)
4. `topics/core-concepts.html` — CAP theorem, consistency models, latency numbers, back-of-envelope math
5. `topics/key-technologies.html` — When to use SQL vs NoSQL, Redis, Kafka, S3, CDN, load balancer
6. `topics/common-patterns.html` — Read-heavy, write-heavy, fan-out, saga, CQRS, event sourcing
7. `topics/question-breakdowns.html` — Index page linking to individual question pages

Each page must be self-contained and interview-complete. A reader should be able to pass an interview on that topic reading only that page.

---

## Index page rules

- Dark hero with site title and tagline
- Topic cards in a CSS grid (auto-fill, minmax 260px)
- Each card: `<div class="card-num">[01-08, zero-padded]</div>` + category pill + title + one-line desc + difficulty badge + time badge
- Cards carry `style="--card-i:[0-based index]"` for the staggered fade/slide-in entrance animation (CSS only, see `style.css`)
- No raster images, no third-party icon libraries — typography, color, and hand-authored inline SVG only
- Filter row at top: All / Foundations / Question Breakdowns (JS filter, no page reload)
- New topic cards always get the next sequential `card-num` and `--card-i`; never reuse or skip a number

---

## nav.js behavior

- Sidebar on desktop (240px), slide-in drawer on mobile/iPad (toggled via hamburger below 900px)
- Section links built from `<section id="...">` + `<h2>` on current page — each gets a small inline SVG icon
  from the `ICONS` map in `nav.js` keyed by section `id` (mental-model, core-concepts, how-it-works, tradeoffs,
  when-to-use, interview-moves, follow-ups, plus a couple of per-page extras). Unmapped ids just render without
  an icon — safe to add a new section id without touching `nav.js`, but prefer reusing the existing ids above
  so the icon shows.
- Section `<h2>` is clickable to collapse/expand its body (`.sec-body` wrapper + chevron, JS-driven)
- Topic list at bottom of sidebar renders from the `TOPICS` array in `nav.js`, each with a numbered step badge
  (`.sb-step-mark`) that fills in as a checkmark once visited (tracked via `localStorage` key `sdprep-visited`)
- `.sb-progress-wrap`/`.sb-progress-fill` bar at the top of the sidebar shows overall curriculum progress
  (visited topics / total topics) — this is the "progression" affordance; keep `TOPICS` in sync with the
  actual page set whenever a page is added or removed
- Active section highlight via IntersectionObserver; page-level scroll progress bar at the very top of the viewport
- Fade-in-on-scroll (`.reveal`/`.in-view`) applies to `main > section[id]`, `.diagram-wrap`, `.compare-grid`,
  `.flash-card` — new sections/diagrams get this automatically, no per-element opt-in needed
- "Back to home" link at top
- All motion respects `prefers-reduced-motion` — do not add animation that bypasses this guard
