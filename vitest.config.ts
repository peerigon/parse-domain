import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    root: "./src",
    coverage: {
      reporter: ["lcov", "html"],
      reportsDirectory: "../coverage",
      exclude: ["scripts/**", "tests/**"],
    },
  },
});
