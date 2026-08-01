import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import { allCategorySubcategories } from "../lib/category-config";

/** Blog posts / articles — the main content type editors manage. */
export const Posts: CollectionConfig = {
  slug: "posts",
  access: { read: () => true },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (!doc.featured) return;

        // Keep a single center-column feature. Selecting a new post clears the
        // previous selection without requiring an extra editor step.
        await req.payload.update({
          collection: "posts",
          where: {
            and: [
              { id: { not_equals: doc.id } },
              { featured: { equals: true } },
            ],
          },
          data: { featured: false },
          req,
        });
      },
    ],
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "featured",
      "date",
    ],
    group: "Content",
  },
  fields: [
    // ---- Main column ----
    { name: "title", type: "text", required: true },
    { name: "excerpt", type: "textarea", admin: { description: "Short summary shown on cards and as the article deck." } },
    { name: "body", type: "richText" },
    seoFields(),

    // ---- Sidebar ----
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Post",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Show this post in the homepage center column and scrolling alert bar.",
      },
    },
    slugField("title"),
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "subcategory",
      type: "select",
      label: "Subcategory",
      index: true,
      options: allCategorySubcategories.map(
        ({ label, slug, parentLabel }) => ({
          label: `${parentLabel} — ${label}`,
          value: slug,
        })
      ),
      admin: {
        position: "sidebar",
        description:
          "Optional. Select a child category that belongs to the chosen main category.",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    { name: "featuredImage", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    { name: "featuredImageCaption", type: "text", admin: { position: "sidebar" } },
    {
      name: "relativeLabel",
      type: "text",
      admin: { position: "sidebar", description: 'Optional relative label (e.g. "2 hours ago").' },
    },
    { name: "readMinutes", type: "number", admin: { position: "sidebar" } },
  ],
};
