# 06 — Touch target heights below 44px

Status: resolved
Group: per-page

## Problem

1806 raw findings deduplicate to a few causes, nearly all **height** failures — links wide enough but 14–21px tall:

| Element | Size | Where |
|---|---|---|
| Footer links | 148×**21** | all 13 routes |
| TopBar utility links | 68×**19** | all 13 routes |
| Breadcrumb links | 34×**15** | 9 routes |
| Subscribe button | 118×**38** | all routes |
| Byline author links | 69×**15** | article / author |

## Already partly closed by ticket 04

Ticket 04 raised the header search input, MiniSignup input, and search-page input to 44px, and took their paired controls (the Subscribe link, the search submit button) with them so the flex rows stayed aligned. Those bumps revert at `md:`, so **768–1023 still fails this ticket's ≥44px bar** for those controls. Work here starts from that state.

## Change

Add vertical padding (or `min-h-[44px]` with centred content) to standalone links at touch widths. Font sizes stay as designed — this is padding, not type.

Desktop may keep tighter spacing; the 44px floor matters for touch. Applying it at all widths would visibly loosen the footer and TopBar, so gate it to `< lg` unless you want it everywhere.

## Explicitly out of scope

Category eyebrow labels (11px, ~14px tall) are flagged by the script but are a deliberate typographic device from the desktop design. Won't-fix unless you say otherwise.

**Byline author links — won't-fix, added during implementation.** The table above lists them at 69×15, but `Byline.tsx` renders `By ` + link + ` · ` + date as a single inline text run. A 44px box there either does nothing (inline boxes ignore height) or breaks the line's baseline. WCAG 2.5.8 excepts targets that are inline in a sentence, so this is the same class of exemption as eyebrow labels. The audit's own filter would have caught it had the byline been a `<p>` rather than a `<div>`. Headline links inside cards fall under the same exception.

## Scope expanded during implementation

The table's five rows were diagnosis, not the contract — the acceptance line asks for the count to fall to eyebrow labels and inline prose links only, and `Change` says "standalone links", unqualified. These standalone controls were missed by the original table and are fixed here too: tag chips (4 sites), pagination cells, share/email/print buttons, `FollowButton`, the author page's follow control, `SectionHeading`'s "View All" link, and the `MiniSignup` submit.

## Acceptance

- Footer, TopBar, breadcrumb, and Subscribe targets ≥ 44px tall at ≤ 1023
- Desktop spacing unchanged, or changed deliberately
- Re-run shows tap-target count dropping to eyebrow labels and inline prose links only

## Files

`components/layout/SiteFooter.tsx`, `components/layout/TopBar.tsx`, `components/ui/Breadcrumbs.tsx`, `components/ui/Byline.tsx`, `components/layout/SiteHeader.tsx`
