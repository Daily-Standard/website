// Pure logic: card ranking, benefit periods and usage summaries.
// No DOM access here so it can be unit-tested with `node --test`.

import { CARDS, CURRENCIES } from './data/cards.js';
import { MERCHANTS } from './data/merchants.js';

// Categories that also count as a broader category for earning purposes.
const CATEGORY_PARENTS = {
  amazon: ['online'],
};

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------- lookup helpers ----------

export function getCard(cardId, state) {
  return CARDS.find((c) => c.id === cardId)
    || (state.customCards || []).find((c) => c.id === cardId)
    || null;
}

export function getMerchant(merchantId) {
  return MERCHANTS.find((m) => m.id === merchantId) || null;
}

export function walletCardIds(state) {
  return (state.wallet || []).map((w) => w.cardId);
}

/** Value of one point in cents, honoring user overrides and wallet "boosts". */
export function pointValue(currency, state) {
  const override = state.valuations && state.valuations[currency];
  if (typeof override === 'number' && override > 0) return override;
  const cur = CURRENCIES[currency];
  if (!cur) return 1;
  if (cur.boostedBy && cur.boostedBy.some((id) => walletCardIds(state).includes(id))) {
    return cur.boostedCents;
  }
  return cur.defaultCents;
}

// ---------- dates & periods ----------

export function quarterKey(date) {
  return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * The benefit period containing `date`.
 * Returns { key, start, end } where `end` is exclusive. Keys start with the
 * period's start year so usage can be grouped by year.
 */
export function periodFor(cadence, date, anniversaryMonth) {
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-11
  switch (cadence) {
    case 'monthly':
      return { key: `${y}-${pad(m + 1)}`, start: new Date(y, m, 1), end: new Date(y, m + 1, 1) };
    case 'quarterly': {
      const q = Math.floor(m / 3);
      return { key: `${y}-Q${q + 1}`, start: new Date(y, q * 3, 1), end: new Date(y, q * 3 + 3, 1) };
    }
    case 'semiannual': {
      const h = m < 6 ? 0 : 1;
      return { key: `${y}-H${h + 1}`, start: new Date(y, h * 6, 1), end: new Date(y, h * 6 + 6, 1) };
    }
    case 'cardmember_year': {
      const am = (anniversaryMonth || 1) - 1;
      const startYear = m >= am ? y : y - 1;
      return {
        key: `${startYear}-CM${pad(am + 1)}`,
        start: new Date(startYear, am, 1),
        end: new Date(startYear + 1, am, 1),
      };
    }
    case 'annual':
    default:
      return { key: `${y}`, start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) };
  }
}

/** All periods that start within the next `months` months (including the current one). */
export function upcomingPeriods(cadence, from, months, anniversaryMonth) {
  const out = [];
  const limit = new Date(from.getFullYear(), from.getMonth() + months, 1);
  let p = periodFor(cadence, from, anniversaryMonth);
  while (p.start < limit) {
    out.push(p);
    p = periodFor(cadence, p.end, anniversaryMonth);
  }
  return out;
}

export function creditAmount(credit, period) {
  const month = period.start.getMonth() + 1;
  if (credit.monthOverrides && credit.monthOverrides[month] != null) {
    return credit.monthOverrides[month];
  }
  return credit.amount;
}

export function daysBetween(a, b) {
  return Math.ceil((b - a) / DAY_MS);
}

// ---------- earning ----------

function categoryMatches(ruleCategories, category) {
  if (!ruleCategories || !category) return false;
  const wanted = [category, ...(CATEGORY_PARENTS[category] || [])];
  return ruleCategories.some((c) => wanted.includes(c));
}

/**
 * Best earning rate for one card on one purchase.
 * Returns { rate, note, cap, conditional: [{rate, condition}], warnings: [] }.
 * `conditional` lists higher rates that need a specific booking channel or
 * activation; they are shown as tips but not used for ranking.
 */
