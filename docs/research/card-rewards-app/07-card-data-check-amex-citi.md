# Verification batch 2 (Amex + Citi + Costco), as of 2026-11-16

Method: WebSearch snippets only. Issuer sites are blocked and WebFetch to frequentmiler.com failed (DNS blocked), so nothing below was read directly from an issuer page. Confidence: H = several independent sources agree; M = one or two good sources, or matches prior knowledge but not re-confirmed; L = single weak source or conflicting.

---

## amex_platinum: CORRECTION NEEDED

Confirmed:
- annualFee 895 (H). Network amex. The 5x flights rule (direct with airline or Amex Travel, up to $500K/calendar year) and the 5x prepaid hotels via Amex Travel rule match (M: not re-confirmed this pass, no change reported).
- resy $100 quarterly, enrollment (H). lululemon $75 quarterly, US stores (not outlets) + lululemon.com, enrollment (H). digital $25 monthly, enrollment (H). uber $15/mo + $20 extra in Dec (H; reported unchanged in 2026). uber_one $120 calendar year (H). walmart $12.95 + tax monthly, monthly plan only (H). oura $200 calendar year, enrollment, ring hardware only (H). equinox $300 calendar year, enrollment (M). airline $200 calendar year (M: one blog claims a mid-year reset, others say Jan 1; treat Jan 1 as correct).
- Saks credit ended July 1, 2026. cards.js already omits it, so no change.

Corrections:
1. `clear`: amount 209 -> **219**. Amex raised it to match CLEAR+'s price starting July 1, 2026. Enrollment required. (H)
2. `hotel`: name/note update. It was rebranded as the "lodging credit" (still $300 semiannual, $600/yr). It now also covers prepaid Airbnb Luxe stays of 2+ nights (reported live Oct 22, 2026), and using it on Airbnb Luxe unlocks a separate $250 Airbnb Experiences credit. FHR will require a 2-night minimum from Jan 1, 2027. Suggested note: `'Prepaid FHR / Hotel Collection (2+ nights) or Airbnb Luxe (2+ nights) via Amex Travel; FHR 2-night minimum from 2027'`. (M: CNBC + TPG. The Oct 22 date comes from one source.)
3. `digital` note (optional): Peacock bundles (incl. Apple TV pairings) stopped qualifying on Aug 1, 2026. (M)

Sources: https://upgradedpoints.com/news/clear-plus-membership-price-increase-july-2026/ ; https://thepointsguy.com/news/clear-membership-fee-hike-2026/ ; https://www.cnbc.com/select/amex-platinum-airbnb-lodging-credit/ ; https://thepointsguy.com/news/amex-platinum-airbnb-hotel-credit-changes/ ; https://upgradedpoints.com/news/amex-platinum-benefit-changes-2026/ ; https://www.insideflyer.com/posts/amex-platinum-card-changes-take-effect-july-2026/ ; https://norteapp.io/cards/american-express-platinum/credits ; https://upgradedpoints.com/credit-cards/reviews/american-express-platinum-card/benefits/

---

## amex_gold: CORRECTION NEEDED

Refresh effective April 30, 2026. The fee stayed at $325 (H).

Confirmed: annualFee 325. 4x dining up to $50K/yr. 4x US supermarkets up to $25K/yr. 3x flights (direct or AmexTravel.com). uber $10/mo. resy $50 semiannual, enrollment. dunkin $7/mo, enrollment. (H)

Corrections:
1. Add rule: `{ rate: 5, categories: ['hotels'], condition: 'prepaid hotels booked on AmexTravel.com / Amex Travel app' }`. This was 2x before the refresh, so the old rule was also missing from cards.js. (H. Cap: none reported, but I did not confirm whether one exists.)
2. `dining` note: Goldbelly and Wine.com were removed effective July 1, 2026 (TPG says usable through June 30). Buffalo Wild Wings and Wonder were added. New note: `'Grubhub, The Cheesecake Factory, Five Guys, Buffalo Wild Wings, Wonder; enrollment required'`. (H)
3. Optional: the refresh also added Hertz Five Star status (non-credit perk). The Uber One credit reported for Gold is a limited-time offer, so do not add it.

