# Credit Card Rewards App: Research Summary and Build Recommendations

Researched 2026-11-16. This file pulls together the four detailed reports in this folder:

| File | What it covers |
|---|---|
| [01-cardpointers.md](01-cardpointers.md) | CardPointers in depth: company, features, pricing history, ratings, complaints, timeline |
| [02-competitors.md](02-competitors.md) | ~25 competitors and adjacent tools, comparison table, shutdowns/acquisitions, international |
| [03-technical.md](03-technical.md) | Card data, merchant category codes, bank linking, card-linked offers, iOS/Android limits, AI, compliance, architecture |
| [04-market.md](04-market.md) | Market size, monetization economics, regulation, user pain points, go-to-market, risks |
| [05-build-roadmap.md](05-build-roadmap.md) | Building the next features: hosting, push reminders, nearby stores, accounts/household sharing, bank linking, native app, card-data upkeep, payments; phased roadmap and running costs |
| [06-card-data-check-chase-capitalone-others.md](06-card-data-check-chase-capitalone-others.md) | Check of the app's card data: Chase, Capital One, Discover, Wells Fargo, Bank of America, U.S. Bank |
| [07-card-data-check-amex-citi.md](07-card-data-check-amex-citi.md) | Check of the app's card data: Amex and Citi, plus Costco acceptance |

## Read this first: research limits

- Most primary sites could not be loaded in this session (cardpointers.com, apps.apple.com, plaid.com, consumerfinance.gov and others), and **Reddit was not reachable**. Most facts come from search-result summaries of the cited pages. The detail files mark unconfirmed items `[U]` / `[verify]`.
- Many review sites earn affiliate commissions or are written by competitors (Kudos in particular), so their verdicts are biased.
- Check prices, ratings and user counts on the live pages before putting them in a pitch or financial model.
- The "Recommendations" section at the end is analysis, not sourced fact.

---

## 1. CardPointers in one page

- **Who:** Emmanuel Crouvisier, a bootstrapped indie developer. Started in 2019 and full-time since 2022. In practice a one-person company. No published revenue or user totals.
- **What it is:** you pick the cards you hold from a database of about 5,000 cards from 900 banks. **No bank linking and no transaction import.** It tells you the best card for a store, category or your current location, using point values you can adjust.
- **Main paid feature: card-linked offers.** A browser extension (Chrome/Safari/Firefox) adds every Amex, Chase, Citi, Bank of America, Wells Fargo and US Bank offer to every eligible card while you're logged in to the bank's site. Since v8 (Sept 2026) the app can also log in itself and sync offers every night, storing your bank passwords in the iPhone Keychain.
- **Apple-first:** iPhone, iPad, Mac, Watch, Vision Pro, CarPlay, widgets, Live Activities ("AutoPilot" shows the best card for the nearest store), Siri/App Intents, Apple Intelligence "Ask AI", and Visual Intelligence (point the camera at a storefront). Android exists but is weaker and was described as a web wrapper as recently as 2026.
- **Also:** annual-fee reminders, credit/benefit tracking, sign-up bonus tracking, Chase 5/24, up to 6 household profiles, an MCP server for Claude/ChatGPT, and a command-line tool.
- **Pricing:** free tier plus CardPointers+. The price has risen steadily from about $40/yr to **$99.99/yr or $299.99 lifetime from Oct 1, 2026**, with frequent 50%-off sales. Older pages show $59.99–$89.99, so sources conflict on history.
- **How it grows:** a large network of points bloggers and creators with commissioned discount links, plus podcasts and 9to5Mac coverage. Revenue is mainly subscriptions; no evidence of earning from card applications.
- **Ratings:** iOS about 4.7 stars from about 9–10K ratings. Google Play about 4.3 stars, about 1.2K reviews, 50K+ downloads.
- **Recurring complaints:** price increases; free tier too limited; poor value for people with 1–2 cards; Android second-class; offer auto-add breaks when banks change sites (Amex throttled multi-card adding in 2026); lag with many offers; occasional lost data; unease about stored passwords; no real spending data, so no automatic minimum-spend or credit-usage tracking.

**What its moat is:** offer automation across 6 issuers, deep iOS integration, and the blogger affiliate network. The card database itself is not a moat; several competitors and APIs match it.

---

## 2. Competitor map

