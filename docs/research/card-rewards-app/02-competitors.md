# Competitive Landscape: CardPointers-style Apps (as of 2026-11-16)

## Method and caveats

- Research was done with web search only. WebFetch could not reach most target sites (cardpointers.com help, joinkudos.com, cardstack.money and others failed DNS under this session's network allowlist), so **nearly every fact below comes from search-result snippets**, not from reading the full page.
- Many sources are affiliate blogs or competitors' own blogs (e.g., Kudos reviewing MaxRewards and CardPointers). Treat pricing and claims from those as low-confidence.
- Markers: **[V]** means confirmed by an official or primary source, or by two or more independent sources. **[U]** means unverified, a single secondary source, or conflicting sources. "Not found" means I searched and found nothing. It does not mean the fact is false.
- No user counts or revenue figures have been estimated. Where none was found, the field says so.

---

## 1. Direct competitors: "which card should I use" plus offer managers (US)

### CardPointers (the reference product)
- **Features:** Best card per category/merchant/location. Auto-adds card-linked offers (Amex, Chase and others) via a browser extension. "Smart Add" puts each Amex offer on the card with the highest category bonus [V: Frequent Miler]. Tracks credits and benefits, iOS widgets/Watch. The 2026 v7 redesign is "the biggest redesign in the app's seven-year history" [U: Cloud9Club]. CardPointers AI uses MCP to connect the user's wallet to ChatGPT/Claude and is included in CardPointers+ [V: cardpointers.com/ai, 9to5Mac]. A CLI version exists for CardPointers+ members [V: help.cardpointers.com, snippet].
- **Platforms:** iOS, Android, web, browser extension.
- **Pricing:** Conflicting. Official help page (undated in snippet) shows $6.99/mo, $59.99/yr, $199.99 lifetime [U, dating]. Other 2026 reviews cite $89.99/yr and $200 lifetime list price, often 30–50% off in recurring sales [U]. Frequent heavy discounting through affiliate partners (Upgraded Points, View from the Wing, DannyDealGuru) [V].
- **Data approach:** Mostly manual card selection (choose your cards, no bank linking needed for recommendations). Offer adding works through the browser extension using the user's issuer session.
- **Business model:** Subscription plus affiliate-driven discounts and promotion.
- **Funding / users:** Not found. Ratings: iOS ~4.7 (~9.8k reviews), Google Play ~4.6 (~680 reviews) [U: aggregators].
- **Strengths:** Deep card database, strong points-blog affiliate distribution, fast Apple-platform adoption (Liquid Glass, Apple Intelligence, widgets), first mover on AI/MCP.
- **Weaknesses:** Amex has throttled multi-card offer adding. In April 2026 CardPointers' help center acknowledged Amex "server issues" affecting multi-login users and suggested a VPN workaround [V: help.cardpointers.com snippet]. A Jan 2026 Android purchase-restore bug [V: help.cardpointers.com]. UK App Store reviews say it lacks UK banks/cards [U].

### MaxRewards
- **Features:** Links accounts. Recommends best card. Auto-activates offers from Amex, Chase, Capital One, BofA, Citi, Wells Fargo, USAA, US Bank (Gold tier). Tracks spend, credits, and rewards. Chrome extension (beta, updated June 2026) [U].
- **Platforms:** iOS, Android, Chrome extension.
- **Pricing:** Free tier, plus Gold and Platinum. Gold is "pay what you want." Sources disagree, with figures from about $54–60/yr up to $9/mo ($108/yr) [U].
- **Data approach:** Bank login linking. Reviewers say it stores bank login credentials, flag a possible Chase fraud-lock risk, and report sync breakages [U: review blogs]. A feedback-board thread reports "offers not updating" [V: feedback.maxrewards.com, title only].
- **Funding:** $3M seed (Sept 2021), co-led by Dundee VC, Techstars Atlanta 2019 alum [V: BusinessWire, TechCrunch]. Total $3.0–4.1M depending on source [U]. Founders: Anik Khan (CEO) and David Gao (CTO) [V].
- **Users:** About page says "over 125,000 members" [V, self-reported, undated]. A 2026 blog says 400,000+ [U].
- **Ratings:** iOS 4.6 (352 ratings), Google Play ~3.6 (~2.2k) [U: snippets].
- **Strengths:** The most automated offer activation, across the widest set of issuers.
- **Weaknesses:** Credential-based syncing is fragile and raises security worries. The low Android rating points to reliability problems.

### Kudos (Kudos Technologies)
- **Features:** A browser extension and app that recommends the best card at checkout. It claims 3,000+ cards and 1M+ sites [U, company]. Also includes "Boost" merchant cashback (shopping-portal affiliate commissions, with a doctorofcredit report of 100% pass-through on boosted merchants), approval odds, card recommendations, and a "Kudos AI" assistant (company blog).
- **Platforms:** Chrome/Edge/Safari extensions and an iOS app [V: multiple].
- **Pricing:** Free tier. Premium is listed at $71.95/yr and Lifetime at a one-time $240, both on Kudos' own blog [U].
- **Business model:** Affiliate (card applications, shopping cashback), plus subscription.
- **Funding:** $10.2M Series A led by QED Investors (CB Insights dates it April 2025), after a $7M seed [V: Finextra, TechCrunch, Newswire]. Total is $17.2M per TechCrunch, versus $39.7M per CB Insights [conflict, U]. Samsung Next and Chingona Ventures are investors [V: their blogs].
- **Users / ratings:** No company-reported 2026 count found. Trustpilot 3.6 from 37 reviews [U]. One aggregator gives the app 4.77 [U, low-confidence].
- **Strengths:** Best-funded consumer player. Owns the online checkout moment through its extension. Free core product.
- **Weaknesses:** Mostly online-checkout focused. Affiliate incentives may bias recommendations. It writes heavy SEO "review" content attacking competitors, so read its comparisons skeptically.

### Uthrive
- **Features:** Recommends best card, alerts when you used the wrong card, shows "missed rewards" dashboard, Chrome extension [V: App Store, Chrome Web Store].
- **Pricing:** Free [V: App Store]. No premium tier found.
- **Data approach:** Account linking. The provider was not confirmed.
- **Funding / users:** Not found. Launched Nov 2021 [V: GlobeNewswire].
- **Notes:** App Store copyright line shows 2021 [U], so activity level in 2026 is unclear. Status needs checking.

### Card Curator
- iOS app ("Card Curator: Travel Sooner") with personalized card recommendations. It claims no bank or issuer partnerships, which it presents as "unbiased" [V: App Store/Product Hunt]. A related(?) cardcurator.ai describes a "decision engine for credit cards" [U, relationship unclear]. Pricing, funding, and users not found.

### TravelFreely
- A free app focused on churning: tracks Chase 5/24, annual fee reminders, and signup bonuses. Monetizes via card affiliate links. Last updated March 2026 (v1.6.12) per an aggregator [U]. Platform availability conflicts (iOS-only vs iOS+Android) [U].

### The Points Guy (TPG) app
- "Card Advisor" suggests which owned card to use. Syncs cards to show "points net worth." "Rewards Boost" suggests the next card to apply for (affiliate). iPhone only, requires iOS 17.6+ per App Store snippet [U]. Older reviews mention miscategorized transactions and reconnect problems [U: CreditCards.com 2021]. Free, affiliate-funded.

### New and small entrants (2025–2026, unverified, mostly App Store/Product Hunt listings only)
Kred, EarnPerCard (Product Hunt, July 2026), Troveo (AI, early access), Flo (formerly WalletFlo), Cardzen, Kaldex (Plaid-linked tracker), kardfolio (benefits), MaxWorth (AI), Credit Buddy, Pointwise ("credit card advisor"), Card Chooser, Card Insider (US listing). **No traction data found for any of them.** This shows the category is crowded at the low end.

**Not found:** "CardAdvisor" (US app) and "Card Hero." cardadvisor.in exists as an Indian card-comparison site [U]. "Cardless" is a card-issuing platform (Bilt 2.0 servicer), not an optimizer app [V: Bilt newsroom].

---

## 2. Points and miles trackers and award search (adjacent)

### AwardWallet
- Tracks balances and expirations across 600+ loyalty programs (620+ per company) [V]. Plus is $49.99/yr per AwardWallet blog and Frequent Miler, Sept 2026 [V-ish]. CA App Store shows $39.99 [U]. Frequent Miler reports that from Oct 1, 2026 expiration dates and alerts require Plus [U]. About page lists 942,000 users [U, undated]. Wikipedia-derived sources say 700k in 2021. American Airlines blocked tracking (cease-and-desist 2012, re-integrated 2013, no contract from Dec 2021) [V: Doctor of Credit, View from the Wing]. Also runs a large affiliate content blog.
- **Lesson:** Programs can and do cut off scrapers. Freemium is being squeezed toward paid.

### point.me
- Award flight search. Standard is ~$12/mo or $129/yr, Premium is ~$260/yr [U: NerdWallet, Points Party]. Has a strategic partnership with The Points Guy [V: point.me page title]. 2026 additions: multi-destination search (July 2026), Explore map, transfer-bonus integration, hotel search beta for paid members (Oct 2026) [U: TPG, Points Party].

### Roame
- Award flight search, free with an account plus Pro (~$109.99/yr per a third party [U]). YC-backed, ~$0.5M raised in 2023 [U: CB Insights, VCBacked]. Hotel award search beta Nov 2025 [U]. No acquisition found.

### Seats.aero
- Cached award availability. Pro rose to $12.99/mo or $109.99/yr from Nov 9, 2026 (was $9.99 and $99.99), with existing subscribers grandfathered [V: Upgraded Points, Milesopedia, AwardWallet]. Free tier covers about 60 days, Pro covers a full year plus live search and alerts [V].

### Milesopedia (Canada)
- A content and comparison site (140+ Canadian cards compared). **No dedicated "best card" app found.** It publishes reviews of AwardWallet, point.me, and Roame.

---

## 3. Bank, fintech, and platform built-ins (the platform threat)

| Player | What it does | Status |
|---|---|---|
| **Apple Wallet (iOS 26)** | Use rewards and installments at checkout via Apple Pay (initial partners Synchrony, U.S. Bank), shows card-specific rewards before checkout | [U: 9to5Mac, eMarketer]. **No automatic "best card" ranking found.** |
| **Google Pay / Chrome autofill** | Shows reward details for 100+ US cards in Chrome autofill, plus card benefits | Shows only one benefit at a time. Benefits **do not affect autofill rank order**. Limited to flat-rate perks [V: Google support and developer docs]. |
| **Curve (UK/EEA)** | One card that routes to your underlying cards, "Go Back in Time" switching after purchase, FX savings, Curve Pay on Android, Plaid open banking | Lloyds Banking Group agreed to acquire it (announced 19 Nov 2025, reported about £120M, shareholder IDC opposed) [V: tech.eu, Banking Dive, Curve blog]. Completion reported May 2026 [U: Seedtable citing Lloyds H1 results]. |
| **Bilt** | Rent/mortgage rewards. Bilt Card 2.0 (Blue/Obsidian/Palladium) issued by Column N.A., serviced by Cardless, launched Feb 7, 2026, replacing Wells Fargo | [V: Bilt newsroom, Upgraded Points]. NerdWallet called the rollout confusing [V: headline]. |
| **Credit Karma / NerdWallet** | Recommend cards to *apply for* (approval odds), with affiliate revenue as the core model | Card referrals are NerdWallet's largest revenue line [U: secondary]. Not a "which card to swipe" tool. |
| **Capital One Shopping, Rakuten, PayPal Honey** | Shopping-portal and coupon extensions | Honey and Capital One Shopping were sued by creators over affiliate-cookie replacement. Capital One settled in Sept 2025 without admitting liability. Rakuten Advertising dropped Honey from its network [V: Tubefilter, hellopartner, Wikipedia]. Rakuten launched an AI spending-insights agent in 2026 [U: PYMNTS headline]. |
| **Mastercard / Visa** | Mastercard uses AI to surface rewards to cardholders. Visa is betting on AI financial advice | [U: eMarketer, PaymentsJournal headlines]. |

---

## 4. International

- **India:**
  - **CRED** pays credit card bills in exchange for rewards, and has expanded into UPI, lending, and wealth. It claims more than 40% of India's card bill payments and 17M monthly engaged members. A ~Rs 8,550 crore (~$900M) round led by Meta was reported June 2026. Valuation figures conflict, from $3.5B to $6.4B [U]. This is not a which-card optimizer.
  - **SaveSage** is an AI credit card and loyalty manager. It raised ~$1M pre-seed in Oct 2025 (led by Bhavesh Gupta, mix of equity and debt), after a Rs 2.5 crore angel round (iSEED, Alluvium, LetsVenture). It claims 200,000 users and a $1.1M revenue run-rate as of Sept 2025, and has an IndiGo partnership [V: multiple Indian outlets, company-reported numbers].
  - **Card Insider** offers card news, offers, and lounge info, is free, and needs no card details [U].
  - **Kiwi** is a RuPay-on-UPI card issuer, not an optimizer.
  - TechnoFino is a community and data source.
  - India is the most active international market for this category.
- **Canada:** Rewardly claims Big Five and Amex Canada support, but the only source is its own promotional post and no app store listing was found [U]. Otherwise the market is comparison sites (Milesopedia, Finly, Ratehub, CreditCardGenius, MoneySense). Drop, a Canadian loyalty app, had a manufactured-spend crackdown and redemption delays; its status was not confirmed. **This is an open gap.**
- **UK/EEA:** Curve (now Lloyds) is the routing approach. No dedicated UK which-card or Avios optimizer app found. CardPointers' UK App Store reviews complain about missing UK support [U]. Head for Points is content only. **This is a gap**, and fewer rewards cards plus interchange caps shrink the opportunity.
- **Australia:** Point Hacks has no app (its About page says so) and points users to AwardWallet [V-ish]. Seats.aero has AUD pricing. **No local which-card app found.**
- **Hong Kong:** RewardsWise recommends cards by category for HK banks [U].

---

## 5. Shutdowns and acquisitions

| Company | Event | Why (as reported) |
|---|---|---|
| **Wallaby Financial** | Acquired by Bankrate, Dec 2014 [V: socaltech]. Folded into CreditCards.com distribution, co-launched WalletUp, and moved to B2B for financial institutions by 2016 [V: Finovate, Bank Innovation]. | Affiliate distributors bought the tech to drive card applications. The consumer app's current status was not confirmed, but no evidence was found that it is still active. |
| **Mint** (Intuit) | Shut down March 23, 2024, with users pushed to Credit Karma [V: Bloomberg, NerdWallet]. | Consolidation into Credit Karma's affiliate (card and loan referral) model. Intuit admitted Credit Karma lacked Mint's budgeting features. |
| **Curve** | Acquired by Lloyds (announced Nov 2025, about £120M reported, well below prior valuations, with shareholder dispute) [V]. | Bank buys wallet tech for its 28M customers. Curve was loss-making [U: pulse.bot "£9m loss" headline]. |
| **Bilt / Wells Fargo** | Wells Fargo exited as issuer. Bilt 2.0 moved to Column plus Cardless in Feb 2026 [V]. | Issuer economics (widely reported losses on rent transactions, not verified here). |
| **Honey** | Lost merchants and affiliate-network access amid lawsuits [V: Wikipedia, ppc.land]. | Affiliate-cookie replacement practices. |

**Pattern:** Standalone consumer card optimizers tend to get acquired by affiliate distributors (Bankrate, Intuit) or banks (Lloyds), or stay small and bootstrapped. Affiliate-driven models face legal and trust risk.

---

## 6. Structural risks for any new entrant

1. **Issuer anti-automation.** Amex has throttled multi-card offer adding (2026), which forced CardPointers into "Smart Add" and VPN workarounds [V]. Credential-based scraping (MaxRewards) breaks and can trigger fraud locks [U].
2. **Data-access costs.** JPMorgan Chase began charging aggregators (Plaid deal Sept 2025, plus Yodlee, Akoya, and Morningstar) [V: American Banker]. The CFPB §1033 open-banking rule is enjoined and being rewritten to likely allow fees [U: trackers, Bloomberg Law]. Plaid said it would not pass costs on, but that could change.
3. **Loyalty program cutoffs.** The AwardWallet/AA precedent shows programs can block tracking.
4. **Platform encroachment.** Google already shows card benefits at autofill, and Apple Wallet shows rewards before checkout. Neither yet ranks cards, but both could.

---

## 7. Comparison table

| App | Core job | Platforms | Price (2026, approx.) | Data approach | Offer auto-enroll | Model | Funding | Users / ratings |
|---|---|---|---|---|---|---|---|---|
| CardPointers | Best card + offers + benefits | iOS, Android, web, extension, CLI, MCP | $59.99–89.99/yr, ~$200 lifetime [U] | Manual card list, extension for offers | Yes (Amex, Chase, others), Amex throttled | Subscription | Not found | iOS 4.7 (~9.8k) [U] |
| MaxRewards | Best card + offers + spend tracking | iOS, Android, Chrome | Free, Gold PWYW ~$54–108/yr [U] | Bank credential linking | Yes, widest issuer list | Subscription | ~$3–4M seed [V/U] | 125k+ (self) to 400k [U]; Android ~3.6 |
| Kudos | Checkout best card + cashback | Chrome, Edge, Safari, iOS | Free, Premium $71.95/yr, $240 lifetime [U] | Manual and linking (unclear) | Not confirmed | Affiliate + subscription | $10.2M Series A (QED), total $17M+ [V/U] | Not found |
| Uthrive | Best card + missed rewards | iOS, Android(?), Chrome | Free | Account linking | Not found | Likely affiliate [U] | Not found | Not found |
| TPG app | Card Advisor + points net worth | iPhone | Free | Account sync | No | Affiliate | Part of TPG | Not found |
| TravelFreely | Churn tracker (5/24, AF) | iOS (Android?) | Free | Manual | No | Affiliate | Not found | 4.9 [U] |
| Card Curator | Card recommendations | iOS | Not found | Not found | No | Claims no issuer ties | Not found | Not found |
| AwardWallet | Loyalty balances and expirations | iOS, Android, web | Plus $49.99/yr | Program logins/scraping | n/a | Subscription + affiliate content | Not found | ~942k users (self) [U] |
| point.me | Award search | Web | $129–260/yr [U] | n/a | n/a | Subscription + TPG partnership | Not found | Not found |
| Roame | Award search | Web | Free + Pro ~$110/yr [U] | n/a | n/a | Freemium | ~$0.5M (YC) [U] | Not found |
| Seats.aero | Award availability | Web | Pro $109.99/yr [V] | n/a | n/a | Freemium | Not found | Not found |
| Curve | Route spend to any card (UK/EEA) | iOS, Android, physical card | Free + paid tiers (not verified) | Card-on-file + Plaid open banking | n/a | Interchange + subscription | Acquired by Lloyds | Not found |
| CRED (India) | Card bill pay + rewards | iOS, Android | Free | Bill-pay linking | n/a | Fees, lending, ads | ~$900M round (Meta lead) 2026 [U] | 17M monthly engaged (self) |
| SaveSage (India) | AI card and loyalty manager | App | Not found | Not found | Not found | Revenue run-rate $1.1M (self) | ~$1M pre-seed + angel [V] | 200k users (self) |

---

## 8. Gaps in the market and underserved needs

1. **Reliable offer automation that doesn't break.** The top complaint for MaxRewards is sync and credential breakage, and Amex has throttled CardPointers. There is room for an approach that is resilient and user-transparent (for example, device-side extension automation with clear status and retries), not one that hides failures.
2. **In-store, at-the-moment recommendations.** Kudos owns online checkout. In-store still depends on the user opening an app. Possible approaches: geofenced notifications, Apple Wallet and Lock Screen surfaces, Watch, Siri/Shortcuts, and widgets. Apple and Google don't rank cards yet, but that is the main platform risk to watch.
3. **Unbiased recommendations.** Most players (Kudos, TPG, Credit Karma, NerdWallet, TravelFreely) earn from card-application affiliates, and Card Curator markets "no issuer partnerships" as a differentiator. A transparent "no affiliate influence" position is a clear way to stand out. The tradeoff is that the business has to rest on subscriptions.
4. **Benefit and credit utilization tracking.** Coupon-book premium cards (Amex Platinum, the Bilt 2.0 tiers, and similar) create demand for "did I use my $X credit this month" tracking with reminders. Many small 2025–26 apps (kardfolio, Kaldex) target this, but none dominates.
5. **Missed-rewards and household views.** Uthrive pioneered "you used the wrong card" alerts. A multi-user household wallet (couples sharing cards and Player 2 churning) is rarely served well.
6. **International coverage.** Canada, UK, and Australia have content sites but no strong which-card app. CardPointers' UK reviews complain about missing support, and Rewardly in Canada is unproven. India is active (SaveSage, CRED) but different: bill-pay, UPI, and RuPay dynamics.
7. **Churning workflow.** Issuer application rules (5/24, Amex once-per-lifetime, velocity), signup-bonus minimum-spend progress, and annual-fee/downgrade decisions are only partly covered (TravelFreely, CardPointers).
8. **Linking points to redemptions.** Award-search tools (point.me, Seats.aero, Roame) are separate from wallet apps. Few combine "what I have" (balances, transfer partners, current transfer bonuses) with "what I can book." point.me's partnership with TPG suggests convergence.
9. **AI assistant layer.** CardPointers' MCP integration and Kudos AI are early. A conversational "plan my spend and redemptions" product built on accurate card and offer data is still open.
10. **Privacy-first data approach.** Given Chase's data fees, §1033 uncertainty, and credential scraping risk, a manual-first or on-device design with optional linking may be a selling point and lower costs.

---

## Sources

- CB Insights, CardPointers alternatives: https://www.cbinsights.com/company/cardpointers/alternatives-competitors
- Kudos blog, CardPointers review (competitor-authored): https://www.joinkudos.com/blog/cardpointers-credit-card-app-review
- Kudos blog, MaxRewards review (competitor-authored): https://www.joinkudos.com/blog/maxrewards-credit-card-app-review
- CardPointers pricing help page: https://help.cardpointers.com/article/43-how-much-does-cardpointers-cost
- CardPointers App Store: https://apps.apple.com/us/app/cardpointers-for-credit-cards/id1472875808
- CardPointers AI: https://cardpointers.com/ai/
- 9to5Mac, CardPointers iOS 26 update: https://9to5mac.com/2025/11/30/cardpointers-updated-for-ios-26-with-liquid-glass-design-apple-intelligence-more/
- Cloud9Club CardPointers review 2026: https://cloud9club.net/card-pointers-review/
- Wallet Hacks CardPointers review: https://wallethacks.com/cardpointers-app-review/
- View from the Wing, CardPointers sale: https://viewfromthewing.com/?p=257414
- Upgraded Points, CardPointers discount: https://upgradedpoints.com/news/cardpointers-discount/
- CardPointers help, Amex server issues/VPN: https://help.cardpointers.com/article/84-working-around-amex-server-issues-via-vpn
- CardPointers help, Android restore bug: https://help.cardpointers.com/article/74-android-update-causing-restore-purchase-to-fail
- Frequent Miler on CardPointers / Amex multi-card: https://frequentmiler.com/cardpointers/ and https://frequentmiler.com/?p=294050
- DannyDealGuru, CardPointers Amex issue: https://dannydealguru.com/?p=220466
- The College Investor, MaxRewards review: https://thecollegeinvestor.com/maxrewards-review/
- MaxRewards App Store: https://apps.apple.com/us/app/id1435710443
- Doctor of Credit, MaxRewards auto-activate: https://www.doctorofcredit.com/mobile-app-that-auto-activates-cashback-offers-on-your-credit-cards/
- MaxRewards feedback, offers not updating: https://feedback.maxrewards.com/feature-requests/p/offers-not-updating-in-app
- MaxRewards seed round (BusinessWire): https://www.businesswire.com/news/home/20210910005071/en/MaxRewards-Raises-$3-Million-Series-Seed-to-Help-Consumers-Earn-Extraordinary-Benefits-from-Everyday-Spend
- TechCrunch, MaxRewards $3M: https://techcrunch.com/2021/09/10/maxrewards-banks-3m-to-reveal-best-payment-methods-that-reap-the-most-rewards
- MaxRewards About: https://maxrewards.com/about
- MaxRewards Chrome extension: https://chromewebstore.google.com/detail/maxrewards-maximize-credi/jfncaogcblglilhhheliphggkfbpcddd
- Finextra, Kudos $10.2M: https://www.finextra.com/newsarticle/44168/kudos-raises-102m-for-ai-powered-smart-wallet/ai
- Newswire, Kudos Series A: https://www.newswire.com/news/ai-powered-kudos-wallet-raises-oversubscribed-10-2-million-series-a
- TechCrunch, Kudos: https://techcrunch.com/?p=2780553
- CB Insights, Kudos: https://www.cbinsights.com/company/kudos-technologies
- Samsung Next on Kudos: https://samsungnext.com/blog/why-we-invested-in-kudos
- Doctor of Credit, Kudos portal: https://www.doctorofcredit.com/kudos-shopping-portal-simplified-system-pays-out-100-of-affiliate-commission/
- Kudos referral/Lifetime post: https://www.joinkudos.com/blog/refer-a-friend-earn-70-how-the-kudos-referral-program-works-2026
- Kudos vs Monarch (Premium price): https://www.joinkudos.com/blog/kudos-vs-monarch-which-app-maximizes-your-money-better-2025
- Uthrive App Store: https://apps.apple.com/us/app/uthrive-rewards-cashback/id1593133342
- Uthrive launch (GlobeNewswire): https://rss.globenewswire.com/news-release/2021/11/18/2337467/0/en/Personal-Finance-App-Uthrive-Launches-to-Help-Consumers-Get-the-Most-out-of-their-Credit-Card-Rewards-and-Cash-Back-Programs.html
- Uthrive Chrome extension: https://chrome.google.com/webstore/detail/uthrive-use-best-cards-fo/kmajiclhfhbncoegkfboeldogkdbmkhj
- Card Curator App Store: https://apps.apple.com/us/app/id1526009534 ; cardcurator.ai: https://cardcurator.ai/
- TravelFreely App Store: https://apps.apple.com/app/id1536443694 ; Thrifty Traveler review: https://thriftytraveler.com/guides/travel-freely-review ; Marlvel report: https://marlvel.ai/intel-report/travel/travel-freely-points-miles
- TPG app App Store: https://apps.apple.com/us/app/id1459686987 ; TPG Rewards Boost: https://thepointsguy.com/news/rewards-boost ; CreditCards.com guide: https://www.creditcards.com/education/guide-to-the-points-guy-app/
- Product Hunt/other new entrants: https://www.producthunt.com/products/cardpointers/alternatives ; Troveo: https://troveo.app/ ; Flo: https://www.walletflo.com/ ; Kaldex: https://apps.apple.com/app/kaldex/id6761017106 ; Cardzen: https://apps.apple.com/app/id6767056141 ; kardfolio: https://apps.apple.com/us/app/-/id6759400652
- AwardWallet Plus: https://awardwallet.com/blog/awardwallet-plus-perks ; Frequent Miler: https://frequentmiler.com/?p=295778 ; About: https://awardwallet.com/page/about ; App Store: https://apps.apple.com/US/app/id388442727
- AA blocks AwardWallet: https://viewfromthewing.com/american-airlines-wont-let-you-track-your-aadvantage-account-with-award-wallet-anymore/ ; https://doctorofcredit.com/?p=183775
- point.me: https://www.nerdwallet.com/travel/learn/point-me-guide ; https://thepointsguy.com/news/point-me-new-features/ ; https://www.point.me/insights/the-points-guy-pointme-announce-strategic-partnership-help-travelers-unlock-full-value-points.md ; https://thepointsparty.com/articles/point-me-hotel-search-beta-paid-members-october-2026
- Roame: https://roame.travel/guides/roame-vs-point-me ; https://www.vcbacked.co/company/roame-holdings ; https://www.cbinsights.com/company/roame/financials ; https://www.caplight.com/company/roame
- Seats.aero price: https://upgradedpoints.com/news/seats-aero-price-increase ; https://milesopedia.fr/actualites/seats-aero-pro-hausse-prix/ ; https://upgradedpoints.com/news/seats-aero-free-vs-pro/
- Milesopedia: https://milesopedia.com/en/credit-cards/
- Apple Wallet iOS 26: https://9to5mac.com/2025/09/19/heres-everything-new-for-apple-wallet-in-ios-26/ ; https://www.emarketer.com/content/ios-26-brings-enhanced-apple-wallet-features-travel-commerce
- Google card benefits in autofill: https://support.google.com/chrome/answer/16577205 ; https://www.androidcentral.com/apps-software/google-pay/google-pay-way-more-rewarding-to-shop-online-with-chrome ; https://9to5google.com/2025/12/05/chrome-autofill-google-wallet/
- Curve/Lloyds: https://tech.eu/2025/11/19/curve-confirms-sale-to-lloyds/ ; https://www.bankingdive.com/news/lloyds-bank-uk-acquire-fintech-curve-digital-wallet-120-million-idc-investor-concern/806065/ ; https://www.curve.com/blog/press/curve-is-joining-lloyds-banking-group/ ; https://seedtable.com/exits/curve ; https://www.finextra.com/newsarticle/46934/lloyds-bank-completes-controversial-acquisition-of-curve ; https://www.pulse.bot/finance/news/curve-swings-to-9m-loss-as-lloyds-takeover-remains-incomplete-089111be-16ec-4222-a43c-2af5e3e062bf/
- Bilt 2.0: https://newsroom.biltrewards.com/meetbiltcard2.0 ; https://upgradedpoints.com/news/new-bilt-cards-launch-february-2026/ ; https://www.nerdwallet.com/travel/news/bilt-promises-rewards-delivers-confusion ; https://awardwallet.com/news/bilt-rewards/cardless-card-portfolio/
- Mint shutdown: https://www.bloomberg.com/news/articles/2024-04-10/intuit-s-shutdown-of-mint-has-gone-better-than-thought-ceo-says ; https://www.nerdwallet.com/finance/news/mint-app-closing-what-it-means-how-to-pick-a-new-budget-service
- Wallaby/Bankrate: https://www.socaltech.com/wallaby_acquired_by_bankrate/s-0058067.html ; https://bankinnovation.net/2017/04/wallaby-financial-eyes-the-pfm-space/ ; https://www.finextra.com/pressarticle/56896/wallaby-and-creditcardscom-launch-walletup-mobile-app ; https://techcrunch.com/2012/11/16/wallabys-iphone-app-tells-you-which-credit-card-to-use-to-maximize-your-rewards
- Honey / Capital One Shopping: https://en.wikipedia.org/wiki/PayPal_Honey ; https://www.tubefilter.com/2025/01/24/capital-one-shopping-honey-lawsuits-creator-affiliate-marketing/ ; https://couponsinthenews.com/2025/09/19/capital-one-settles-coupon-dispute-with-online-influencers/ ; https://ppc.land/honey-loses-7-000-merchants-as-judge-lets-creator-lawsuit-proceed/
- Rakuten AI agent: https://www.pymnts.com/credit-cards/2026/rakuten-ai-agent-offers-card-users-spending-insights/
- Mastercard AI rewards: https://www.emarketer.com/content/mastercard-uses-ai-help-cardholders-find-rewards
- NerdWallet/Credit Karma model: https://productmint.com/the-nerdwallet-business-model-how-does-nerdwallet-make-money/ ; https://wealthvieu.com/credit-karma-vs-nerdwallet
- Chase data fees / §1033: https://www.americanbanker.com/news/jpmorganchase-reaches-deal-to-charge-plaid-for-customer-data ; https://openbankingtracker.com/guides/section-1033-status ; https://news.bloomberglaw.com/banking-law/cfpb-likely-to-take-quicker-route-in-revising-open-banking-rule
- CRED: https://www.newkerala.com/news/a/cred-raise-rs-8550-crore-funding-round-led-187.htm ; https://pulse2.com/cred-raises-%E2%82%B98550-crore-series-h-about-900-million-led-by-meta/amp/ ; https://www.businesswire.com/news/home/20260622947239/en/
- SaveSage: https://indianstartupnews.com/funding/ai-powered-personal-finance-startup-savesage-raises-1-million-in-a-mix-of-debt-and-equity-10606205 ; https://www.ciol.com/funding-acquistion-merger/savesage-raises-1-million-to-expand-ai-driven-credit-card-rewards-platform-10609251 ; https://startup.siliconindia.com/startup-funding/credit-card-management-startup--savesage-club--nets-rs-25-crore-angel-fund-nwid-47949.html
- Card Insider: https://apps.apple.com/us/app/id1609557864 ; Kiwi: https://gokiwi.in/blog/best-upi-app-for-rupay-credit-card-payments
- Canada: https://dev.to/tahseen_rahman/best-credit-card-rewards-apps-in-canada-2026-complete-guide-2bce ; https://www.finlywealth.com/post/best-credit-card-apps-in-canada
- Drop: https://en.wikipedia.org/wiki/Drop_(loyalty_program) ; https://milestomemories.com/drop-manufactured-spending-shutdown
- Australia: https://www.pointhacks.com.au/about ; https://www.pointhacks.com.au/tracking-points-apps-roundup/
- UK: https://apps.apple.com/gb/app/id1472875808 ; https://www.headforpoints.com/best-uk-avios-airline-hotel-credit-cards
- HK RewardsWise: https://apps.apple.com/dk/app/id6538721089
