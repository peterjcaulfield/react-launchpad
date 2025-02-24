import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom", // or 'jsdom'
    globals: true,
    setupFiles: "./setupTests.ts",
    include: ["**/*test.{js,ts,tsx,jsx}"],
  },
});
