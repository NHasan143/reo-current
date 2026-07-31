"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FocusEvent } from "react";
import type { NavItem } from "@/lib/types";

export function MainNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(null);
  const openItem = navItems.find((item) => item.href === openHref);

  useEffect(() => {
    setOpenHref(null);
  }, [pathname]);

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

            {openItem.recentPosts?.length ? (
              <div className="grid grid-cols-4 gap-6">
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
      )}
    </nav>
  );
}
