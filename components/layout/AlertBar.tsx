import Link from "next/link";
import type { Article } from "@/lib/types";

export function AlertBar({
  article,
}: {
  article: Pick<Article, "slug" | "title">;
}) {
  return (
    <div className="border-b border-alertline bg-alertbg">
      <div className="container-page flex items-center gap-3.5 py-2.5 text-[13px]">
        <span className="shrink-0 bg-brand px-2.5 py-[3px] text-[11px] font-extrabold uppercase tracking-[1px] text-white">
          Featured
        </span>
        <div className="alert-ticker min-w-0 flex-1 overflow-hidden">
          <div className="alert-ticker-track">
            <Link
              href={`/article/${article.slug}`}
              className="font-semibold text-ink hover:text-brand focus-visible:text-brand"
            >
              {article.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
