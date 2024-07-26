import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      reporter: ["lcov", "html"],
      include: ["src/**"],
      exclude: ["src/scripts/**", "src/tests/**"],
    },
  },
});