Sources: https://www.doctorofcredit.com/american-express-gold-card-changes-hertz-five-star-status-new-dining-partners-af-remains-same/ ; https://thepointsguy.com/news/american-express-gold-refresh-2026/ ; https://www.nerdwallet.com/credit-cards/news/american-express-gold-card-unveils-new-and-updated-benefits ; https://upgradedpoints.com/news/amex-gold-card-new-benefits-2026/ ; https://awardwallet.com/news/credit-cards/american-express-gold-card-refresh-2026/ ; https://frequentmiler.com/american-express-gold-card-changes-minor-tweaks-good-limited-time-offers/

---

## amex_blue_cash_preferred: CORRECTION NEEDED

Confirmed: annualFee 95 ($0 intro first year). 6% US supermarkets up to $6K/yr, then 1%. 6% select US streaming (uncapped). 3% US gas stations. 3% transit (taxis/rideshare, parking, tolls, trains, buses). (H)
Doctor of Credit reported an April 2026 Amex survey of a $135-$160 fee. No change has been announced. (M)

Correction:
1. credits: [] -> add `{ id: 'disney', name: 'Disney Streaming credit', amount: 10, cadence: 'monthly', note: 'Disney+, Hulu, ESPN+ (incl. bundles) charged to the card; enrollment required' }`. Raised from $7 to $10 on Aug 1, 2025, and the $9.99 minimum was removed. (H. One AwardWallet reader said an Amex terms page still showed $7.)

Sources: https://thepointsguy.com/credit-cards/blue-cash-preferred-increases-disney-bundle-credit ; https://upgradedpoints.com/news/amex-blue-cash-cards-disney-streaming-credit/ ; https://awardwallet.com/news/cash-back/amex-disney-streaming-credit-update/ ; https://www.americanexpress.com/en-us/credit-cards/credit-intel/blue-cash-preferred-vs-blue-cash-everyday/ ; https://www.doctorofcredit.com/american-express-surveys-changes-to-blue-cash-preferred-card/

---

## amex_blue_cash_everyday: CORRECTION NEEDED

Confirmed: annualFee 0. 3% US supermarkets, 3% US online retail and 3% US gas stations, each up to $6K/yr, then 1%. Base rate 1%. (H)

Correction:
1. credits: [] -> add
   - `{ id: 'disney', name: 'Disney Streaming credit', amount: 7, cadence: 'monthly', note: 'Disney+, Hulu, ESPN+ (incl. bundles); enrollment required' }` (H; $9.99 minimum removed Aug 2025)
   - `{ id: 'home_chef', name: 'Home Chef credit', amount: 15, cadence: 'monthly', note: 'Enrollment required' }` (H; one low-quality source said $7, which conflicts with all others)

Sources: https://www.cnbc.com/select/american-express-relaunches-blue-cash-everyday-card-new-benefits/ ; https://www.businesswire.com/news/home/20220714005286/en ; https://thepointsguy.com/news/blue-cash-everyday-new-perks ; https://upgradedpoints.com/news/amex-blue-cash-cards-disney-streaming-credit/

---

## citi_double_cash: CORRECTION NEEDED

Confirmed: annualFee 0. 2% total (1% buy + 1% pay), baseRate 2. Earns ThankYou points. (H) Network mastercard: none of the results stated it; it matches prior knowledge (M).

Correction:
1. Add rule: `{ rate: 5, categories: ['hotels', 'travel'], condition: 'hotels, car rentals and attractions booked on Citi Travel' }`. Upgraded Points says Citi made this permanent from May 18, 2025, and 2026 reviews still list it. (M) Conflict: a Frequent Miler podcast titled "Citi cancels 5X earnings" (June 2, 2026) was disputed in its own comments, and I found no written report of the Double Cash 5% ending. Re-check if possible.

