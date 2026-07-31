"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/types";

export function MainNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b-[3px] border-ink bg-white">
      <div className="no-scrollbar container-page flex justify-between gap-1 overflow-x-auto overflow-y-hidden lg:gap-0">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`-mb-[3px] block whitespace-nowrap border-b-[3px] px-1.5 py-[13px] text-[12px] font-semibold transition-colors hover:text-brand ${
                active
                  ? "border-brand text-brand"
                  : "border-transparent text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
