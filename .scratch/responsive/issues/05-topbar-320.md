# 05 — TopBar date wraps to three lines at 320

Status: resolved
Group: per-page

## Problem

At 320px the date renders "Saturday, / August 1, / 2026" across three lines and collides with the Newsletters / Advertise / Subscribe links. `TopBar.tsx` has no breakpoint classes at all.

## Change

Pick one:

- Shorten the date at small widths (e.g. "Aug 1, 2026"), or
- Hide the date below `sm` and keep the utility links, or
- `whitespace-nowrap` the date and let the links wrap instead

Recommended: shorten at small widths — keeps the date visible, which is meaningful on a news site.

## Acceptance

- TopBar occupies one line at 320
- Date and utility links do not collide at any width
- Utility links reach 44px touch height (see ticket 06)

## Files

`components/layout/TopBar.tsx`
