# cards.js verification, batch 1 (as of 2026-11-16)

Method: WebSearch result snippets only. WebFetch was blocked (doctorofcredit.com did not resolve; issuer domains blocked), so no issuer page was read directly. Confidence: HIGH = several independent snippets agree (or an issuer press snippet); MED = one or two secondary snippets, or snippets plus pre-2026 knowledge; LOW = conflicting or thin.

---

## chase_sapphire_preferred: CORRECTION NEEDED (HIGH)
The June 15, 2026 refresh applies to new applicants from that date. Sources disagree on when existing cardholders got it (FM says Oct 1, 2026; TPG says June 15). Either way, it is live for everyone by Nov 2026.
- annualFee 95: confirmed.
- ADD rule: `{ rate: 3, categories: ['gas'], note: 'gas stations and EV charging (reportedly incl. Costco gas)' }`. No cap was reported.
- ADD rule: `{ rate: 3, merchants: ['airbnb'], note: 'vacation rentals booked directly with Airbnb, Vrbo, etc.' }`. Alternatively, put it as a note on travel, since the app has no vacation-rental category.
- These are unchanged: 3x dining, 3x select streaming, 3x online groceries (excl. Target/Walmart/wholesale clubs), 2x other travel, 5x Chase Travel.
- Hotel credit: change `amount: 50` to `amount: 100`. `cardmember_year` is correct ("every account anniversary year").
- Optional `merchants: ['lyft']` rate 5 (5x total on Lyft through 9/30/2027, per DoC Apr 2025). MED.
- Not modeled, FYI: the 10% anniversary points bonus is gone, and Hyatt transfers are now 4:3.
Sources: https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred , https://frequentmiler.com/chase-sapphire-preferred-card-refresh/ , https://www.nerdwallet.com/credit-cards/news/chase-sapphire-preferred-june-2026-update-new-benefits , https://thepointsguy.com/news/chase-sapphire-preferred-refresh-2026 , https://awardwallet.com/news/credit-cards/chase-sapphire-preferred-card-changes/?pubDate=2026-06-10 , https://www.fool.com/money/credit-cards/articles/100000-point-bonus-100-hotel-credit-3x-on-gas-and-airbnb-the-chase-sapphire-preferred-is-getting-even-better/

## chase_sapphire_reserve: CORRECTION NEEDED (HIGH for edit/doordash; MED for others)
- annualFee 795: confirmed. Earning rules (8x Chase Travel, 4x flights and hotels booked direct, 3x dining, 1x other): the snippets confirm 8x and $795. 4x direct was not confirmed by snippets in this session, but it matches the known June 2025 refresh terms. MED-HIGH.
- `edit`: change to `amount: 500, cadence: 'annual'`, with note "Up to $250 per prepaid 2+ night stay via The Edit; first two stays any time in the calendar year". Since Jan 1, 2026, the credit is no longer split into Jan–Jun and Jul–Dec halves. HIGH (NerdWallet and FM; one Chase business-card page still showed the old split).
- ADD credit `{ id: 'select_hotels', name: 'Chase Travel select hotels credit (2026 only)', amount: 250, cadence: 'annual', note: 'Prepaid select-brand hotel stays booked via Chase Travel; calendar 2026 only, does not renew' }`. MED. It expires 12/31/2026, so it could also be omitted.
- `doordash`: change the note. Since Oct 1, 2026 it is a $15/month promo on any eligible order (replacing the $5 restaurant promo), plus two $10 non-restaurant promos. That makes `amount: 35` monthly, up from 25, with DashPass and activation required. HIGH (FM, MilesTalk citing a Chase statement, ThriftyTraveler, InsideFlyer).
- `apple`: value is unclear. Chase marketed it at $250; current snippets cite $288/yr (after the Apple TV price increase). One snippet says it is complimentary through 6/22/2027 with activation. LOW. Keep 250 or change to 288.
- These are confirmed unchanged: travel $300 `cardmember_year`; dining $150 `semiannual` (OpenTable/Exclusive Tables); StubHub/viagogo $150 `semiannual` (activation, through 12/31/2027); Lyft $10 `monthly` (through 9/30/2027); Peloton $10 `monthly` (through 12/31/2027).
- Optional `merchants: ['lyft']` rate 5 (cut from 10x to 5x in Apr 2025). MED.
Sources: https://www.nerdwallet.com/travel/news/chase-sapphire-reserve-the-edit-hotel-credit , https://frequentmiler.com/?p=294186 , https://viewfromthewing.com/chase-sapphire-reserve-changed-again-new-250-hotel-credit-and-more-flexible-500-edit-credit/ , https://frequentmiler.com/chase-sapphire-reserve-doordash-benefit-enhancement-coming-october-1-2026/ , https://milestalk.com/confirmed-chase-sapphire-reserve-getting-15-monthly-doordash-credits/ , https://thepointsguy.com/credit-cards/chase-sapphire-reserve-credits/ , https://www.nerdwallet.com/credit-cards/news/chase-sapphire-reserve-overhaul-june-2025 , https://www.doctorofcredit.com/chase-lyft-partnership-extended-through-2027-added-10-credit-lower-5x-earn/

