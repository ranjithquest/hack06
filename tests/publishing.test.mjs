import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { deliverables } from "../app/deliverables.js";
import { project } from "../lib/exports.mjs";
import { buildWorkspace } from "../lib/publish.mjs";

test("static publishing includes offline downloads and repository-relative assets", async () => {
  const artifacts = resolve(project, ".test-artifacts");
  await mkdir(artifacts, { recursive: true });
  const directory = await mkdtemp(resolve(artifacts, "publish-"));
  try {
    await buildWorkspace(directory);
    const entries = ["index.html", ...deliverables.map(item => item.entry)];
    for (const entry of entries) {
      const html = await readFile(resolve(directory, entry), "utf8");
      assert(!html.includes("/@vite/client"));
      assert(!html.includes("workspace-preview-tools"));
      const references = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)];
      for (const [, reference] of references) {
        if (/^(?:data:|https?:|#)/.test(reference)) continue;
        const url = new URL(reference, `https://ranjithquest.github.io/hack06/${entry}`);
        assert(url.pathname.startsWith("/hack06/"), `Reference escapes repository: ${reference}`);
        const file = resolve(directory, decodeURIComponent(url.pathname.slice("/hack06/".length)));
        assert(file === directory || file.startsWith(directory + sep));
        await access(file);
        if (file.endsWith(".css")) {
          const css = await readFile(file, "utf8");
          for (const [, asset] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            if (asset.startsWith("data:")) continue;
            assert(!asset.startsWith("/"), `Root-relative CSS asset: ${asset}`);
            await access(resolve(dirname(file), asset));
          }
        }
      }
    }
    for (const deck of deliverables.filter(item => item.kind === "deck")) {
      const html = await readFile(resolve(directory, "exports", `${deck.id}.html`), "utf8");
      assert(html.includes("data:image/"), "Download must contain embedded images");
      assert(!/<script\b[^>]*\bsrc\s*=|<link\b[^>]*rel=["']stylesheet["']/i.test(html));
      assert(!html.includes("workspace-preview-tools"));
      assert(html.includes('id="asset-notices"'));
    }
    assert.match(await readFile(resolve(directory, "licenses/DMMono-OFL.txt"), "utf8"), /SIL OPEN FONT LICENSE/);
    assert.match(await readFile(resolve(directory, "licenses/fluent-icons-LICENSE"), "utf8"), /MIT License/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
