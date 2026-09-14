import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { deliverables } from "./app/deliverables.js";
import { workspacePlugin } from "./lib/workspace-plugin.mjs";
import { sharedAssetsPlugin } from "./lib/assets-plugin.mjs";

const project = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(project, "app"),
  base: "./",
  publicDir: false,
  resolve: {
    alias: { "/assets": resolve(project, "assets") },
  },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  plugins: [sharedAssetsPlugin(), workspacePlugin()],
  build: {
    outDir: resolve(project, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        workspace: resolve(project, "app/index.html"),
        ...Object.fromEntries(deliverables.map(item => [item.id, resolve(project, "app", item.entry)])),
      },
    },
  },
});