| App | What it does | Data approach | Price (2026, approx.) | Notes |
|---|---|---|---|---|
| **CardPointers** | Best card + offers + benefits | Manual card list; extension or on-device login for offers | $99.99/yr, $299.99 lifetime | Bootstrapped, Apple-first |
| **MaxRewards** | Best card + offer auto-activation (~8 issuers) + spend tracking | Bank logins (Plaid + its own login connectors) | Free; Gold is pay-what-you-want, sources say ~$54–108/yr | $3M seed (2021). Sync breakage is the top complaint; Android ~3.6 stars. User count conflicts (125K self-reported vs 400K–900K elsewhere) |
| **Kudos** | Browser extension that picks the best card at online checkout, plus iOS app | User picks cards; linking optional | Free; Premium ~$72/yr (own blog, unverified) | Best funded (~$17M+, $10.2M Series A led by QED). Earns from card referrals and shopping cashback |
| **Uthrive** | Best card + "you used the wrong card" alerts | Account linking | Free | Launched 2021; current activity unclear |
| **The Points Guy app** | Card advisor + points net worth | Account sync | Free | Affiliate-funded, iPhone only |
| **TravelFreely** | Churning tracker (5/24, fees, bonuses) | Manual | Free | Affiliate-funded |
| **AwardWallet** | Loyalty balances and expirations (600+ programs) | Program logins | Plus $49.99/yr | Expiration alerts became paid-only (reported Oct 2026). American Airlines blocked it |
| **point.me / Roame / Seats.aero** | Award flight search | n/a | ~$110–260/yr | Adjacent; point.me partnered with TPG |
| **Many small 2025–26 apps** | Kaldex, Cardzen, kardfolio, Credit Buddy, RewardTide, Pointalize, etc. | Mostly "no bank linking" | Various | No traction data found. The low end is crowded |

**Built-in threats:** Google Chrome autofill shows card benefits for 100+ US cards at online checkout but does not rank cards. Apple Wallet shows rewards before checkout but does not pick a best card. The Amex app now tracks Platinum credits itself. Citi agreed to buy Kard (personalized offers). If Apple or Google start ranking cards, the basic "which card" feature becomes a commodity.

**What happened to past players:** Wallaby was bought by Bankrate (2014) and folded into card referrals. Mint was shut down (2024) and pushed users to Credit Karma. Curve (UK) was bought by Lloyds (announced Nov 2025, ~£120M reported). The pattern: these apps get bought by affiliate publishers or banks, or stay small and bootstrapped.

**International:** India is active (SaveSage claims 200K users; CRED is big but is a bill-pay app). No strong which-card app found in Canada, the UK or Australia.

---

## 3. Market and money

- **Size:** about 175–216M US adults have a credit card (sources conflict), averaging 3.7 active cards. Over 90% of card spending is on rewards cards (CFPB). Rewards earned: over $40B in 2022; about $47B earned and $43B redeemed in 2024 (second-hand).
- **Who actually benefits:** people who pay in full earn 73% of rewards (CFPB 2023). They are the paying customers for an optimizer, a smaller and better-off group.
- **Enthusiast core:** r/CreditCards ~1.2–1.6M members, r/churning ~600–676K (third-party estimates). Treat the hardcore US market as high hundreds of thousands to low millions of people; that's a judgment, not a measured figure.
- **Subscription benchmark:** enthusiasts pay **$50–110/yr**. Lifetime plans and 30–50% sales are normal.
- **Card affiliate bounties:** blogs claim $50–300+ per approved card; none of it is confirmed by issuers, and premium-card deals go mostly to big publishers. NerdWallet's credit card revenue fell 24% in Q4 2025, a sign this channel is getting harder.
- **Card-linked offer networks** (Cardlytics, Kard) are shrinking or being bought by banks. Not a near-term revenue source for a startup.
- **Trust:** recommendations paid per approval are widely distrusted (TPG/Red Ventures critique). Being visibly unbiased is a real selling point.

## 4. Things that change the picture in 2025–2026

- **Coupon-book premium cards:** Chase Sapphire Reserve went to $795/yr and Amex Platinum to $895/yr, each with many small monthly or half-yearly credits. Users are building their own spreadsheets to track them. This is the clearest new demand signal.
- **Bilt 2.0 (Feb 2026):** new issuer and confusing rent-points rules, which suits a calculator.
- **Devaluations** (Citi transfer ratios, US Bank Altitude Reserve, Amex abroad): a "what changed on my cards" feed is an engagement hook.
- **Open banking rule (Section 1033):** blocked in court since Oct 2025 and being rewritten; no guaranteed free bank data access. JPMorgan now charges aggregators like Plaid, and those costs may be passed on.
- **Amex Offers terms (updated July 2026)** prohibit giving login credentials to third parties to enroll in offers unless Amex authorizes it. This directly affects the CardPointers v8 and MaxRewards approach.
- **Visa/Mastercard settlement** (preliminary approval June 2026) may let merchants decline some premium cards. **Credit Card Competition Act** reintroduced, no vote yet.

## 5. How these apps are built (short version)

