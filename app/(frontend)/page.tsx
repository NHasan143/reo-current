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
        {/*
          Source order is priority order — lead, then rail, then aside — so that
          phones, screen readers, and tab order all reach the lead story first.
          Desktop's newspaper arrangement is restored with explicit grid
          placement rather than by reordering the markup.

          Tiers: one column below 768; main + right rail from 768; the full
          three-column grid at 1280, the width it was drawn for.
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_260px] md:gap-x-8 md:gap-y-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[1fr_2fr_1fr] xl:gap-0">
          {/* Lead */}
          <div className="md:col-start-1 md:row-start-1 xl:col-start-2 xl:row-start-1 xl:px-7">
            <article>
              <Link href={`/article/${lead.slug}`}>
                <Photo
                  src={lead.featuredImageUrl}
                  label="Lead Photo"
                  priority
                  sizes="(min-width: 1280px) 620px, (min-width: 768px) 60vw, 100vw"
                  className="mb-[18px] aspect-[16/9] w-full"
                />
              </Link>
              <Link
                href={`/category/${lead.category.slug}`}
                className="text-[12px] font-bold uppercase tracking-[1px] text-brand"
              >
                {lead.category.name}
              </Link>
              {/* Holds at 32px through the tablet tier — the main column is
                  narrower there than a phone's full width — and only steps up
                  once the three-column grid gives it room. */}
              <h1 className="mb-3.5 mt-2.5 font-serif text-[32px] font-bold leading-[1.15] text-ink xl:text-[36px]">
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

          {/* Rail stories — beneath the lead at tablet, the left column at xl */}
          <div className="flex flex-col md:col-start-1 md:row-start-2 xl:col-start-1 xl:row-start-1 xl:row-span-1 xl:border-r xl:border-line xl:pr-6">
            {railStories.map((article) => (
              <StoryCompact key={article.slug} article={article} />
            ))}
          </div>

          {/* Right rail — spans both rows at tablet, its own column at xl */}
          <aside className="md:col-start-2 md:row-start-1 md:row-span-2 md:border-l md:border-line md:pl-6 xl:col-start-3 xl:row-span-1 xl:border-l xl:pl-6">
            {/* No posts assigned to the right column is a legitimate editor
                state, and the spacing has to go with the section. */}
            {rightStories.length > 0 && (
              <div className="mb-6">
                <LatestWire articles={rightStories} />
              </div>
            )}
            <MorningWire description="Daily briefing on preservation, inspections, and REO — in your inbox by 7 AM." />
          </aside>
        </div>

        {/* Section blocks */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {/* A category with nothing published would otherwise render its rule
              heading over an empty block. */}
          {sections
            .filter((section) => section.articles.length > 0)
            .map((section) => (
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
