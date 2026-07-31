import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="-ml-2 flex flex-wrap items-center text-[12px] text-gray-400 lg:ml-0"
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2 text-gray-300">/</span>}
          {item.href ? (
            // Crumbs are navigation, not prose, so they take the 44px touch
            // row below lg rather than the inline-text exemption. Short labels
            // like "Home" need the horizontal padding to clear 44px wide too.
            <Link
              href={item.href}
              className="touch-target flex min-w-[44px] items-center justify-center px-2 hover:text-brand lg:min-w-0 lg:px-0"
            >
              {item.label}
            </Link>
          ) : (
            // Matches the links' padding so the nav's -ml-2 lands correctly
            // whichever kind of crumb comes first.
            <span className="flex items-center px-2 font-semibold text-gray-600 lg:px-0">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
