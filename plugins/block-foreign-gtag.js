export default () => {
  if (!process.client) return;

  const getAllowedId = () => window.GTAG_ID || window.__GTAG_ID__ || "";
  const isGtagScript = (el) =>
    el && el.tagName === "SCRIPT" && typeof el.src === "string" && el.src.includes("googletagmanager.com/gtag/js");

  const disableForeign = (id) => {
    const allowed = getAllowedId();
    if (!id || id === allowed) return;
    window[`ga-disable-${id}`] = true;
  };

  const handleScript = (scriptEl) => {
    try {
      const url = new URL(scriptEl.src);
      const id = url.searchParams.get("id");
      if (id && id !== getAllowedId()) {
        disableForeign(id);
        // Remove the foreign GA script
        if (scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
      }
    } catch (_) {
      // ignore
    }
  };

  // Initial scan
  document
    .querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')
    .forEach(handleScript);

  // Observe dynamically added scripts
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (isGtagScript(node)) handleScript(node);
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
};


