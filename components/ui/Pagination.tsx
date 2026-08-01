import Link from "next/link";

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

// min-w matters as much as min-h here: a single-digit page sits at 39px wide.
const CELL =
  "touch-target inline-flex min-w-[44px] items-center justify-center border px-[15px] text-[13px] lg:h-[38px] lg:min-w-0";

export function Pagination({
  currentPage = 1,
  totalPages = 3,
  basePath,
  showPrev = false,
}: {
  currentPage?: number;
  totalPages?: number;
  basePath: string;
  showPrev?: boolean;
}) {
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);
  const prevDisabled = currentPage <= 1;

  return (
    <nav
      aria-label="Pagination"
      className="mt-9 flex items-center justify-center gap-1.5"
    >
      {showPrev &&
        (prevDisabled ? (
          <span
            className={`${CELL} cursor-not-allowed border-stroke font-semibold text-gray-400`}
          >
            ← Prev
          </span>
        ) : (
          <Link
            href={href(currentPage - 1)}
            className={`${CELL} border-stroke font-semibold text-ink hover:border-ink`}
          >
            ← Prev
          </Link>
        ))}

      {pageList(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1.5 text-[13px] text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${CELL} ${
              p === currentPage
                ? "border-ink bg-ink font-bold text-white"
                : "border-stroke font-semibold text-ink hover:border-ink"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={href(Math.min(totalPages, currentPage + 1))}
        className={`${CELL} border-stroke font-semibold text-ink hover:border-ink`}
      >
        Next →
      </Link>
    </nav>
  );
}
