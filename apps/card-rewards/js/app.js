import { CARDS, CATEGORIES, CURRENCIES, NETWORK_NAMES, DATA_AS_OF } from './data/cards.js';
import { MERCHANTS } from './data/merchants.js';
import {
  rankCards, getCard, pointValue, creditsFor, creditStatus, cardBenefitSummary,
  expiringSoon, usageKey, quarterKey, buildIcs, isPerk, annualFeeFor, setupChecklist,
} from './engine.js';
import { readStatement, suggestCredit, applyMatches, merchantsFromStatement, mergeMerchants, parseOfferList, matchOffers } from './importer.js';
import { loadState, saveState, normalize, emptyState } from './store.js';

// ---------- state ----------

let state = loadState();
const ui = {
  tab: readPref('tab', 'pay'),
  query: '',
  selection: null,          // { type: 'merchant'|'category', id }
  openCard: null,           // wallet card id expanded in Wallet tab
  showAddCustom: false,
  importReview: null,       // { cardId, format, lines: [{ id, date, description, amount, creditId, already }] }
  toast: '',
};

function readPref(k, fallback) {
  try { return localStorage.getItem(`card-rewards-${k}`) || fallback; } catch { return fallback; }
}
function writePref(k, v) {
  try { localStorage.setItem(`card-rewards-${k}`, v); } catch { /* ignore */ }
}

function commit(mutator) {
  mutator(state);
  if (!saveState(state)) toast('Could not save in this browser (private mode?). Changes will be lost on reload.');
  render();
}

function entryFor(cardId) {
  return state.wallet.find((w) => w.cardId === cardId);
}

// ---------- formatting ----------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const pct = (n) => `${Number(n).toFixed(n % 1 ? (Math.round(n * 10) === n * 10 ? 1 : 2) : 0)}%`;
const CADENCE = { monthly: 'per month', quarterly: 'per quarter', semiannual: 'per half-year', annual: 'per calendar year', cardmember_year: 'per card year' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function rateLabel(card, rate) {
  return card.currency === 'cash' ? `${pct(rate)} cash back` : `${rate}x points`;
}
function daysLabel(d) {
  if (d <= 0) return 'resets today';
  if (d === 1) return '1 day left';
  return `${d} days left`;
}

// ---------- rendering ----------

const app = document.getElementById('app');

function render() {
  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.tab === ui.tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-current', on ? 'page' : 'false');
  });
  const view = ui.tab === 'benefits' ? renderBenefits() : ui.tab === 'wallet' ? renderWallet() : renderPay();
  app.innerHTML = view + (ui.toast ? `<div class="toast" role="status">${esc(ui.toast)}</div>` : '');
}

function emptyWallet(message) {
  return `
    <section class="empty">
      <p>${esc(message)}</p>
      <button class="btn primary" data-action="goto" data-tab="wallet">Add your cards</button>
    </section>`;
}

// ----- Pay tab -----

function searchMatches(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const merchants = MERCHANTS.filter((m) => m.name.toLowerCase().includes(s))
    .map((m) => ({ type: 'merchant', id: m.id, label: m.name, sub: CATEGORIES[m.category] }));
  const cats = Object.entries(CATEGORIES).filter(([, label]) => label.toLowerCase().includes(s))
    .map(([id, label]) => ({ type: 'category', id, label, sub: 'Category' }));
  return [...merchants, ...cats].slice(0, 8);
}

