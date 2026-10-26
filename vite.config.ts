import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // One copy of React for the site and for @pufferblow/spines, whatever way it was installed (a git install, or a
    // link to ../spines while working on both): a second copy would break hooks.
    dedupe: ["react", "react-dom", "lucide-react"],
  },
  server: {
    // ../spines is allowed so a local `npm link` / `file:` checkout of spines is served by the dev server too.
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
