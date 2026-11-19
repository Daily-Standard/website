import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, readStatement, suggestCredit, applyMatches, descriptionPattern, merchantsFromStatement } from '../js/importer.js';
import { getCard, cardBenefitSummary, setupChecklist, expiringSoon, usageKey } from '../js/engine.js';

const CHASE_CSV = `Transaction Date,Post Date,Description,Category,Type,Amount,Memo
11/02/2026,11/03/2026,LYFT   *RIDE SUN 8PM,Travel,Sale,-14.20,
11/03/2026,11/03/2026,LYFT CREDIT,Travel,Return,10.00,
11/05/2026,11/06/2026,"STUBHUB, INC",Entertainment,Sale,-180.00,
11/06/2026,11/06/2026,STUBHUB CREDIT,Entertainment,Adjustment,150.00,
11/08/2026,11/08/2026,Payment Thank You-Mobile,,Payment,500.00,
11/09/2026,11/09/2026,WHOLEFDS MKT 10234,Groceries,Sale,-62.11,
`;

const AMEX_CSV = `Date,Description,Amount
10/14/2026,MARRIOTT HOTEL BOSTON,412.50
10/20/2026,AUTOPAY PAYMENT - THANK YOU,-412.50
10/21/2026,"AMEX OFFER CREDIT, SHOP SMALL",-20.00
`;

test('csv parser handles quotes and CRLF', () => {
  const rows = parseCsv('a,b\r\n"x, y","say ""hi"""\r\n');
  assert.deepEqual(rows, [['a', 'b'], ['x, y', 'say "hi"']]);
});

test('reads a Chase statement', () => {
  const { format, transactions } = readStatement(CHASE_CSV);
  assert.equal(format, 'chase');
  assert.equal(transactions.length, 6);
  const credits = transactions.filter((t) => t.isCredit && !t.isPayment);
  assert.deepEqual(credits.map((c) => c.description), ['LYFT CREDIT', 'STUBHUB CREDIT']);
  assert.equal(credits[1].amount, 150);
  assert.ok(transactions.find((t) => t.description.startsWith('Payment')).isPayment);
});

test('reads an Amex statement (opposite signs)', () => {
  const { format, transactions } = readStatement(AMEX_CSV);
  assert.equal(format, 'amex');
  const offer = transactions.find((t) => t.description.startsWith('AMEX OFFER'));
  assert.equal(offer.isCredit, true);
  assert.equal(offer.amount, 20);
  assert.equal(transactions.find((t) => t.description.startsWith('MARRIOTT')).isCredit, false);
  assert.equal(transactions.find((t) => t.description.startsWith('AUTOPAY')).isPayment, true);
});

test('rejects a file without the needed columns', () => {
  assert.ok(readStatement('foo,bar\n1,2\n').error);
});

test('suggests credits by keyword, remembered rules win', () => {
  const credits = getCard('chase_sapphire_reserve', {}).credits;
  assert.equal(suggestCredit('LYFT CREDIT', 'chase_sapphire_reserve', credits), 'lyft');
  assert.equal(suggestCredit('STUBHUB CREDIT', 'chase_sapphire_reserve', credits), 'stubhub');
  assert.equal(suggestCredit('RANDOM REFUND', 'chase_sapphire_reserve', credits), null);
  const rules = [{ cardId: 'chase_sapphire_reserve', pattern: descriptionPattern('RANDOM REFUND'), creditId: 'travel' }];
  assert.equal(suggestCredit('RANDOM REFUND', 'chase_sapphire_reserve', credits, rules), 'travel');
});

test('applying matches records usage once, capped, and remembers the match', () => {
  const entry = { cardId: 'chase_sapphire_reserve' };
  const state = { wallet: [entry], usage: {}, imported: {}, importRules: [] };
  const credits = getCard('chase_sapphire_reserve', {}).credits;
  const { transactions } = readStatement(CHASE_CSV);
  const lines = transactions.filter((t) => t.isCredit && !t.isPayment)
    .map((t) => ({ ...t, creditId: suggestCredit(t.description, entry.cardId, credits) }));

  const r1 = applyMatches(state, entry, credits, lines);
  assert.equal(r1.usage[usageKey('chase_sapphire_reserve', 'lyft', '2026-11')], 10);
  assert.equal(r1.usage[usageKey('chase_sapphire_reserve', 'stubhub', '2026-H2')], 150);
  assert.equal(r1.importRules.length, 2);

  // Importing the same file again changes nothing.
  const r2 = applyMatches({ ...state, ...r1 }, entry, credits, lines);
  assert.deepEqual(r2.usage, r1.usage);
});

test('merchants list skips credits and payments', () => {
  const { transactions } = readStatement(CHASE_CSV);
  const names = merchantsFromStatement(transactions).map((m) => m.name);
  assert.ok(names.includes('WHOLEFDS MKT'));
  assert.ok(names.some((n) => n.startsWith('LYFT')));
  assert.ok(!names.some((n) => n.startsWith('PAYMENT')));
});

test('free night perk: not counted as dollars, warns 60 days out', () => {
  const entry = { cardId: 'amex_marriott_bonvoy_legacy', anniversaryMonth: 3, annualFee: 120 };
  const state = { wallet: [entry], usage: {} };
  const sum = cardBenefitSummary(entry, state, new Date(2027, 0, 20));
  assert.equal(sum.fee, 120); // user's own fee wins
  assert.equal(sum.availableNow, 0);
  assert.equal(sum.leftThisYear, 0);
  assert.equal(sum.statuses[0].remaining, 1);
  const soon = expiringSoon(state, new Date(2027, 0, 20)); // card year ends Mar 1
  assert.equal(soon[0].credit.id, 'free_night');
});

test('setup checklist lists activation steps', () => {
  const state = { wallet: [{ cardId: 'chase_sapphire_reserve', setupDone: { lyft: true } }], usage: {} };
  const list = setupChecklist(state);
  assert.ok(list.length >= 5);
  assert.equal(list.find((x) => x.credit.id === 'lyft').done, true);
  assert.equal(list.find((x) => x.credit.id === 'stubhub').done, false);
});

test('offer list parsing and matching to statement brands', async () => {
  const { parseOfferList, matchOffers, mergeMerchants } = await import('../js/importer.js');
  const list = parseOfferList(JSON.stringify({
    source: 'card-rewards-offer-helper', issuer: 'amex', capturedAt: '2026-11-19T00:00:00Z',
    offers: [
      { merchant: 'The Home Depot', text: 'Spend $100, get $15 back' },
      { merchant: 'Starbucks', text: 'Earn 10% back' },
      { merchant: 'HomeGoods', text: 'Spend $50, get $10' },
      { merchant: 'Hilton', text: '' },
    ],
  }));
  assert.equal(list.issuer, 'amex');
  assert.throws(() => parseOfferList('{"offers": []}'));
  assert.throws(() => parseOfferList('not json'));

  const merchants = mergeMerchants({}, [
    { name: 'THE HOME DEPOT', count: 2 },
    { name: 'STARBUCKS STORE', count: 5 },
    { name: 'MARRIOTT BOSTON', count: 1 },
  ]);
  const hits = matchOffers({ amex: list }, merchants);
  assert.deepEqual(hits.map((h) => h.offer.merchant), ['Starbucks', 'The Home Depot']);
  assert.equal(hits[0].count, 5);
  assert.equal(mergeMerchants(merchants, [{ name: 'STARBUCKS STORE', count: 1 }])['STARBUCKS STORE'].count, 6);
});
