import type { Field } from "payload";

/** Reusable URL slug field that auto-fills from another field when left blank. */
export const slugField = (from = "name"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "URL-friendly identifier. Auto-generated from the title if left blank.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return value;
        const src = (data?.[from] as string) || "";
        return src
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      },
    ],
  },
});
