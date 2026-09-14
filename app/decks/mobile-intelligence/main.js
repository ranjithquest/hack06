(() => {
  const slides = [...document.querySelectorAll("main > section")];
  const dots = document.querySelector(".slide-dots");
  const counter = document.querySelector(".slide-counter");
  const previous = document.querySelector('[data-action="prev"]');
  const next = document.querySelector('[data-action="next"]');
  let current = Math.max(0, slides.findIndex(slide => slide.id === location.hash.slice(1)));
  let touchStartX = null;

  if (!slides.length || !dots || !counter || !previous || !next) return;
  document.body.classList.add("slideshow-mode");

  slides.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
    slide.dataset.slide = String(index + 1);
    slide.dataset.visible = "false";
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => show(index));
    dots.appendChild(dot);
  });

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
      slide.dataset.visible = String(active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    [...dots.children].forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    slides[current].scrollTop = 0;
    history.replaceState(null, "", `#${slides[current].id}`);
  }

  function step(delta) { show(current + delta); }
  previous.addEventListener("click", (event) => {
    event.preventDefault();
    step(-1);
  });
  next.addEventListener("click", (event) => {
    event.preventDefault();
    step(1);
  });
  document.addEventListener("keydown", (event) => {
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]")) return;
    if (event.key === " " && event.target instanceof Element && event.target.closest("button, a")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); step(1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); step(-1); }
    if (event.key === "Home") { event.preventDefault(); show(0); }
    if (event.key === "End") { event.preventDefault(); show(slides.length - 1); }
  });

  document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener("hashchange", () => {
    show(Math.max(0, slides.findIndex(slide => slide.id === location.hash.slice(1))));
  });
  show(current);
})();
