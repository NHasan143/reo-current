"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/types";

// The nav is CMS-driven and uncapped (all categories, limit 50), and the
// labels run long — the eight seeded categories already measure ~1130px, so
// the strip is clipped at every width below 1280. Phones get a drawer that
// lists every category at full length; tablets keep the strip with an edge
// fade so it reads as scrollable.

function useLockedBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function MainNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLockedBody(open);

  // Every dismissal returns focus to the trigger: whatever was focused inside
  // the panel is about to unmount, and without this focus falls to <body> and
  // the next Tab restarts from the top of the document.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on navigation — the drawer would otherwise survive a route change.
  // Focus is left alone here; the destination page owns it.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The drawer only exists below md. Crossing that boundary while open would
  // otherwise leave `open` true — drawer mounted but CSS-hidden, body scroll
  // still locked — and pop it back open on the way down.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Escape closes; Tab cycles within the panel while it is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  const linkClass = (href: string) =>
    `-mb-[3px] block whitespace-nowrap border-b-[3px] px-1.5 py-[13px] text-[12px] font-semibold transition-colors hover:text-brand ${
      pathname === href
        ? "border-brand text-brand"
        : "border-transparent text-ink"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b-[3px] border-ink bg-white">
      {/* Phone: trigger only. */}
      <div className="container-page flex items-center justify-between md:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="nav-drawer"
          aria-label="Open sections menu"
          className="-ml-1.5 flex min-h-[44px] items-center gap-2 px-1.5 text-[12px] font-semibold uppercase tracking-[1px] text-ink"
        >
          <span aria-hidden className="flex w-4 flex-col gap-[3px]">
            <span className="h-[2px] w-full bg-ink" />
            <span className="h-[2px] w-full bg-ink" />
            <span className="h-[2px] w-full bg-ink" />
          </span>
          Sections
        </button>
      </div>

      {/* Tablet and up: the scroll strip. The right-edge fade signals that it
          scrolls, since .no-scrollbar hides the scrollbar itself. */}
      <div className="relative hidden md:block">
        <div className="no-scrollbar container-page flex justify-between gap-1 overflow-x-auto overflow-y-hidden lg:gap-0">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent xl:hidden"
        />
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Pointer-only convenience: hidden from the accessibility tree and
              out of the tab order, so the close button below stays the single
              labelled close control. Keyboard users close with Escape or it. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-ink/50"
          />
          <div
            ref={panelRef}
            id="nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Sections"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col overflow-y-auto bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-[12px] font-extrabold uppercase tracking-[1.5px] text-ink">
                Sections
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close sections menu"
                className="-mr-2 flex h-11 w-11 items-center justify-center text-[20px] leading-none text-ink"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-[44px] items-center border-l-[3px] px-5 py-2.5 text-[15px] font-semibold transition-colors ${
                    pathname === item.href
                      ? "border-brand text-brand"
                      : "border-transparent text-ink hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
