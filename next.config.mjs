import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Payload-served media (same origin) and any remote host you configure.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withPayload(nextConfig);
