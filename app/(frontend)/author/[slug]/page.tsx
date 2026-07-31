import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { ArticleListItem } from "@/components/cards/ArticleCards";
import { Pagination } from "@/components/ui/Pagination";
import { FollowButton } from "@/components/ui/FollowButton";
import { MiniSignup } from "@/components/forms/MiniSignup";
import { MostRead } from "@/components/sidebar/MostRead";
import { Photo } from "@/components/ui/Photo";
import {
  getAllAuthorSlugs,
  getArticlesByAuthor,
  getAuthor,
  getMostRead,
} from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: "Author not found" };
  return { title: author.name, description: author.bio };
}

const SOCIAL =
  "inline-flex items-center justify-center border border-stroke bg-white px-3.5 py-[9px] text-[13px] font-semibold text-ink transition-colors hover:border-ink";

// Small so pagination is demonstrable with the current seed data; bump this
// once authors have more posts.
const PAGE_SIZE = 2;

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const [articles, mostRead] = await Promise.all([
    getArticlesByAuthor(slug),
    getMostRead(),
  ]);

  const [featured, ...rest] = articles;
  const firstName = author.name.split(" ")[0];
  const beats = author.beats ?? (author.beat ? [author.beat] : []);

  // Featured story shows on page 1; the rest is paginated.
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showFeatured = page === 1 && featured;

  return (
    <>
      {/* Author header */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-8 px-5 py-12 sm:px-6 md:flex-row md:items-center">
          <Avatar
            initials={author.initials}
            src={author.avatarUrl}
            name={author.name}
            size={128}
            className="shrink-0"
          />
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[1.2px] text-brand">
              {author.role}
            </div>
            <h1 className="mb-2.5 mt-2 font-serif text-[36px] font-bold text-ink md:text-[40px]">
              {author.name}
            </h1>
            <p className="mb-4 max-w-[620px] text-[16px] leading-[1.6] text-gray-600">
              {author.bio}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <FollowButton label="Follow" followingLabel="Following" />
              {author.social?.email && (
                <a href={`mailto:${author.social.email}`} className={SOCIAL}>
                  Email
                </a>
              )}
              {author.social?.twitter && (
                <a href={`https://x.com/${author.social.twitter}`} className={SOCIAL}>
                  X / Twitter
                </a>
              )}
              {author.social?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${author.social.linkedin}`}
                  className={SOCIAL}
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      {author.stats && author.stats.length > 0 && (
        <section className="border-b border-line2">
          <div className="mx-auto flex max-w-[1120px] flex-wrap gap-x-14 gap-y-4 px-5 py-5 sm:px-6">
            {author.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-[26px] font-bold text-ink">
                  {stat.value}
                </div>
                <div className="text-[12px] uppercase tracking-[1px] text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1120px] px-5 py-11 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2.4fr_1fr] lg:gap-12">
          {/* Article list */}
          <div className="min-w-0">
            <div className="rule-heading mb-2">
              <span className="rule-label">Latest by {author.name}</span>
            </div>

            {showFeatured && (
              <article className="border-b border-line2 py-6">
                <Link href={`/article/${featured.slug}`}>
                  <Photo
                    src={featured.featuredImageUrl}
                    label="Featured Photo"
                    priority
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="mb-4 aspect-[16/8] w-full"
                  />
                </Link>
                <span className="eyebrow">{featured.category.name}</span>
                <h2 className="mb-2.5 mt-2 font-serif text-[28px] font-bold leading-[1.2] text-ink">
                  <Link href={`/article/${featured.slug}`} className="hover:text-brand">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mb-2.5 text-[15px] leading-[1.6] text-gray-600">
                  {featured.excerpt}
                </p>
                <div className="text-[12px] text-gray-500">{featured.displayDate}</div>
              </article>
            )}

            {pageItems.map((article) => (
              <ArticleListItem
                key={article.slug}
                article={article}
                thumbWidth={180}
                dateOnly
                headingClassName="text-[21px]"
              />
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/author/${slug}`}
                showPrev
              />
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {beats.length > 0 && (
              <section className="mb-8">
                <div className="rule-heading mb-3">
                  <span className="rule-label">Beats</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {beats.map((b) => (
                    <span
                      key={b}
                      className="border border-stroke px-3 py-[5px] text-[13px] font-semibold text-gray-600"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {author.beat && (
              <div className="mb-8">
                <MiniSignup
                  title={`Follow ${firstName}'s beat`}
                  description={`Get ${author.beat} — ${firstName}'s weekly rundown on rules and pricing.`}
                  cta="Subscribe"
                />
              </div>
            )}

            <MostRead items={mostRead} />
          </aside>
        </div>
      </section>
    </>
  );
}
