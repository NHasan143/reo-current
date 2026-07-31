import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Tags: CollectionConfig = {
  slug: "tags",
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    group: "Content",
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "description", type: "textarea" },
    {
      name: "articleCount",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Optional display count shown on the tag page.",
      },
    },
  ],
};
