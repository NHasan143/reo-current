import type { Config } from "tailwindcss";

// Color values are lifted verbatim from the design source (the .dc.html
// mockups) so the build matches pixel-for-pixel. Body text greys map onto
// Tailwind's default `gray` scale, which already equals the design's hexes
// (gray-500 #6b7280, gray-600 #4b5563, gray-400 #9ca3af, gray-800 #1f2937).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8a1c1c", // primary brick red
          dark: "#701319", // button hover
          light: "#c94a4a", // footer "Current"
        },
        ink: {
          DEFAULT: "#14171c", // near-black bars / footer / dark hero
          soft: "#1d2026",
        },
        paper: "#f6f7f8", // light section background (heroes, cards, bio)
        alertbg: "#f4f1ea", // breaking-alert strip
        alertline: "#e3ded2",
        line: "#d9dce1", // primary hairline border
        line2: "#e7e9ed", // list separators / card borders
        stroke: "#c9cdd4", // input & button outlines
        photo: "#e7e4dc", // image placeholder fill
        avatar: "#d7d2c6", // avatar circle fill
        utility: "#b9bec7", // top bar / footer link text
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
