import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rankCards, earningFor, getCard, pointValue, periodFor, upcomingPeriods,
  creditStatus, cardBenefitSummary, expiringSoon, usageKey, buildIcs,
} from '../js/engine.js';
import { CARDS, CATEGORIES } from '../js/data/cards.js';
import { MERCHANTS } from '../js/data/merchants.js';

const NOV_16 = new Date(2026, 10, 16); // local time, Q4 2026

function wallet(...ids) {
  return { wallet: ids.map((cardId) => ({ cardId })), usage: {}, valuations: {} };
}

test('catalog data is internally consistent', () => {
  const ids = new Set();
  for (const card of CARDS) {
    assert.ok(!ids.has(card.id), `duplicate card id ${card.id}`);
    ids.add(card.id);
    for (const rule of card.rules) {
      for (const c of rule.categories || rule.topCategory || rule.choice || []) {
        assert.ok(CATEGORIES[c], `${card.id}: unknown category ${c}`);
      }
      for (const m of rule.merchants || []) {
        assert.ok(MERCHANTS.some((x) => x.id === m), `${card.id}: unknown merchant ${m}`);
      }
    }
    const creditIds = new Set();
    for (const credit of card.credits) {
      assert.ok(!creditIds.has(credit.id), `${card.id}: duplicate credit ${credit.id}`);
      creditIds.add(credit.id);
      assert.ok(['monthly', 'quarterly', 'semiannual', 'annual', 'cardmember_year'].includes(credit.cadence));
    }
  }
  for (const m of MERCHANTS) assert.ok(CATEGORIES[m.category], `merchant ${m.id}: unknown category`);
});

test('dining: Amex Gold beats Sapphire Preferred and Double Cash', () => {
  const { results } = rankCards(wallet('citi_double_cash', 'chase_sapphire_preferred', 'amex_gold'), { category: 'dining' }, NOV_16);
  assert.equal(results[0].card.id, 'amex_gold');
  assert.equal(results[0].rate, 4);
  assert.equal(results[0].returnPct, 5); // 4x * 1.25c default MR value
});

test('Sapphire in wallet boosts Chase point value', () => {
  assert.equal(pointValue('chase_ur', wallet('chase_freedom_unlimited')), 1.0);
  assert.equal(pointValue('chase_ur', wallet('chase_freedom_unlimited', 'chase_sapphire_preferred')), 1.25);
  const state = wallet('chase_freedom_unlimited');
  state.valuations.chase_ur = 2;
  assert.equal(pointValue('chase_ur', state), 2);
});

test('Walmart is not grocery for Blue Cash Preferred', () => {
  const { category, results } = rankCards(wallet('amex_blue_cash_preferred', 'wells_fargo_active_cash'), { merchantId: 'walmart' }, NOV_16);
  assert.equal(category, 'superstore');
  assert.equal(results[0].card.id, 'wells_fargo_active_cash');
});

test('Costco: non-Visa cards are marked not accepted and ranked last', () => {
  const { results } = rankCards(wallet('amex_platinum', 'citi_costco', 'wells_fargo_active_cash'), { merchantId: 'costco' }, NOV_16);
  assert.deepEqual(results.map((r) => r.card.id), ['citi_costco', 'wells_fargo_active_cash', 'amex_platinum']);
  assert.equal(results[2].accepted, false);
  assert.equal(results[0].rate, 2);
});

test('Sapphire Preferred: Lyft promo and gas', () => {
  const card = getCard('chase_sapphire_preferred', {});
  assert.equal(earningFor(card, {}, { category: 'transit', merchantId: 'lyft' }, NOV_16).rate, 5);
  assert.equal(earningFor(card, {}, { category: 'gas' }, NOV_16).rate, 3);
});

test('Costco gas uses the merchant-specific 5% rule', () => {
  const card = getCard('citi_costco', {});
  assert.equal(earningFor(card, {}, { category: 'gas', merchantId: 'costco_gas' }, NOV_16).rate, 5);
  assert.equal(earningFor(card, {}, { category: 'gas', merchantId: 'shell' }, NOV_16).rate, 4);
});

test('rotating category needs activation', () => {
  const card = getCard('chase_freedom_flex', {});
  const notActivated = earningFor(card, {}, { category: 'groceries' }, NOV_16);
  assert.equal(notActivated.rate, 1);
  assert.equal(notActivated.conditional[0].rate, 5);
  assert.equal(notActivated.warnings.length, 1);

  const activated = earningFor(card, { rotatingActivated: { '2026-Q4': true } }, { category: 'groceries' }, NOV_16);
  assert.equal(activated.rate, 5);
  assert.equal(activated.warnings.length, 0);

  // Q1 2027: groceries and streaming; activation is per quarter.
  const jan = new Date(2027, 0, 10);
  assert.equal(earningFor(card, { rotatingActivated: { '2026-Q4': true } }, { category: 'groceries' }, jan).rate, 1);
  assert.equal(earningFor(card, { rotatingActivated: { '2027-Q1': true } }, { category: 'streaming' }, jan).rate, 5);
  // A quarter with no data falls back to the regular rates.
  assert.equal(earningFor(card, { rotatingActivated: { '2027-Q2': true } }, { category: 'groceries' }, new Date(2027, 4, 1)).rate, 1);
});

