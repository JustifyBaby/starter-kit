import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@schema": path.resolve(__dirname, "src/types/schema"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
