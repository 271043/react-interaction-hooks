import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "demo",
  base: "./",
  build: {
    outDir: "../dist-demo",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@sharpbits/react-interaction-hooks": resolve(__dirname, "src/index.ts"),
    },
  },
});
