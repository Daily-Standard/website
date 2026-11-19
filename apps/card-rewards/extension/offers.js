// Injected into the Chase or Amex offers page when you click the extension.
// It only acts on what's visible in your own logged-in tab: it never sees your
// password and sends nothing anywhere. Results are saved in chrome.storage
// (when running as an extension) so the popup can show progress.
//
// The bank pages couldn't be inspected when this was written, so offer buttons
// are found by their visible text / accessible name rather than page internals.
// If nothing is found, use "Diagnose this page" in the popup and adjust
// ADD_PATTERNS (or add your own pattern in the popup).

(() => {
  if (window.__cardOffers) return; // already injected in this frame

  const ADD_PATTERNS = [
    /^\+?\s*add to (my )?card$/i,
    /^\+?\s*add (this )?offer\b/i,
    /\badd\b.*\boffer\b/i,
    /\badd\b.*\bto (your |my )?card\b/i,
  ];
  const SKIP_PATTERNS = [/\badded\b/i, /\bremove\b/i, /\bdetails?\b/i, /\bview\b/i, /\bterms\b/i, /\bauthorized user\b/i];
  const NOT_MERCHANT = [/^\$|^\d|%/, /^(spend|earn|get|expires?|ends?|add|added|new|offer|limited|online|in-store)\b/i];

  let stopRequested = false;

  function issuerFor(host) {
    if (/americanexpress\.com$/i.test(host)) return 'amex';
    if (/chase\.com$/i.test(host)) return 'chase';
    return 'other';
  }

  function labelOf(el) {
    const aria = el.getAttribute('aria-label');
    const text = (aria || el.innerText || el.textContent || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 160);
  }

  function isVisible(el) {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const st = getComputedStyle(el);
    return st.visibility !== 'hidden' && st.display !== 'none' && !el.disabled && el.getAttribute('aria-disabled') !== 'true';
  }

  function isAddLabel(label, extra) {
    if (!label) return false;
    if (SKIP_PATTERNS.some((p) => p.test(label))) return false;
    if (extra && label.toLowerCase().includes(extra.toLowerCase())) return true;
    return ADD_PATTERNS.some((p) => p.test(label));
  }

  function clickables() {
    return [...document.querySelectorAll('button, [role="button"], a')];
  }

  function addButtons(extra) {
    return clickables().filter((el) => isVisible(el) && isAddLabel(labelOf(el), extra));
  }

  /** The offer tile around a button: nearest ancestor with a reasonable amount of text. */
  function tileFor(el) {
    let node = el.parentElement;
    for (let i = 0; node && i < 8; i++, node = node.parentElement) {
      const text = (node.innerText || '').trim();
      if (text.length >= 15 && text.length <= 600 && text.split('\n').length >= 2) return node;
    }
    return el.parentElement;
  }

  function guessMerchant(lines, buttonLabel) {
    // Accessible names like "Add Starbucks offer to card" often contain the merchant.
    const m = buttonLabel && buttonLabel.match(/add (?:the )?(.+?) offer/i);
    if (m && !/^(this|to)$/i.test(m[1])) return m[1].trim();
    const line = lines.find((l) => l.length >= 2 && l.length <= 60 && !NOT_MERCHANT.some((p) => p.test(l)));
    return line || lines[0] || '';
  }

  function offerFromButton(el) {
    const tile = tileFor(el);
    const lines = (tile && tile.innerText ? tile.innerText : '').split('\n').map((l) => l.trim()).filter(Boolean)
      .filter((l) => !isAddLabel(l));
    const label = labelOf(el);
    return { merchant: guessMerchant(lines, label), text: lines.join(' · ').slice(0, 300) };
  }

  function scan(extra) {
    const offers = addButtons(extra).map(offerFromButton);
    return { issuer: issuerFor(location.hostname), url: location.origin + location.pathname, offers };
  }

  function diagnose(extra) {
    const all = clickables().filter(isVisible).map(labelOf).filter(Boolean);
    const interesting = all.filter((l) => /add|offer|card/i.test(l));
    return {
      issuer: issuerFor(location.hostname),
      page: location.hostname + location.pathname + location.hash.split('?')[0],
      frame: window === window.top ? 'top' : 'iframe',
      visibleClickables: all.length,
      matchedAddButtons: addButtons(extra).length,
      labelsMentioningAddOfferCard: [...new Set(interesting)].slice(0, 40),
    };
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function save(progress) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ progress });
      }
    } catch { /* not running as an extension (tests) */ }
  }

  /** Click every "add" button one at a time, at a human pace. */
  async function addAll({ delayMin = 2000, delayMax = 4000, max = 150, extra = '' } = {}) {
    stopRequested = false;
    const issuer = issuerFor(location.hostname);
    const added = [];
    const failed = [];
    const seen = new Set();
    let rounds = 0;
    await save({ issuer, running: true, added: 0, failed: 0, at: Date.now() });

    while (!stopRequested && added.length < max && rounds < max * 2) {
      rounds++;
      const next = addButtons(extra).find((el) => !seen.has(el));
      if (!next) break;
      seen.add(next);
      const offer = offerFromButton(next);
      next.scrollIntoView({ block: 'center', behavior: 'smooth' });
      await sleep(400);
      try {
        next.click();
        added.push(offer);
      } catch (e) {
        failed.push({ ...offer, error: String(e) });
      }
      await save({ issuer, running: true, added: added.length, failed: failed.length, last: offer.merchant, at: Date.now() });
      await sleep(delayMin + Math.random() * (delayMax - delayMin));
    }

    const result = { issuer, running: false, stopped: stopRequested, added: added.length, failed: failed.length, addedOffers: added, at: Date.now() };
    await save(result);
    return result;
  }

  window.__cardOffers = {
    scan,
    diagnose,
    addAll,
    stop: () => { stopRequested = true; return true; },
    // exposed for tests
    _isAddLabel: isAddLabel,
    _guessMerchant: guessMerchant,
  };
})();
