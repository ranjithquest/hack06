import { buildWorkspace } from "../lib/publish.mjs";

try {
  console.log(`Built workspace and downloadable decks: ${await buildWorkspace()}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
