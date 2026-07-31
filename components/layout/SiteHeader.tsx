import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import type { NavItem } from "@/lib/types";

function Masthead() {
  return (
    <div className="border-b border-line">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4 sm:py-5">
        <Link
          href="/"
          aria-label="REO Current home"
          className="relative block h-[45px] w-[118px] shrink-0 overflow-hidden sm:h-[51px] sm:w-[135px]"
        >
          <Image
            src="/images/reo-current-logo.png"
            alt="REO Current"
            width={1024}
            height={1024}
            priority
            className="absolute left-1/2 top-1/2 h-auto w-[162px] max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-[190px]"
          />
        </Link>

        <div className="flex w-full items-center gap-2.5 sm:w-auto">
          {/* Search — submits to /search on Enter. Two boundaries, deliberately
              different: the 16px font holds to md because that's where iOS
              Safari stops zooming on focus, while the 44px height holds to lg
              because tablets are still touch devices. */}
          <form role="search" action="/search" className="flex-1 sm:flex-none">
            <input
              type="search"
              name="q"
              placeholder="Search news…"
              aria-label="Search news"
              className="h-11 w-full border border-stroke px-3.5 text-[16px] outline-none focus:border-gray-500 sm:w-[200px] md:text-[13px] lg:h-[38px]"
            />
          </form>
          {/* Subscribe — goes to the newsletters page. Its height tracks the
              input's so the row stays aligned. */}
          <Link
            href="/newsletters"
            className="btn-brand h-11 whitespace-nowrap lg:h-[38px]"
          >
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
