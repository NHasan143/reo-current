# Responsive audit — REO Current frontend

**Date:** 2026-08-01
**Method:** Playwright (throwaway, scratchpad — not added to `package.json`)
**Coverage:** 14 routes × 7 widths (320 / 375 / 414 / 768 / 1024 / 1280 / 1440) = 98 runs
**Checks:** page overflow, element overflow, tap targets < 44×44, font < 16px at mobile widths

Raw results: `scratchpad/audit/results/raw.json`. Screenshots: `scratchpad/audit/results/screenshots/` (full page) and `results/fold/` (above the fold).

---

## Headline result

**The layout does not break.** Zero overflow defects — no page-level, no element-level — on any route at any width. No load errors, no console errors. The existing mobile-first work (64 breakpoint prefixes, `grid-cols-1` defaults) does its job.

The prediction that `ArticleCards.tsx:55`'s fixed `grid-cols-[1fr_110px]` thumbnail would overflow at 320px was **wrong**: 280px of content minus a 110px thumb and 16px gap leaves 154px for text. Tight, but it holds.

What the audit found instead is a different class of problem: **content prioritisation and reachability**, not breakage.

---

## P1 — Structural

### 1. The primary nav is clipped at every width below 1280

Measured hidden width in the scroll strip:

| Width | Nav content | Visible | Hidden |
|---|---|---|---|
| 320 | 1127px | 320px | **807px** |
| 768 | 1135px | 768px | **367px** |
| 1024 | 1107px | 1024px | **83px** |
| 1280 | 1280px | 1280px | fits |
| 1440 | 1280px | 1280px | fits |

**Post-fix re-measurement (ticket 01 resolved):**

| Width | Before | After |
|---|---|---|
| 320 / 375 / 414 | 807px hidden | drawer — 8/8 categories reachable, 0 truncated, 0px overflow |
| 768 | 367px hidden | strip + edge fade |
| 1024 | 83px hidden | strip + edge fade |
| 1280 / 1440 | fits | unchanged |

Verified by `scratchpad/audit/verify-01.mjs` — 28/28 acceptance checks.

At 320px roughly one and a half of eight categories are reachable. The strip *is* scrollable, but `.no-scrollbar` (`globals.css:9`) deliberately hides the scrollbar and nothing else signals more content — items are severed mid-word ("Disaster & Field Alerts" then a bare "M").

It only fits at 1280 because `justify-between` spreads items edge-to-edge with zero slack. **The nav is CMS-driven and uncapped** (`lib/data.ts:144`, `limit: 50`) — a ninth category breaks desktop too.

Files: `components/layout/MainNav.tsx`

### 2. The homepage lead story is buried below the fold on mobile and tablet

DOM order in `app/(frontend)/page.tsx:64` is left rail → centre lead → right rail. When the grid collapses to one column, readers scroll through all three `railStories` before reaching the lead.

At 768 the *entire* first screen is the left rail; the lead headline sits >1100px down, behind a full-width photo. Same at 320/375/414. Source order also drives screen-reader and tab order, so this is an accessibility defect, not only a visual one.

**Post-fix re-measurement (ticket 02 resolved):**

| Check | Result |
|---|---|
| Lead is first story in DOM | ✓ at 320 / 375 / 414 / 768 |
| Lead `<h1>` position @768 | 542px (was >1100px) |
| Tab order | lead first, then rail stories |
| Desktop 1280 / 1440 | **0 pixels differ** vs a baseline reconstructed from `31537f2` with the marquee frozen |
| Overflow | 0px at all 7 widths |

Verified by `scratchpad/audit/verify-02.mjs` — 26/26 acceptance checks.

Files: `app/(frontend)/page.tsx`

### 3. The homepage 3-column grid is cramped at 1024

`lg:grid-cols-[1fr_2fr_1fr]` engages at 1024 but was drawn for 1280. At iPad-landscape width the left rail is narrow enough that "National Order Mill Faces Vendor Exodus Over 60-Day Payment Terms" wraps to four lines, while the right rail runs to large dead space below the newsletter box.

