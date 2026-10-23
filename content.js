// Hlásí background skriptu, že uživatel právě otevírá odkaz do nového panelu
// (prostřední tlačítko, nebo Ctrl+klik; na macOS Cmd+klik).
const isMac = navigator.platform.startsWith("Mac");

document.addEventListener(
  "mousedown",
  (event) => {
    const middle = event.button === 1;
    const modified = event.button === 0 && (isMac ? event.metaKey : event.ctrlKey);
    if (!middle && !modified) return;

    const link = event.target instanceof Element && event.target.closest("a[href]");
    if (!link) return;

    browser.runtime.sendMessage({ type: "link-open" });
  },
  true
);