Sources: https://upgradedpoints.com/news/citi-permanent-5x-earnings-double-cash-custom-cash/ ; https://upgradedpoints.com/credit-cards/reviews/citi-double-cash-card/ ; https://frequentmiler.com/citi-cancels-5x-earnings-coffee-break-ep108-6-2-26/

---

## citi_custom_cash: CORRECTION NEEDED

Confirmed: annualFee 0. 5% on the top eligible category each billing cycle, on up to $500, then 1%. No enrollment needed. (H)

Corrections:
1. The `topCategory` list is missing 'flights' and 'hotels'. Citi's "select travel" is airlines, hotels, cruise lines and travel agencies. "Select transit" includes car rentals, taxis/rideshare, transit, tolls and parking. New list: `['dining','groceries','gas','flights','hotels','travel','transit','streaming','drugstores','home_improvement','entertainment']`. "Fitness clubs" is also eligible but has no category in the app; consider a note. (H for the category list)
2. Status: **closed to new applications on May 28, 2026**. Existing cardholders keep the same terms. Add a note to the card name or a field. (H: NerdWallet, DoC, AwardWallet, US News)
3. Citi Travel bonus: UNRESOLVED. NerdWallet and Citi snippets say the +4% on hotels/car rentals/attractions via Citi Travel ran "through 6/30/2026". AwardWallet says the end date was removed from Citi pages. Upgraded Points says it became permanent (5% total) in May 2025. If you add it, use `{ rate: 5, categories: ['hotels','travel'], condition: 'hotels, car rentals and attractions booked on Citi Travel (end date unclear; verify)' }`, or leave it out. (L)

Sources: https://www.nerdwallet.com/credit-cards/news/citi-custom-cash-closed-to-new-applications ; https://awardwallet.com/news/citi-thankyou-rewards/citi-custom-cash-closed-new-applications/ ; https://doctorofcredit.com/rumor-citi-to-discontinue-custom-cash-card ; https://money.usnews.com/credit-cards/articles/citi-shuts-down-applications-for-popular-custom-cash-card ; https://thepointsguy.com/credit-cards/reviews/citi-custom-cash-review/ ; https://www.nerdwallet.com/credit-cards/reviews/citi-custom-cash ; https://upgradedpoints.com/news/citi-permanent-5x-earnings-double-cash-custom-cash/

---

## citi_strata_premier: CONFIRMED (with caveats)

- annualFee 95. 3x air travel and hotels, restaurants, supermarkets, gas and EV charging. 10x hotels, car rentals and attractions on Citi Travel. $100 off a single $500+ hotel stay via Citi Travel, once per calendar year (`annual`). (M: 2026 reviews still describe these, and no change was announced.)
- Watch: Citi surveyed cardholders (around March 2026) about a $195 fee with more benefits. Nothing has been announced. (M)
- Related: cash-out value for Strata Premier points fell to 0.75 cents/pt on Aug 24, 2025. This only affects CURRENCIES if the app models cash-out. Strata welcome bonuses are now once per lifetime (not a cards.js field).
- If citi_strata_elite is added: CURRENCIES.citi_ty.boostedBy should become `['citi_strata_premier', 'citi_strata_elite']`.

Sources: https://www.doctorofcredit.com/citi-sends-out-survey-for-citi-strata-premier-changes-195-annual-fee-more-benefits/ ; https://frequentmiler.com/citi-strata-premier-refresh-rumors/ ; https://frequentmiler.com/citi-to-cut-cash-back-redemption-rate-to-0-75c-per-point-for-strata-premier/ ; https://card-savvy.com/learn/citi-strata-premier-review-2026

---

## citi_costco: CONFIRMED

- annualFee 0 (Costco membership required). Network visa. 5% Costco gas. 4% other gas and EV charging. The $7,000/yr cap is combined across the 5% and 4% gas spend, then 1%. 3% restaurants (incl. takeout/delivery) and eligible travel (incl. Costco Travel). 2% Costco and Costco.com. 1% everything else. Paid yearly as a reward certificate with the February statement. (H. The 5% Costco gas rate started Jan 19, 2025.)

