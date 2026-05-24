# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for the Jordan Climbing Federation (www.jcf.jo). Plain HTML/CSS/JS — no build step, no framework, no dependencies to install. Deployed via GitHub Pages from the repo root (`CNAME` → `jcf.jo`); pushing to `main` publishes the site.

## Running locally

Must be served over HTTP, not opened as `file://`, because subpages reference assets with absolute paths (`/css/style.css`, `/img/...`).

```bash
python3 -m http.server 8080   # then visit http://localhost:8080
# or: npx serve .
```

There are no tests, linters, or build commands.

## Architecture

**Multi-page site, one folder per page.** Each route is a directory containing `index.html`, giving clean URLs (`/faq/`, `/all-events/`, `/jcf-competitions/`). Only the root `index.html` lives at the top level.

**Everything visual flows through two shared files:**
- `css/style.css` — all styles for the whole site (~1200 lines).
- `js/app.js` — a single IIFE wiring up every interactive behavior: header show/hide on scroll, mobile burger menu + folder toggles, scroll-reveal fade-ins, FAQ accordion, the history carousel (`#history-carousel`), and forcing the hero video to 0.5× playback. Behaviors are feature-detected by element ID/class, so a page only activates the parts whose markup it includes.

**The header, nav, mobile menu, footer, and GTranslate widget are copy-pasted into every page.** There is no templating or include system. Changing a nav link, footer detail, or the language widget means editing that block in *every* `index.html`, not one file.

### Two conventions that differ between the root and subpages

When creating or editing pages, match the surrounding page — getting these wrong silently breaks assets:

1. **Asset paths.** Root `index.html` uses *relative* paths (`css/style.css`, `img/logo.png`). Every subpage uses *absolute* paths (`/css/style.css`, `/img/logo.png`).
2. **Active nav link.** The root page marks `<a href="/" class="nav-link active">`; subpages drop the `active` class.

### Page layout system (in `css/style.css`)

Pages are built from stacked `<section class="section ...">` blocks. Two independent axes of modifier classes compose the look:

- **Theme** (background + text color): `dark-theme`, `black-theme`, `bright-theme`, `light-theme`, `default-theme`. Buttons restyle themselves per theme.
- **Vertical size**: `section-small`, `section-medium`, `section-custom` (plus the default).

Inside, content goes in `.section-content`, two-column layouts use `.two-col` with `.col-left` / `.col-right` (add `.reverse-mobile` to flip stacking order on small screens). Full-bleed backgrounds use `.section-background` + `.bg-image`/`hero-video` + a `.section-overlay`. Colors are CSS variables defined in `:root`.

Reusable components include the event grid (`.event-card`) on `/all-events/`, competition galleries under `/jcf-competitions/`, and the newsletter form (a no-backend form that just reveals a "Thank you!" message via inline `onsubmit`).

### Images

All images live in `img/` (with subfolders like `img/competitions/<event>/` for galleries). The hero expects `img/hero-video.mp4`, falling back to the `img/video-fallback.jpg` poster if absent.
