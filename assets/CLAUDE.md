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
Tight definition table: term | one-line definition.
Max 8 rows. No sentences that exceed 15 words.

### How it works section
Use a visual flow: HTML/CSS arrow chain showing data path.
Class: `<div class="flow">` with `<div class="flow-step">` nodes.
Below the flow: numbered list of what happens at each step (max 1 line each).

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
- Strictly no decorative elements, no icons libraries, no gradients

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
- Each card: category pill + title + one-line desc + difficulty badge + time badge
- No images. No icons. Pure typography and color.
- Filter row at top: All / Foundations / Question Breakdowns (JS filter, no page reload)

---

## nav.js behavior

- Sidebar on desktop (240px), slide-in drawer on mobile/iPad
- Section links built from `<section id="...">` + `<h2>` on current page
- Topic list at bottom of sidebar
- Active section highlight via IntersectionObserver
- "Back to home" link at top
- On iPad: sidebar hidden by default, hamburger toggles it
