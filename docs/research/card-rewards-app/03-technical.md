# 03 — Technical research: building a credit card rewards optimizer (CardPointers / MaxRewards / Kudos-style)

Research date: 2026-11-16. Method: web search plus fetches of a few primary pages. Some primary sites (plaid.com, teller.io) were blocked in this research session, so Plaid and Teller details come from search snippets and third-party summaries. Items marked **[verify]** are unconfirmed or come from secondary or vendor sources. Items marked **[author knowledge]** come from general platform knowledge and were not re-checked against a source during this research.

---

## 0. How the three reference products work (observed)

| App | Core mechanism (per sources) |
|---|---|
| **CardPointers** | Mobile app with a curated card database. The "CardPointers X" browser extension auto-adds Amex, Chase, BofA, Citi, Wells Fargo and US Bank offers **while the user is logged in to the bank's site**, with no credentials shared with CardPointers. Offers sync to the app, and the extension suggests the best card on merchant sites. It needs "access your data for all websites". Release notes show repeated fixes after bank-side changes, e.g. Chase on 7/23/2025. [S20, S21] |
| **MaxRewards** | Links accounts through Plaid **plus "proprietary connectors"**, i.e. credential-based logins. Its FAQ says Plaid cannot read Chase reward balances, rewards on transactions, or Chase Offers, and cannot auto-activate offers. The paid Gold tier auto-activates offers on each sync. The company says it does not store credentials; a competitor claims it does **[verify]**. The help centre documents login loops (Citi, WF, Amex in 2024) and warns that repeated attempts can trigger password resets. [S22–S25] |
| **Kudos** | Browser extension (Chrome, Edge, Safari) plus an iOS app. The user picks the cards they hold, and the extension recommends one at checkout and can autofill card details. It adds its own "Boost" cashback at partner merchants (affiliate revenue). [S26–S28] |

These point to two architectural families:
1. **Rules engine over a curated card database plus user-declared wallet.** This is cheap, needs no account linking, and is how CardPointers and Kudos start.
2. **Account-linked.** Aggregators and/or credential connectors read balances, transactions and offers. This is more powerful but costs more and is fragile, with more legal exposure (MaxRewards).

---

## 1. Card product data

### What you need per card
- Earning rules: category, multiplier, cap (amount and period), base rate, and the definition of each category (which MCCs, plus exclusions such as "excludes Target/Walmart" or "excludes warehouse clubs").
- Rotating or quarterly categories with activation requirements. Example: Chase Freedom Q4 2026 is 5% on grocery stores (excluding Walmart and Target), dining, and American Red Cross, on up to $1,500 combined, with activation by Dec 14, 2026. Chase activation is retroactive within the quarter; Discover's is not. [S30–S32]
- User-selectable categories (e.g. "choose your 3%"), card-specific portals (e.g. "5x on travel booked via portal"), and payment-method conditions (mobile wallet, specific network).
- Point valuations (cents per point, which is subjective), annual fee, credits/benefits with reset cadence (monthly, semiannual, calendar or cardmember year), sign-up bonus, and foreign transaction fee.

### Sources
| Source | What it is | Notes |
|---|---|---|
| **"Rewards Credit Card API" (Rewards CC API)** | Commercial API listed on Product Hunt; claims coverage of 99.5% of the US market, with bonuses, benefits, bonus spend categories and card images. | The listing is about two years old and its current status is unknown **[verify]**. [S1, S2] |
| **StackEasy credit card rewards API** | Claims 4,211 US cards and 2,828 "verified reward structures", with caps, conditions and effective point values. Access needs manual approval, and there is a free tier of about 1,000 calls/month. | Listed on an MCP server directory. Vendor claims only; it says data comes from a scraper and LLM-extraction pipeline with human review **[verify]**. [S3] |
| **Engine by MoneyLion (formerly Even Financial)** | Credit card **marketplace/affiliate** API. It returns offers (ITA or personalised) with issuer, click URL, card image, benefit categories and a recommendation score. | This is an affiliate offer feed, not a full earning-rules database. Ordering can be influenced by compensation, and specific disclosure text is required. Ownership is described inconsistently across sources **[verify]**. [S4, S5] |
| **Affiliate networks / publishers** (Bankrate/Red Ventures, CardRatings, NerdWallet-style partners) | Card data and links bundled with affiliate relationships. | I did **not** find public, documented developer APIs from Bankrate or CardRatings during this research. Assume a partnership or BD conversation is needed **[verify]**. |
| **Manual curation from issuer T&Cs** | Analysts maintain a schema from issuer pages and pricing/terms PDFs, assisted by LLM extraction (see §6). | Most enthusiast apps appear to do this at least partly. This is inference from the products' behaviour, not a documented fact. |

