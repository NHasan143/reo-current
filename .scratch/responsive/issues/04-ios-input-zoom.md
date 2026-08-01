# 04 — Form inputs to 16px (stop iOS auto-zoom)

Status: resolved
Group: per-page

## Problem

iOS Safari zooms the viewport when a focused field's text is under 16px, and does not zoom back out on blur. Four fields are affected:

| Field | Current |
|---|---|
| Header search — `SiteHeader.tsx:33` | 13px |
| `MiniSignup` email | 13px |
| Newsletter form email | 14px |
| `#nl-email` | 14px |

## Change

Raise every `input` / `textarea` / `select` font-size to 16px at mobile widths. Desktop may keep the smaller size (`sm:text-[13px]`) if the visual weight matters — the zoom trigger is a touch-device behaviour.

Also bump field heights from 38px/42px to ≥ 44px, which closes the matching tap-target findings in ticket 06.

## Acceptance

- No form field under 16px at ≤ 767
- Field heights ≥ 44px at mobile widths
- Header masthead layout doesn't reflow badly with the larger input

## Files

`components/layout/SiteHeader.tsx`, `components/forms/MiniSignup.tsx`, `components/forms/NewsletterForm.tsx`
