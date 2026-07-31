import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Authors: CollectionConfig = {
  slug: "authors",
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role"],
    group: "Content",
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "role", type: "text", admin: { description: "e.g. Senior Compliance Reporter" } },
    { name: "bio", type: "textarea" },
    {
      name: "initials",
      type: "text",
      admin: { position: "sidebar", description: "Avatar fallback initials (e.g. SM)." },
    },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "beat", type: "text", admin: { description: "Named newsletter for this beat (e.g. Compliance Watch)." } },
    {
      name: "beats",
      type: "text",
      hasMany: true,
      admin: { description: "Topic beats shown as chips on the author page." },
    },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "email", type: "text" },
        { name: "twitter", type: "text", label: "X / Twitter handle" },
        { name: "linkedin", type: "text", label: "LinkedIn handle" },
      ],
    },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
};
