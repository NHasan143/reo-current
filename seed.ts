import { getPayload } from "payload";
import config from "@payload-config";
import {
  articles,
  authors,
  categories,
  newsletters,
  tags,
} from "./lib/mock-data";

// ---------------------------------------------------------------------------
// Lexical rich-text helpers (build editor state for the one long-form post)
// ---------------------------------------------------------------------------

const text = (t: string) => ({
  type: "text",
  version: 1,
  detail: 0,
  format: 0,
  mode: "normal",
  style: "",
  text: t,
});
const paragraph = (t: string) => ({
  type: "paragraph",
  version: 1,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  textFormat: 0,
  textStyle: "",
  children: [text(t)],
});
const heading = (t: string) => ({
  type: "heading",
  tag: "h2",
  version: 1,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  children: [text(t)],
});
const quote = (t: string) => ({
  type: "quote",
  version: 1,
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  children: [text(t)],
});
const richText = (children: unknown[]) => ({
  root: {
    type: "root",
    version: 1,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    children,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hudBody: any = richText([
  paragraph(
    "The Department of Housing and Urban Development on Thursday issued its final rule overhauling the property preservation allowable fee schedule, capping a two-year review process that drew thousands of comments from field service companies, contractors, and mortgage servicers."
  ),
  paragraph(
    "The revision raises base allowables across nearly every line item — from initial secures and lock changes to grass cuts and debris removal — marking the first broad increase in almost a decade. It also restructures how over-allowable approvals are requested and introduces a tiered system that adjusts pricing by region."
  ),
  heading("What changes for vendors"),
  paragraph(
    "Industry stakeholders say the change will have immediate operational impact across the national vendor network, with regional field service companies expected to adjust work-order pricing and inspection scheduling within the current quarter."
  ),
  quote(
    "This is the most significant shift we've seen in several cycles. Vendors who prepare now will be in a far stronger position when the guidance takes full effect."
  ),
  paragraph(
    "The regional tiers, which divide the country into four cost bands, are intended to better reflect labor and disposal costs that vary widely between rural and metropolitan markets. Analysts note the approach mirrors long-standing requests from vendor advocacy groups."
  ),
  heading("Implementation timeline"),
  paragraph(
    "The final rule takes effect October 1, giving servicers and their vendor networks roughly 75 days to update systems, retrain field crews, and revise bid templates. REO Current will continue to track the development and publish compliance guidance as agencies release implementation details."
  ),
]);

const CATEGORY_ORDER = [
  "property-preservation",
  "field-inspections",
  "field-service-companies",
  "contractors-vendors",
  "foreclosure-reo",
  "compliance-pricing",
  "disaster-field-alerts",
  "mortgage",
];

const ADMIN_EMAIL = "admin@reocurrent.com";
const ADMIN_PASSWORD = "changeme123";
const LEAD = "hud-finalizes-property-preservation-allowable-fee-schedule";

// --- Top-level await: `payload run` waits for module evaluation to finish ---

const payload = await getPayload({ config });

payload.logger.info("— Clearing existing content —");
for (const collection of [
  "posts",
  "categories",
  "tags",
  "authors",
  "newsletters",
] as const) {
  const existing = await payload.find({ collection, limit: 500, depth: 0 });
  for (const doc of existing.docs) {
    await payload.delete({ collection, id: doc.id });
  }
}

const users = await payload.find({ collection: "users", limit: 1 });
if (users.totalDocs === 0) {
  await payload.create({
    collection: "users",
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "REO Editor" },
  });
  payload.logger.info(`— Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} —`);
}

const catId: Record<string, number> = {};
for (const c of Object.values(categories)) {
  const doc = await payload.create({
    collection: "categories",
    data: {
      name: c.name,
      slug: c.slug,
      description: c.description,
      order: CATEGORY_ORDER.indexOf(c.slug) + 1,
    },
  });
  catId[c.slug] = doc.id as number;
}

const tagId: Record<string, number> = {};
for (const t of Object.values(tags)) {
  const doc = await payload.create({
    collection: "tags",
    data: {
      name: t.name,
      slug: t.slug,
      description: t.description,
      articleCount: t.articleCount,
    },
  });
  tagId[t.slug] = doc.id as number;
}

const authorId: Record<string, number> = {};
for (const a of Object.values(authors)) {
  const doc = await payload.create({
    collection: "authors",
    data: {
      name: a.name,
      slug: a.slug,
      role: a.role,
      bio: a.bio,
      initials: a.initials,
      beat: a.beat,
      beats: a.beats,
      social: a.social,
      stats: a.stats,
    },
  });
  authorId[a.slug] = doc.id as number;
}

for (const n of newsletters) {
  await payload.create({
    collection: "newsletters",
    data: {
      name: n.name,
      slug: n.slug,
      description: n.description,
      cadence: n.cadence,
    },
  });
}

for (const p of articles) {
  await payload.create({
    collection: "posts",
    data: {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.slug === LEAD ? hudBody : undefined,
      category: catId[p.category.slug],
      tags: p.tags.map((t) => tagId[t.slug]).filter(Boolean),
      author: authorId[p.author.slug],
      date: p.date,
      relativeLabel: p.relativeDate,
      readMinutes: p.readMinutes,
      featuredImageCaption: p.featuredImageCaption,
      commentCount: p.commentCount,
      comments: p.comments?.map((c) => ({
        author: c.author,
        date: c.date,
        text: c.text,
      })),
    },
  });
}

payload.logger.info(
  `— Seed complete: ${Object.keys(categories).length} categories, ${Object.keys(tags).length} tags, ${Object.keys(authors).length} authors, ${articles.length} posts —`
);
process.exit(0);
