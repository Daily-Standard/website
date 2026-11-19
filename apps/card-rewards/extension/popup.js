// Popup: injects offers.js into the current tab (all frames) and calls it.

const $ = (id) => document.getElementById(id);
const status = (msg) => { $('status').textContent = msg; };

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function issuerOf(url) {
  try {
    const host = new URL(url).hostname;
    if (/americanexpress\.com$/.test(host)) return 'amex';
    if (/chase\.com$/.test(host)) return 'chase';
  } catch { /* ignore */ }
  return null;
}

async function inject(tabId) {
  await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, files: ['offers.js'] });
}

/** Run a method of window.__cardOffers in every frame; returns per-frame results. */
async function call(tabId, method, arg) {
  const results = await chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: (m, a) => (window.__cardOffers ? window.__cardOffers[m](a) : null),
    args: [method, arg ?? null],
  });
  return results.map((r) => r.result).filter((r) => r != null);
}

function settings() {
  return { extra: $('extra').value.trim(), max: Math.max(1, Number($('max').value) || 150) };
}

async function saveSettings() {
  await chrome.storage.local.set({ settings: settings() });
}

async function init() {
  const { settings: saved, progress } = await chrome.storage.local.get(['settings', 'progress']);
  if (saved) { $('extra').value = saved.extra || ''; $('max').value = saved.max || 150; }
  const tab = await currentTab();
  const issuer = issuerOf(tab && tab.url);
  if (!issuer) {
    $('where').textContent = 'Open your Amex Offers page or Chase Offers page, then click this again.';
    ['add', 'stop', 'copy', 'diagnose'].forEach((id) => { $(id).disabled = true; });
    return;
  }
  $('where').textContent = issuer === 'amex'
    ? 'American Express page. Open the Offers page with "Available" offers showing.'
    : 'Chase page. Open the Chase Offers page (all offers) for one card.';
  if (progress) showProgress(progress);
  await inject(tab.id);
  const scans = await call(tab.id, 'scan', settings().extra);
  const found = scans.reduce((n, s) => n + s.offers.length, 0);
  if (!progress || !progress.running) status(found ? `${found} offers ready to add on this page.` : 'No "add" buttons found on this page. Scroll to load offers, or try Diagnose.');
}

function showProgress(p) {
  if (p.running) status(`Adding… ${p.added} added${p.failed ? `, ${p.failed} failed` : ''}${p.last ? `\nLast: ${p.last}` : ''}`);
  else status(`${p.stopped ? 'Stopped' : 'Done'}: ${p.added} offers added${p.failed ? `, ${p.failed} failed` : ''}.`);
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.progress) showProgress(changes.progress.newValue);
});

$('add').addEventListener('click', async () => {
  await saveSettings();
  const tab = await currentTab();
  await inject(tab.id);
  status('Starting…');
  // Not awaited: the page keeps going even if this popup closes.
  call(tab.id, 'addAll', { ...settings(), delayMin: 2000, delayMax: 4000 }).catch((e) => status(`Error: ${e.message}`));
});

$('stop').addEventListener('click', async () => {
  const tab = await currentTab();
  await call(tab.id, 'stop');
  status('Stopping after the current offer…');
});

$('copy').addEventListener('click', async () => {
  const tab = await currentTab();
  await inject(tab.id);
  const scans = await call(tab.id, 'scan', settings().extra);
  const issuer = issuerOf(tab.url);
  // Include offers already added in this session (they no longer show an "add" button).
  const { progress } = await chrome.storage.local.get('progress');
  const offers = scans.flatMap((s) => s.offers);
  if (progress && progress.issuer === issuer && progress.addedOffers) offers.push(...progress.addedOffers);
  const unique = [...new Map(offers.filter((o) => o.merchant).map((o) => [o.merchant.toLowerCase(), o])).values()];
  const payload = { source: 'card-rewards-offer-helper', version: 1, issuer, capturedAt: new Date().toISOString(), offers: unique };
  await navigator.clipboard.writeText(JSON.stringify(payload));
  status(`Copied ${unique.length} offers. In the Card Rewards app, open Benefits → Card offers → Paste offer list.`);
});

$('diagnose').addEventListener('click', async () => {
  await saveSettings();
  const tab = await currentTab();
  await inject(tab.id);
  const reports = await call(tab.id, 'diagnose', settings().extra);
  $('out').value = JSON.stringify(reports, null, 1);
  status('Diagnose report below. It lists button names only (no account details).');
});

init().catch((e) => status(`Error: ${e.message}`));
