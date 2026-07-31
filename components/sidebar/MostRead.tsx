import Link from "next/link";
import type { MostReadItem } from "@/lib/types";

export function MostRead({ items }: { items: MostReadItem[] }) {
  return (
    <section>
      <div className="rule-heading mb-1">
        <span className="rule-label">Most Read</span>
      </div>
      <ol>
        {items.map((item) => (
          <li
            key={item.rank}
            className="flex items-baseline gap-3.5 border-b border-line2 py-3.5"
          >
            <span className="font-serif text-[24px] font-bold leading-none text-stroke">
              {item.rank}
            </span>
            <Link
              href={item.href}
              className="text-[14px] font-semibold leading-[1.4] text-ink hover:text-[#0E489C]"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
