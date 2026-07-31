import Link from "next/link";
import type { Article } from "@/lib/types";
import { Photo } from "@/components/ui/Photo";
import { Byline } from "@/components/ui/Byline";
import { CategoryEyebrow } from "@/components/cards/CategoryEyebrow";

function href(article: Article) {
  return `/article/${article.slug}`;
}

/** Homepage left-rail: image-less, category + headline + meta. */
export function StoryCompact({ article }: { article: Article }) {
  return (
    <article className="border-b border-line2 py-[18px]">
      <CategoryEyebrow category={article.category} />
      <h3 className="mb-1.5 mt-1.5 font-serif text-[18px] font-bold leading-[1.3] text-ink">
        <Link href={href(article)} className="hover:text-brand">
          {article.title}
        </Link>
      </h3>
      <Byline article={article} withBy={false} dateVariant="relative" />
    </article>
  );
}

/** Homepage: the two cards directly under the lead story (photo + excerpt). */
export function SecondaryCard({ article }: { article: Article }) {
  return (
    <article>
      <Link href={href(article)}>
        <Photo
          src={article.featuredImageUrl}
          label="Photo"
          sizes="(min-width: 1024px) 320px, 100vw"
          className="mb-3 aspect-[16/10] w-full text-[11px]"
        />
      </Link>
      <CategoryEyebrow category={article.category} />
      <h3 className="mb-2 mt-1.5 font-serif text-[20px] font-bold leading-[1.25] text-ink">
        <Link href={href(article)} className="hover:text-brand">
          {article.title}
        </Link>
      </h3>
      <p className="mb-2 text-[14px] leading-[1.55] text-gray-600">
        {article.excerpt}
      </p>
      <Byline article={article} withBy={false} dateVariant="relative" />
    </article>
  );
}

/** Homepage section blocks: headline + meta with a small square-ish thumbnail. */
export function StoryRow({ article }: { article: Article }) {
  return (
    <article className="grid grid-cols-[1fr_110px] gap-4 border-b border-line2 py-4">
      <div className="min-w-0">
        <h3 className="mb-1.5 font-serif text-[17px] font-bold leading-[1.3] text-ink">
          <Link href={href(article)} className="hover:text-brand">
            {article.title}
          </Link>
        </h3>
        <Byline article={article} withBy={false} />
      </div>
      <Link href={href(article)}>
        <Photo
          src={article.featuredImageUrl}
          sizes="110px"
          className="aspect-[4/3] w-full"
        />
      </Link>
    </article>
  );
}

/**
 * Full-width list row for category / tag / author streams.
 * `thumbWidth` and `dateOnly` cover the small layout differences between them.
 */
export function ArticleListItem({
  article,
  thumbWidth = 200,
  dateOnly = false,
  headingClassName = "text-[23px]",
}: {
  article: Article;
  thumbWidth?: number;
  dateOnly?: boolean;
  headingClassName?: string;
}) {
  return (
    <article
      className="grid grid-cols-1 gap-5 border-b border-line2 py-6 sm:grid-cols-[1fr_var(--thumb)]"
      style={{ "--thumb": `${thumbWidth}px` } as React.CSSProperties}
    >
      <div className="min-w-0">
        <CategoryEyebrow category={article.category} />
        <h3
          className={`mb-2.5 mt-1.5 font-serif font-bold leading-[1.25] text-ink ${headingClassName}`}
        >
          <Link href={href(article)} className="hover:text-brand">
            {article.title}
          </Link>
        </h3>
        <p className="mb-2.5 text-[15px] leading-[1.6] text-gray-600">
          {article.excerpt}
        </p>
        {dateOnly ? (
          <div className="text-[12px] text-gray-500">{article.displayDate}</div>
        ) : (
          <Byline article={article} />
        )}
      </div>
      <Link href={href(article)} className="order-first sm:order-last">
        <Photo
          src={article.featuredImageUrl}
          sizes={`${thumbWidth}px`}
          className="aspect-[4/3] w-full"
        />
      </Link>
    </article>
  );
}
