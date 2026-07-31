import Link from "next/link";
import type { Article } from "@/lib/types";

/** "By {author} · {date}" byline. Set withBy=false for the "{author} · {date}" form. */
export function Byline({
  article,
  withBy = true,
  className = "",
  dateVariant = "display",
}: {
  article: Article;
  withBy?: boolean;
  className?: string;
  dateVariant?: "display" | "relative";
}) {
  const date =
    dateVariant === "relative" && article.relativeDate
      ? article.relativeDate
      : article.displayDate;

  return (
    <div className={`text-[12px] text-gray-500 ${className}`}>
      {withBy && "By "}
      <Link
        href={`/author/${article.author.slug}`}
        className="font-semibold text-ink hover:text-brand"
      >
        {article.author.name}
      </Link>
      <span className="mx-1"> · </span>
      <span>{date}</span>
    </div>
  );
}
