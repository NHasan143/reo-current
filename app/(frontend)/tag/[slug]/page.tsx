import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { RevealMore } from "@/components/ui/RevealMore";
import { FollowButton } from "@/components/ui/FollowButton";
import { TagChips } from "@/components/sidebar/PopularTags";
import { MostRead } from "@/components/sidebar/MostRead";
import { MorningWire } from "@/components/sidebar/MorningWire";
import {
  getAllTagSlugs,
  getArticlesByTag,
  getMostRead,
  getPopularTags,
  getRelatedTags,
  getTag,
} from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return { title: "Tag not found" };
  return { title: `#${tag.name}`, description: tag.description };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) notFound();

  const [articles, relatedTags, mostRead, popularTags] = await Promise.all([
    getArticlesByTag(slug),
    getRelatedTags(slug),
    getMostRead(),
    getPopularTags(),
  ]);

  const initial = articles.slice(0, 3);
  const more = articles.slice(3);

  return (
    <>
      {/* Tag hero */}
      <section className="border-b border-line bg-paper">
        <div className="container-page py-10">
          {/* "Tags" was a link to /tag, which is not a route — every tag page
              shipped a breadcrumb that 404s. There is no tag index to point
              at, so it stays as plain text. */}
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tags" },
              { label: tag.name },
            ]}
          />
          <div className="mt-3.5 text-[12px] font-bold uppercase tracking-[1.2px] text-[#FD7402]">
            Tag
          </div>
          <h1 className="mb-2 mt-2 font-serif text-[36px] font-bold text-ink md:text-[44px]">
            #{tag.name}
          </h1>
          {tag.description && (
            <p className="mb-4 max-w-[680px] text-[16px] text-gray-600">
              {tag.description}
            </p>
          )}
          <div className="flex items-center gap-4">
            {/* Count the articles actually listed below. The editor-entered
                articleCount drifts from reality as posts are added or
                retagged, and contradicting the visible list is worse than
                having no number. */}
            <span className="text-[13px] font-bold text-ink">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </span>
            <FollowButton label="Follow Tag" followingLabel="Following" />
          </div>
        </div>
      </section>

      {/* Related tags */}
      <section className="border-b border-line2">
        <div className="container-page flex flex-wrap items-center gap-3 py-4">
          <span className="text-[12px] font-bold uppercase tracking-[1px] text-gray-500">
            Related tags:
          </span>
          {relatedTags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}`}
              className="touch-target inline-flex items-center border border-stroke px-3 py-[5px] text-[13px] font-semibold text-gray-600 hover:border-[#FD7402] hover:text-[#FD7402]"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
          {/* Article stream */}
          <div className="min-w-0">
            {initial.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}

            {articles.length === 0 && (
              <p className="border-y border-line py-8 text-[16px] text-gray-600">
                No articles have been tagged #{tag.name} yet.
              </p>
            )}

            {more.length > 0 && (
              <RevealMore>
                {more.map((article) => (
                  <ArticleListItem key={article.slug} article={article} />
                ))}
              </RevealMore>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <MostRead items={mostRead} />
            <div className="mt-7">
              <MorningWire />
            </div>
            <div className="mt-7">
              <TagChips tags={popularTags} title="Popular Tags" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