export function earningFor(card, walletEntry, { category, merchantId }, date = new Date()) {
  const entry = walletEntry || {};
  const qk = quarterKey(date);
  let best = { rate: card.baseRate, note: 'base rate', cap: null };
  const conditional = [];
  const warnings = [];

  const consider = (rate, note, cap) => {
    if (rate > best.rate) best = { rate, note: note || null, cap: cap || null };
  };

  for (const rule of card.rules || []) {
    if (rule.merchants) {
      if (merchantId && rule.merchants.includes(merchantId)) consider(rule.rate, rule.note, rule.cap);
      continue;
    }
    if (rule.rotating) {
      const overrides = entry.rotatingOverride || {};
      const cats = overrides[qk] || (rule.quarters && rule.quarters[qk]) || [];
      if (categoryMatches(cats, category)) {
        const activated = entry.rotatingActivated && entry.rotatingActivated[qk];
        const qNote = (rule.quarterNotes && rule.quarterNotes[qk]) || 'this quarter\'s bonus category';
        if (activated) {
          consider(rule.rate, qNote, rule.cap);
        } else {
          conditional.push({ rate: rule.rate, condition: `if you activate this quarter's bonus (${qNote})` });
          warnings.push(`Activate the ${rule.rate}% quarterly bonus to earn it here.`);
        }
      }
      continue;
    }
    if (rule.choice) {
      const chosen = entry.choice || rule.defaultChoice;
      if (categoryMatches([chosen], category)) consider(rule.rate, 'your chosen category', rule.cap);
      continue;
    }
    if (rule.topCategory) {
      if (categoryMatches(rule.topCategory, category)) consider(rule.rate, rule.note, rule.cap);
      continue;
    }
    if (categoryMatches(rule.categories, category)) {
      if (rule.condition) {
        conditional.push({ rate: rule.rate, condition: rule.condition });
      } else {
        consider(rule.rate, rule.note, rule.cap);
      }
    }
  }

  // Only keep conditional tips that beat the unconditional rate.
  const tips = conditional.filter((c) => c.rate > best.rate);
  return { ...best, conditional: tips, warnings: tips.length ? warnings : [] };
}

/**
 * Rank every card in the wallet for a purchase.
 * Input: { category?, merchantId? }. If only merchantId is given, the
 * merchant's usual category is used.
 */
