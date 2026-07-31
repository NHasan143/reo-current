import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";
import { ShareButtons } from "@/components/article/ShareButtons";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { MostRead } from "@/components/sidebar/MostRead";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getMostRead,
  getRelatedArticles,
} from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const description = article.seo?.metaDescription || article.excerpt;
  const keywords = [
    article.seo?.focusKeyword,
    ...(article.seo?.secondaryKeywords?.split(",") ?? []),
  ]
    .map((keyword) => keyword?.trim())
    .filter((keyword): keyword is string => Boolean(keyword));

  return {
    title: article.title,
    description,
    keywords: keywords.length ? keywords : undefined,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      authors: [article.author.name],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [mostRead, related] = await Promise.all([
    getMostRead(),
    getRelatedArticles(slug),
  ]);

  return (
    <>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-y-10 px-5 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-14">
        {/* Main column */}
        <article className="min-w-0">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: article.category.name,
                href: `/category/${article.category.slug}`,
              },
              { label: "Article" },
            ]}
          />

          <Link
            href={`/category/${article.category.slug}`}
            className="mt-4 block text-[12px] font-bold uppercase tracking-[1.2px] text-[#FD7402] hover:text-[#0E489C]"
          >
            {article.category.name}
          </Link>
          <h1 className="mb-4 mt-3.5 font-serif text-[32px] font-bold leading-[1.12] text-ink md:text-[44px]">
            {article.title}
          </h1>
          <p className="mb-6 font-serif text-[19px] leading-[1.5] text-gray-600 md:text-[21px]">
            {article.excerpt}
          </p>

          {/* Byline + share */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <Avatar
                initials={article.author.initials}
                src={article.author.avatarUrl}
                name={article.author.name}
                size={42}
              />
              <div className="leading-tight">
                <Link
                  href={`/author/${article.author.slug}`}
                  className="text-[14px] font-bold text-ink hover:text-[#FD7402]"
                >
                  {article.author.name}
                </Link>
                <div className="text-[12px] text-gray-500">
                  {article.author.role} · {article.displayDate}
                  {article.readMinutes ? ` · ${article.readMinutes} min read` : ""}
                </div>
              </div>
            </div>
            <ShareButtons title={article.title} />
          </div>

          {/* Lead image */}
          <figure className="mb-8">
            <Photo
              src={article.featuredImageUrl}
              label="Article Photo"
              priority
              sizes="(min-width: 1024px) 760px, 100vw"
              className="aspect-[16/9] w-full"
            />
            {article.featuredImageCaption && (
              <figcaption className="mt-2 text-[12px] text-gray-400">
                {article.featuredImageCaption}
              </figcaption>
            )}
          </figure>

          {/* Body */}
          {article.body && (
            <div className="prose-content">
              <RichText data={article.body} />
            </div>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="my-9 flex flex-wrap gap-2 border-t border-line pt-6">
              {article.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="border border-stroke px-3 py-[5px] text-[12px] font-semibold text-gray-600 transition-colors hover:border-[#FD7402] hover:text-[#FD7402]"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Author bio */}
          <div className="mb-11 flex gap-4 border border-line2 bg-paper p-[22px]">
            <Avatar
              initials={article.author.initials}
              src={article.author.avatarUrl}
              name={article.author.name}
              size={56}
            />
            <div>
              <Link
                href={`/author/${article.author.slug}`}
                className="text-[15px] font-bold text-ink hover:text-[#FD7402]"
              >
                {article.author.name}
              </Link>
              <p className="mt-1 text-[14px] leading-[1.6] text-gray-600">
                {article.author.bio}
              </p>
            </div>
          </div>

        </article>

        {/* Sidebar */}
        <aside>
          <div className="lg:sticky lg:top-[70px]">
            <div className="mb-7">
              <MorningWire />
            </div>
            <MostRead items={mostRead} />
          </div>
        </aside>
      </div>

      {/* Related coverage */}
      {related.length > 0 && (
        <div className="border-t border-line bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6">
            <div className="rule-heading mb-6">
              <span className="rule-label text-[15px]">Related Coverage</span>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/article/${rel.slug}`}
                  className="group block border border-line2 bg-white"
                >
                  <Photo
                    src={rel.featuredImageUrl}
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="aspect-[16/9] w-full"
                  />
                  <div className="p-[18px]">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.8px] text-[#FD7402] group-hover:text-[#0E489C]">
                      {rel.category.name}
                    </div>
                    <h3 className="mb-2 font-serif text-[18px] font-bold leading-[1.3] text-ink group-hover:text-[#0E489C]">
                      {rel.title}
                    </h3>
                    <div className="text-[12px] text-gray-500">
                      {rel.author.name} · {rel.displayDate}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
