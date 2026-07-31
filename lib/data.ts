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

// Cache the Payload instance across requests.
let cached: Promise<Payload> | null = null;
function payload(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

// ----- mappers -------------------------------------------------------------

function fmtDate(d: string): string {
  // Format in UTC so the displayed day matches the stored date regardless of
  // the server's timezone.
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(d));
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

async function findOneBySlug(collection: any, slug: string): Promise<any | null> {
  const p = await payload();
  const res = await p.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return res.docs[0] ?? null;
}

// ----- site chrome ---------------------------------------------------------

export async function getPrimaryNav(): Promise<NavItem[]> {
  const p = await payload();
  const res = await p.find({
    collection: "categories",
    limit: 50,
    sort: "order",
    depth: 0,
  });
  return res.docs.map((c: any) => ({
    label: c.name,
    href: `/category/${c.slug}`,
  }));
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

export async function getFeaturedArticle(): Promise<Article> {
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
  if (!latest) throw new Error("No posts are available for the homepage feature.");
  return latest;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const doc = await findOneBySlug("posts", slug);
  return doc ? mapPost(doc) : null;
}

export async function searchArticles(q: string, limit = 40): Promise<Article[]> {
  const query = q.trim();
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
  return getHomepageColumnStories("left");
}

export async function getHomepageRightStories(): Promise<Article[]> {
  return getHomepageColumnStories("right");
}

export async function getHomepageSecondary(): Promise<Article[]> {
  return getArticlesBySlugs(homepageSecondarySlugs);
}

async function getHomepageColumnStories(
  column: "left" | "right"
): Promise<Article[]> {
  const p = await payload();
  const res = await p.find({
    collection: "posts",
    where: { homepageColumn: { equals: column } },
    sort: ["homepageOrder", "-date"],
    limit: 50,
    depth: 2,
  });
  return res.docs.map(mapPost);
}

export async function getRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const current = await findOneBySlug("posts", slug);
  const p = await payload();
  if (!current) {
    const res = await p.find({ collection: "posts", limit, depth: 2 });
    return res.docs.map(mapPost);
  }
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
  let docs = res.docs.map(mapPost);
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

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const p = await payload();
  const cat = await findOneBySlug("categories", slug);
  if (!cat) {
    const res = await p.find({ collection: "posts", sort: "-date", limit: 20, depth: 2 });
    return res.docs.map(mapPost);
  }
  const res = await p.find({
    collection: "posts",
    where: { category: { equals: cat.id } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  if (res.docs.length === 0) {
    const fallback = await p.find({ collection: "posts", sort: "-date", limit: 20, depth: 2 });
    return fallback.docs.map(mapPost);
  }
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

export async function getArticlesByTag(slug: string): Promise<Article[]> {
  const p = await payload();
  const tag = await findOneBySlug("tags", slug);
  if (!tag) {
    const res = await p.find({ collection: "posts", sort: "-date", limit: 6, depth: 2 });
    return res.docs.map(mapPost);
  }
  const res = await p.find({
    collection: "posts",
    where: { tags: { in: [tag.id] } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  if (res.docs.length === 0) {
    const fallback = await p.find({ collection: "posts", sort: "-date", limit: 6, depth: 2 });
    return fallback.docs.map(mapPost);
  }
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

export async function getArticlesByAuthor(slug: string): Promise<Article[]> {
  const p = await payload();
  const author = await findOneBySlug("authors", slug);
  if (!author) {
    const res = await p.find({ collection: "posts", sort: "-date", limit: 6, depth: 2 });
    return res.docs.map(mapPost);
  }
  const res = await p.find({
    collection: "posts",
    where: { author: { equals: author.id } },
    sort: "-date",
    limit: 50,
    depth: 2,
  });
  if (res.docs.length === 0) {
    const fallback = await p.find({ collection: "posts", sort: "-date", limit: 6, depth: 2 });
    return fallback.docs.map(mapPost);
  }
  return res.docs.map(mapPost);
}