## chase_freedom_unlimited: CONFIRMED (HIGH)
$0 fee, Visa. Rates: 1.5% base, 3% dining (incl. takeout and eligible delivery), 3% drugstores, 5% Chase Travel. One snippet quotes the Chase product page as of 10/8/2026.
- Optional `merchants: ['lyft']` rate 2 (Freedom cards earn 2% total on Lyft through 9/2027). This is below the 1.5% base only marginally, so it is low value. MED.
Sources: https://thepointsparty.com/chase-freedom-unlimited-review , https://www.doctorofcredit.com/chase-lyft-partnership-extended-through-2027-added-10-credit-lower-5x-earn/

## chase_freedom_flex: CONFIRMED with one open question
- $0 fee, Mastercard, 3% dining and drugstores, 5% Chase Travel, $1,500/quarter cap with activation: confirmed. HIGH.
- Q4 2026 (Oct 1 – Dec 31): grocery stores (excl. Walmart/Target), dining, American Red Cross. Existing `quarters`/`quarterNotes` match. HIGH. Activation deadline is reported as Dec 14, 2026.
- Open question: InsideFlyer ("Chase Freedom Flex offers 7X on dining in Q4 2026") and another snippet say Flex dining earns 7% total this quarter (3% base + 4% bonus). The app's rotating rate of 5 may understate dining. Not confirmed on a Chase page. LOW-MED.
- Q1 2027 (announced early): grocery stores and select/top streaming services, $1,500 cap. Add `'2027-Q1': ['groceries', 'streaming']`. MED-HIGH (DoC headline "Chase Freedom Q1 2027 Categories: Grocery & Streaming"; DannyDealGuru). Reported activation start is Dec 15, 2026, but one snippet shows a conflicting date.
- Lyft: 2% total, not 5% (one TPG snippet said 5x, but DoC says Freedom cards were cut to 2x in Apr 2025). Optional.
Sources: https://media.chase.com/news/chase-freedom-2026-q4-categories , https://www.doctorofcredit.com/chase-freedom-5-categories-for-q4-2026-grocery-dining-red-cross/ , https://www.insideflyer.com/posts/chase-freedom-flex-offers-7x-on-dining-in-q4-2026/ , https://www.doctorofcredit.com/chase-freedom-q1-2027-categories-grocery-streaming/ , https://dannydealguru.com/chase-freedom-q1-2027-categories/

