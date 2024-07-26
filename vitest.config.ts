import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    root: "./src",
    coverage: {
      reporter: ["json", "html"],
      reportsDirectory: "../coverage",
      exclude: ["scripts/**", "tests/**"],
    },
  },
});
