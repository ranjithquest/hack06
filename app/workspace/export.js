export function connectExport(button, id, status) {
  button.addEventListener("click", async () => {
    const label = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing HTML...";
    status.textContent = "Bundling the deck and its images.";
    try {
      const response = await fetch(`/__workspace/export/${id}`, {
        method: "POST",
        headers: { "X-Hack06-Export": "1", "Content-Type": "application/json" },
        body: "{}",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Export failed (${response.status}).`);
      const download = document.createElement("a");
      download.href = result.download;
      download.download = result.filename;
      document.body.appendChild(download);
      download.click();
      download.remove();
      status.textContent = "HTML exported. A copy is also saved in the project's exports folder.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
}
