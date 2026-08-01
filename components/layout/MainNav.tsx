"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import type { NavItem } from "@/lib/types";

// The nav is CMS-driven and uncapped (all categories, limit 50), and the
// labels run long — the eight seeded categories already measure ~1130px, so
// the strip is clipped at every width below 1280. Phones get a drawer that
// lists every category at full length; tablets keep the strip with an edge
// fade so it reads as scrollable. From lg the strip also drives the recent-
// posts mega panel, which has no room to open below that width.

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

  // Drawer (below md).
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Recent-posts mega panel (lg and up).
  const [openHref, setOpenHref] = useState<string | null>(null);
  const openItem = navItems.find((item) => item.href === openHref);

  useLockedBody(open);

  // Every dismissal returns focus to the trigger: whatever was focused inside
  // the panel is about to unmount, and without this focus falls to <body> and
  // the next Tab restarts from the top of the document.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close both on navigation — either would otherwise survive a route change.
  // Focus is left alone here; the destination page owns it.
  useEffect(() => {
    setOpen(false);
    setOpenHref(null);
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

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpenHref(null);
    }
  }

  return (
    <nav
      className="sticky top-0 z-40 border-b-[3px] border-ink bg-white"
      onMouseLeave={() => setOpenHref(null)}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenHref(null);
      }}
    >
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
          {navItems.map((item) => {
            const active = pathname === item.href;
            const expanded = openHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-haspopup="true"
                aria-expanded={expanded}
                onMouseEnter={() => setOpenHref(item.href)}
                onFocus={() => setOpenHref(item.href)}
                className={`-mb-[3px] block whitespace-nowrap border-b-[3px] px-1.5 py-[13px] text-[14px] font-bold transition-colors hover:text-[#0E489C] ${
                  active
                    ? "border-[#FD7402] text-[#FD7402]"
                    : "border-transparent text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent xl:hidden"
        />
      </div>

      {/* Recent-posts mega panel — anchored to the nav, lg and up only. */}
      {openItem && (
        <div className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_14px_28px_rgba(20,23,28,0.14)] lg:block">
          <div className="container-page py-6">
            <div className="mb-4 flex items-end justify-between border-b-2 border-ink pb-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#FD7402]">
                  Recent Posts
                </div>
                <div className="mt-0.5 font-serif text-[22px] font-bold text-ink">
                  {openItem.label}
                </div>
              </div>
              <Link
                href={openItem.href}
                onClick={() => setOpenHref(null)}
                className="text-[13px] font-bold text-[#FD7402] hover:text-[#0E489C]"
              >
                View All <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div
              className={
                openItem.children?.length
                  ? "grid grid-cols-[220px_1fr] gap-8"
                  : undefined
              }
            >
              {openItem.children?.length ? (
                <div className="border-r border-line pr-7">
                  <div className="flex flex-col">
                    {openItem.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenHref(null)}
                        className="border-b border-line py-2.5 text-[14px] font-bold text-ink transition-colors last:border-b-0 hover:text-[#0E489C]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {openItem.recentPosts?.length ? (
                <div
                  className="grid grid-cols-3 gap-6"
                >
                {openItem.recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/article/${post.slug}`}
                    onClick={() => setOpenHref(null)}
                    className="group block min-w-0"
                  >
                    <div className="relative mb-3 aspect-[16/8] overflow-hidden bg-photo">
                      {post.featuredImageUrl ? (
                        <Image
                          src={post.featuredImageUrl}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 290px, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[1px] text-[#a8a294]">
                          Article Photo
                        </div>
                      )}
                    </div>
                    <div className="font-serif text-[17px] font-bold leading-[1.25] text-ink group-hover:text-[#0E489C]">
                      {post.title}
                    </div>
                    <div className="mt-2 text-[11px] font-medium text-gray-500">
                      {post.displayDate}
                    </div>
                  </Link>
                ))}
                </div>
              ) : (
                <p className="py-3 text-[14px] text-gray-500">
                  No posts have been published in this category yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
                      ? "border-[#FD7402] text-[#FD7402]"
                      : "border-transparent text-ink hover:text-[#0E489C]"
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
