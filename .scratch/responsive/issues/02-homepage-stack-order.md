# 02 — Homepage lead first on mobile and tablet

Status: resolved
Group: foundation

## Problem

`app/(frontend)/page.tsx:64` orders the DOM left rail → centre lead → right rail. Collapsed to one column, readers meet three secondary stories before the lead. At 768 the entire first screen is the rail; the lead headline is >1100px down. Source order also drives screen-reader and tab order.

## Change

Rewrite source order to priority order — lead → secondary → left rail → right rail — then restore the desktop newspaper arrangement with `lg:order-*` (rail `lg:order-1`, lead `lg:order-2`, right rail `lg:order-3`).

Per the agreed rule: DOM carries priority, CSS carries desktop presentation.

## Acceptance

- Lead photo + `<h1>` are the first content below the AlertBar at 320/375/414/768
- Desktop 1280/1440 renders visually identical to today (compare against `results/screenshots/home-1280.png`)
- Tab order reaches the lead headline before rail stories
- No overflow introduced at any width

## Files

`app/(frontend)/page.tsx`
