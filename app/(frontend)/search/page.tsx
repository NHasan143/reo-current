import type { Metadata } from "next";
import Link from "next/link";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { MostRead } from "@/components/sidebar/MostRead";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { getMostRead, searchArticles } from "@/lib/data";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [results, mostRead] = await Promise.all([
    searchArticles(query),
    getMostRead(),
  ]);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          <p className="eyebrow">Search</p>
          <h1 className="mt-2 font-serif text-[36px] font-bold text-ink md:text-[42px]">
            {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search REO Current"}
          </h1>
          {query && (
            <p className="mt-2 text-[15px] text-gray-600">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          )}

          {/* Search box. 16px holds to md (where iOS Safari stops zooming on
              focus); the 44px height holds to lg, since tablets are still
              touch. The submit button tracks the input so the row stays
              aligned. */}
          <form action="/search" role="search" className="mt-5 flex max-w-md gap-2.5">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search news…"
              aria-label="Search news"
              className="h-11 w-full border border-stroke px-3.5 text-[16px] outline-none focus:border-gray-500 md:text-[14px] lg:h-[42px]"
            />
            <button type="submit" className="btn-brand h-11 lg:h-[42px]">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
          <div className="min-w-0">
            {query && results.length === 0 && (
              <p className="py-8 text-[15px] text-gray-600">
                No articles matched your search. Try different keywords, or{" "}
                <Link href="/" className="text-[#FD7402] underline">
                  browse the homepage
                </Link>
                .
              </p>
            )}
            {results.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}
          </div>

          <aside>
            <MostRead items={mostRead} />
            <div className="mt-7">
              <MorningWire />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
