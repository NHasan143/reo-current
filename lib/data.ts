// ---------------------------------------------------------------------------
// Data access layer
// ---------------------------------------------------------------------------
// Every page/component reads content through these functions. They resolve
// content from Payload CMS via its Local API (no HTTP — direct DB access inside
// the same Next.js process), then map Payload documents onto the UI's domain
// types (lib/types.ts). Editors manage all of this at /admin.
//
// Site "furniture" that isn't a blog entity yet (the "Latest" wire, "Most
// Read", and the testimonial) still comes from lib/mock-data.ts — these can
// graduate to a Payload global later.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import type {
  Article,
  Author,
  Category,
  MostReadItem,
  NavItem,
  Newsletter,
  Tag,
  Testimonial,
} from "./types";
import {
  footerSections,
  homepageSecondarySlugs,
  mostRead,
  testimonial,
} from "./mock-data";
import {
  getSubcategoriesForParent,
  getSubcategory,
} from "./category-config";

// Cache the Payload instance across requests.
let cached: Promise<Payload> | null = null;
function payload(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

// ----- mappers -------------------------------------------------------------

function fmtDate(d: string): string {
  // Format in UTC so the displayed day matches the stored date regardless of
  // the server's timezone. A missing or unparseable date must not take the
  // whole page down with a RangeError, so fall back to an empty label.
  const parsed = new Date(d);
  if (!d || Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mediaUrl(m: any): string | undefined {
  return m && typeof m === "object" && m.url ? (m.url as string) : undefined;
}

function mapCategory(c: any): Category {
  return { slug: c.slug, name: c.name, description: c.description ?? undefined };
}

function mapTag(t: any): Tag {
  return {
    slug: t.slug,
    name: t.name,
    description: t.description ?? undefined,
    articleCount: t.articleCount ?? undefined,
  };
}

function mapAuthor(a: any): Author {
  return {
    slug: a.slug,
    name: a.name,
    role: a.role ?? "",
    bio: a.bio ?? "",
    initials: a.initials || initialsFrom(a.name),
    avatarUrl: mediaUrl(a.avatar),
    beat: a.beat ?? undefined,
    beats: Array.isArray(a.beats) && a.beats.length ? a.beats : undefined,
    social: a.social
      ? {
          email: a.social.email ?? undefined,
          twitter: a.social.twitter ?? undefined,
          linkedin: a.social.linkedin ?? undefined,
        }
      : undefined,
    stats: Array.isArray(a.stats)
      ? a.stats.map((s: any) => ({ value: s.value, label: s.label }))
      : undefined,
  };
}

function mapPost(p: any): Article {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    body: p.body ?? undefined,
    category: typeof p.category === "object" ? mapCategory(p.category) : ({} as Category),
    subcategory: p.subcategory ?? undefined,
    tags: Array.isArray(p.tags)
      ? p.tags.filter((t: any) => typeof t === "object").map(mapTag)
      : [],
    author: typeof p.author === "object" ? mapAuthor(p.author) : ({} as Author),
    date: p.date,
    displayDate: fmtDate(p.date),
    relativeDate: p.relativeLabel ?? undefined,
    readMinutes: p.readMinutes ?? undefined,
    featuredImageUrl: mediaUrl(p.featuredImage),
    featuredImageCaption: p.featuredImageCaption ?? undefined,
    seo: p.seo
      ? {
          metaDescription: p.seo.metaDescription ?? undefined,
          focusKeyword: p.seo.focusKeyword ?? undefined,
          secondaryKeywords: p.seo.secondaryKeywords ?? undefined,
        }
      : undefined,
  };
}

// ----- small query helpers -------------------------------------------------

// Memoised per request: pages routinely resolve the same slug twice (once in
// generateMetadata, once in the component), which was issuing every lookup
// query twice. React's cache() dedupes them within a single render pass.
const findOneBySlug = cache(async function findOneBySlug(
  collection: any,
  slug: string
): Promise<any | null> {
  const p = await payload();
  const res = await p.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] ?? null;
});

// SQL LIKE treats % and _ as wildcards. Payload's `like` operator interpolates
// the raw term into the pattern with no ESCAPE clause, so searching "%" matched
// every row and "a%b" matched anything between an a and a b.
//
// The wildcards are deleted rather than replaced with a space: Payload splits a
// search phrase on whitespace and requires every word, so substituting a space
// would turn "a%b" into a two-letter AND query that matches almost everything.
// Deleting gives "a%b" -> "ab" and "100%" -> "100", which is what a reader
// typing those characters actually means.
function stripLikeWildcards(term: string): string {
  return term.replace(/[%_]/g, "").replace(/\s+/g, " ").trim();
}

// ----- site chrome ---------------------------------------------------------

export async function getPrimaryNav(): Promise<NavItem[]> {
  const p = await payload();
  const [categories, posts] = await Promise.all([
    p.find({
      collection: "categories",
      limit: 50,
      sort: "order",
      depth: 0,
    }),
    p.find({
      collection: "posts",
      limit: 200,
      sort: "-date",
      depth: 1,
    }),
  ]);

  const recentByCategory = new Map<string, NavItem["recentPosts"]>();

  for (const post of posts.docs as any[]) {
    const categoryID =
      typeof post.category === "object" ? post.category?.id : post.category;
    if (categoryID == null) continue;

    const key = String(categoryID);
    const recent = recentByCategory.get(key) ?? [];
    if (recent.length >= 3) continue;

    recent.push({
      slug: post.slug,
      title: post.title,
      displayDate: fmtDate(post.date),
      featuredImageUrl: mediaUrl(post.featuredImage),
    });
    recentByCategory.set(key, recent);
  }

  // Every category is a nav item, ordered by the `order` sidebar field.
  // Mortgage carries no subcategories, so its mega panel is recent posts only.
  return categories.docs.map((category: any) => {
    const href = `/category/${category.slug}`;

    return {
      label: category.name,
      href,
      children: getSubcategoriesForParent(category.slug).map(
        ({ label, slug }) => ({
          label,
          href: `${href}/${slug}`,
        })
      ),
      recentPosts: recentByCategory.get(String(category.id)) ?? [],
    };
  });
}

export async function getFooterSections(): Promise<NavItem[]> {
  return footerSections;
}

export async function getMostRead(limit = 5): Promise<MostReadItem[]> {
  return mostRead.slice(0, limit);
}

export async function getTestimonial(): Promise<Testimonial> {
  return testimonial;
}

export async function getPopularTags(limit = 6): Promise<Tag[]> {
  const p = await payload();
  const res = await p.find({ collection: "tags", limit, depth: 0 });
  return res.docs.map(mapTag);
}

export async function getNewsletters(): Promise<Newsletter[]> {
  const p = await payload();
  const res = await p.find({ collection: "newsletters", limit: 50, depth: 0 });
  return res.docs.map((n: any) => ({
    slug: n.slug,
    name: n.name,
    description: n.description ?? "",
    cadence: n.cadence ?? "",
    body: n.body ?? undefined,
    seo: n.seo
      ? {
          metaDescription: n.seo.metaDescription ?? undefined,
          focusKeyword: n.seo.focusKeyword ?? undefined,
          secondaryKeywords: n.seo.secondaryKeywords ?? undefined,
        }
      : undefined,
  }));
}

// ----- articles ------------------------------------------------------------

export async function getLatestArticles(limit?: number): Promise<Article[]> {
  const p = await payload();
  const res = await p.find({
    collection: "posts",
    sort: "-date",
    limit: limit ?? 100,
    depth: 2,
  });
  return res.docs.map(mapPost);
}

// Returns null when the CMS has no posts at all. This used to throw, which
// turned a brand-new (or fully emptied) CMS into a 500 on the homepage instead
// of an empty but working page.
export async function getFeaturedArticle(): Promise<Article | null> {
  const p = await payload();
  const featured = await p.find({
    collection: "posts",
    where: { featured: { equals: true } },
    sort: "-date",
    limit: 1,
    depth: 2,
  });

  if (featured.docs[0]) return mapPost(featured.docs[0]);

  const [latest] = await getLatestArticles(1);
  return latest ?? null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const doc = await findOneBySlug("posts", slug);
  return doc ? mapPost(doc) : null;
}

export async function searchArticles(q: string, limit = 40): Promise<Article[]> {
  const query = stripLikeWildcards(q);
  if (!query) return [];
  const p = await payload();
  const res = await p.find({
    collection: "posts",
    where: {
      or: [
        { title: { like: query } },
        { excerpt: { like: query } },
      ],
    },
    sort: "-date",
    limit,
    depth: 2,
  });
  return res.docs.map(mapPost);
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const p = await payload();
  const res = await p.find({ collection: "posts", limit: 500, depth: 0 });
  return res.docs.map((d: any) => d.slug);
}

export async function getArticlesBySlugs(slugs: string[]): Promise<Article[]> {
  if (!slugs.length) return [];
  const p = await payload();
  const res = await p.find({
    collection: "posts",
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 2,
  });
  const bySlug = new Map(res.docs.map((d: any) => [d.slug, mapPost(d)]));
  return slugs.map((s) => bySlug.get(s)).filter((a): a is Article => Boolean(a));
}

export async function getHomepageLeftStories(): Promise<Article[]> {
  const p = await payload();
  const [categories, posts] = await Promise.all([
    p.find({
      collection: "categories",
      limit: 50,
      sort: "order",
      depth: 0,
    }),
    p.find({
      collection: "posts",
      limit: 500,
      sort: "-date",
      depth: 2,
    }),
  ]);

  const latestByCategory = new Map<string, Article>();

  for (const post of posts.docs as any[]) {
    const categoryID =
      typeof post.category === "object" ? post.category?.id : post.category;
    if (categoryID == null) continue;

    const key = String(categoryID);
    if (!latestByCategory.has(key)) {
      latestByCategory.set(key, mapPost(post));
    }
  }

  return categories.docs
    .filter((category: any) => category.slug !== "mortgage")
    .map((category: any) => latestByCategory.get(String(category.id)))
    .filter((article): article is Article => Boolean(article));
}

export async function getHomepageRightStories(): Promise<Article[]> {
  return getLatestArticles(7);
}

export async function getHomepageSecondary(): Promise<Article[]> {
  return getArticlesBySlugs(homepageSecondarySlugs);
}

export async function getRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const current = await findOneBySlug("posts", slug);
  const p = await payload();
  // No such article: there is nothing to be related to. (Callers 404 first;
  // this keeps the function honest if it is ever used somewhere that doesn't.)
  if (!current) return [];
  const categoryId =
    typeof current.category === "object" ? current.category.id : current.category;
  const res = await p.find({
    collection: "posts",
    where: {
      and: [
        { category: { equals: categoryId } },
        { slug: { not_equals: slug } },
      ],
    },
    limit,
    depth: 2,
  });
  const docs = res.docs.map(mapPost);
  if (docs.length < limit) {
    const fill = await p.find({
      collection: "posts",
      where: { slug: { not_equals: slug } },
      limit: limit + 5,
      depth: 2,
    });
    for (const d of fill.docs.map(mapPost)) {
      if (docs.length >= limit) break;
      if (!docs.some((x) => x.slug === d.slug)) docs.push(d);
    }
  }
  return docs.slice(0, limit);
}

