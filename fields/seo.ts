import type { Field } from "payload";

/** Reusable editorial SEO fields for publishable content. */
export const seoFields = (): Field => ({
  name: "seo",
  type: "group",
  label: "SEO",
  fields: [
    {
      name: "metaDescription",
      type: "textarea",
      label: "Meta Description",
      maxLength: 160,
      admin: {
        description:
          "Suggested search-result summary. Keep it specific and under 160 characters; the excerpt is used when this is blank.",
      },
    },
    {
      name: "focusKeyword",
      type: "text",
      label: "Focus Keyword",
      admin: {
        description: "The primary search phrase this content is intended to answer.",
      },
    },
    {
      name: "secondaryKeywords",
      type: "text",
      label: "Secondary Keywords",
      admin: {
        description: "Related search phrases, separated by commas.",
      },
    },
  ],
});
