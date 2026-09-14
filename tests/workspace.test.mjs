import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { deliverables } from "../app/deliverables.js";
import { exportDeck, exportPath, findDeck, project } from "../lib/exports.mjs";
import { workspacePlugin } from "../lib/workspace-plugin.mjs";

test("deck toolbar offers local export or a published download without a live indicator", () => {
  const plugin = workspacePlugin();
  for (const deck of deliverables.filter(item => item.kind === "deck")) {
    for (const development of [true, false]) {
      const tags = plugin.transformIndexHtml.handler("", {
        filename: resolve(project, "app", deck.entry),
        server: development ? {} : undefined,
      });
      const [toolbar, script] = tags;
      assert.equal(toolbar.attrs["data-deck-id"], deck.id);
      assert.equal(toolbar.attrs["aria-label"], "Deck tools");
      const [download, close] = toolbar.children;
      assert.equal(close.children, "&times;");
      assert.equal(close.attrs["aria-label"], "Close deck and return to workspace");
      const base = `https://ranjithquest.github.io/hack06/${deck.entry}`;
      assert.equal(new URL(close.attrs.href, base).pathname, "/hack06/");
      assert.equal(new URL(script.attrs.src, base).pathname, "/hack06/workspace/deck-tools.js");
      assert.equal(download.children, "Export HTML");
      assert.equal(download.tag, development ? "button" : "a");
      if (!development) {
        assert.equal(new URL(download.attrs.href, base).pathname, `/hack06/exports/${deck.id}.html`);
        assert.equal(download.attrs.download, `${deck.id}.html`);
      }
      assert(!JSON.stringify(toolbar).includes("Live preview"));
    }
  }
  assert.equal(plugin.transformIndexHtml.handler("workspace", {
    filename: resolve(project, "app/index.html"),
  }), "workspace");
});

test("deliverables have unique IDs and real entries inside the app", async () => {
  const seen = new Set();
  const app = resolve(project, "app");
  for (const item of deliverables) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert(!seen.has(item.id), `Duplicate ID: ${item.id}`);
    seen.add(item.id);
    assert(item.title && item.description && item.kind && item.label);
    const entry = resolve(app, item.entry);
    assert(entry.startsWith(app + sep));
    assert(entry.endsWith(".html"));
    await access(entry);
  }
});

test("exports reject unknown IDs and traversal", () => {
  for (const id of ["missing", "../mobile-intelligence", "../../outside"]) {
    assert.throws(() => findDeck(id), /Unknown deck/);
    assert.throws(() => exportPath(id), /Unknown deck/);
  }
});

test("deck exports are self-contained and preserve slide content", async () => {
  const artifacts = resolve(project, ".test-artifacts");
  await mkdir(artifacts, { recursive: true });
  const directory = await mkdtemp(resolve(artifacts, "export-"));
  try {
    for (const deck of deliverables.filter(item => item.kind === "deck")) {
      const output = await exportDeck(deck.id, directory);
      const html = await readFile(output, "utf8");
      const source = await readFile(resolve(project, "app", deck.entry), "utf8");
      const slideIds = text => [...text.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
      assert(slideIds(source).length > 0);
      assert.deepEqual(slideIds(html), slideIds(source));
      assert.equal(new Set(slideIds(html)).size, slideIds(html).length);
      assert(!/<script\b[^>]*\bsrc\s*=/i.test(html), "External script remains");
      assert(!/<link\b[^>]*rel=["']stylesheet["']/i.test(html), "External stylesheet remains");
      const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)];
      assert(images.length > 0);
      assert(images.every(match => match[1].startsWith("data:image/")), "Images must be embedded");
      assert(/data:(?:font\/ttf|application\/x-font-ttf)/.test(html), "Local fonts must be embedded");
      assert(!html.includes("fonts.googleapis.com"));
      assert(!html.includes("/@vite/client"));
      assert(!html.includes("workspace-preview-tools"));
      assert(html.includes("history.replaceState"), "Slide navigation must be included");
      assert(html.includes("SIL OPEN FONT LICENSE"), "Font notice must accompany exported fonts");
      assert(html.includes("MIT License"), "Icon notice must accompany exported icons");
      assert((await readdir(directory)).every(name => !name.startsWith(".export-")), "Staging files remain");
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
