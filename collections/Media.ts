import type { CollectionConfig } from "payload";

/** Uploaded images (featured photos, author avatars). Served by Payload. */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  admin: { group: "Content" },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 768 },
      { name: "feature", width: 1280 },
    ],
    focalPoint: true,
  },
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};