test('user-set rotating categories (Discover)', () => {
  const card = getCard('discover_it', {});
  const entry = { rotatingOverride: { '2026-Q4': ['amazon'] }, rotatingActivated: { '2026-Q4': true } };
  assert.equal(earningFor(card, entry, { category: 'amazon' }, NOV_16).rate, 5);
  assert.equal(earningFor(card, entry, { category: 'dining' }, NOV_16).rate, 1);
});

test('choice category (BofA Customized Cash)', () => {
  const card = getCard('boa_customized_cash', {});
  assert.equal(earningFor(card, {}, { category: 'gas' }, NOV_16).rate, 3); // default choice
  assert.equal(earningFor(card, { choice: 'online' }, { category: 'amazon' }, NOV_16).rate, 3); // amazon counts as online
  assert.equal(earningFor(card, { choice: 'online' }, { category: 'gas' }, NOV_16).rate, 1);
  assert.equal(earningFor(card, {}, { category: 'wholesale' }, NOV_16).rate, 2);
});

test('portal-only rates are tips, not the ranked rate', () => {
  const card = getCard('chase_sapphire_reserve', {});
  const hotel = earningFor(card, {}, { category: 'hotels' }, NOV_16);
  assert.equal(hotel.rate, 4);
  assert.equal(hotel.conditional[0].rate, 8);
});

test('periods', () => {
  assert.equal(periodFor('monthly', NOV_16).key, '2026-11');
  assert.equal(periodFor('quarterly', NOV_16).key, '2026-Q4');
  assert.equal(periodFor('semiannual', NOV_16).key, '2026-H2');
  assert.equal(periodFor('annual', NOV_16).key, '2026');
  const cm = periodFor('cardmember_year', NOV_16, 3);
  assert.equal(cm.key, '2026-CM03');
  assert.equal(cm.end.getFullYear(), 2027);
  assert.equal(periodFor('cardmember_year', new Date(2026, 1, 1), 3).key, '2025-CM03');
  // Q4-26 (current) through Q4-27, which starts before Nov 2027
  assert.equal(upcomingPeriods('quarterly', NOV_16, 12).length, 5);
  assert.equal(upcomingPeriods('monthly', NOV_16, 12).length, 12);
});

test('credit status, December Uber override, and partial usage', () => {
  const state = wallet('amex_platinum');
  const entry = state.wallet[0];
  const uber = getCard('amex_platinum', {}).credits.find((c) => c.id === 'uber');
  assert.equal(creditStatus(entry, uber, state, NOV_16).amount, 15);
  assert.equal(creditStatus(entry, uber, state, new Date(2026, 11, 5)).amount, 35);

  state.usage[usageKey('amex_platinum', 'uber', '2026-11')] = 10;
  const s = creditStatus(entry, uber, state, NOV_16);
  assert.equal(s.remaining, 5);
  assert.equal(s.daysLeft, 15);
});

test('benefit summary and expiring soon', () => {
  const state = wallet('amex_gold');
  state.usage[usageKey('amex_gold', 'uber', '2026-10')] = 10;
  state.usage[usageKey('amex_gold', 'uber', '2025-12')] = 10; // previous year, not counted
  const sum = cardBenefitSummary(state.wallet[0], state, new Date(2026, 11, 28));
  assert.equal(sum.fee, 325);
  assert.equal(sum.usedThisYear, 10);
  // December: dining 10 + uber 10 + dunkin 7 monthly, resy 50 for H2 => 77 left
  assert.equal(sum.availableNow, 77);
  assert.equal(sum.leftThisYear, 77);

  const soon = expiringSoon(state, new Date(2026, 11, 28));
  assert.equal(soon[0].daysLeft, 4);
  assert.ok(soon.some((x) => x.credit.id === 'resy'));
  assert.equal(expiringSoon(state, new Date(2026, 11, 1)).filter((x) => x.credit.cadence === 'monthly').length, 0);
});

test('hidden and custom credits', () => {
  const state = wallet('amex_gold');
  state.wallet[0].hiddenCredits = ['dunkin'];
  state.wallet[0].customCredits = [{ id: 'c1', name: 'Test', amount: 20, cadence: 'annual' }];
  const sum = cardBenefitSummary(state.wallet[0], state, NOV_16);
  assert.ok(!sum.statuses.some((s) => s.credit.id === 'dunkin'));
  assert.ok(sum.statuses.some((s) => s.credit.id === 'c1'));
});

test('custom card ranks with the rest', () => {
  const state = wallet('citi_double_cash');
  state.customCards = [{ id: 'custom_1', name: 'Store card', issuer: 'Custom', network: 'visa', annualFee: 0, currency: 'cash', baseRate: 1, rules: [{ rate: 5, categories: ['dining'] }], credits: [] }];
  state.wallet.push({ cardId: 'custom_1' });
  const { results } = rankCards(state, { category: 'dining' }, NOV_16);
  assert.equal(results[0].card.id, 'custom_1');
});

test('ics export contains reminders', () => {
  const ics = buildIcs(wallet('amex_gold'), NOV_16);
  assert.ok(ics.startsWith('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('SUMMARY:Use $50 Resy credit (American Express Gold Card)'));
  assert.ok(ics.trim().endsWith('END:VCALENDAR'));
});
