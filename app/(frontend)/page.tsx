import Link from "next/link";
import { AlertBar } from "@/components/layout/AlertBar";
import {
  StoryCompact,
  SecondaryCard,
  StoryRow,
} from "@/components/cards/ArticleCards";
import { LatestWire } from "@/components/sidebar/LatestWire";
import { MorningWire } from "@/components/sidebar/MorningWire";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo } from "@/components/ui/Photo";
import { Byline } from "@/components/ui/Byline";
import {
  getArticlesByCategory,
  getFeaturedArticle,
  getHomepageLeftStories,
  getHomepageRightStories,
  getHomepageSecondary,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const HOMEPAGE_SECTIONS = [
  { slug: "property-preservation", title: "Property Preservation Services" },
  { slug: "foreclosure-reo", title: "Foreclosure & REO" },
  { slug: "field-inspections", title: "Field Inspections" },
  { slug: "mortgage", title: "Mortgage" },
] as const;

export default async function HomePage() {
  const [lead, pinnedRailStories, pinnedSecondary, pinnedRightStories] =
    await Promise.all([
      getFeaturedArticle(),
      getHomepageLeftStories(),
      getHomepageSecondary(),
      getHomepageRightStories(),
    ]);

  // A featured post belongs only in the center lead position, even if it was
  // previously pinned to one of the surrounding homepage slots.
  const railStories = pinnedRailStories.filter(
    (article) => article.slug !== lead.slug
  );
  const secondary = pinnedSecondary.filter(
    (article) => article.slug !== lead.slug
  );
  const rightStories = pinnedRightStories.filter(
    (article) => article.slug !== lead.slug
  );

  const sections = await Promise.all(
    HOMEPAGE_SECTIONS.map(async (s) => ({
      ...s,
      articles: (await getArticlesByCategory(s.slug)).slice(0, 3),
    }))
  );

  return (
    <>
      <AlertBar article={lead} />

      <div className="container-page pb-14 pt-8">
        {/* Lead: 3-column newspaper grid with vertical dividers */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr_1fr] lg:gap-0">
          {/* Left rail */}
          <div className="flex flex-col lg:border-r lg:border-line lg:pr-6">
            {railStories.map((article) => (
              <StoryCompact key={article.slug} article={article} />
            ))}
          </div>

          {/* Center lead */}
          <div className="lg:px-7">
            <article>
              <Link href={`/article/${lead.slug}`}>
                <Photo
                  src={lead.featuredImageUrl}
                  label="Lead Photo"
                  priority
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className="mb-[18px] aspect-[16/9] w-full"
                />
              </Link>
              <Link
                href={`/category/${lead.category.slug}`}
                className="text-[12px] font-bold uppercase tracking-[1px] text-brand"
              >
                {lead.category.name}
              </Link>
              <h1 className="mb-3.5 mt-2.5 font-serif text-[32px] font-bold leading-[1.15] text-ink md:text-[36px]">
                <Link href={`/article/${lead.slug}`} className="hover:text-brand">
                  {lead.title}
                </Link>
              </h1>
              <p className="mb-3 text-[16px] leading-[1.6] text-gray-600">
                {lead.excerpt}
              </p>
              <Byline article={lead} className="text-[13px]" dateVariant="relative" />
            </article>

            {/* Secondary cards under the lead */}
            {secondary.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-6 border-t-2 border-ink pt-6 sm:grid-cols-2">
                {secondary.map((article) => (
                  <SecondaryCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="lg:border-l lg:border-line lg:pl-6">
            <LatestWire articles={rightStories} />
            <div className="mt-6">
              <MorningWire description="Daily briefing on preservation, inspections, and REO — in your inbox by 7 AM." />
            </div>
          </aside>
        </div>

        {/* Section blocks */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.slug}>
              <SectionHeading
                title={section.title}
                href={`/category/${section.slug}`}
              />
              <div className="mt-1">
                {section.articles.map((article) => (
                  <StoryRow key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
