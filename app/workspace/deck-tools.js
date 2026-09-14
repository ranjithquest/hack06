import { deliverables } from "../deliverables.js";
import { connectExport } from "./export.js";
import "./deck-tools.css";

const deck = deliverables.find(item => location.pathname === `/${item.entry}` || location.pathname === `/${item.entry.replace(/index\.html$/, "")}`);
if (deck) {
  const tools = document.createElement("aside");
  tools.className = "workspace-preview-tools";
  tools.setAttribute("aria-label", "Development tools");
  tools.innerHTML = '<a href="/">Workspace</a><span class="preview-live">Live preview</span><button type="button">Export HTML</button><p role="status" aria-live="polite"></p>';
  document.body.appendChild(tools);
  connectExport(tools.querySelector("button"), deck.id, tools.querySelector("[role=status]"));
}