function renderPay() {
  if (!state.wallet.length) return emptyWallet('Add the cards you carry, then search a store or category to see which one earns the most.');

  const quick = ['dining', 'groceries', 'gas', 'flights', 'hotels', 'transit', 'streaming', 'online', 'drugstores', 'other'];
  const matches = ui.selection ? [] : searchMatches(ui.query);

  let resultHtml = '';
  if (ui.selection) {
    const q = ui.selection.type === 'merchant' ? { merchantId: ui.selection.id } : { category: ui.selection.id };
    const { category, merchant, results } = rankCards(state, q);
    const [best, ...rest] = results;
    const title = merchant ? merchant.name : CATEGORIES[category];
    resultHtml = `
      <section class="result">
        <div class="result-head">
          <div>
            <p class="eyebrow">Best card for</p>
            <h2>${esc(title)}</h2>
            ${merchant ? `<p class="muted">Usually codes as: ${esc(CATEGORIES[category])}</p>` : ''}
          </div>
          <button class="btn ghost" data-action="clear-search">New search</button>
        </div>
        ${merchant && merchant.note ? `<p class="note">${esc(merchant.note)}</p>` : ''}
        ${merchant ? matchOffers(state.offers, { [merchant.name.toUpperCase()]: { count: 1 } }).map((m) => `<p class="tip"><strong>${m.issuer === 'amex' ? 'Amex' : 'Chase'} offer:</strong> ${esc(m.offer.merchant)}${m.offer.text ? ` · ${esc(m.offer.text)}` : ''}. Use the card it was added to.</p>`).join('') : ''}
        ${best ? bestCardHtml(best) : ''}
        ${rest.length ? `
          <h3 class="section-label">Your other cards</h3>
          <ol class="rank-list">
            ${rest.map((r) => `
              <li class="${r.accepted ? '' : 'declined'}">
                <span class="rank-name">${esc(r.card.name)}</span>
                <span class="rank-val">${r.accepted ? `${pct(r.returnPct)}` : 'Not accepted'}</span>
                <span class="rank-sub">${esc(rateLabel(r.card, r.rate))}${r.warnings.length ? ' · <strong>activation needed for more</strong>' : ''}</span>
              </li>`).join('')}
          </ol>` : ''}
      </section>`;
  }

  return `
    <section class="search">
      <label for="q" class="eyebrow">Where are you paying?</label>
      <div class="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="q" type="search" autocomplete="off" placeholder="Store or category, e.g. Costco, dining" value="${esc(ui.selection ? '' : ui.query)}">
      </div>
      ${matches.length ? `
        <ul class="suggestions" role="listbox">
          ${matches.map((m) => `
            <li><button data-action="select" data-type="${m.type}" data-id="${m.id}">
              <span>${esc(m.label)}</span><span class="muted">${esc(m.sub)}</span>
            </button></li>`).join('')}
        </ul>` : ''}
      ${!ui.selection && ui.query && !matches.length ? '<p class="muted">No match. Try a category instead.</p>' : ''}
      ${!ui.selection ? `
        <div class="chips">
          ${quick.map((c) => `<button class="chip" data-action="select" data-type="category" data-id="${c}">${esc(CATEGORIES[c].split(' (')[0].split(' &')[0].split(' /')[0])}</button>`).join('')}
        </div>` : ''}
    </section>
    ${resultHtml}
    ${!ui.selection ? usableNowHtml() : ''}`;
}

function bestCardHtml(r) {
  const valueLine = r.card.currency === 'cash'
    ? `${pct(r.rate)} cash back`
    : `${r.rate}x points × ${r.cents}¢ ≈ ${pct(r.returnPct)} back`;
  return `
    <article class="best ${r.accepted ? '' : 'declined'}">
      <p class="eyebrow">Use</p>
      <h3>${esc(r.card.name)}</h3>
      <p class="big">${r.accepted ? pct(r.returnPct) : 'Not accepted here'}</p>
      <p>${esc(valueLine)}${r.note && r.note !== 'base rate' ? ` · ${esc(r.note)}` : ''}</p>
      ${r.cap ? `<p class="muted small">Limit: ${esc(r.cap)}</p>` : ''}
      ${r.warnings.map((w) => `<p class="warn">${esc(w)}</p>`).join('')}
      ${r.conditional.map((c) => `<p class="tip">Earns ${esc(rateLabel(r.card, c.rate))} ${esc(c.condition)}.</p>`).join('')}
    </article>`;
}

/** Small reminder on the Pay tab: unused credits that are about to reset. */
function usableNowHtml() {
  const soon = expiringSoon(state).slice(0, 3);
  if (!soon.length) return '';
  return `
    <section class="panel">
      <h3 class="section-label">Use before they reset</h3>
      <ul class="mini-list">
        ${soon.map((s) => `<li><span>${esc(money(s.remaining))} ${esc(s.credit.name)}</span><span class="muted">${esc(s.card.name)} · ${daysLabel(s.daysLeft)}</span></li>`).join('')}
      </ul>
      <button class="btn ghost" data-action="goto" data-tab="benefits">See all benefits</button>
    </section>`;
}

// ----- Benefits tab -----

