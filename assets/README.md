# system-design-prep

Personal system design interview prep — published via GitHub Pages.
Dark theme, sidebar nav, mobile/iPad compatible, zero build step.

## One-time setup

```bash
# 1. Create repo locally
mkdir system-design-prep && cd system-design-prep
git init

# 2. Create folder structure
mkdir -p assets topics

# 3. Copy all files from this download into the correct locations:
#    CLAUDE.md         → system-design-prep/
#    README.md         → system-design-prep/
#    index.html        → system-design-prep/
#    assets/style.css  → system-design-prep/assets/
#    assets/nav.js     → system-design-prep/assets/
#    topics/*.html     → system-design-prep/topics/

# 4. Push to GitHub
git add .
git commit -m "init: sd prep site with 7 foundation pages"
git remote add origin https://github.com/ANUVIK2401/system-design-prep
git push -u origin main

# 5. Enable GitHub Pages
# Go to: github.com/ANUVIK2401/system-design-prep → Settings → Pages
# Source: Deploy from branch → Branch: main → Folder: / (root)
# Site goes live at: https://ANUVIK2401.github.io/system-design-prep/
```

## Add a new topic (every time)

```bash
# Open Claude Code from inside the repo
cd system-design-prep
claude

# Then in Claude Code, say:
# "Add [topic name]"
# Paste the Hello Interview screenshot

# Claude Code will:
# 1. Read CLAUDE.md
# 2. Generate topics/[slug].html
# 3. Update index.html with the new card
# 4. Print the commit command

# Then run:
git add . && git commit -m "add [topic]" && git push
```

## File structure

```
system-design-prep/
├── CLAUDE.md              ← Instructions for Claude Code (don't delete)
├── README.md
├── index.html             ← Topic dashboard
├── assets/
│   ├── style.css          ← Shared dark theme
│   └── nav.js             ← Sidebar + scroll-spy + mobile drawer
└── topics/
    ├── sd-introduction.html
    ├── how-to-prepare.html
    ├── delivery-framework.html
    ├── core-concepts.html
    ├── key-technologies.html
    ├── common-patterns.html
    ├── question-breakdowns.html
    └── url-shortener.html
```

## iPad access

Open Safari on iPad → https://ANUVIK2401.github.io/system-design-prep/
Tap the share button → "Add to Home Screen" for offline-like access.
Sidebar becomes a hamburger drawer on iPad width.
