import Link from "next/link";
import type { Category } from "@/lib/types";

export function MoreSections({
  categories,
  title = "More Sections",
}: {
  categories: Category[];
  title?: string;
}) {
  return (
    <section>
      <div className="rule-heading mb-3">
        <span className="rule-label">{title}</span>
      </div>
      <div>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex items-center justify-between border-b border-line2 py-[11px] text-[14px] font-semibold text-ink hover:text-brand"
          >
            <span>{cat.name}</span>
            <span aria-hidden="true" className="text-brand">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