- **Two architectures:** (a) a rules engine over a curated card database plus the cards the user says they hold (CardPointers, Kudos), which is cheap and private; (b) bank-linked (MaxRewards), which is more powerful but costly, fragile and riskier.
- **Card data is the core job.** Each card needs categories, multipliers, caps, exclusions, rotating categories with activation, credits with reset schedules, and fees, all with start and end dates. Commercial APIs exist (Rewards CC API, StackEasy) but their status is unverified. Expect an in-house editorial process with an LLM extracting from issuer terms and a human reviewing.
- **Merchant categories are messy.** The category code comes from the merchant's payment processor, so the same brand can code differently by location (a Target coded as grocery in one town and discount store in the next). Issuers add their own exclusions (warehouse clubs, Target/Walmart). You need a merchant → likely code → issuer-specific override layer, improved by user reports.
- **Bank linking:** Plaid, MX, Finicity, Akoya, Teller. They give balances and transactions but **not rewards balances or card offers**. MX returns the raw category code; Plaid's is unconfirmed. Pricing needs quotes; third-party estimates run about $0.25–1.50 per account per month.
- **Card-linked offers:** the safest automation runs in the user's own logged-in browser session (CardPointers extension). Storing bank logins is the most fragile and riskiest approach. No issuer lawsuits found, but pushback so far is technical (site changes, bot detection).
- **Phones:** no third-party app can read Apple Wallet cards or choose the Apple Pay card. Apple's FinanceKit covers only Apple Card/Cash/Savings in the US. iOS allows 20 watched locations per app, Android 100. Widgets, Watch, Siri/App Intents and Live Activities are the in-store surfaces.
- **AI:** use an LLM to understand the question and explain the answer, but compute rewards with a fixed rules engine. Also useful for extracting card terms and analyzing statements.
- **Compliance:** the FTC Safeguards Rule likely applies (written security program, MFA, breach reporting). Don't store card numbers or bank passwords if you can avoid it. SOC 2 is expected by data partners. Several state privacy laws treat location as sensitive.

---

## 6. Gaps a new app could fill

1. **Credit and benefit tracking for premium cards**, ideally confirmed from actual transactions rather than manual check-offs.
2. **Offer automation that's transparent about failures** and doesn't hold bank passwords.
3. **Unbiased recommendations**, with any affiliate links kept separate from the ranking.
4. **Households and couples**: shared wallet, both people's bonuses, application rules and fees.
5. **A real Android app** (CardPointers is weak there; MaxRewards' Android rating is ~3.6).
6. **Churning workflow**: issuer application rules, minimum-spend progress from real transactions, fee-time keep/downgrade/cancel decisions.
7. **Missed-rewards reports** ("you used the wrong card; that cost you $X this month").
8. **Linking points to bookings**: what you hold, transfer partners, current transfer bonuses.
9. **Markets outside the US** (Canada, UK, Australia), with smaller rewards economics.
10. **Small business cards** and expenses. No dedicated competitor found.

---

## 7. Recommendations (analysis, not sourced)

**Don't build a straight CardPointers clone.** Its core is matched by many free or cheap apps, and its advantages (6-issuer offer automation, years of iOS polish, a blogger affiliate network) take years to copy. Pick a sharp angle.

Three angles worth considering:

- **A. "Get your money's worth from premium cards."** Track credits and benefits for CSR, Amex Platinum/Gold, Venture X and similar, with reminders before each credit resets and a running "fee paid vs. value used" figure per card. Optional bank linking confirms credits automatically. It ties to the strongest 2025–26 demand signal and the people who pay $800/yr fees will pay $50–100/yr to recover them. Risk: Amex and Chase are building tracking into their own apps.
- **B. "Household wallet."** Built from the start for two people: shared best-card answers, both people's bonuses and application rules, fee calendar. Less crowded and harder for issuers to copy, since they only see their own cards.
- **C. "Android-first and privacy-first."** Fix the platform CardPointers neglects, with no bank linking needed. Easiest to start, least defensible long term.

A and B combine naturally. Whichever you pick, a sensible order is:

1. **MVP (no bank linking):** pick your cards from a curated set of the ~150–300 most-held US rewards cards; best card by merchant, category and nearby place; credit/benefit tracker with reminders; quarterly-category activation reminders; widgets. An "ask which card" assistant can sit on top of the rules engine.
2. **Phase 2:** optional Plaid (or MX, for category codes) linking for missed-rewards reports, minimum-spend progress and automatic credit confirmation; browser extension for online checkout; household sharing if not already in.
3. **Phase 3 (higher risk):** card-offer auto-add, only inside the user's own logged-in browser session; never stored bank passwords, especially given the July 2026 Amex terms.

**Business model:** subscription at about $50–80/yr with a useful free tier (undercutting CardPointers' $99.99), possibly a lifetime option. Keep any card-application affiliate links clearly separate from recommendations and say so publicly.

**Go-to-market:** what worked for CardPointers was points bloggers and creators with commissioned discount codes; for Kudos, an SEO blog and a cashback hook. Reddit communities restrict self-promotion, so take part in discussions rather than advertising.

## 8. Open questions to check before committing

1. Check CardPointers' and MaxRewards' current pricing and features yourself on their live sites and app listings.
2. Read r/churning and r/CreditCards threads on these apps; this research couldn't reach Reddit.
3. Get quotes from Plaid and MX, and confirm whether Plaid returns raw merchant category codes.
4. Contact Rewards CC API and StackEasy about card data licensing; confirm they are active.
5. Have a lawyer review issuer terms (especially Amex Offers, July 2026) before building any offer automation.
6. Watch for the new Section 1033 proposal (sent to White House review Aug 2026) and whether it allows bank fees.
7. Decide US-only vs. another market (Canada looks open).
