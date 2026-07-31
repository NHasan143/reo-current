import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

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
      "homepageColumn",
      "homepageOrder",
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
    {
      name: "homepageColumn",
      type: "select",
      label: "Homepage Side Column",
      defaultValue: "none",
      index: true,
      options: [
        { label: "Not Assigned", value: "none" },
        { label: "Left Column", value: "left" },
        { label: "Right Column (Latest)", value: "right" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Choose a side column for this post. Featured Post takes priority over this setting.",
      },
    },
    {
      name: "homepageOrder",
      type: "number",
      label: "Homepage Order",
      defaultValue: 0,
      min: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first within the selected side column.",
        condition: (_, siblingData) =>
          siblingData?.homepageColumn === "left" ||
          siblingData?.homepageColumn === "right",
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
