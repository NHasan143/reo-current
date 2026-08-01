import Link from "next/link";
import type { Article } from "@/lib/types";

export function AlertBar({
  articles,
}: {
  articles: Pick<Article, "slug" | "title">[];
}) {
  return (
    <div className="border-b border-alertline bg-alertbg">
      <div className="container-page flex items-center gap-3.5 py-2.5 text-[13px]">
        <span className="shrink-0 bg-[#FD7402] px-2.5 py-[3px] text-[11px] font-extrabold uppercase tracking-[1px] text-white">
          Featured
        </span>
        <div className="alert-ticker min-w-0 flex-1 overflow-hidden">
          <div className="alert-ticker-track">
            {[false, true].map((duplicate) => (
              <div
                key={duplicate ? "duplicate" : "original"}
                className={`alert-ticker-group ${
                  duplicate ? "alert-ticker-copy" : ""
                }`}
                aria-hidden={duplicate || undefined}
              >
                {articles.map((article, index) => (
                  <span key={article.slug}>
                    {index > 0 ? (
                      <span className="mx-8 text-[#FD7402]" aria-hidden="true">
                        •
                      </span>
                    ) : null}
                    <Link
                      href={`/article/${article.slug}`}
                      tabIndex={duplicate ? -1 : undefined}
                      className="font-semibold text-ink hover:text-[#0E489C] focus-visible:text-[#0E489C]"
                    >
                      {article.title}
                    </Link>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
