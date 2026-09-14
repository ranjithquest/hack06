import { deliverables } from "../deliverables.js";

const container = document.querySelector("#deliverables");
document.querySelector("#workspace-mode").textContent = import.meta.env.DEV ? "Live workspace" : "Workspace snapshot";

for (const item of deliverables) {
  const card = document.createElement("article");
  card.className = "deliverable-card";
  const image = document.createElement("div");
  image.className = item.kind === "research" ? "deck-thumbnail research-thumbnail" : "deck-thumbnail";
  image.setAttribute("aria-hidden", "true");
  const mark = document.createElement("span");
  mark.textContent = item.kind === "research" ? "Research" : "Hack 26";
  const thumbnailTitle = document.createElement("em");
  thumbnailTitle.textContent = item.title;
  image.append(mark, thumbnailTitle);
  const content = document.createElement("div");
  content.className = "deliverable-content";
  const meta = document.createElement("p");
  meta.className = "eyebrow";
  meta.textContent = `${item.kind} / ${item.label}`;
  const title = document.createElement("h3");
  title.textContent = item.title;
  const description = document.createElement("p");
  description.className = "deliverable-description";
  description.textContent = item.description;
  const actions = document.createElement("div");
  actions.className = "deliverable-actions";
  const open = document.createElement("a");
  open.className = "open-deliverable";
  open.href = `./${item.entry}`;
  open.textContent = item.kind === "deck" ? "Open deck" : item.kind === "research" ? "Read research" : "Open deliverable";
  actions.appendChild(open);
  content.append(meta, title, description, actions);
  card.append(image, content);
  container.appendChild(card);
}

if (deliverables.length < 2) {
  const space = document.createElement("aside");
  space.className = "next-deliverable";
  space.innerHTML = '<span class="next-mark" aria-hidden="true">+</span><p class="eyebrow">Room for what comes next</p><h3>The next idea<br>belongs here, too.</h3><p>Research, a prototype, another deck.<br>We can add each new deliverable to this workspace as we make it.</p>';
  container.appendChild(space);
}
