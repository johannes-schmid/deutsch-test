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
      // German became the default on 2026-10-12; English lives at /en.
      { source: "/de", destination: "/", permanent: true },
      // /dtz became a blog article on 2026-10-16.
      { source: "/dtz", destination: "/blog/dtz-pruefung", permanent: true },
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
