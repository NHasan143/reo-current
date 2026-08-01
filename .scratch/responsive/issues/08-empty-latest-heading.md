# 08 — Empty "LATEST" heading in homepage right rail

Status: resolved
Group: polish

## Problem

At 1024 the homepage right rail renders the `LATEST` rule-heading with nothing beneath it, then the newsletter box, then a large dead space.

## Unknown — resolved

It was a data condition, but not the benign kind the ticket assumed. `seed.ts` assigned `homepageColumn` with a ternary that produced `"left"` for three slugs and `"none"` for everything else — **there was no `"right"` branch at all**, so no post could ever appear in the rail. Confirmed via the API: 15 posts `none`, 3 `left`, 0 `right`.

So a guard alone would have been the wrong fix on its own: the rail is meant to carry the "Latest" wire, and hiding it would have converted a visible bug into an invisible one, leaving every seeded environment silently missing a designed section.

Both parts shipped:

1. **Root cause** — `seed.ts` now has explicit `LEFT_COLUMN` / `RIGHT_COLUMN` lists and assigns four recent posts to the right rail, which renders as designed.
2. **Invariant** — the call site still guards, because an unassigned rail is a legitimate editor state.

The guard sits at the **call site** in `page.tsx`, matching the repo's existing convention (`{related.length > 0 && …}` and five similar). An early `return null` inside `LatestWire` was tried first and reverted: components elsewhere are wrapped in spacing divs by their callers (`category/[slug]/page.tsx:142`, `tag/[slug]/page.tsx:128`), so self-nulling would leave empty wrappers with margin — the same defect class in a new place.

## Acceptance (if confirmed a defect)

- `LatestWire` renders nothing at all when it has no items
- Right rail has no orphaned headings at any width

## Files

`components/sidebar/LatestWire.tsx`, `app/(frontend)/page.tsx`
