import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

export const Newsletters: CollectionConfig = {
  slug: "newsletters",
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "cadence"],
    group: "Content",
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "description", type: "text" },
    { name: "body", type: "richText" },
    seoFields(),
    { name: "cadence", type: "text", admin: { description: 'e.g. "Daily · 7 AM"' } },
  ],
};