Sources: https://www.nerdwallet.com/article/credit-cards/costco-credit-card-hikes-rewards-for-gas-at-its-pumps ; https://nerdwallet.com/credit-cards/reviews/costco-anywhere-visa ; https://aem.citi.com/credit-cards/credit-card-rewards/costco-anywhere-card-dining-benefits ; https://warehousegasprices.com/costco-anywhere-visa-gas-cash-back/

---

## merchants.js: costco / costco_gas: CORRECTION NEEDED (minor)

- US warehouses and gas: Visa is the only credit network accepted (plus debit/ATM, Shop Card, cash). (H)
- Costco.com: Costco's own payment-methods page (snippet) lists all Visa cards, Mastercard, PIN debit and Shop Cards. Third parties agree Mastercard works online and on CostcoTravel.com. Discover: conflicting reports. Amex: not accepted per most sources (one weak source says it is). (M)
- Fix: update the `costco` note to `'U.S. warehouses take Visa only (plus debit). Costco.com also accepts Mastercard. Most cards do not count Costco as grocery.'`. Optionally add a `costco_online` merchant with `networks: ['visa','mastercard']`. The Costco card's 2% applies to both. costco_gas `['visa']` is correct.

Sources: https://www.costco.com/online-payment-methods.html (snippet only) ; https://www.citi.com/credit-cards/understanding-credit-cards/what-credit-cards-does-costco-accept ; https://www.nerdwallet.com/credit-cards/learn/best-credit-cards-to-use-at-costco

---

## CANDIDATE TO ADD: citi_strata_elite (launched July 2025)

```
{ id: 'citi_strata_elite', name: 'Citi Strata Elite', issuer: 'Citi', network: 'mastercard' /* M: prior knowledge, not seen in snippets */,
  annualFee: 595, currency: 'citi_ty', baseRate: 1.5,
  url: 'https://www.citi.com/credit-cards/citi-strata-elite-credit-card' /* unverified URL */,
  rules: [
    { rate: 3, categories: ['dining'] },
    { rate: 6, categories: ['dining'], condition: 'Citi Nights: Fri & Sat 6pm-6am ET' },
    { rate: 12, categories: ['hotels','travel'], condition: 'hotels, car rentals and attractions booked on cititravel.com' },
    { rate: 6, categories: ['flights'], condition: 'air travel booked on cititravel.com' },
  ],
  credits: [
    { id: 'hotel', name: 'Citi Travel hotel credit', amount: 300, cadence: 'annual', note: 'Prepaid 2+ night stay booked on cititravel.com; applied at booking' },
    { id: 'splurge', name: 'Splurge credit', amount: 200, cadence: 'annual', note: 'Up to 2 of: 1stDibs, American Airlines, Best Buy, Future Personal Training, Live Nation' },
    { id: 'blacklane', name: 'Blacklane credit', amount: 100, cadence: 'semiannual', note: 'Jan-Jun and Jul-Dec' },
  ] }
```
Confidence: fee $595 (H; one Upgraded Points snippet said $895 and one old KTT page said $469, both outliers). Earning rates (H). Hotel/Splurge/Blacklane amounts and cadences (H). Splurge activation: sources conflict (TPG says no enrollment needed; Bankrate says activation required). Also: Global Entry/TSA PreCheck credit (not modeled), Priority Pass, $75 authorized users.

Sources: https://www.citigroup.com/global/news/press-release/2025/citi-launches-citi-strata-elite-credit-card ; https://thepointsguy.com/credit-cards/citi-strata-elite-statement-credits/ ; https://thepointsguy.com/credit-cards/citi-strata-elite-splurge-credit/ ; https://www.citi.com/credit-cards/credit-card-rewards/citi-nights-weekend-dining-entertainment-rewards ; https://upgradedpoints.com/credit-cards/reviews/citi-strata-elite-card/benefits/ ; https://www.bankrate.com/credit-cards/reviews/citi-strata-elite-card
