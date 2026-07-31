import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
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
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Controls nav ordering (lower = earlier).",
      },
    },
  ],
};
