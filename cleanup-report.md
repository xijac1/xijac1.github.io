# Cleanup + Modularization Report

Generated: Feb 9, 2026

## Executive summary
Your site mixes full HTML documents inside dynamically injected content, duplicates styles and scripts across pages, and uses many inline styles. Consolidating layout, styles, and page modules will reduce redundancy and make edits safer and faster.

---

## Top issues (highest impact)

1) **Full HTML documents are being injected into `#dynamic-content`.**
   - Files like [pages/home.html](pages/home.html), [pages/projects.html](pages/projects.html), [pages/contact.html](pages/contact.html), [pages/quotes.html](pages/quotes.html), and project pages include full `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>` tags. When loaded via `fetch()` in [assets/js/main.js](assets/js/main.js#L13), this creates nested documents inside a `<div>`, which is invalid HTML and causes inconsistent CSS/JS behavior.
   - **Fix:** Convert those pages into **partials** that only contain the inner markup for the content area. Keep global `<head>` links and scripts in [index.html](index.html).

2) **Styles are duplicated and conflicting in `styles.css`.**
   - Multiple repeated blocks exist for `.mainunit`, `.project-card`, `.course-card`, `.certificate-card`, and certificate styles. The CSS file repeats “Portfolio variant styles” and also redefines `.quote-unit` twice.
   - **Fix:** Deduplicate these sections and keep a single, authoritative set of styles.

3) **Inline styles are widespread across pages.**
   - Examples: [pages/home.html](pages/home.html), [pages/contact.html](pages/contact.html), [pages/projects.html](pages/projects.html), [pages/projects/math4322.html](pages/projects/math4322.html), [pages/projects/math4323.html](pages/projects/math4323.html), [pages/projects/ecoscan.html](pages/projects/ecoscan.html), and [pages/leetcode/leetcode1.html](pages/leetcode/leetcode1.html).
   - **Fix:** Move inline styles into `assets/css/styles.css` and use reusable classes (e.g., `.page-hero`, `.section`, `.content-container`, `.btn-group`, `.page-title`).

4) **Inline scripts duplicate logic already in `assets/js/main.js`.**
   - [pages/projects.html](pages/projects.html#L123) has an inline filter script that duplicates `initializeProjectFilter()` in [assets/js/main.js](assets/js/main.js#L63).
   - **Fix:** Remove the inline script and keep a single source of truth in `main.js`.

5) **Multiple Bootstrap versions and redundant imports.**
   - [index.html](index.html#L7) uses Bootstrap 5.3.3 and icons 1.11.3.
   - [pages/projects/ecoscan.html](pages/projects/ecoscan.html#L7) uses Bootstrap 5.3.0 and icons 1.10.0.
   - **Fix:** Load Bootstrap and icons only in [index.html](index.html) and remove from partials.

---

## Detailed clean-up recommendations

### 1) Convert all `pages/*` to partials
**Why:** Avoid nested HTML documents and centralize layout/scripts.

**Action plan:**
- Remove `<html>`, `<head>`, `<body>` and keep only the content inside the main container for:
  - [pages/home.html](pages/home.html)
  - [pages/projects.html](pages/projects.html)
  - [pages/contact.html](pages/contact.html)
  - [pages/quotes.html](pages/quotes.html)
  - [pages/resume.html](pages/resume.html)
  - [pages/leetcode/leetcode1.html](pages/leetcode/leetcode1.html)
  - [pages/projects/ecoscan.html](pages/projects/ecoscan.html)
  - [pages/projects/math4322.html](pages/projects/math4322.html)
  - [pages/projects/math4323.html](pages/projects/math4323.html)

### 2) Centralize layout and shared UI
**Why:** Prevent repeated markup and keep layout changes in one place.

**Action plan:**
- Keep the sidebar, footer, and shared elements in [index.html](index.html).
- If you later want true templating, consider a static site generator (Eleventy, Astro) or HTML includes.

### 3) Deduplicate and organize `styles.css`
**Why:** There are repeated selectors and conflicting definitions.

**Action plan:**
- Consolidate duplicated sections:
  - `.mainunit`, `.project-card`, `.course-card`, `.certificate-card`
  - `.quote-unit`
  - “Portfolio variant styles” repeated blocks
- Split into logical groups:
  - **Base/Reset** (body, typography)
  - **Layout** (sidebar, main-content)
  - **Components** (cards, buttons, filters)
  - **Pages** (home, projects, quotes, resume)
  - **Utilities** (spacing helpers)

### 4) Extract inline styles into classes
**Why:** Inline styles are hard to maintain and block reuse.

**Action plan:**
- Create classes like:
  - `.page-container` (shared margins/padding/width)
  - `.page-title`
  - `.section`
  - `.btn-row`
  - `.hero-image`
  - `.profile-image`
- Replace inline styles in all HTML partials with class names.

### 5) Consolidate project page styles
**Why:** Project pages repeat very similar `section` and layout CSS.

**Action plan:**
- Create a shared `.project-page` and `.project-section` in `styles.css`.
- Remove `<style>` blocks from:
  - [pages/projects/ecoscan.html](pages/projects/ecoscan.html)
  - [pages/projects/math4322.html](pages/projects/math4322.html)
  - [pages/projects/math4323.html](pages/projects/math4323.html)
  - [pages/leetcode/leetcode1.html](pages/leetcode/leetcode1.html)

### 6) Reduce JS duplication and isolate page modules
**Why:** Inline scripts and global selectors can conflict as the site grows.

**Action plan:**
- Keep page-specific initialization in functions in [assets/js/main.js](assets/js/main.js).
- Add a simple router mapping, e.g.:
  - `pages/quotes.html` → `initQuotesPage()`
  - `pages/projects.html` → `initProjectsPage()`
- Remove inline scripts from HTML partials.

### 7) Normalize paths and linking
**Why:** Mixed absolute and relative paths break depending on where the partial is loaded from.

**Action plan:**
- Standardize on root-relative `/assets/...` (best with GitHub Pages if site is root) OR relative paths consistently.
- In partials loaded via `fetch`, root-relative is safer.

---

## Quick win checklist

- [ ] Convert all `pages/*` to partials (remove full HTML wrapper)
- [ ] Remove inline `<style>` blocks and move to `assets/css/styles.css`
- [ ] Delete duplicate CSS blocks in `styles.css`
- [ ] Remove inline filter script from [pages/projects.html](pages/projects.html)
- [ ] Remove redundant Bootstrap/icon imports from partials
- [ ] Create shared classes for repeated inline styles

---

## Suggested modular file structure (optional)

- assets/
  - css/
    - base.css
    - layout.css
    - components.css
    - pages.css
  - js/
    - main.js
    - pages/
      - projects.js
      - quotes.js

If you want, I can implement this refactor step-by-step and keep everything working while we modularize.
