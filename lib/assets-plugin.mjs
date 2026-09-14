import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../assets", import.meta.url));

export function sharedAssetsPlugin() {
  let serving = false;
  return {
    name: "shared-project-assets",
    configResolved(config) {
      serving = config.command === "serve";
    },
    configureServer(server) {
      server.watcher.add(assets);
    },
    handleHotUpdate(context) {
      if (context.file.startsWith(assets + sep)) {
        context.server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        // Outside-root HTML assets need Vite's filesystem route in development.
        const prefix = serving
          ? `/@fs/${assets.split(sep).join("/").replace(/^\/+/, "")}`
          : relative(dirname(resolve(context.filename)), assets).split(sep).join("/");
        return html.replace(/(\b(?:src|href|poster)\s*=\s*["'])\/assets\//g, `$1${prefix}/`);
      },
    },
  };
}
