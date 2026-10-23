const TTL_MS = 1500;
const DEBUG = false;
const log = (...args) => DEBUG && console.log("[Tab Grouper]", ...args);

// Zpráva z content scriptu a vznik panelu mohou dorazit v libovolném pořadí,
// proto si pamatujeme obojí a při příchodu druhé strany je spárujeme.
const armed = new Map(); // openerTabId -> čas kliknutí
const created = new Map(); // openerTabId -> { tabId, time }

const fresh = (time) => Date.now() - time <= TTL_MS;

async function groupIfUngrouped(openerId, newTabId) {
  try {
    const opener = await browser.tabs.get(openerId);
    log("opener groupId:", opener.groupId);
    // Opener už je ve skupině: výchozí chování Firefoxu.
    if (opener.groupId !== undefined && opener.groupId !== -1) return;

    const groupId = await browser.tabs.group({
      tabIds: [openerId, newTabId],
      createProperties: { windowId: opener.windowId },
    });
    log("vytvořena skupina", groupId);
  } catch (error) {
    console.error("Tab Grouper: seskupení se nezdařilo", error);
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "link-open" || !sender.tab) return;
  const openerId = sender.tab.id;
  log("zpráva z panelu", openerId);

  const pending = created.get(openerId);
  if (pending && fresh(pending.time)) {
    created.delete(openerId);
    groupIfUngrouped(openerId, pending.tabId);
  } else {
    armed.set(openerId, Date.now());
  }
});

browser.tabs.onCreated.addListener((tab) => {
  const openerId = tab.openerTabId;
  log("nový panel", tab.id, "opener:", openerId);
  if (openerId === undefined) return;

  const armedAt = armed.get(openerId);
  if (armedAt !== undefined && fresh(armedAt)) {
    armed.delete(openerId);
    groupIfUngrouped(openerId, tab.id);
  } else {
    created.set(openerId, { tabId: tab.id, time: Date.now() });
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  armed.delete(tabId);
  created.delete(tabId);
});
