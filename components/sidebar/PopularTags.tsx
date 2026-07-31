import Link from "next/link";
import type { Tag } from "@/lib/types";

/** Chip list of tags (Popular Tags sidebar, related-tags bar). */
export function TagChips({ tags, title }: { tags: Tag[]; title?: string }) {
  return (
    <section>
      {title && (
        <div className="rule-heading mb-3">
          <span className="rule-label">{title}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tag/${tag.slug}`}
            className="touch-target inline-flex items-center border border-stroke px-[11px] py-[5px] text-[13px] font-semibold text-gray-600 transition-colors hover:border-brand hover:text-brand"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