**How often it changes.** Rotating categories change quarterly. Card launches and refreshes, credit changes and fee changes happen many times a year across the market, and limited-time and targeted offers change weekly. No source quantified the overall change rate. Plan for a **continuous** editorial process with versioned rules (effective_from/effective_to), not a one-time import.

**Recommendation:** start with the roughly 150–300 most-held US rewards cards, curated in-house, using a structured schema plus LLM-assisted T&C extraction with human review. Evaluate a commercial API for long-tail coverage. Use an affiliate feed (e.g. Engine) only for "apply for card" monetisation.

---

## 2. Merchant category data (MCC)

### How MCCs work
- An MCC is an ISO 18245 four-digit code assigned to a merchant location by its **acquirer** and carried in the authorisation and clearing messages. Issuers decide rewards categories from the MCC, sometimes with merchant-level overrides. [S6, S7, S8]
- Consequences:
  - **The same brand can code differently by location.** One cited example: a Target in Deerfield Beach, FL coded 5411 (grocery) while one in Coral Springs coded 5310 (discount store). Walmart Neighborhood Markets often code as grocery. [S9, S10]
  - **Issuers use explicit exclusions on top of the MCC.** Chase "grocery stores" excludes superstores and warehouse clubs. Capital One excludes Walmart and Target. Amex US Supermarkets excludes superstores (Target, Walmart) and warehouse clubs (BJ's, etc.) per secondary sources **[verify against Amex terms]**. Bank of America is cited as an exception that counts Costco and BJ's as grocery. [S9, S10, S11]
  - Online versus in-store purchases, third-party processors (Square, PayPal, Toast) and delivery apps can change the code.
- So the optimizer needs a **merchant → (MCC, issuer-specific overrides)** layer, not just MCC → category.

### Merchant → MCC lookup sources
| Source | Notes |
|---|---|
| **Visa Merchant Search API** (Visa Developer) | Community posts describe looking up a merchant's name, address and MCC. Access requires Visa Developer onboarding and likely production approval **[verify terms for consumer apps]**. [S12] |
| **Visa Supplier Matching Service** | Aimed at B2B supplier acceptance matching. [S13] |
| **Mastercard Places / Locations API** | Has an MCC lookup endpoint (`GET /merchant-category-codes/mcc-codes/{mcc}`) and merchant location search. [S14] |
| **Mastercard Merchant Identifier API** | Turns raw descriptors into standardised merchant records with MCC. Useful for cleaning transaction descriptors. [S15] |
| **Aggregator transaction data** | **MX** documents a `merchant_category_code` field (ISO 18245) on transactions (integer in Atrium/Nexus, string in MDX On Demand). [S16] **Plaid** steers developers to its own `personal_finance_category` taxonomy (about 16 primary and 104 detailed categories). I found no confirmation that Plaid Transactions returns raw MCC **[verify with Plaid]**. [S17, S18] Akoya offers its own three-level enrichment categories; MCC exposure is unconfirmed. [S19] |
| **Crowdsourcing** | Users report "this charge at X earned 4x / coded as Y". This is how enthusiast communities (FlyerTalk, myFICO threads, AwardWallet's merchant lookup tool) build knowledge. Users' own linked transactions are the best ground truth. [S10, S11] |
| **POI datasets** | Google Places, Apple MapKit/Maps POI categories, Foursquare, OpenStreetMap give a **place type**, not an MCC. Map place type to a probable MCC, then refine with crowdsourced or transaction evidence. Check each provider's ToS on storing and caching POI data **[verify]**. |

### Location-based "which card here?" detection
- **iOS:** Core Location region monitoring is limited to **20 regions per app**. The usual workaround is to keep the nearest 20 POIs and re-register them on significant location change. It needs "Always" location permission for background triggers. One developer reported fewer events with the newer `CLMonitor` API than with the legacy `CLCircularRegion` (anecdotal). [S33–S35]
- **Android:** up to **100 geofences per app per device user**. Background geofencing needs `ACCESS_BACKGROUND_LOCATION` on Android 10+, and on Android 8+ background events are batched (several times per hour), so latency can be minutes. [S36, S37]
- **Practical pattern:** show a notification or widget suggestion on POI dwell, plus a manual "I'm at…" search with nearby POIs, which is more reliable. Expect App Review and Play scrutiny of "Always"/background location. Justify it clearly or make it optional.

---

## 3. Account linking (aggregators) and Section 1033

### Vendors
| Vendor | Notes |
|---|---|
| **Plaid** | Largest US coverage. Transactions covers credit-card accounts and uses the `personal_finance_category` taxonomy (v2 opt-in). Raw MCC is not confirmed (see above). Pricing: a free "Launch"/limited-production tier and usage-based plans; third-party estimates put a successful link around $0.30–$1+, with Transactions typically billed per connected account per month **[verify — plaid.com could not be fetched]**. Has bank data-access agreements with Chase and Amex. [S17, S38, S39, S44] |
| **MX** | Exposes `merchant_category_code` (ISO 18245). Quote-only pricing; one third-party claim says contracts start around $5k/month **[verify]**. [S16, S39] |
| **Finicity (Mastercard Open Banking)** | Quote-only pricing **[verify]**. [S39] |
| **Akoya** | Bank-owned, API-only (no screen scraping) data access network. Covered by the JPMorgan fee agreements. [S19, S41] |
| **Teller** | Developer-friendly with published per-connection pricing and free development use, per third-party comparisons **[verify — teller.io could not be fetched]**. [S39] |

**What you get (and do not get):** balances, credit limits, posted and often pending transactions, merchant name/entity, aggregator categories, and sometimes MCC (MX). You generally do **not** get issuer rewards balances, points earned per transaction, or card-linked offers through standard aggregator APIs. MaxRewards' Chase FAQ states this explicitly for Plaid. [S23] This gap is why some apps resort to credential-based "connectors".

### CFPB Section 1033 ("Personal Financial Data Rights") — status as of Nov 2026
- Finalised Oct 2024, with phased compliance originally starting **April 1, 2026**. [S40]
- Banking groups sued in E.D. Kentucky. The CFPB under the new administration moved to reconsider and issued an ANPRM on **Aug 22, 2025**. A **preliminary injunction (Oct 2025)** bars enforcement during reconsideration, so the April 2026 date passed without being enforced. [S40, S42]
- The Sixth Circuit held the related appeal in abeyance (**Mar 30, 2026**) pending the new rule. [S42]
- The CFPB shifted to a full rulemaking (Jan 2026) and **sent a reconsideration NPRM to OIRA in Aug 2026**. [S43, S44] I could **not** confirm whether it has since been published in the Federal Register **[verify]**.
- **Bank fees:** In July 2025 JPMorgan sent aggregators pricing sheets for data access. By Sept–Nov 2025 it had reached paid agreements with Plaid and reportedly Yodlee, Morningstar and Akoya, with undisclosed pricing (reported as "fractions of a cent per data pull"). Plaid said it would not pass the fees to its clients. Whether banks may charge fees is a live question in the 1033 rewrite. [S41, S45, S46]
- **Implications:** There is currently no enforceable federal right forcing banks to give free API access. Access depends on aggregator–bank bilateral deals, and costs could rise if fees spread. Credential-based scraping is being phased out by large banks in favour of OAuth/API connections, which makes "proprietary connectors" riskier over time (inference).

---

## 4. Card-linked offers (Amex Offers, Chase Offers, Citi Merchant Offers, BofA Deals)

**How apps automate enrollment today**
1. **Browser extension in the user's own logged-in session** (CardPointers X). The extension runs on the bank's domain and clicks or calls the same internal endpoints the site uses. No credentials leave the browser. It breaks when banks change their front end. [S20, S21]
2. **Server-side or app-side scripted login with user credentials** (MaxRewards "proprietary connectors"). This is the most fragile approach: MFA, login loops and bot detection can lock users out. [S22–S25]

**Legal and ToS risk (analysis, not legal advice):**
- Bank online-banking agreements generally prohibit automated access or scraping and sharing credentials with third parties **[verify specific issuer ToS text — not fetched]**. Breaking that can lead to account restrictions for users and, for the app, potential CFAA, state computer-access, or contract claims. I found **no reported lawsuits** by Amex or Chase against CLO-automation apps in this research; absence of evidence is not evidence of safety.
- Credential storage raises your security obligations a lot (see §7) and may conflict with the post-1033 direction toward tokenised access.
- Issuer pushback seen so far is **technical** (front-end changes, bot detection, login challenges), visible in CardPointers and MaxRewards release and help notes. [S21, S24]
- Amex Offers are also moving into AI channels: Amex has agentic tools in Perplexity using Plaid-connected accounts, and there are unverified reports of an OpenAI integration for offers. [S47, S48]

**Official alternatives (the app becomes the "publisher"):**
| Network | Notes |
|---|---|
| **Cardlytics** | Large bank-channel CLO network. Launched the **Cardlytics Rewards Platform** (GA May 2025) for non-bank publishers. [S49, S50] |
| **Kard** | API-first CLO platform for fintechs and modern issuers (claims 40+ partners and 61M+ cardholders; vendor figures). [S51] |
| **Figg, Rakuten/Dosh, others** | Mentioned in the brief but **not verified** in this research **[verify]**. Rakuten's card-linked "in-store offers" and Dosh, which was acquired by Cardlytics in 2021 **[author knowledge — verify]**, are other models. |

These networks track spend through card enrollment with the network (Visa/Mastercard transaction data). They do **not** activate issuer offers like Amex Offers. They are a separate revenue stream (you earn a share of merchant-funded cashback).

---

## 5. Mobile platform capabilities and limits

**iOS** [author knowledge for the general APIs; verify specifics in current Apple docs]
- **WidgetKit** home and lock screen widgets ("best card nearby", "credits expiring"). Widgets are interactive since iOS 17 via App Intents.
- **App Intents / Siri / Shortcuts / Spotlight**: "Which card for Whole Foods?" can be an App Intent that returns a result card. App Intents also feed Apple Intelligence and Siri integrations on newer iOS.
- **Live Activities**: e.g. tracking a quarterly cap or "you're at Costco — use X".
- **watchOS**: widget and complication showing the card for the current location.
- **Apple Wallet:** third-party apps **cannot read the user's payment cards** or transactions from Wallet. PassKit read access is limited to passes your own app or team issued, and adding payment cards needs an issuer-only entitlement. [S52, S53] There is also no API to choose which card Apple Pay uses; the user picks it at checkout.
- **FinanceKit:** the exception. With user consent, apps get balances and transactions, delivered on-device with background sync. **US (iOS 17.4+):** Apple Card, Apple Cash, Savings only. **UK (iOS 18.4+):** accounts connected to Wallet via open banking, including Barclays, Barclaycard, First Direct, Halifax, HSBC, Lloyds, M&S Bank, MBNA, Monzo, Nationwide, NatWest, RBS and Santander. It needs an **entitlement request**, an App Store Finance-category listing, and an app providing financial management tools. In the US it does **not** cover Chase, Amex or other third-party cards as of the Apple page fetched [S54]. Found no 2026 US expansion **[verify]**.
- **NFC:** Core NFC is not a path to read EMV payment cards in App Store apps (forum questions show no sanctioned route) **[verify]**. [S55]

**Android** [author knowledge; verify]
- Glance/App Widgets, Wear OS Tiles/Complications, App Actions / Gemini integrations, and ongoing notifications as the closest equivalent to Live Activities.
- Google Wallet APIs let issuers and businesses **add** passes. There is no general API to read other cards' payment data **[verify — no Google doc found in this research]**.
- Geofencing: 100 per app (see §2).

---

## 6. AI / LLM features
Practical uses (design suggestions, not sourced claims):
1. **Natural-language "which card for X?"** The LLM resolves the merchant (name → POI/brand → probable MCC → issuer overrides) and then calls the **deterministic rules engine** through tool or function calling. Never let the LLM compute rewards by itself; it should explain the engine's output.
2. **T&C and benefit-guide parsing:** extract earning rules, caps, exclusions and credit reset cadence from issuer PDFs into a JSON schema. Human review is required, and changes can be flagged by diffing new extractions against the current rules (monitor issuer pages).
3. **Transaction/statement analysis:** "you earned 1x at Costco on Card A; Card B would have earned 2%" (missed-rewards report). This needs linked transactions or uploaded statements (PDF/CSV parsing).
4. **Offer matching:** summarise and dedupe card-linked offers, and match them to past spend.
5. **Merchant-coding knowledge base:** cluster crowdsourced data points into "Merchant X codes as grocery for Amex, not Chase".

Considerations: send minimal PII to LLM providers (strip account numbers), use zero-retention or enterprise API terms, cache answers per (merchant, wallet hash), and evaluate hallucination on a golden test set of merchant/card cases. Apple's Nov 2025 guideline update requires clear disclosure when sharing personal data with third parties, **including third-party AI** **[verify exact wording]**. [S56, S57]

---

## 7. Security and compliance
- **GLBA / FTC Safeguards Rule:** non-bank fintechs "significantly engaged in financial activities" are generally FTC-covered financial institutions. They need a written information security program, a qualified individual, risk assessment, encryption, **MFA**, vendor oversight, and (since the 2023 amendment) **notification to the FTC of breaches affecting 500+ consumers**. Whether a pure rewards optimizer is a "financial institution" depends on facts; aggregating account data likely counts. Get counsel **[verify]**. [S58, S59]
- **GLBA Privacy Rule:** privacy notice and opt-out obligations for sharing nonpublic personal information (NPI) with non-affiliated parties (relevant if monetising via affiliates or data) **[author knowledge — verify]**.
- **State privacy laws:** California, Oregon and Minnesota (and now Connecticut and Montana after amendments) lack a broad **entity-level** GLBA exemption, so non-NPI data (marketing, device, location) is still covered. Location data is "sensitive" in several states and needs opt-in consent. [S60, S61]
- **Aggregator requirements:** Plaid, MX and others run partner security reviews, and banks' data-access agreements impose security questionnaires. **SOC 2 Type II** is not legally required, but in practice it is expected by data partners, CLO networks and B2B partners **[industry practice; verify per partner]**.
- **Credential storage:** avoid it. If unavoidable, keep credentials in an HSM/KMS-backed vault, never log them, and consider on-device-only storage. This is the single biggest risk multiplier.
- **Card numbers:** do not store PANs (avoids PCI DSS scope). The Kudos-style autofill increases PCI and security exposure.
- **App Store:** guideline 5.1.1(ix) treats banking and financial services as highly regulated, and Apple expects such apps to be submitted by the legal entity providing the service **[verify current text]**. The Nov 2025 update tightened third-party data-sharing disclosure. FinanceKit has its own entitlement terms (§5). [S56, S57, S54]
- **Advertising/affiliate:** card affiliate flows carry UDAAP and marketing disclosure obligations (Engine's compliance guidelines require specific disclosures). [S5]

---

## 8. Reference architecture and MVP stack

```
[iOS app (SwiftUI) + widgets/App Intents/Watch]   [Android (Kotlin/Compose) — phase 2]
[Browser extension (MV3, TypeScript): checkout card suggestion; optional offer auto-add in user session]
            │  HTTPS (auth: Sign in with Apple/Google, passkeys; JWT)
            ▼
API gateway / backend (TypeScript/Node or Python FastAPI)
 ├─ Rules engine (deterministic): wallet × merchant → ranked cards (multiplier, caps used, point value, offers)
 ├─ Card catalog service (versioned rules: effective dates, rotating categories, credits)
 ├─ Merchant resolver: name/POI → brand → MCC distribution → issuer overrides (crowdsourced + transaction evidence)
 ├─ Aggregation adapter (Plaid first; MX for MCC if needed) + webhooks → transaction ingest
 ├─ Offers service (user-submitted / extension-synced issuer offers; CLO network adapter later)
 ├─ LLM service (tool-calling over rules engine; T&C extraction pipeline with human review queue)
 └─ Notifications (APNs/FCM), cap/credit reminders
Data: Postgres (catalog, users, rules; JSONB for rule DSL), Redis (cache), object store (T&C PDFs),
      KMS-encrypted columns for tokens; audit log; analytics (privacy-preserving)
Admin/CMS: internal tool for card editors (Retool or a small Next.js admin)
Infra: managed cloud (AWS/GCP) or Supabase/Render for MVP; IaC; SOC 2 tooling (Vanta/Drata-type) when partners require it
```

**MVP scope (lowest cost and risk):**
1. Manual wallet: the user picks cards with no linking. Curated catalog of the top roughly 200 cards with rotating categories and credits tracking.
2. Merchant search plus nearby POIs (MapKit/Google Places) mapped to the best card, using an issuer-override table.
3. Widgets, Siri/App Intents, Watch, and reminders (quarterly activation, expiring credits).
4. LLM "ask which card" over the rules engine.
5. Phase 2: Plaid-linked transactions for a missed-rewards report and cap tracking. Browser extension for checkout suggestions. Affiliate card recommendations (Engine) for revenue.
6. Phase 3 (higher risk): issuer offer automation via in-session extension only, not stored credentials. CLO network publisher integration (Cardlytics Rewards Platform or Kard).

**Rough cost drivers** (orders of magnitude; no verified price sheets):
- **Card data curation:** people (editors and analysts) are the largest ongoing cost. A commercial card API licence is quote-based.
- **Aggregator fees:** per linked account and per month, scaling with users who link. Possible pass-through of bank data fees in the future (JPMorgan precedent).
- **POI/Maps APIs:** per-request pricing (Google Places). Apple MapKit is free within Apple's quotas **[verify]**.
- **LLM inference:** per-token. Keep it low by caching and by using the LLM only for language and extraction, not routine lookups.
- **Compliance:** SOC 2 audit and tooling, legal review (GLBA, state privacy, affiliate disclosures, ToS risk), pen tests.
- **Engineering upkeep:** browser extensions and credential connectors break when banks change their sites, so expect ongoing maintenance.
- **Infra:** modest at MVP scale. Apple/Google developer programs.

---

## Key uncertainties to resolve
1. Whether Plaid Transactions exposes raw MCC (MX does).
2. Current 1033 NPRM publication status and its stance on bank fees.
3. Exact issuer ToS language on automated access, and any enforcement against offer-automation apps.
4. Whether FinanceKit gains US third-party card support (none found as of the Apple page fetched).
5. Pricing and terms for the card-data APIs (Rewards CC API, StackEasy) and whether they are still active.

---

## Sources
- S1 Rewards Credit Card API (Product Hunt): https://www.producthunt.com/products/rewards-credit-card-api
- S2 Rewards CC API forum: https://www.producthunt.com/@rewards_cc_api/forums
- S3 StackEasy API listing: https://mcpservers.org/servers/www-stackeasy-ai-developers
- S4 Engine by MoneyLion — Credit Cards Marketplace API: https://even-financial.gitbook.io/developer-center/native-api-integrations/credit-cards-marketplace/api-specifications
- S5 Engine compliance guidelines: https://even-financial.gitbook.io/developer-center/native-api-integrations/credit-cards-marketplace/compliance-guidelines
- S6 Merchant category code (Wikipedia): https://www.wikipedia.com/wiki/Merchant_category_code
- S7 Global Payments — MCC codes: https://www.globalpayments.com/insights/what-are-mcc-codes
- S8 Cybersource merchantCategoryCode field: https://developer.cybersource.com/docs/cybs/en-us/api-fields/reference/all/so/api-fields/merchant-category-code.md
- S9 CardRatings — how issuers define grocery purchases: https://www.cardratings.com/rewards/how-do-credit-card-issuers-define-grocery-purchases.html
- S10 NerdWallet — MCCs and rewards: https://www.nerdwallet.com/blog/credit-cards/merchant-category-codes-credit-card-rewards/
- S11 The Points Guy — grocery vs supermarkets: https://thepointsguy.com/credit-cards/grocerys-stores-vs-supermarkets-bonus-category/
- S12 Visa Developer community — Merchant Search API: https://community.developer.visa.com/t5/Implementation-API-Sample-Code/Mapping-of-ISO8583-merchant-related-fields-in-MerchantSearch-API/m-p/15563
- S13 Visa Supplier Matching Service: https://developer.visa.com/products/suppliermatchingservice
- S14 Mastercard Places — MCC lookup: https://developer.mastercard.com/places/documentation/use-cases/merchant-category-code-lookup/
- S15 Mastercard Merchant Identifier glossary: https://developer.mastercard.com/merchant-identifier/documentation/glossary/
- S16 MX Atrium transactions (merchant_category_code): https://docs.mx.com/api-reference/atrium/reference/transactions/overview
- S17 Plaid Transactions docs: https://plaid.com/docs/transactions/
- S18 Plaid PFC taxonomy blog: https://plaid.com/blog/transactions-categorization-taxonomy/
- S19 Akoya Transaction Enrichment (PDF): https://akoya.com/hubfs/Website%20images%20-%20NB%2024/Products/Transactions%20(Product)/Akoya%20Transaction%20Enrichment%20Solution.pdf?hsLang=en
- S20 CardPointers extension page: https://cardpointers.com/extension/
- S21 CardPointers X (Firefox add-on): https://addons.mozilla.org/en-US/firefox/addon/cardpointers-x/
- S22 MaxRewards help — welcome: https://help.maxrewards.com/en/articles/7852163-welcome-to-maxrewards
- S23 MaxRewards — Chase connector FAQ: https://help.maxrewards.com/en/articles/6885255-chase-connector-faq
- S24 MaxRewards — V3 bank connector updates: https://help.maxrewards.com/en/articles/8578595-v3-bank-connector-updates
- S25 NextCard MaxRewards review (competitor): https://www.nextcard.com/articles/maxrewards-review-worth-it
- S26 Kudos App Store listing: https://apps.apple.com/us/app/kudos-ai-powered-smart-wallet/id6443548838
- S27 Doctor of Credit — Kudos review: https://doctorofcredit.com/kudos-app-extension-offers-5x-rewards-at-partner-retailers-more-20-referral-bonus-20-back-at-lowes-more
- S28 CardRates — Kudos: https://www.cardrates.com/news/kudos-smart-wallet-app-streamlines-card-checkout/
- S30 Chase media — Freedom Q4 2026 categories: https://media.chase.com/news/chase-freedom-2026-q4-categories
- S31 NerdWallet — Chase activation retroactive, Discover not: https://www.nerdwallet.com/credit-cards/learn/chase-freedom-5-opt-in-works-retroactively
- S32 InsideFlyer — Q4 2026 rotating categories: https://www.insideflyer.com/posts/q4-2026-rotating-5-cashback-categories-now-active/
- S33 Radar — limitations of iOS geofencing: https://radar.com/blog/limitations-of-ios-geofencing
- S34 Apple Developer Forums — CLMonitor limitations: https://developer.apple.com/forums/thread/736099
- S35 Apple Developer Forums — CLMonitor vs CLCircularRegion events: https://developer.apple.com/forums/thread/806783
- S36 Android — Create and monitor geofences: https://developer.android.com/training/location/geofencing
- S37 Mapp — geofencing limitations: https://docs.mapp.com/limitations
- S38 Plaid pricing (third-party summary): https://www.activepieces.com/blog/plaid-pricing-2026-cost-per-connection-and-request
- S39 Plaid vs MX vs Finicity comparison: https://beancount.io/blog/2026/10/18/plaid-vs-mx-vs-finicity-bank-data-aggregators-coverage-reliability-price-guide
- S40 Cozen O'Connor — 1033 enjoined and under reconsideration: https://www.cozen.com/news-resources/publications/2026/section-1033-compliance-date-open-banking-rule-enjoined-and-under-reconsideration
- S41 Bloomberg Law — JPMorgan–Plaid data fee deal: https://news.bloomberglaw.com/banking-law/jpmorgan-plaid-data-fee-deal-shifts-open-banking-battlefield
- S42 Bloom Credit — where 1033 stands: https://bloomcredit.io/blog/where-section-1033-actually-stands-a-plain-language-guide-for-financial-institutions/
- S43 CU Times — CFPB shifts to full rulemaking: https://www.cutimes.com/amp/2026/01/29/cfpb-shifts-to-full-rulemaking-for-section-1033-rewrite-after-credit-union-push/
- S44 Consumer Finance Monitor — NPRM sent to OIRA (Aug 2026): https://www.consumerfinancemonitor.com/2026/08/06/cfpb-sends-new-section-1033-open-banking-proposal-to-oira-for-review/
- S45 The Paypers — JPMorgan paid data access agreements: https://thepaypers.com/fintech/news/jpmorgan-chase-reaches-paid-data-access-agreements-with-aggregators
- S46 The Star/CNBC — JPMorgan secures deals with aggregators: https://www.thestar.com.my/tech/tech-news/2025/11/15/jpmorgan-secures-deals-with-fintech-aggregators-over-fees-to-access-data-cnbc-reports
- S47 eMarketer — Amex agentic tools in Perplexity: https://www.emarketer.com/content/amex-launches-agentic-business-tools-perplexity-
- S48 Bloomberg Law — Amex–Plaid data-sharing deal: https://news.bloomberglaw.com/banking-law/american-express-plaid-reach-consumer-data-sharing-agreement
- S49 Business Wire — Cardlytics Rewards Platform: https://www.businesswire.com/news/home/20250520125250/en/Cardlytics-Launches-Cardlytics-Rewards-Platform-and-Expands-Publisher-Base-Beyond-Financial-Institutions
- S50 Cardlytics Rewards Platform: https://go.cardlytics.com/CardlyticsRewardsPlatform
- S51 Kard — Cardlytics vs Kard (vendor): https://www.getkard.com/blog/cardlytics-vs-kard-comparing-card-linked-offer-platforms-in-2026
- S52 Apple PassKit Programming Guide (archive): https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Apps.html
- S53 Apple Wallet (Wikipedia): https://Www.Wikipedia.org/wiki/Apple_Wallet
- S54 Apple — Get started with FinanceKit: https://developer.apple.com/financekit/
- S55 Apple Developer Forums — EMV via Core NFC inquiry: https://developer.apple.com/forums/thread/817739
- S56 Apple — Updated App Review Guidelines (news): https://developer.apple.com/news?id=ey6d8onl
- S57 Open Terms Archive — Nov 2025 App Store changes: https://opentermsarchive.org/en/memos/apple-updates-app-store-rules-on-data-use-age-gating-external-software-and-loan-app-disclosures/
- S58 Wilson Sonsini — FTC updated Safeguards Rule: https://www.wsgr.com/en/insights/ftc-releases-updated-safeguards-rule-for-financial-institutions.html
- S59 Paul Hastings — Safeguards Rule breach reporting: https://www.paulhastings.com/en-GB/insights/ph-privacy/revised-ftc-safeguards-rule-brings-breach-reporting-obligations-to-non
- S60 Orrick — GLBA entity-level exemption eroding: https://www.orrick.com/de-DE/Insights/2025/07/Where-is-the-GLBA-Entity-Level-Exemption-Two-More-State-Privacy-Laws
- S61 Dinsmore — bankers and state privacy laws: https://www.dinsmore.com/publications/what-bankers-need-to-know-to-comply-with-state-privacy-laws/
