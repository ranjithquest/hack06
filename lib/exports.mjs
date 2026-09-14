import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deliverables } from "../app/deliverables.js";
import { sharedAssetsPlugin } from "./assets-plugin.mjs";
import { exportNotices } from "./notices.mjs";

export const project = fileURLToPath(new URL("../", import.meta.url));
export const exportsDirectory = resolve(project, "exports");

export function findDeck(id) {
  const deck = deliverables.find(item => item.id === id && item.kind === "deck");
  if (!deck) throw new Error(`Unknown deck: ${id}`);
  return deck;
}

export function exportPath(id, directory = exportsDirectory) {
  findDeck(id);
  return resolve(directory, `${id}.html`);
}

export async function exportDeck(id, directory = exportsDirectory) {
  const deck = findDeck(id);
  const entry = resolve(project, "app", deck.entry);
  await mkdir(directory, { recursive: true });
  const staging = await mkdtemp(resolve(directory, ".export-"));
  try {
    await build({
      configFile: false,
      root: dirname(entry),
      publicDir: false,
      base: "./",
      logLevel: "warn",
      resolve: { alias: { "/assets": resolve(project, "assets") } },
      plugins: [sharedAssetsPlugin(), viteSingleFile({ removeViteModuleLoader: true })],
      build: {
        outDir: resolve(staging, "build"),
        emptyOutDir: true,
        assetsInlineLimit: () => true,
        rollupOptions: { input: entry },
      },
    });
    const html = await readFile(resolve(staging, "build/index.html"), "utf8");
    if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*rel=["']stylesheet["']/i.test(html)
      || [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)].some(match => !match[1].startsWith("data:"))) {
      throw new Error("Export still references external code, styles or images.");
    }
    const temporaryFile = resolve(staging, `${id}.html`);
    await writeFile(temporaryFile, html.replace("</body>", `${await exportNotices()}</body>`));
    const destination = exportPath(id, directory);
    await rename(temporaryFile, destination);
    return destination;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
