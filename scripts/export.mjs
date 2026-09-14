import { deliverables } from "../app/deliverables.js";
import { exportDeck, findDeck } from "../lib/exports.mjs";

const ids = process.argv.slice(2);
const selected = ids.length ? ids : deliverables.filter(item => item.kind === "deck").map(item => item.id);
try {
  selected.forEach(findDeck);
  for (const id of selected) console.log(`Exported: ${await exportDeck(id)}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
