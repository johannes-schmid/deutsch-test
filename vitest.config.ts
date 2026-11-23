import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { include: ["lib/billing/**/*.test.ts", "lib/kurztest/**/*.test.ts", "lib/lifecycle/**/*.test.ts", "lib/admin/**/*.test.ts", "lib/modelltest/**/*.test.ts", "lib/content-ideas/**/*.test.ts", "lib/blog/**/*.test.ts", "lib/i18n/**/*.test.ts", "lib/exam/dtz-result.test.ts"] },
})