**Post-fix re-measurement (ticket 03 resolved):**

| Width | Columns | Widest rail headline | Divider |
|---|---|---|---|
| 320 / 375 / 414 | 1 | — | none |
| 768 | 2 (428 / 260) | **2 lines** | none |
| 1024 | 2 (644 / 300) | **1 line** (was 4) | none |
| 1280 / 1440 | 3 (308 / 616 / 308) | — | 1px, restored |

Verified by `scratchpad/audit/verify-03.mjs` — 23/23 acceptance checks. "1280/1440 unchanged" is evidenced by the ticket 02 pixel diff (0px differ).

**Scope correction:** this applies to the homepage lead grid **only**. The article page's `lg:grid-cols-[minmax(0,1fr)_320px]` (≈620px content + 320px rail) reads well at 1024 and should keep its current `lg:` switch.

Files: `app/(frontend)/page.tsx`

---

## P2 — Functional

### 4. Four form inputs sit under 16px and trigger iOS auto-zoom

Safari on iOS zooms the viewport when a focused field's text is below 16px, leaving the page zoomed after blur.

| Field | Size |
|---|---|
| Header search (`SiteHeader.tsx:33`) | 13px |
| `MiniSignup` email (`#mini-*`) | 13px |
| Search page search box (`search/page.tsx:44`) | 14px |
| Newsletter form email (`#nl-email`) | 14px |

*Correction:* the first draft of this table listed "Newsletter form email" and "`#nl-email`" as separate rows. They are one element — `NewsletterForm.tsx:54` carries `id="nl-email"`. The genuine fourth field is the search-page box, which the audit did detect (as `input.h-[42px]…text-[14px]`) but which I mislabelled when writing this up. Four distinct fields exist in total; a repo-wide grep outside `app/(payload)` confirms there are no `textarea` or `select` elements at all.

**Post-fix (ticket 04 resolved):** all four at 16px below `md`, heights 44/44/44/48px. Re-audit reports **zero remaining iOS-zoom fields**; tap-target findings fell 1806 → 1700. Verified by `scratchpad/audit/verify-04.mjs` — 108/108.

### 5. TopBar date wraps to three lines at 320

"Saturday, / August 1, / 2026" stacks and collides with the Newsletters / Advertise / Subscribe links.

Files: `components/layout/TopBar.tsx`

### 6. Tap targets below 44×44

1806 raw hits deduplicate to a handful of causes — nearly all **height** failures on links that are wide but 14–21px tall:

| Element | Size | Where |
|---|---|---|
| Footer links | 148×**21** | all 13 routes |
| TopBar utility links | 68×**19** | all 13 routes |
| Breadcrumb links | 34×**15** | 9 routes |
| Header search input | 152×**38** | all routes |
| Subscribe button | 118×**38** | all routes |
| Byline author links | 69×**15** | article/author |

Category eyebrow labels (11px, ~14px tall) are also flagged but are a deliberate typographic device from the desktop design — treat as won't-fix unless you disagree.

---

## P3 — Polish

### 7. Small type on mobile

804 raw hits, overwhelmingly intentional design labels (11px eyebrows, 12px utility text, bylines, timestamps). Genuinely worth review are the reading-text paragraphs: card excerpts at 15px, newsletter/bio descriptions at 13px.

### 8. Empty "LATEST" heading at 1024

The homepage right rail renders the `LATEST` rule-heading with no items beneath it before the newsletter box. Possibly a seed-data artefact (`rightStories` empty) rather than a layout defect — worth confirming against real content.

---

## False positives filtered

As predicted during grilling: `.alert-ticker` (marquee, `whitespace-nowrap` by design) and `.lexical-table` (`min-w-[560px]` inside its own `overflow-x:auto` container) were whitelisted. Inline links inside `p`, `li`, and `.prose-content` are exempt from the 44px rule.

---

## Tickets

See `.scratch/responsive/issues/`. Sequenced foundation → per-page → polish, per the agreed execution plan.
