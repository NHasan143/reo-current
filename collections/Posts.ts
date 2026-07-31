import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

/** Blog posts / articles — the main content type editors manage. */
export const Posts: CollectionConfig = {
  slug: "posts",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "date"],
    group: "Content",
  },
  fields: [
    // ---- Main column ----
    { name: "title", type: "text", required: true },
    { name: "excerpt", type: "textarea", admin: { description: "Short summary shown on cards and as the article deck." } },
    { name: "body", type: "richText" },
    {
      name: "comments",
      type: "array",
      admin: { description: "Reader comments (demo/manual for now)." },
      fields: [
        { name: "author", type: "text", required: true },
        { name: "date", type: "text" },
        { name: "text", type: "textarea", required: true },
      ],
    },

    // ---- Sidebar ----
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
    { name: "commentCount", type: "number", admin: { position: "sidebar", description: "Overrides the shown comment count if set." } },
  ],
};
