import { copyFile, mkdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../assets/", import.meta.url));
const notices = [
  "README.md",
  "fonts/DMMono-OFL.txt",
  "mobile-assets/fluent-icons-LICENSE",
  "mobile-assets/mai-site/source-urls.txt",
];

export async function exportNotices() {
  const texts = await Promise.all(notices.map(async path =>
    `${path}\n\n${await readFile(resolve(assets, path), "utf8")}`));
  const text = texts.join("\n\n").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<template id="asset-notices"><pre>${text}</pre></template>`;
}

export async function copyNotices(directory) {
  await mkdir(directory, { recursive: true });
  await Promise.all(notices.map(path => copyFile(resolve(assets, path), resolve(directory, basename(path)))));
}