## chase_prime_visa: CONFIRMED (MED-HIGH)
$0 fee, Visa. With Prime: 5% Amazon.com, Amazon Fresh, Whole Foods and Chase Travel; 2% restaurants, gas stations, and local transit/commuting; 1% else. No 2026 change was found.
Sources: https://cardcurator.ai/card/prime-visa , https://www.digitaltransactions.net/amazon-offers-richer-rewards-for-its-cobranded-visa-cards/ , https://kiplinger.com/personal-finance/chases-co-branded-amazon-credit-cards-have-both-undergone-a-revamp-including-a-dollar150-bonus

## capital_one_venture_x: CORRECTION NEEDED (minor, MED)
- annualFee 395: confirmed, no increase reported. 10x hotels and rental cars via Capital One Travel: confirmed. $300 Capital One Travel credit `cardmember_year`: confirmed.
- The 5x rule should cover flights and vacation rentals via Capital One Travel. Note text: 'flights and vacation rentals booked through Capital One Travel'.
- Possibly add `{ rate: 5, categories: ['entertainment'], condition: 'Capital One Entertainment purchases' }`. One snippet only, LOW.
- Not a statement credit, FYI: 10,000 anniversary bonus miles each year (about $100). Could be modeled as `{ id: 'anniversary_miles', name: '10,000 anniversary miles', amount: 100, cadence: 'cardmember_year' }` if desired. MED.
- Network: the cards.js value `visa` is not contradicted, and nothing was found on it.
Sources: https://frequentmiler.com/venturex/ , https://nerdwallet.com/credit-cards/reviews/capital-one-venture-x , https://upgradedpoints.com/news/capital-one-venture-x-lounge-access-changes/

## capital_one_venture: CONFIRMED (rates/fee HIGH); possible new credit UNVERIFIABLE
- $95 fee, 2x base, 5x hotels, vacation rentals and rental cars via Capital One Travel: confirmed.
- Reports (DoC, FM, InsideFlyer, MilesToMemories; CreditOdds entry dated 8/1/2026) say a $100 annual "stays credit" is being added for hotel and vacation-rental bookings via Capital One Travel. It would renew each cardmember anniversary with no enrollment. Rollout and status are unclear, and Capital One's benefits page was reportedly not updated. Do NOT add yet, or add with a "rolling out; verify" note. LOW.
Sources: https://www.doctorofcredit.com/reports-capital-one-venture-adding-100-travel-credit-benefit/ , https://frequentmiler.com/capital-one-adding-a-100-hotel-credit-to-the-venture-rewards-card/ , https://www.nerdwallet.com/credit-cards/reviews/capital-one-venture

## capital_one_savor: CORRECTION NEEDED (minor, MED-HIGH)
- $0 fee. 3% dining, entertainment, popular streaming, and grocery stores (excl. superstores like Walmart/Target): confirmed.
- The 5% Capital One Travel rule should read "hotels, vacation rentals and rental cars". ADD `{ rate: 8, categories: ['entertainment'], condition: 'Capital One Entertainment purchases' }`.
- Network: the snippets conflict. Capital One is issuing some new Savor accounts on the Discover network. Existing cards reportedly stay on Mastercard until reissue (WTOP, TheStreet; myFICO thread "My Savor card is now on the Discover network"). Keep `mastercard` with a note, or treat as varies. LOW.
Sources: https://www.nerdwallet.com/credit-cards/reviews/capital-one-savor?trk=cc_lm , https://maxrewards.com/credit-cards/savor-rewards , https://www.travelpirates.com/captains-log/us-capital-one-discover-network-switch-a-travelers-guide-2026 , https://wtop.com/news/2026/03/capital-one-is-now-issuing-credit-cards-on-the-discover-network