// ----- categories ----------------------------------------------------------

export async function getCategory(slug: string): Promise<Category | null> {
  const doc = await findOneBySlug("categories", slug);
  return doc ? mapCategory(doc) : null;
}

export async function getAllCategories(): Promise<Category[]> {
  const p = await payload();
  const res = await p.find({
    collection: "categories",
    limit: 50,
    sort: "order",
    depth: 0,
  });
  return res.docs.map(mapCategory);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const p = await payload();
  const res = await p.find({ collection: "categories", limit: 50, depth: 0 });
  return res.docs.map((d: any) => d.slug);
}

// A category with no posts returns an empty list. It previously fell back to
// "the 20 newest posts site-wide", which put unrelated articles under the
// category heading and defeated the homepage's empty-section check.
export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const p = await payload();
  const cat = await findOneBySlug("categories", slug);
  if (!cat) return [];
  const res = await p.find({
    collection: "posts",
    where: { category: { equals: cat.id } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  return res.docs.map(mapPost);
}

export async function getArticlesBySubcategory(
  parentSlug: string,
  subcategorySlug: string
): Promise<Article[]> {
  if (!getSubcategory(parentSlug, subcategorySlug)) {
    return [];
  }

  const p = await payload();
  const parent = await findOneBySlug("categories", parentSlug);
  if (!parent) return [];

  const res = await p.find({
    collection: "posts",
    where: {
      and: [
        { category: { equals: parent.id } },
        { subcategory: { equals: subcategorySlug } },
      ],
    },
    sort: "-date",
    limit: 50,
    depth: 2,
  });

  return res.docs.map(mapPost);
}

// ----- tags ----------------------------------------------------------------

export async function getTag(slug: string): Promise<Tag | null> {
  const doc = await findOneBySlug("tags", slug);
  return doc ? mapTag(doc) : null;
}

export async function getAllTagSlugs(): Promise<string[]> {
  const p = await payload();
  const res = await p.find({ collection: "tags", limit: 100, depth: 0 });
  return res.docs.map((d: any) => d.slug);
}

// Same rule as categories: an unused tag returns nothing rather than borrowing
// unrelated articles.
export async function getArticlesByTag(slug: string): Promise<Article[]> {
  const p = await payload();
  const tag = await findOneBySlug("tags", slug);
  if (!tag) return [];
  const res = await p.find({
    collection: "posts",
    where: { tags: { in: [tag.id] } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  return res.docs.map(mapPost);
}

export async function getRelatedTags(slug: string, limit = 5): Promise<Tag[]> {
  const p = await payload();
  const res = await p.find({
    collection: "tags",
    where: { slug: { not_equals: slug } },
    limit,
    depth: 0,
  });
  return res.docs.map(mapTag);
}

// ----- authors -------------------------------------------------------------

export async function getAuthor(slug: string): Promise<Author | null> {
  const doc = await findOneBySlug("authors", slug);
  return doc ? mapAuthor(doc) : null;
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const p = await payload();
  const res = await p.find({ collection: "authors", limit: 100, depth: 0 });
  return res.docs.map((d: any) => d.slug);
}

// The fallback here was the most damaging of the three: an author with no
// published posts listed other reporters' articles under "Latest by {name}",
// misattributing bylines. An author with nothing published returns nothing.
export async function getArticlesByAuthor(slug: string): Promise<Article[]> {
  const p = await payload();
  const author = await findOneBySlug("authors", slug);
  if (!author) return [];
  const res = await p.find({
    collection: "posts",
    where: { author: { equals: author.id } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  return res.docs.map(mapPost);
}
