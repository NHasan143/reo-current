import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import type { NavItem } from "@/lib/types";

function Masthead() {
  return (
    <div className="border-b border-line">
      <div className="container-page flex flex-wrap items-end justify-between gap-4 py-4 sm:py-5">
        <Link href="/" className="block leading-none">
          <span className="font-serif text-[32px] font-bold leading-none tracking-[-0.5px] text-ink sm:text-[40px]">
            REO <span className="text-brand">Current</span>
          </span>
          <span className="mt-1.5 block text-[11px] uppercase tracking-[2.5px] text-gray-500">
            Property Preservation &amp; Field Services News
          </span>
        </Link>

        <div className="flex w-full items-center gap-2.5 sm:w-auto">
          {/* Search — submits to /search on Enter. */}
          <form role="search" action="/search" className="flex-1 sm:flex-none">
            <input
              type="search"
              name="q"
              placeholder="Search news…"
              aria-label="Search news"
              className="h-[38px] w-full border border-stroke px-3.5 text-[13px] outline-none focus:border-gray-500 sm:w-[200px]"
            />
          </form>
          {/* Subscribe — goes to the newsletters page. */}
          <Link href="/newsletters" className="btn-brand h-[38px] whitespace-nowrap">
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ navItems }: { navItems: NavItem[] }) {
  return (
    <header>
      <Masthead />
      <MainNav navItems={navItems} />
    </header>
  );
}