export function rankCards(state, query, date = new Date()) {
  const merchant = query.merchantId ? getMerchant(query.merchantId) : null;
  const category = query.category || (merchant ? merchant.category : 'other');

  const results = (state.wallet || [])
    .map((entry) => {
      const card = getCard(entry.cardId, state);
      if (!card) return null;
      const earning = earningFor(card, entry, { category, merchantId: merchant && merchant.id }, date);
      const cents = pointValue(card.currency, state);
      const accepted = !merchant || !merchant.networks || merchant.networks.includes(card.network);
      return {
        card,
        ...earning,
        cents,
        returnPct: round2(earning.rate * cents),
        accepted,
      };
    })
    .filter(Boolean);

  results.sort((a, b) => {
    if (a.accepted !== b.accepted) return a.accepted ? -1 : 1;
    if (b.returnPct !== a.returnPct) return b.returnPct - a.returnPct;
    return a.card.annualFee - b.card.annualFee;
  });

  return { category, merchant, results };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ---------- credits / benefits ----------

export function usageKey(cardId, creditId, periodKey) {
  return `${cardId}::${creditId}::${periodKey}`;
}

/** Credits for a wallet card: catalog credits minus hidden ones, plus custom ones. */
export function creditsFor(entry, state) {
  const card = getCard(entry.cardId, state);
  if (!card) return [];
  const hidden = entry.hiddenCredits || [];
  const base = (card.credits || []).filter((c) => !hidden.includes(c.id));
  return [...base, ...(entry.customCredits || [])];
}

/** Status of one credit in its current period. */
export function creditStatus(entry, credit, state, now = new Date()) {
  const period = periodFor(credit.cadence, now, entry.anniversaryMonth);
  const amount = creditAmount(credit, period);
  const used = Math.min(amount, (state.usage || {})[usageKey(entry.cardId, credit.id, period.key)] || 0);
  const remaining = round2(amount - used);
  const daysLeft = daysBetween(now, period.end);
  return { credit, period, amount, used, remaining, daysLeft };
}

/** Within this many days of a period ending, an unused credit counts as "expiring soon". */
export function expiringThreshold(cadence) {
  return cadence === 'monthly' ? 7 : 30;
}

/**
 * Per-card summary for the calendar year of `now`:
 *  fee, usedThisYear, availableNow (unused in current periods),
 *  leftThisYear (unused value in current + remaining periods that start this year).
 */
export function cardBenefitSummary(entry, state, now = new Date()) {
  const card = getCard(entry.cardId, state);
  const credits = creditsFor(entry, state);
  const usage = state.usage || {};
  const year = now.getFullYear();
  const prefix = `${entry.cardId}::`;

  let usedThisYear = 0;
  for (const [key, value] of Object.entries(usage)) {
    if (!key.startsWith(prefix)) continue;
    const periodKey = key.split('::')[2] || '';
    if (periodKey.startsWith(String(year))) usedThisYear += value;
  }

  let availableNow = 0;
  let leftThisYear = 0;
  const statuses = credits.map((credit) => creditStatus(entry, credit, state, now));
  for (const s of statuses) availableNow += s.remaining;

  for (const credit of credits) {
    const yearEnd = new Date(year + 1, 0, 1);
    let p = periodFor(credit.cadence, now, entry.anniversaryMonth);
    while (p.start < yearEnd) {
      const amount = creditAmount(credit, p);
      const used = usage[usageKey(entry.cardId, credit.id, p.key)] || 0;
      leftThisYear += Math.max(0, amount - used);
      p = periodFor(credit.cadence, p.end, entry.anniversaryMonth);
    }
  }

  return {
    card,
    fee: card ? card.annualFee : 0,
    usedThisYear: round2(usedThisYear),
    availableNow: round2(availableNow),
    leftThisYear: round2(leftThisYear),
    statuses,
  };
}

/** Unused credits whose current period ends soon, soonest first. */
export function expiringSoon(state, now = new Date()) {
  const out = [];
  for (const entry of state.wallet || []) {
    for (const credit of creditsFor(entry, state)) {
      const s = creditStatus(entry, credit, state, now);
      if (s.remaining > 0 && s.daysLeft <= expiringThreshold(credit.cadence)) {
        out.push({ entry, card: getCard(entry.cardId, state), ...s });
      }
    }
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft || b.remaining - a.remaining);
}

// ---------- calendar export ----------

function icsDate(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function icsEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * iCalendar file with an all-day reminder a few days before each credit
 * period ends, for the next 12 months.
 */
export function buildIcs(state, now = new Date(), daysBefore = 5) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Card Rewards//Benefit reminders//EN',
    'CALSCALE:GREGORIAN',
  ];
  const stamp = `${icsDate(now)}T000000Z`;
  for (const entry of state.wallet || []) {
    const card = getCard(entry.cardId, state);
    if (!card) continue;
    for (const credit of creditsFor(entry, state)) {
      for (const p of upcomingPeriods(credit.cadence, now, 12, entry.anniversaryMonth)) {
        const remind = new Date(p.end.getTime() - daysBefore * DAY_MS);
        if (remind < now) continue;
        const amount = creditAmount(credit, p);
        const next = new Date(remind.getTime() + DAY_MS);
        lines.push(
          'BEGIN:VEVENT',
          `UID:${card.id}-${credit.id}-${p.key}@card-rewards`,
          `DTSTAMP:${stamp}`,
          `DTSTART;VALUE=DATE:${icsDate(remind)}`,
          `DTEND;VALUE=DATE:${icsDate(next)}`,
          `SUMMARY:${icsEscape(`Use $${amount} ${credit.name} (${card.name})`)}`,
          `DESCRIPTION:${icsEscape(`Resets ${p.end.toDateString()}. ${credit.note || ''}`.trim())}`,
          'END:VEVENT',
        );
      }
    }
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