function renderBenefits() {
  if (!state.wallet.length) return emptyWallet('Add your cards to track their credits and see how much of each annual fee you\'ve earned back.');

  const summaries = state.wallet.map((e) => ({ entry: e, ...cardBenefitSummary(e, state) })).filter((s) => s.card);
  const withCredits = summaries.filter((s) => s.statuses.length);
  const totalFee = summaries.reduce((a, s) => a + s.fee, 0);
  const totalUsed = summaries.reduce((a, s) => a + s.usedThisYear, 0);
  const totalLeft = summaries.reduce((a, s) => a + s.leftThisYear, 0);
  const soon = expiringSoon(state);
  const year = new Date().getFullYear();

  return `
    <section class="stats">
      <div><p class="eyebrow">Annual fees</p><p class="stat">${money(totalFee)}</p></div>
      <div><p class="eyebrow">Credits used in ${year}</p><p class="stat good">${money(totalUsed)}</p></div>
      <div><p class="eyebrow">Still available in ${year}</p><p class="stat accent">${money(totalLeft)}</p></div>
    </section>

    ${setupHtml()}

    ${soon.length ? `
      <section class="panel urgent">
        <h3 class="section-label">Use soon or lose it</h3>
        ${soon.map((s) => creditRowHtml(s.entry, s, true)).join('')}
      </section>` : ''}

    ${withCredits.length ? withCredits.map((s) => `
      <section class="panel">
        <div class="card-head">
          <h3>${esc(s.card.name)}</h3>
          <p class="muted small">Fee ${money(s.fee)} · used ${money(s.usedThisYear)} in ${year}</p>
        </div>
        ${!s.entry.anniversaryMonth && s.statuses.some((st) => st.credit.cadence === 'cardmember_year')
          ? `<p class="warn">Set this card's anniversary month in Wallet so card-year benefits reset on the right date. <button class="btn small ghost" data-action="open-card" data-id="${s.card.id}">Set it</button></p>` : ''}
        ${feeBarHtml(s.fee, s.usedThisYear)}
        ${s.statuses.map((st) => creditRowHtml(s.entry, st, false)).join('')}
      </section>`).join('') : '<section class="panel"><p class="muted">None of your cards have credits in our list. You can add your own credits from the Wallet tab.</p></section>'}

    ${offersHtml()}

    ${importHtml()}

    ${withCredits.length ? `
      <section class="panel">
        <h3 class="section-label">Reminders</h3>
        <p class="muted small">Download a calendar file with a reminder 5 days before each credit resets over the next 12 months. Open it to add the reminders to your phone's calendar.</p>
        <button class="btn" data-action="export-ics">Add reminders to my calendar</button>
      </section>` : ''}
    <p class="fine">Mark a credit as used when it posts to your statement. Credit amounts change; confirm with your card issuer.</p>`;
}

function feeBarHtml(fee, used) {
  if (!fee) return '';
  const ratio = Math.min(1, used / fee);
  const label = used >= fee ? `Fee earned back (${money(used - fee)} ahead)` : `${money(fee - used)} to break even on the fee`;
  return `
    <div class="bar" role="img" aria-label="${esc(label)}"><span style="width:${(ratio * 100).toFixed(1)}%"></span></div>
    <p class="small ${used >= fee ? 'good' : 'muted'}">${esc(label)}</p>`;
}

function creditRowHtml(entry, s, showCard) {
  const card = getCard(entry.cardId, state);
  const done = s.remaining <= 0;
  const key = usageKey(entry.cardId, s.credit.id, s.period.key);
  const perk = isPerk(s.credit);
  const amountText = perk ? `1 ${s.credit.unit || 'perk'}` : money(s.amount);
  const statusText = done ? 'used' : perk ? daysLabel(s.daysLeft) : `${money(s.remaining)} left · ${daysLabel(s.daysLeft)}`;
  return `
    <div class="credit ${done ? 'done' : ''}">
      <div class="credit-main">
        <p class="credit-name">${esc(s.credit.name)}</p>
        <p class="muted small">${showCard ? `${esc(card.name)} · ` : ''}${amountText} ${CADENCE[s.credit.cadence]} · ${statusText}</p>
        ${s.credit.note ? `<p class="muted small">${esc(s.credit.note)}</p>` : ''}
      </div>
      <div class="credit-actions">
        ${done
          ? `<button class="btn small ghost" data-action="set-used" data-key="${esc(key)}" data-value="0">Undo</button>`
          : `<button class="btn small primary" data-action="set-used" data-key="${esc(key)}" data-value="${s.amount}">Used</button>
             ${perk ? '' : `<button class="btn small ghost" data-action="partial" data-key="${esc(key)}" data-max="${s.amount}" data-used="${s.used}">Part</button>`}`}
      </div>
    </div>`;
}

function setupHtml() {
  const list = setupChecklist(state);
  const todo = list.filter((x) => !x.done);
  if (!list.length) return '';
  if (!todo.length) return `<p class="fine">All ${list.length} benefit activations done.</p>`;
  return `
    <section class="panel">
      <h3 class="section-label">Activate these once (${todo.length} left)</h3>
      <p class="muted small">These benefits only pay out after a one-time setup.</p>
      ${todo.map((x) => `
        <div class="credit">
          <div class="credit-main">
            <p class="credit-name">${esc(x.credit.name)}</p>
            <p class="muted small">${esc(x.card.name)} · ${esc(x.credit.setup)}</p>
          </div>
          <div class="credit-actions">
            <button class="btn small primary" data-action="setup-done" data-card="${x.card.id}" data-id="${x.credit.id}">Done</button>
          </div>
        </div>`).join('')}
    </section>`;
}

