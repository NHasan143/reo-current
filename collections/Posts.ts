import type { CollectionConfig, Payload } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import {
  allCategorySubcategories,
  getSubcategoriesForParent,
} from "../lib/category-config";

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
      // The dropdown lists every subcategory in the site, so nothing stopped an
      // editor pairing "Disaster Events" with the Field Inspections category.
      // Such a post then matched no subcategory page at all — it silently
      // vanished from the child listing instead of being rejected on save.
      validate: async (
        value: unknown,
        {
          data,
          req,
        }: {
          data?: Partial<{ category: number | string | { id: number | string } }>;
          req: { payload: Payload };
        }
      ) => {
        if (!value) return true;

        const category = data?.category;
        const categoryID =
          category && typeof category === "object" ? category.id : category;
        if (!categoryID) return true;

        let parentSlug: string | undefined;
        try {
          const parent = await req.payload.findByID({
            collection: "categories",
            id: categoryID,
            depth: 0,
          });
          parentSlug = parent?.slug;
        } catch {
          return true; // Category lookup failed; the category field reports it.
        }
        if (!parentSlug) return true;

        const allowed = getSubcategoriesForParent(parentSlug);
        if (allowed.some((child) => child.slug === value)) return true;

        return allowed.length
          ? `That subcategory belongs to a different section. Choose one of: ${allowed
              .map((child) => child.label)
              .join(", ")}.`
          : "The selected category has no subcategories. Leave this field blank.";
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
