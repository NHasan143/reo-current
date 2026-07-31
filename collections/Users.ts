import type { CollectionConfig } from "payload";

/** Admin/editor accounts. Auth is built in — this is who logs into /admin. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email", group: "Settings" },
  fields: [
    { name: "name", type: "text" },
  ],
};
