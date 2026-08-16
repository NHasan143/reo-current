import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// `next lint` was removed in Next.js 16, so the previous "lint": "next lint"
// script resolved the word "lint" as a directory name and always failed.
// eslint-config-next 16 ships flat configs, so ESLint now runs directly.
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "media/**",
      "app/(payload)/admin/importMap.js",
      "payload-types.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
