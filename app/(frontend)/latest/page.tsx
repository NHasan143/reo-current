import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { Pagination } from "@/components/ui/Pagination";
import { MostRead } from "@/components/sidebar/MostRead";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { getLatestArticles, getMostRead } from "@/lib/data";

export const metadata: Metadata = {
  title: "Latest News",
  description: "Every REO Current story, newest first.",
};

const PAGE_SIZE = 8;

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const [articles, mostRead] = await Promise.all([
    getLatestArticles(),
    getMostRead(),
  ]);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const pageItems = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Latest" }]} />
          <h1 className="mb-2 mt-3 font-serif text-[36px] font-bold text-ink md:text-[42px]">
            Latest News
          </h1>
          <p className="max-w-[680px] text-[16px] text-gray-600">
            Every story across property preservation, inspections, foreclosure,
            and compliance — newest first.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
          {/* Article stream */}
          <div className="min-w-0">
            {pageItems.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/latest"
                showPrev
              />
            )}
          </div>

          {/* Sidebar */}
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