function offersHtml() {
  const issuers = Object.entries(state.offers || {});
  const matches = matchOffers(state.offers, state.merchants);
  const haveMerchants = Object.keys(state.merchants || {}).length > 0;
  const ISSUER = { amex: 'Amex', chase: 'Chase', other: 'Other' };
  return `
    <section class="panel">
      <h3 class="section-label">Card offers</h3>
      ${issuers.length ? `<p class="muted small">${issuers.map(([k, v]) => `${ISSUER[k] || k}: ${v.offers.length} offers (updated ${esc(new Date(v.capturedAt || Date.now()).toLocaleDateString())})`).join(' · ')}</p>` : '<p class="muted small">Use the Offer Helper browser extension on your computer to add all Amex and Chase offers, then copy the offer list and paste it here.</p>'}
      ${matches.length ? `
        <p class="sub-title">Offers at brands you've bought from (${matches.length})</p>
        <ul class="mini-list">
          ${matches.map((m) => `<li><span><strong>${esc(m.offer.merchant)}</strong> · ${esc(ISSUER[m.issuer] || m.issuer)}</span><span class="muted">${esc(m.offer.text || '')}</span><span class="muted">On your statements as ${esc(m.merchant)} (${m.count}×)</span></li>`).join('')}
        </ul>`
        : issuers.length ? `<p class="muted small">${haveMerchants ? 'None of your offers match brands on your imported statements.' : 'Import a statement below so the app can spot offers at brands you buy from.'}</p>` : ''}
      <details>
        <summary class="small">Paste offer list</summary>
        <textarea id="offer-paste" rows="3" placeholder="Paste here after “Copy offer list for the app”" aria-label="Offer list"></textarea>
        <button class="btn" data-action="offers-save">Save offers</button>
      </details>
    </section>`;
}

