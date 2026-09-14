import { connectExport } from "./export.js";
import "./deck-tools.css";

const tools = document.querySelector(".workspace-preview-tools");
if (import.meta.env.DEV && tools) {
  connectExport(tools.querySelector("button"), tools.dataset.deckId, tools.querySelector("[role=status]"));
}
