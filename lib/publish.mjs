import { build } from "vite";
import { resolve } from "node:path";
import { deliverables } from "../app/deliverables.js";
import { exportDeck, project } from "./exports.mjs";
import { copyNotices } from "./notices.mjs";

export async function buildWorkspace(directory = resolve(project, "dist")) {
  await build({
    configFile: resolve(project, "vite.config.js"),
    build: { outDir: directory, emptyOutDir: true },
  });
  for (const deck of deliverables.filter(item => item.kind === "deck")) {
    await exportDeck(deck.id, resolve(directory, "exports"));
  }
  await copyNotices(resolve(directory, "licenses"));
  return directory;
}