## discover_it: CORRECTION NEEDED (fill quarters)
- $0 fee, Discover network, 1% base, 5% rotating with $1,500/quarter cap and activation: confirmed. Capital One says rotating 5% continues after the migration.
- Q4 2026 (Oct 1 – Dec 31): restaurants, entertainment, utilities. Set `quarters: { '2026-Q4': ['dining', 'entertainment'] }` and `quarterNotes: { '2026-Q4': 'Restaurants, entertainment, utilities' }`. HIGH (NerdWallet, DoC, CardRatings). The app has no utilities category, so mention utilities in the note only.
- Q1 2027: not announced in any results. In past years Discover announced in late November or early December.
- After the Capital One platform migration (waves running from July 27, 2026 into 2027; dates vary by account), cardholders reportedly gain 5% on Capital One Travel bookings (hotels, vacation rentals, rental cars) and possibly Capital One Entertainment. This varies per account, so it is best left out or added as a condition note. LOW-MED.
Sources: https://www.nerdwallet.com/credit-cards/news/discover-bonus-categories-q4-2026 , https://www.doctorofcredit.com/discover-q4-2026-5-categories-utilities-restaurants-entertainment/ , https://www.nerdwallet.com/credit-cards/news/discover-rewards-credit-cards-moving-to-capital-one , https://frequentmiler.com/discover-it-cards-moving-to-capital-one-7-27-26-more-bonus-spend-categories-capital-one-offers-access-more/

## wells_fargo_active_cash: CONFIRMED (HIGH)
$0 fee, Visa, unlimited 2% cash rewards. No 2026 change was found.
Sources: https://www.nerdwallet.com/credit-cards/reviews/wells-fargo-active-cash , https://maxrewards.com/credit-cards/active-cash

## wells_fargo_autograph: CONFIRMED (MED-HIGH)
$0 fee, Visa. 3x restaurants, travel, gas stations (and EV charging), transit, popular streaming, and phone plans; 1x else. No 2026 change was found.
Sources: https://www.nerdwallet.com/credit-cards/reviews/wells-fargo-autograph , https://thepointsparty.com/articles/wells-fargo-autograph-review-2026

## boa_customized_cash: CONFIRMED (MED)
$0 fee, Visa. 3% choice category: gas and EV charging, online shopping (including cable, streaming, internet and phone plans), dining, travel, drugstores, or home improvement/furnishings. 2% grocery stores and wholesale clubs. The 3% and 2% tiers share a $2,500/quarter cap, then 1%. No category change was found for 2026.
- Optional note on the `online` choice: "includes cable, streaming, internet and phone plans".
- FYI: Preferred Rewards became "BofA Rewards" on May 27, 2026, with a 10–75% bonus by tier. That is not modeled.
Sources: https://www.doctorofcredit.com/starts-june-1st-bank-of-america-increased-cashback-rates-for-one-year-on-unlimited-customized-cash-rewards-cards-200/ , https://upgradedpoints.com/news/bank-of-america-customized-cash-rewards-categories/ , https://card-savvy.com/learn/bofa-rewards-2026-changes

## usbank_altitude_go: CORRECTION NEEDED (MED-HIGH)
- $0 fee, Visa. 4x dining (incl. takeout and delivery) and 2x groceries, grocery delivery, gas and EV charging, streaming: confirmed (a May 2026 snippet).
- ADD a cap to the 4x rule: `cap: 'Up to $2,000 in dining purchases per quarter, then 1x'`. This has been in effect since Apr 14, 2025. HIGH.
- ADD credit `{ id: 'streaming', name: 'Streaming credit', amount: 15, cadence: 'cardmember_year', note: 'Once per 12-month period after 11 consecutive months of eligible streaming purchases (e.g. Netflix, Hulu)' }`. MED. The terms are confirmed, but no 2026-dated source confirms the credit still exists, and the cadence is "per 12-month period" rather than strictly a calendar or cardmember year.
Sources: https://upgradedpoints.com/news/us-bank-altitude-go-changes , https://awardwallet.com/news/credit-cards/changes-to-us-bank-altitude-go/ , https://www.doctorofcredit.com/major-changes-to-u-s-bank-altitude-connect-card , https://stage02.priceless.com/USBAltitudeGoStreaming
