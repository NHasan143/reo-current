import Link from "next/link";
import type { Article } from "@/lib/types";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function LatestWire({
  articles,
  heading = "Latest",
}: {
  articles: Article[];
  heading?: string;
}) {
  // A rule-heading with nothing under it reads as a broken section. The right
  // rail is editor-driven (posts opt in via homepageColumn), so an empty list
  // is a normal state, not an error.
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="rule-heading mb-1">
        <span className="rule-label">{heading}</span>
      </div>
      <ul>
        {articles.map((article) => (
          <li key={article.slug} className="border-b border-line2">
            <Link
              href={`/article/${article.slug}`}
              className="group flex items-baseline gap-2.5 py-3"
            >
              <span className="shrink-0 whitespace-nowrap text-[11px] font-bold text-[#0E489C]">
                {formatDate(article.date)}
              </span>
              <span className="line-clamp-2 min-w-0 text-[14px] font-semibold leading-[1.4] text-ink group-hover:text-[#0E489C]">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
