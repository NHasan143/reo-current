import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { Pagination } from "@/components/ui/Pagination";
import { Photo } from "@/components/ui/Photo";
import { MostRead } from "@/components/sidebar/MostRead";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { MoreSections } from "@/components/sidebar/MoreSections";
import {
  getAllCategories,
  getAllCategorySlugs,
  getArticlesByCategory,
  getCategory,
  getMostRead,
} from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found" };
  return { title: category.name, description: category.description };
}

// Small so pagination is demonstrable with the current seed data; bump this
// once the CMS has more posts per category.
const PAGE_SIZE = 2;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [articles, mostRead, allCategories] = await Promise.all([
    getArticlesByCategory(slug),
    getMostRead(),
    getAllCategories(),
  ]);

  const [topStory, ...rest] = articles;
  const moreSections = allCategories.filter((c) => c.slug !== slug).slice(0, 5);

  // Top story appears on page 1; the rest is paginated.
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showTop = page === 1 && topStory;

  return (
    <>
      {/* Category hero */}
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: category.name }]}
          />
          <h1 className="mb-2 mt-3 font-serif text-[36px] font-bold text-ink md:text-[42px]">
            {category.name}
          </h1>
          {category.description && (
            <p className="max-w-[680px] text-[16px] text-gray-600">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
          {/* Article stream */}
          <div className="min-w-0">
            {showTop && (
              <article className="mb-2 border-b-2 border-ink pb-7">
                <Link href={`/article/${topStory.slug}`}>
                  <Photo
                    src={topStory.featuredImageUrl}
                    label="Featured Photo"
                    priority
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="mb-4 aspect-[16/8] w-full"
                  />
                </Link>
                <span className="eyebrow">Top Story</span>
                <h2 className="mb-2.5 mt-2 font-serif text-[30px] font-bold leading-[1.2] text-ink">
                  <Link href={`/article/${topStory.slug}`} className="hover:text-[#0E489C]">
                    {topStory.title}
                  </Link>
                </h2>
                <p className="mb-2.5 text-[16px] leading-[1.6] text-gray-600">
                  {topStory.excerpt}
                </p>
                <div className="text-[12px] text-gray-500">
                  By{" "}
                  <Link
                    href={`/author/${topStory.author.slug}`}
                    className="font-semibold text-ink hover:text-[#FD7402]"
                  >
                    {topStory.author.name}
                  </Link>{" "}
                  · {topStory.relativeDate ?? topStory.displayDate}
                </div>
              </article>
            )}

            {pageItems.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/category/${slug}`}
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
            <div className="mt-7">
              <MoreSections categories={moreSections} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
