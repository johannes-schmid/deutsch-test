import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/i18n/slugs";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/api/kurztest/**": ["./data/kurztest/drafts/**/*"],
    // /admin/seo reads the SEO loop's snapshots and lists from disk (lib/admin/seo.ts).
    "/admin/seo": ["./seo-agent/**/*"],
  },
  partialPrefetching: true,
  async headers() {
    return [
      // The push service worker (public/sw.js) must never be served stale, or a fix to it would not reach browsers.
      // Russian and Ukrainian are noindex for now (Hannes, 2026-11-16); the pages stay live for visitors.
      { source: "/:l(ru|uk)", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] },
      { source: "/:l(ru|uk)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" }] },
    ];
  },
  async redirects() {
    return [
      // German became the default on 2026-10-12; English lives at /en.
      { source: "/de", destination: "/", permanent: true },
      // /dtz became a blog article on 2026-10-16.
      { source: "/dtz", destination: "/blog/dtz-pruefung", permanent: true },
      { source: "/dtz/kurztest", destination: "/gratis-test/dtz", permanent: true },
      { source: "/dtz/kurztest/:skill", destination: "/gratis-test/dtz/:skill", permanent: true },
      // /uk and /ru got translated slugs on 2026-11-16 (lib/i18n/slugs.ts).
      ...legacyRedirects(),
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