function importHtml() {
  const cardsWithCredits = state.wallet;
  if (!cardsWithCredits.length) return '';
  const r = ui.importReview;
  if (r) {
    const entry = entryFor(r.cardId);
    const credits = creditsFor(entry, state).filter((c) => !isPerk(c));
    const fresh = r.lines.filter((l) => !l.already);
    return `
      <section class="panel">
        <h3 class="section-label">Statement credits found</h3>
        <p class="muted small">${esc(getCard(r.cardId, state).name)}: ${fresh.length} new credit${fresh.length === 1 ? '' : 's'}${r.lines.length - fresh.length ? `, ${r.lines.length - fresh.length} already imported` : ''}.${fresh.length ? ' Check where each one belongs; the app remembers your choices for next time.' : ''}</p>
        ${fresh.map((l) => `
          <div class="import-line">
            <div>
              <p class="credit-name">${esc(money(l.amount))} · ${esc(l.description)}</p>
              <p class="muted small">${esc(l.date.toLocaleDateString())}</p>
            </div>
            <select data-action="import-assign" data-id="${esc(l.id)}" aria-label="Which benefit is this?">
              <option value="">Not a tracked benefit</option>
              ${credits.map((c) => `<option value="${c.id}" ${l.creditId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
            </select>
          </div>`).join('') || '<p class="muted">Nothing new in this file.</p>'}
        <div class="row wrap">
          ${fresh.length || r.merchants.length ? '<button class="btn primary" data-action="import-apply">Save</button>' : ''}
          <button class="btn ghost" data-action="import-cancel">Cancel</button>
        </div>
      </section>`;
  }
  return `
    <section class="panel">
      <h3 class="section-label">Import a statement</h3>
      <p class="muted small">On chase.com or americanexpress.com, download your recent card activity as a CSV file, then pick it here. The app finds statement credits and ticks off the benefits they count toward, and remembers which brands you buy from so it can spot card offers for them. The file is read on this device only.</p>
      <div class="row wrap">
        <select id="import-card" aria-label="Which card is this statement for?">
          ${cardsWithCredits.map((e) => `<option value="${e.cardId}">${esc(getCard(e.cardId, state).name)}</option>`).join('')}
        </select>
        <label class="btn">Choose CSV file<input type="file" accept=".csv,text/csv" data-action="import-file" hidden></label>
      </div>
    </section>`;
}

// ----- Wallet tab -----

function renderWallet() {
  const owned = new Set(state.wallet.map((w) => w.cardId));
  const available = CARDS.filter((c) => !owned.has(c.id));
  const currencies = [...new Set(state.wallet.map((w) => getCard(w.cardId, state)).filter(Boolean).map((c) => c.currency))]
    .filter((c) => c !== 'cash');

  return `
    <section class="panel">
      <h3 class="section-label">My cards (${state.wallet.length})</h3>
      ${state.wallet.length ? `<ul class="wallet-list">${state.wallet.map(walletCardHtml).join('')}</ul>` : '<p class="muted">No cards yet. Add the ones you carry below.</p>'}
    </section>

    <section class="panel">
      <h3 class="section-label">Add a card</h3>
      <div class="row">
        <select id="add-card" aria-label="Choose a card to add">
          <option value="">Choose a card…</option>
          ${groupByIssuer(available).map(([issuer, cards]) => `
            <optgroup label="${esc(issuer)}">${cards.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</optgroup>`).join('')}
        </select>
        <button class="btn primary" data-action="add-card">Add</button>
      </div>
      <button class="btn ghost" data-action="toggle-custom">${ui.showAddCustom ? 'Cancel custom card' : 'My card isn\'t listed'}</button>
      ${ui.showAddCustom ? customCardFormHtml() : ''}
    </section>

    ${currencies.length ? `
      <section class="panel">
        <h3 class="section-label">What your points are worth</h3>
        <p class="muted small">Used to compare points with cash back. These are estimates; set your own based on how you redeem.</p>
        ${currencies.map((c) => `
          <label class="field inline">
            <span>${esc(currencyName(c))}</span>
            <span class="with-unit"><input type="number" inputmode="decimal" step="0.05" min="0.1" max="5" data-action="valuation" data-currency="${c}" value="${pointValue(c, state)}"><span>¢ / point</span></span>
          </label>`).join('')}
      </section>` : ''}

    <section class="panel">
      <h3 class="section-label">Backup</h3>
      <p class="muted small">Your data stays in this browser only. Export a backup to move it to another device.</p>
      <div class="row wrap">
        <button class="btn" data-action="export-json">Export backup</button>
        <label class="btn">Import backup<input type="file" accept="application/json" data-action="import-json" hidden></label>
        <button class="btn danger" data-action="reset">Erase everything</button>
      </div>
    </section>

    <p class="fine">Card data last updated ${esc(DATA_AS_OF)}. Rates, fees and credits change often and this list hasn't been checked against every issuer page, so confirm on the issuer's site (linked on each card). Merchant categories are typical, not guaranteed: the same store can code differently by location. This app is not affiliated with any card issuer and earns nothing from your choices.</p>`;
}

function currencyName(currency) {
  if (CURRENCIES[currency]) return CURRENCIES[currency].name;
  const custom = state.customCards.find((c) => c.currency === currency);
  return custom ? `${custom.name} points` : 'Points';
}

function groupByIssuer(cards) {
  const map = new Map();
  for (const c of cards) {
    if (!map.has(c.issuer)) map.set(c.issuer, []);
    map.get(c.issuer).push(c);
  }
  return [...map.entries()];
}

function walletCardHtml(entry) {
  const card = getCard(entry.cardId, state);
  if (!card) return '';
  const open = ui.openCard === entry.cardId;
  return `
    <li class="wallet-card ${open ? 'open' : ''}">
      <button class="wallet-toggle" data-action="toggle-card" data-id="${card.id}" aria-expanded="${open}">
        <span>${esc(card.name)}</span>
        <span class="muted small">${NETWORK_NAMES[card.network] || ''} · ${annualFeeFor(entry, card) ? `${money(annualFeeFor(entry, card))}/yr` : 'No annual fee'}</span>
      </button>
      ${open ? walletCardDetailHtml(entry, card) : ''}
    </li>`;
}

function walletCardDetailHtml(entry, card) {
  const qk = quarterKey(new Date());
  const rotating = (card.rules || []).find((r) => r.rotating);
  const choice = (card.rules || []).find((r) => r.choice);
  const hasCardYear = creditsFor({ ...entry, hiddenCredits: [] }, state).some((c) => c.cadence === 'cardmember_year');
  const catalogCredits = card.credits || [];
  const hidden = entry.hiddenCredits || [];

  let rotatingHtml = '';
  if (rotating) {
    const cats = (entry.rotatingOverride || {})[qk] || (rotating.quarters || {})[qk] || [];
    const activated = !!(entry.rotatingActivated || {})[qk];
    rotatingHtml = `
      <div class="sub">
        <p class="sub-title">${rotating.rate}% categories for ${qk.replace('-', ' ')}</p>
        ${(rotating.quarterNotes || {})[qk] ? `<p class="muted small">${esc(rotating.quarterNotes[qk])}</p>` : ''}
        ${!cats.length ? '<p class="warn">Not set for this quarter. Pick this quarter\'s categories from the issuer\'s calendar:</p>' : ''}
        <div class="checks">
          ${Object.entries(CATEGORIES).filter(([id]) => id !== 'other').map(([id, label]) => `
            <label><input type="checkbox" data-action="rotating-cat" data-card="${card.id}" value="${id}" ${cats.includes(id) ? 'checked' : ''}> ${esc(label)}</label>`).join('')}
        </div>
        <label class="switch"><input type="checkbox" data-action="rotating-activated" data-card="${card.id}" ${activated ? 'checked' : ''}> I've activated this quarter's bonus</label>
      </div>`;
  }

  return `
    <div class="wallet-detail">
      <p class="small"><a href="${esc(card.url || '#')}" target="_blank" rel="noopener">Check current terms on the issuer's site ↗</a></p>
      <p class="small muted">Earns: ${esc(earnSummary(card))}</p>
      <label class="field inline">
        <span>Annual fee you pay</span>
        <span class="with-unit"><span>$</span><input type="number" inputmode="decimal" min="0" step="1" data-action="fee" data-card="${card.id}" value="${annualFeeFor(entry, card)}"></span>
      </label>
      ${choice ? `
        <label class="field">
          <span>Your ${choice.rate}% category</span>
          <select data-action="choice" data-card="${card.id}">
            ${choice.choice.map((c) => `<option value="${c}" ${(entry.choice || choice.defaultChoice) === c ? 'selected' : ''}>${esc(CATEGORIES[c])}</option>`).join('')}
          </select>
        </label>` : ''}
      ${rotatingHtml}
      ${hasCardYear ? `
        <label class="field">
          <span>Card anniversary month (for card-year credits)</span>
          <select data-action="anniversary" data-card="${card.id}">
            ${MONTHS.map((m, i) => `<option value="${i + 1}" ${(entry.anniversaryMonth || 1) === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </label>` : ''}
      ${catalogCredits.length ? `
        <div class="sub">
          <p class="sub-title">Credits to track</p>
          <p class="muted small">Untick credits you don't care about.</p>
          <div class="checks">
            ${catalogCredits.map((c) => `
              <label><input type="checkbox" data-action="credit-visible" data-card="${card.id}" value="${c.id}" ${hidden.includes(c.id) ? '' : 'checked'}> ${esc(c.name)} (${money(c.amount)} ${CADENCE[c.cadence]})</label>`).join('')}
          </div>
        </div>` : ''}
      ${(entry.customCredits || []).length ? `
        <div class="sub">
          <p class="sub-title">Your added credits</p>
          ${entry.customCredits.map((c) => `
            <div class="row between"><span class="small">${esc(c.name)} · ${money(c.amount)} ${CADENCE[c.cadence]}</span>
            <button class="btn small ghost" data-action="remove-credit" data-card="${card.id}" data-id="${c.id}">Remove</button></div>`).join('')}
        </div>` : ''}
      <form class="sub" data-form="add-credit" data-card="${card.id}">
        <p class="sub-title">Add a credit or benefit</p>
        <div class="grid3">
          <input name="name" required placeholder="Name, e.g. Saks credit" aria-label="Credit name">
          <input name="amount" required type="number" inputmode="decimal" min="0.01" step="0.01" placeholder="Amount $" aria-label="Amount in dollars">
          <select name="cadence" aria-label="How often it resets">
            ${Object.entries(CADENCE).map(([k, v]) => `<option value="${k}">${v.replace('per ', 'Every ')}</option>`).join('')}
          </select>
        </div>
        <button class="btn" type="submit">Add credit</button>
      </form>
      <button class="btn danger small" data-action="remove-card" data-id="${card.id}">Remove card from wallet</button>
    </div>`;
}

function earnSummary(card) {
  const unit = card.currency === 'cash' ? '%' : 'x';
  const parts = [];
  for (const r of card.rules || []) {
    if (r.condition) continue;
    if (r.rotating) parts.push(`${r.rate}${unit} rotating quarterly categories`);
    else if (r.choice) parts.push(`${r.rate}${unit} on a category you choose`);
    else if (r.topCategory) parts.push(`${r.rate}${unit} on your top category each cycle`);
    else if (r.merchants) parts.push(`${r.rate}${unit} at ${r.merchants.map((m) => MERCHANTS.find((x) => x.id === m)?.name || m).join(', ')}`);
    else parts.push(`${r.rate}${unit} ${r.categories.map((c) => CATEGORIES[c].toLowerCase()).join(', ')}`);
  }
  parts.push(`${card.baseRate}${unit} everything else`);
  return parts.join('; ');
}

function customCardFormHtml() {
  const cats = Object.entries(CATEGORIES).filter(([id]) => id !== 'other');
  return `
    <form class="sub" data-form="custom-card">
      <label class="field"><span>Card name</span><input name="name" required maxlength="60"></label>
      <div class="grid3">
        <label class="field"><span>Network</span>
          <select name="network">${Object.entries(NETWORK_NAMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
        <label class="field"><span>Annual fee $</span><input name="fee" type="number" min="0" step="1" value="0"></label>
        <label class="field"><span>Base rate (% or x)</span><input name="base" type="number" min="0" step="0.25" value="1"></label>
      </div>
      <label class="field"><span>Rewards type</span>
        <select name="currency"><option value="cash">Cash back</option><option value="custom_points">Points (value set below)</option></select></label>
      <label class="field"><span>If points: worth this many cents each</span><input name="cents" type="number" min="0.1" step="0.05" value="1"></label>
      <p class="sub-title">Bonus categories (leave blank if none)</p>
      <div class="cat-rates">
        ${cats.map(([id, label]) => `
          <label><span>${esc(label)}</span><input name="rate_${id}" type="number" min="0" step="0.25" inputmode="decimal" placeholder="-"></label>`).join('')}
      </div>
      <button class="btn primary" type="submit">Save card</button>
    </form>`;
}

// ---------- actions ----------

function toast(msg) {
  ui.toast = msg;
  render();
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { ui.toast = ''; render(); }, 2600);
}

function setTab(tab) {
  ui.tab = tab;
  writePref('tab', tab);
  render();
  window.scrollTo(0, 0);
}

function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelector('.tabs').addEventListener('click', (e) => {
  const t = e.target.closest('.tab');
  if (t) setTab(t.dataset.tab);
});

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
  const a = el.dataset.action;

  if (a === 'goto') setTab(el.dataset.tab);
  else if (a === 'select') { ui.selection = { type: el.dataset.type, id: el.dataset.id }; ui.query = ''; render(); window.scrollTo(0, 0); }
  else if (a === 'clear-search') { ui.selection = null; ui.query = ''; render(); document.getElementById('q')?.focus(); }
  else if (a === 'set-used') {
    const value = Number(el.dataset.value);
    commit((s) => { if (value > 0) s.usage[el.dataset.key] = value; else delete s.usage[el.dataset.key]; });
  } else if (a === 'partial') {
    const max = Number(el.dataset.max);
    const input = window.prompt(`How much of the ${money(max)} have you used?`, el.dataset.used || '');
    if (input == null) return;
    const v = Number(String(input).replace(/[$,\s]/g, ''));
    if (!Number.isFinite(v) || v < 0) { toast('Enter a dollar amount.'); return; }
    commit((s) => { if (v > 0) s.usage[el.dataset.key] = Math.min(v, max); else delete s.usage[el.dataset.key]; });
  } else if (a === 'offers-save') {
    try {
      const list = parseOfferList(document.getElementById('offer-paste').value);
      commit((s) => { s.offers = { ...(s.offers || {}), [list.issuer]: { capturedAt: list.capturedAt, offers: list.offers } }; });
      toast(`Saved ${list.offers.length} ${list.issuer === 'amex' ? 'Amex' : list.issuer === 'chase' ? 'Chase' : ''} offers.`);
    } catch (e) {
      toast(e.message);
    }
  } else if (a === 'open-card') {
    ui.openCard = el.dataset.id;
    setTab('wallet');
  } else if (a === 'setup-done') {
    commit(() => {
      const entry = entryFor(el.dataset.card);
      entry.setupDone = { ...(entry.setupDone || {}), [el.dataset.id]: true };
    });
  } else if (a === 'import-cancel') {
    ui.importReview = null;
    render();
  } else if (a === 'import-apply') {
    const r = ui.importReview;
    const entry = entryFor(r.cardId);
    const credits = creditsFor(entry, state);
    const fresh = r.lines.filter((l) => !l.already);
    const matched = fresh.filter((l) => l.creditId).length;
    commit((s) => {
      Object.assign(s, applyMatches(s, entry, credits, fresh));
      s.merchants = mergeMerchants(s.merchants, r.merchants);
      s.imported[r.fileKey] = true;
    });
    ui.importReview = null;
    toast(`Saved. ${matched} credit${matched === 1 ? '' : 's'} ticked off, ${r.merchants.length} brands noted.`);
  } else if (a === 'export-ics') {
    download('card-credit-reminders.ics', buildIcs(state), 'text/calendar');
  } else if (a === 'add-card') {
    const id = document.getElementById('add-card').value;
    if (!id) { toast('Choose a card first.'); return; }
    commit((s) => s.wallet.push({ cardId: id }));
    ui.openCard = id;
    toast(`Added ${getCard(id, state).name}`);
  } else if (a === 'toggle-card') {
    ui.openCard = ui.openCard === el.dataset.id ? null : el.dataset.id;
    render();
  } else if (a === 'remove-card') {
    const card = getCard(el.dataset.id, state);
    if (!window.confirm(`Remove ${card.name} from your wallet? Its credit history is kept if you add it back.`)) return;
    commit((s) => {
      s.wallet = s.wallet.filter((w) => w.cardId !== el.dataset.id);
      if (card.custom) s.customCards = s.customCards.filter((c) => c.id !== card.id);
    });
  } else if (a === 'remove-credit') {
    commit(() => {
      const entry = entryFor(el.dataset.card);
      entry.customCredits = (entry.customCredits || []).filter((c) => c.id !== el.dataset.id);
    });
  } else if (a === 'toggle-custom') {
    ui.showAddCustom = !ui.showAddCustom;
    render();
  } else if (a === 'export-json') {
    download(`card-rewards-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), 'application/json');
  } else if (a === 'reset') {
    if (!window.confirm('Erase all cards, credits and settings from this browser? This cannot be undone.')) return;
    commit((s) => Object.assign(s, emptyState()));
    toast('Everything erased.');
  }
});

app.addEventListener('input', (e) => {
  if (e.target.id === 'q') {
    ui.query = e.target.value;
    ui.selection = null;
    const pos = e.target.selectionStart;
    render();
    const q = document.getElementById('q');
    q.focus();
    q.setSelectionRange(pos, pos);
  }
});

app.addEventListener('keydown', (e) => {
  if (e.target.id === 'q' && e.key === 'Enter') {
    const first = searchMatches(ui.query)[0];
    if (first) { ui.selection = { type: first.type, id: first.id }; ui.query = ''; render(); }
  }
});

app.addEventListener('change', (e) => {
  const el = e.target;
  const a = el.dataset.action;
  const entry = el.dataset.card ? entryFor(el.dataset.card) : null;
  const qk = quarterKey(new Date());

  if (a === 'fee') {
    const v = Number(el.value);
    if (Number.isFinite(v) && v >= 0) commit(() => { entry.annualFee = v; });
  } else if (a === 'import-assign') {
    const line = ui.importReview && ui.importReview.lines.find((l) => l.id === el.dataset.id);
    if (line) line.creditId = el.value || null;
  } else if (a === 'import-file') {
    const file = el.files && el.files[0];
    const cardId = document.getElementById('import-card').value;
    if (!file || !cardId) return;
    file.text().then((text) => {
      const { format, transactions, error } = readStatement(text);
      if (error) { toast(error); return; }
      const imp = entryFor(cardId);
      const credits = creditsFor(imp, state).filter((c) => !isPerk(c));
      const lines = transactions
        .filter((t) => t.isCredit && !t.isPayment)
        .map((t) => ({
          ...t,
          creditId: suggestCredit(t.description, cardId, credits, state.importRules),
          already: !!state.imported[`${cardId}|${t.id}`],
        }));
      const fileKey = `${cardId}|file|${transactions.length}|${transactions[0] && transactions[0].id}|${transactions[transactions.length - 1].id}`;
      ui.importReview = { cardId, format, lines, fileKey, merchants: state.imported[fileKey] ? [] : merchantsFromStatement(transactions) };
      render();
    }).catch(() => toast('Could not read that file.'));
  } else if (a === 'valuation') {
    const v = Number(el.value);
    if (Number.isFinite(v) && v > 0) commit((s) => { s.valuations[el.dataset.currency] = v; });
  } else if (a === 'choice') {
    commit(() => { entry.choice = el.value; });
  } else if (a === 'anniversary') {
    commit(() => { entry.anniversaryMonth = Number(el.value); });
  } else if (a === 'rotating-activated') {
    commit(() => { entry.rotatingActivated = { ...(entry.rotatingActivated || {}), [qk]: el.checked }; });
  } else if (a === 'rotating-cat') {
    const card = getCard(entry.cardId, state);
    const rule = card.rules.find((r) => r.rotating);
    const current = (entry.rotatingOverride || {})[qk] || (rule.quarters || {})[qk] || [];
    const next = el.checked ? [...new Set([...current, el.value])] : current.filter((c) => c !== el.value);
    commit(() => { entry.rotatingOverride = { ...(entry.rotatingOverride || {}), [qk]: next }; });
  } else if (a === 'credit-visible') {
    commit(() => {
      const hidden = new Set(entry.hiddenCredits || []);
      if (el.checked) hidden.delete(el.value); else hidden.add(el.value);
      entry.hiddenCredits = [...hidden];
    });
  } else if (a === 'import-json') {
    const file = el.files && el.files[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const data = normalize(JSON.parse(text));
        if (!window.confirm(`Replace your current data with this backup (${data.wallet.length} cards)?`)) return;
        commit((s) => Object.assign(s, data));
        toast('Backup restored.');
      } catch {
        toast('That file isn\'t a valid backup.');
      }
    });
  }
});

app.addEventListener('submit', (e) => {
  const form = e.target.closest('form');
  if (!form) return;
  e.preventDefault();
  const fd = new FormData(form);

  if (form.dataset.form === 'add-credit') {
    const name = String(fd.get('name') || '').trim();
    const amount = Number(fd.get('amount'));
    if (!name || !(amount > 0)) return;
    commit(() => {
      const entry = entryFor(form.dataset.card);
      entry.customCredits = [...(entry.customCredits || []), { id: `custom_${Date.now().toString(36)}`, name, amount, cadence: String(fd.get('cadence')) }];
    });
    toast(`Added ${name}`);
  } else if (form.dataset.form === 'custom-card') {
    const name = String(fd.get('name') || '').trim();
    if (!name) return;
    const id = `custom_${Date.now().toString(36)}`;
    const isCash = fd.get('currency') === 'cash';
    const currency = isCash ? 'cash' : `points_${id}`;
    const rules = Object.keys(CATEGORIES)
      .map((c) => ({ c, rate: Number(fd.get(`rate_${c}`)) }))
      .filter((x) => x.rate > 0)
      .map((x) => ({ rate: x.rate, categories: [x.c] }));
    const card = {
      id, name, issuer: 'Custom', custom: true,
      network: String(fd.get('network')),
      annualFee: Math.max(0, Number(fd.get('fee')) || 0),
      currency, baseRate: Math.max(0, Number(fd.get('base')) || 1),
      rules, credits: [],
    };
    commit((s) => {
      s.customCards.push(card);
      s.wallet.push({ cardId: id });
      if (!isCash) s.valuations[currency] = Number(fd.get('cents')) || 1;
    });
    ui.showAddCustom = false;
    ui.openCard = id;
    toast(`Added ${name}`);
  }
});

// ---------- boot ----------

render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
}
