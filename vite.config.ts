import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // @pufferblow/spines is a path dependency with its own node_modules: without this its components would
    // load a second copy of React and hooks would fail.
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  server: {
    fs: { allow: [resolve(__dirname), resolve(__dirname, "../spines")] },
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  build: {
    target: "es2022",
    outDir: "dist",
  },
});
