import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/api/kurztest/**": ["./data/kurztest/drafts/**/*"],
  },
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/dtz/kurztest", destination: "/gratis-test/dtz", permanent: true },
      { source: "/dtz/kurztest/:skill", destination: "/gratis-test/dtz/:skill", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
