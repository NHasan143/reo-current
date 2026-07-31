import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12px] text-gray-400">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-2 text-gray-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#FD7402]">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-600">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
