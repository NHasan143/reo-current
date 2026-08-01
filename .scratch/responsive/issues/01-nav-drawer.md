# 01 — Mobile nav drawer, tablet strip

Status: resolved
Group: foundation

## Problem

The primary nav is clipped at every width below 1280: 807px hidden at 320, 367px at 768, 83px at 1024. Items are severed mid-word and `.no-scrollbar` hides the only affordance that more exist. The nav is CMS-driven with `limit: 50` (`lib/data.ts:144`), so a ninth category breaks 1280 as well.

## Change

- **< 768** — hamburger button + slide-out drawer listing every category at full label length.
- **768–1023** — keep the horizontal scroll strip, but add an edge fade so it reads as scrollable.
- **≥ 1024** — unchanged full nav.

`MainNav` is already `"use client"`, so state fits without a new boundary.

## Deviation from the tier spec (accepted)

The tier above says "≥ 1024 unchanged". The edge fade is `xl:hidden`, so it renders 768–1279 — including 1024–1279, where the spec implies no change. This is deliberate: the audit measured 83px still clipped at 1024, so the affordance is warranted there. The nav *layout* is unchanged at ≥ 1024; only the fade is added.

## Acceptance

- Every category reachable at 320 without horizontal scrolling
- Drawer closes on Escape, on backdrop click, and on route change
- Focus trapped while open; trigger has `aria-expanded` / `aria-controls`
- Drawer trigger ≥ 44×44
- Nav re-measured: no clipping at 320/375/414; strip at 768 shows a scroll affordance

## Files

`components/layout/MainNav.tsx`, possibly a new `components/layout/NavDrawer.tsx`

## Note

Largest single piece of new code in this effort and the only one adding JS to the bundle.
