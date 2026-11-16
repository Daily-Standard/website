// Saves everything in this browser only (localStorage). Nothing is sent anywhere.

const KEY = 'card-rewards-state-v1';

export function emptyState() {
  return { version: 1, wallet: [], customCards: [], valuations: {}, usage: {} };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    return normalize(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function normalize(data) {
  const base = emptyState();
  if (!data || typeof data !== 'object') return base;
  return {
    version: 1,
    wallet: Array.isArray(data.wallet) ? data.wallet.filter((w) => w && typeof w.cardId === 'string') : [],
    customCards: Array.isArray(data.customCards) ? data.customCards : [],
    valuations: data.valuations && typeof data.valuations === 'object' ? data.valuations : {},
    usage: data.usage && typeof data.usage === 'object' ? data.usage : {},
  };
}
