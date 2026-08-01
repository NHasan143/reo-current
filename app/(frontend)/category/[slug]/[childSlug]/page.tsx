import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { MostRead } from "@/components/sidebar/MostRead";
import { MoreSections } from "@/components/sidebar/MoreSections";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { Photo } from "@/components/ui/Photo";
import {
  allCategorySubcategories,
  getSubcategory,
} from "@/lib/category-config";
import {
  getAllCategories,
  getArticlesBySubcategory,
  getCategory,
  getMostRead,
} from "@/lib/data";

const PAGE_SIZE = 2;

export function generateStaticParams() {
  return allCategorySubcategories.map(({ parentSlug, slug }) => ({
    slug: parentSlug,
    childSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; childSlug: string }>;
}): Promise<Metadata> {
  const { slug, childSlug } = await params;
  const parent = await getCategory(slug);
  const child = getSubcategory(slug, childSlug);

  if (!parent || !child) {
    return { title: "Category not found" };
  }

  return {
    title: `${child.label} | ${parent.name}`,
    description: `Latest ${child.label.toLowerCase()} news from ${parent.name}.`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; childSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug, childSlug } = await params;
  const { page: pageParam } = await searchParams;
  const child = getSubcategory(slug, childSlug);
  const parent = await getCategory(slug);

  if (!parent || !child) notFound();

  const [articles, mostRead, allCategories] = await Promise.all([
    getArticlesBySubcategory(slug, childSlug),
    getMostRead(),
    getAllCategories(),
  ]);

  const [topStory, ...rest] = articles;
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showTop = page === 1 && topStory;
  const moreSections = allCategories
    .filter((category) => category.slug !== slug)
    .slice(0, 5);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: parent.name, href: `/category/${slug}` },
              { label: child.label },
            ]}
          />
          <h1 className="mb-2 mt-3 font-serif text-[36px] font-bold text-ink md:text-[42px]">
            {child.label}
          </h1>
          <p className="max-w-[680px] text-[16px] text-gray-600">
            Latest {child.label.toLowerCase()} coverage from {parent.name}.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
          <div className="min-w-0">
            {showTop ? (
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
                  <Link
                    href={`/article/${topStory.slug}`}
                    className="hover:text-[#0E489C]"
                  >
                    {topStory.title}
                  </Link>
                </h2>
                <p className="mb-2.5 text-[16px] leading-[1.6] text-gray-600">
                  {topStory.excerpt}
                </p>
                <div className="text-[12px] text-gray-500">
                  By {topStory.author.name} ·{" "}
                  {topStory.relativeDate ?? topStory.displayDate}
                </div>
              </article>
            ) : null}

            {pageItems.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}

            {!articles.length ? (
              <p className="border-y border-line py-8 text-[16px] text-gray-600">
                No posts have been assigned to this subcategory yet.
              </p>
            ) : null}

            {totalPages > 1 ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/category/${slug}/${childSlug}`}
                showPrev
              />
            ) : null}
          </div>

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
