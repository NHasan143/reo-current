# 03 — Homepage tablet tier: 2-col at md, 3-col at xl

Status: resolved
Group: foundation
Blocked by: 02

## Problem

`lg:grid-cols-[1fr_2fr_1fr]` engages at 1024 but was designed for 1280. At iPad-landscape width the left rail wraps headlines to four lines while the right rail runs to dead space. Below 1024 there is no tablet tier at all — 768–1023 is a stretched phone layout.

## Change

- **768–1279** — two columns: lead + secondary content in the main column, right rail (LatestWire, MorningWire) alongside. Left-rail stories flow into the main column.
- **≥ 1280** — the existing three-column newspaper grid, moved from `lg:` to `xl:`.

Applies to the **homepage lead grid only**. The article page's `lg:grid-cols-[minmax(0,1fr)_320px]` reads well at 1024 — leave it.

Section blocks below the lead already use `md:grid-cols-2`; confirm they still balance under the new tier.

## Acceptance

- 768 and 1024 render two columns, no four-line headline wraps in a narrow rail
- 1280/1440 unchanged from today
- Vertical dividers (`lg:border-r`, `lg:border-l`) move to `xl:` with the grid
- No overflow at any width

## Files

`app/(frontend)/page.tsx`
