import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the stack in every response.
  poweredByHeader: false,

  images: {
    // Payload serves uploads from this same origin (/api/media/file/...), which
    // needs no remotePatterns entry at all. This previously allowed
    // { protocol: "https", hostname: "**" }, which turned /_next/image into an
    // open image proxy: any third party could have the server fetch and resize
    // arbitrary remote images on their behalf. Add specific hosts here only if
    // media is ever moved to an external CDN.
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop MIME sniffing on uploads and API responses.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Clickjacking: the site is never meant to be framed cross-origin.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
