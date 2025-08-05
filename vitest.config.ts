import { defineConfig } from "vitest/config";

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
