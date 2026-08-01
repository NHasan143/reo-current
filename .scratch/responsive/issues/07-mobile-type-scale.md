# 07 — Mobile type scale review

Status: resolved
Group: polish

## Problem

804 small-font findings, the large majority of which are intentional design labels (11px eyebrows, 12px utility text, bylines, timestamps) lifted from the desktop mockups. Those are not defects.

Worth review are reading-text paragraphs at mobile widths:

- Card excerpts — **14px and 15px**, not a single size (`ArticleCards.tsx:44` is 14px, `:104` is 15px, the author page uses 15px)
- Newsletter / author bio descriptions — 13px
- `prose-content` — fixed 18px body with a 42px `h1`, 24px `h2`, 20px `h3`

*Corrections made while implementing:* the excerpt size above was stated as a flat 15px; it is mixed. The `globals.css:95` line reference was stale.

## Question for triage — answered

**The 42px prose `h1` turned out to be a non-issue.** Only 1 of 18 seeded articles has a `.prose-content` body at all, and it contains no `h1` — editors put the title in the page `h1`, not the body. Stepping it would have been unverifiable. **Deferred, not done.**

Measured line lengths at 320 (280px column; 45–75 characters per line is the readable range) redirected the work:

| Element | Before | After |
|---|---|---|
| Body 18px | 27 cpl | unchanged — deliberately |
| `h2` 24px | **12 cpl over 4 lines** | 20px, **24 cpl on one line** |
| Blockquote 23px | 20 cpl | 19px, 27 cpl |

Chosen scope: headings and blockquote only; lift the two 13px running-text blurbs to 14px; leave card excerpts alone.

`h3` was stepped 20→19px as a follow-on: dropping `h2` to 20px collapsed it into `h3`, which was also 20px. The mobile heading scale is tightly squeezed — `h4`–`h6` and the body are both 18px, so headings cannot go lower without reading smaller than the text they introduce.

## Change (pending triage)

Discrete breakpoint steps on the affected sizes, per the agreed typography approach. No fluid `clamp()` scale — the codebase is uniformly hardcoded-px utilities and shouldn't grow a second system.

## Files

`app/(frontend)/globals.css`, card components under `components/cards/`
