import { readFile } from "node:fs/promises";
import { posix, resolve } from "node:path";
import { deliverables } from "../app/deliverables.js";
import { exportDeck, exportPath, project } from "./exports.mjs";

export function workspacePlugin() {
  const pending = new Map();
  return {
    name: "hack-06-workspace",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        const deck = deliverables.find(item => item.kind === "deck"
          && context.filename === resolve(project, "app", item.entry));
        if (!deck) return html;
        const workspace = `${posix.relative(posix.dirname(deck.entry), ".") || "."}/`;
        const development = Boolean(context.server);
        return [{
          tag: "aside",
          attrs: { class: "workspace-preview-tools", "aria-label": "Deck tools", "data-deck-id": deck.id },
          children: [
            development
              ? { tag: "button", attrs: { type: "button" }, children: "Export HTML" }
              : {
                tag: "a",
                attrs: { class: "deck-export-link", href: `${workspace}exports/${deck.id}.html`, download: `${deck.id}.html` },
                children: "Export HTML",
              },
            {
              tag: "a",
              attrs: { class: "deck-close", href: workspace, "aria-label": "Close deck and return to workspace" },
              children: "&times;",
            },
            ...(development ? [{ tag: "p", attrs: { role: "status", "aria-live": "polite" } }] : []),
          ],
          injectTo: "body",
        }, {
          tag: "script",
          attrs: { type: "module", src: `${workspace}workspace/deck-tools.js` },
          injectTo: "body",
        }];
      },
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, "http://localhost").pathname;
        const match = pathname.match(/^\/__workspace\/(export|download)\/([a-z0-9-]+)$/);
        if (!match) return next();
        const [, action, id] = match;
        const sendJson = (status, body) => {
          response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
          response.end(JSON.stringify(body));
        };
        if (!deliverables.some(item => item.id === id && item.kind === "deck")) {
          sendJson(404, { error: "Deck not found." });
          return;
        }
        if (action === "export") {
          if (request.method !== "POST") {
            sendJson(405, { error: "Export requires POST." });
            return;
          }
          const sameOrigin = request.headers.origin === `http://${request.headers.host}`;
          if (!sameOrigin || request.headers["x-hack06-export"] !== "1") {
            sendJson(403, { error: "Export must be requested from this workspace." });
            return;
          }
          try {
            if (!pending.has(id)) pending.set(id, exportDeck(id));
            await pending.get(id);
            sendJson(200, { download: `/__workspace/download/${id}`, filename: `${id}.html` });
          } catch (error) {
            server.config.logger.error(`Export failed: ${error.stack}`);
            sendJson(500, { error: "Export failed. Check the terminal for details." });
          } finally {
            pending.delete(id);
          }
          return;
        }
        if (request.method !== "GET") {
          sendJson(405, { error: "Download requires GET." });
          return;
        }
        try {
          const file = await readFile(exportPath(id));
          response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Disposition": `attachment; filename="${id}.html"`,
            "Cache-Control": "no-store",
          });
          response.end(file);
        } catch (error) {
          if (error.code === "ENOENT") {
            sendJson(404, { error: "Export this deck before downloading it." });
          } else {
            server.config.logger.error(`Download failed: ${error.stack}`);
            sendJson(500, { error: "Could not read the export. Check the terminal for details." });
          }
        }
      });
    },
  };
}
