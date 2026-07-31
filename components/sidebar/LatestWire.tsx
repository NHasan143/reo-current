import Link from "next/link";
import type { LatestItem } from "@/lib/types";

export function LatestWire({
  items,
  heading = "Latest",
}: {
  items: LatestItem[];
  heading?: string;
}) {
  return (
    <section>
      <div className="rule-heading mb-1">
        <span className="rule-label">{heading}</span>
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="border-b border-line2">
            <Link href={item.href} className="group flex items-baseline gap-2.5 py-3">
              <span className="shrink-0 whitespace-nowrap text-[11px] font-bold text-brand">
                {item.time}
              </span>
              <span className="text-[14px] font-semibold leading-[1.4] text-ink group-hover:text-brand">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
