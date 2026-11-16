# CardPointers: competitive research (as of 2026-11-16)

## How this was researched, and its limits

- **WebFetch was blocked for every host tried** (cardpointers.com, apps.apple.com, 9to5mac.com, wallethacks.com, revenuecat.com). All findings come from **WebSearch result summaries**, not full page reads. Treat every figure as "reported by the cited page, per the search engine". A human should check the key numbers (pricing, ratings) on the live pages.
- **Reddit is not reachable by the search tool** (the domain is blocked for its user agent). No r/churning, r/CreditCards or r/awardtravel threads were read. Community sentiment below comes from app-store reviews, the Chrome and Firefox extension stores, Doctor of Credit, FlyerTalk and blogs.
- Many review sites earn affiliate commissions on CardPointers+ sales, and several comparison pages are written by competitors (Kudos, Norte, MaxWorth, Prospify). Their verdicts are biased.
- "Unverified" marks claims I could not confirm or where sources conflict.

---

## 1. Company snapshot

| Item | Finding | Source |
|---|---|---|
| Founder | Emmanuel Crouvisier, an indie developer. The original app icon is credited to Ernesto Kenji Salvador. Help center says "Miami, Florida". | help.cardpointers.com/article/44 |
| Founded | 2019. Crunchbase lists him as founder from Feb 2019. | crunchbase.com/person/emmanuel-crouvisier; indiegoodies.com interview |
| Origin | Started as a web-app MVP that sorted cards by value across 12 categories, shared on a subreddit to validate the idea. Apple featured the 1.0 Apple Watch app around the watchOS 6 launch. | indiegoodies.com/interviews/emmanuel_crouvisier |
| Founder's prior job | Director of Engineering at Alembic, Sep 2019 to Dec 2021 (per Crunchbase). He says he left a startup job in 2022 to work on CardPointers full-time. | crunchbase; Product Hunt (@emcro) |
| Funding | Bootstrapped. Founder on Product Hunt: "proudly still indie + bootstrapped after nearly 5 years." No funding rounds found. | producthunt.com/@emcro/activity |
| Team size | Effectively solo. ZoomInfo estimates 1–10 employees, Owler 1–25 (unconfirmed estimates). CB Insights lists only the founder. | zoominfo; owler; cbinsights |
| Revenue / users | **No published revenue, subscriber or user totals found.** Sub Club podcast: he tripled monthly revenue within two months of going full-time; affiliate revenue alone was limited, which pushed him to subscriptions. | subclub.com episode |
| Savings claims (company) | App Store: "most users save over $750 a year". 2025 podcast: average about $750/yr, cumulative "millions". Podcast titles cite "$24 million saved" (older episode). Search summaries also cite $100M+ and $200M+ figures I could not trace. **Marketing numbers; unverified.** | hurdygurdytravel.com 2025-03-31; everand.com ep. 19 |
| Billing infrastructure | RevenueCat + Stripe (RevenueCat case study on cross-platform purchases and better margins). | revenuecat.com/customers/cardpointers |

## 2. Platforms

- **iPhone, iPad, Mac, Apple Watch, Vision Pro** (visionOS app announced Feb 2024), plus CarPlay, widgets, Live Activities, Siri/App Intents, and Lock Screen/Control Center controls. Sources: 9to5mac 2024-02-12; help.cardpointers.com/article/50-carplay; /article/58.
- **Android** (Google Play, `com.cardpointers.app`): 4.3–4.4 stars, about 1.18K reviews, 50K+ downloads. The Points Party (2026) calls it a wrapper around the web app, not native. APKMirror lists a 7.x line from March 2026 described as a "Material 3 Expressive redesign", latest build 7.3.10 (2026-07-21). **Whether Android is native now is unverified.** I found no evidence of an Android v8. Sources: play.google.com; thepointsparty.com; apkmirror.com.
- **Web app** and **browser extension "CardPointers X"** for Chrome, Safari (macOS and iOS), and Firefox (including Firefox for Android). Sources: cardpointers.com/extension; chromewebstore; addons.mozilla.org.
- **AI and agent surfaces (2026):** an MCP server at `mcp.cardpointers.com/mcp` (OAuth with a CardPointers account; tools for best card for a purchase, offer search by merchant, and listing cards, offers and profiles). Help articles cover adding it to Claude as a custom connector and to OpenClaw. A ClawHub skill exists. An open-source **CLI** (`github.com/cardpointers/cli`, Homebrew/npm/shell install, JSON output for agents, v1.0.1) is also available. The CLI and the AI integrations require CardPointers+. Sources: cardpointers.com/llms-full.txt; help.cardpointers.com/article/79, /81, /82; clawhub.ai/emcro/cardpointers.

## 3. Features

### Core: best card per purchase
- Recommends the best card by store or category, using per-card **point valuations**. Defaults are set by CardPointers and the user can adjust each one with a +/- stepper. Recommendations change with those values. (help.cardpointers.com/article/36)
- **No transaction import**, so recommendations rely on card facts, offers and the user's own values. (pointbagel.com/alternatives/cardpointers)
- **Card database:** "over 5,000 cards from 900 banks" (App Store listing; Clark.com citing the company). An older Product Hunt page says 3,000+. Users can add cards that are not in the database. (clark.com; producthunt.com)

### Location
- **Location Reminders:** region-based (geofence) notifications telling you which card to use at a saved place. Stored on-device only. The free tier gets 1 reminder; Plus gets more. (help.cardpointers.com/article/18; cardpointers.com/pro)
- **Nearby Pointers:** a list of nearby stores with the best card for each. (help.cardpointers.com/article/9)
- **AutoPilot:** a Live Activity that shows the best card for the nearest store as you move. It appears in the Apple Watch Smart Stack and can be started from controls or Siri. Plus only. v7 announcement mentions "Widgets and AutoPilot for CarPlay". (cardpointers.com/v6; help article 58; x.com/emcro/status/1967581563815862446)
- App Store disclosure: background location use can reduce battery life. (justuseapp summary of the listing)

### Card-linked offers (the main paid driver)
- **Browser extension auto-add:** after opting in, logging into an issuer's site with the extension installed adds every available offer to every eligible card. This is the default setting. It runs in your own browser session, so CardPointers never needs your bank credentials. Supported issuers: **Amex, Chase, Citi, Bank of America, Wells Fargo, US Bank**. (help.cardpointers.com/article/26; /article/24; cardpointers.com/extension)
- Amex offers can be added to multiple cards (Plus). There is a Citi setting to skip dining offers. "Enrollment required" personal offers are not auto-enrolled. (help article 71, 69; frequentmiler.com/cardpointers)
- Offers sync into the app, which then reminds you of relevant offers by store. One creator reports the extension adding "800+ offers at a time" on Amex. (threads.com/@petitevagabond)
- **Founder (2025):** most users have about 250 offers available across their cards at any time. (hurdygurdytravel.com)
- **NEW in v8 (Sept 2026): in-app offer syncing.** The app itself logs into the 6 banks and can **sync offers automatically every night**. It is opt-in: usernames and passwords are stored in the device's local Keychain and "never stored on our servers". Turning off an account removes them. You can instead log in manually each time. **How 2FA is handled is unverified** (the help article's 2FA section was not readable). (help.cardpointers.com/article/85; cardpointers.com/v8; 9to5mac 2026-09-21)
- Breakage risk: release notes mention fixing a Chase Offers change (July 2025). One reviewer says auto-add "occasionally breaks". (search summary of App Store notes; wallethacks)
- **Offer Streak** chart (v7) and **Offer Savings dashboard** (v8). (x.com/emcro; 9to5mac 2026-09-21)

### Card-portfolio tracking
- **Annual fee / renewal reminders** with keep/cancel/downgrade prompts ("renewal recommendations"). (App Store listing via search; thoughtcard.com)
- **Benefit and credit tracking:** monthly, quarterly and annual credits with reminders. (thoughtcard.com; upgradedpoints.com)
- **Sign-up bonus / welcome-offer tracking.** (boldlygo.world; thoughtcard.com)
- **Chase 5/24 status.** Sources disagree on whether this is free or Plus-only. (thoughtcard.com; upgradedpoints.com)
- **Household / "P2" profiles:** track up to 6 family members' cards and offers. Each person needs their own account and must accept an invite. Access is one-way. Only the viewing account needs Plus. (help.cardpointers.com/article/52, /51)
- **Card application recommendations** ("which card to get next") were described in a 2019-era review. Their current form is unverified. (pointmetotheplane.boardingarea.com)
- **Rotating categories / quarterly activation reminders:** **not confirmed.** One 2026 review shows a Chase Freedom Q4 promo surfacing. A competitor comparison says MaxRewards auto-activates rotating categories while CardPointers handles them "manually". (thoughtcard.com; personal-finance-tools.pages.dev; financeaidaily.com)
- **Upgrade/downgrade (product change) recommendations:** only "renewal recommendations" were found. Specific product-change logic is unverified.
- **Referral links:** I found no in-app feature for sharing a user's own card referral links. **Unverified.**

### AI (2025–2026)
- **v7 (Sept 2025, iOS 26):** "Ask AI" in-app and "Siri, ask CardPointers", built on Apple Foundation Models. Sources conflict on where it runs: on-device only (The Points Party) vs. routed between on-device and Private Cloud Compute (App Store listing). Also in v7: a full Liquid Glass redesign, a Watch app showing nearby stores automatically, widgets, CarPlay AutoPilot, Offer Streak, keyboard shortcuts and menu bar for iPad/Mac, and passkey sign-in. (x.com/emcro/status/1967581563815862446; appadvice.com; impresskit.net press release; 9to5mac 2025-09-22)
- **v8 (Sept 2026, iOS 27):** 36 App Intents with Siri on-screen awareness (find, redeem, update and share offers); **Visual Intelligence** (point the camera at a storefront, product, screenshot or receipt to get the best card); 8 extra-large widgets; Mac menu bar app; Offer Savings dashboard; nightly in-app offer sync. The launch date is given as Sept 11, Sept 14 or Sept 21 depending on the source. (cardpointers.com/v8; 9to5mac 2026-09-21; pointsmilesandbling.com/cardpointers)
- MCP server + CLI (see Platforms).

## 4. Data model and privacy

- **Manual card entry, no Plaid / bank aggregation.** Users pick cards from the database. No card numbers and no bank logins are needed for core features. No source shows Plaid use. (boldlygo.world; norteapp.io comparison; financeaidaily.com)
- Offer data comes from the user's own authenticated browser session (extension) or, since v8, optional on-device login with credentials in Keychain.
- Location data stays on device. (help article 18)
- Extension: the founder says domain lookups happen locally, in reply to a reviewer comparing it to Honey. (addons.mozilla.org reviews)
- Contrast with competitors: MaxRewards **requires** bank linking; Kudos makes it optional. (norteapp.io; joinkudos.com, which is a competitor's site)

## 5. Pricing

Free tier, plus **CardPointers+** (formerly "Pro"): monthly, annual and lifetime plans.

**Free vs Plus (reported):** Free allows one card of each type, basic recommendations, offer viewing, one-at-a-time manual offer adding, and 1 location reminder. Plus adds bulk/auto offer adding, multi-card Amex offers, AutoPilot, more location reminders, P2 profiles, CLI/MCP access, and more tracking. (upgradedpoints.com; saymoola.com; cardpointers.com/pro)

**Price history (reconstructed from dated third-party reports, approximate):**

| Period | Annual | Lifetime | Source |
|---|---|---|---|
| Early (date unclear) | $40/yr | $120 | clark.com |
| Feb 2024 | ~$60/yr (50% sale = $30) | $200 (sale $100) | 9to5mac 2024-02-12 |
| 2024–2025 | $72/yr ($6/mo equivalent). Chrome reviewers complained of a "hefty price increase to 72$". | ~$240 implied (2025 podcast: 50% off = $36/yr, $120 lifetime) | upgradedpoints; finliteracynow; chromewebstore reviews; hurdygurdytravel |
| Early–mid 2026 | $89.99–$90/yr; monthly $7.50 (another source says $9.99) | $200 (The Points Party) or $279.99–$280 (Cloud9, Saymoola, ThoughtCard); conflicting | thepointsparty; cloud9club; saymoola; maxworth.app |
| From Oct 1, 2026 | **$99.99/yr** | **$299.99** | help.cardpointers.com/article/43; cardpointers.com/pro; upgradedpoints.com/news/cardpointers-sale |

- **Heavy promo cadence:** 50% sales are frequent (anniversary, Black Friday, 4th of July, Big Spring Sale, v8 launch), and partner affiliate links give 30–50% off. The v8 launch sale ran until Sept 20 or Sept 30, 2026 (sources conflict), ahead of the Oct 1 increase. (dannydealguru; upgradedpoints; insideflyer; pointsmilesandbling)
- One search summary of the App Store listing claimed the developer "only sells lifetime" and showed $119.99 and $199.99 lifetime tiers. This is **garbled and unverified**, probably a misreading of the in-app purchase list.
- The founder says he keeps lifetime because some users are "allergic to subscriptions". He has publicly said he has no regrets about lifetime buyers. (hurdygurdytravel; x.com/emcro/status/1825168825311977866)

## 6. Business model

- **Mainly subscriptions** (CardPointers+). Sub Club episode: affiliate revenue alone was limited, which led to the Pro tier. (subclub.com)
- **Its own affiliate program for selling CardPointers+:** a large network of points-and-miles bloggers and creators (`cardpointers.com/partner/<name>`) earn commission and offer discounts. This is likely a major acquisition channel, judging by how many reviews carry partner links. (threads.com; upgradedpoints; cloud9club; 9to5mac sponsored-style posts)
- **Credit card application affiliate revenue:** the founder said early on that he had no partnership links and that compliance rules are heavy. I found no evidence of current card-application affiliate revenue. **Unverified.** (subclub.com)

## 7. Ratings and reception

- **iOS (US):** about 4.7 stars, with 8.9K–9.8K ratings depending on the snapshot (AppGoblin 4.74 / 8.9K; App Pricing Lab 4.7 / 9.2K; AppFollow ~9,840). One search snippet said "4.6 from 175 ratings", likely the Mac-only listing. (appgoblin.info; apppricinglab.com; appfollow.io)
- **Google Play:** 4.3–4.4 stars, about 1.18K reviews, 50K+ downloads. (play.google.com)
- **Chrome Web Store:** 4.3 from 63 ratings (snapshot). **Firefox:** 4.4–4.6 from 13–18 reviews. (chromewebstore; addons.mozilla.org)
- Press: steady 9to5Mac "Indie App Spotlight" and sale posts (2022, 2024, 2025, 2026), AppAdvice, View from the Wing, Frequent Miler, Doctor of Credit (early Chrome extension post; V2.0 recap), Upgraded Points, Clark.com. Many podcasts (Sub Club, Launched by RevenueCat, Hurdy Gurdy, Point Me to First Class, Award Travel 101, Geobreeze, Hacking Your Wanderlust). No Apple Design Award or App Store Award found.

### Praise (recurring)
1. Auto-adding offers saves time: "my favorite feature", "SO satisfying". (upgradedpoints; threads.com)
2. Responsive solo developer and support. (App Store reviews via search; addons.mozilla.org)
3. Deep Apple-platform integration (Watch, widgets, Siri, CarPlay, Live Activities).
4. No bank linking needed. (wallethacks: "requires no sensitive information")

### Complaints and pain points (recurring, from the sources I could reach)
1. **Price increases and subscription cost:** "hefty price increase to 72$" (Chrome reviews); "yearly Pro cost didn't seem worth it" (saashub user comment); "Is it worth $90 a year?" framing; subscription pricing "confusing" (mwm.ai summary of ~982 reviews). Now $99.99/yr.
2. **Free tier too limited.** The useful features are paywalled. (wallethacks; thepointsparty)
3. **Poor fit for people with 1–2 cards**, and setup takes effort. (upgradedpoints)
4. **Android is second-class** (web wrapper per The Points Party; reviewers recommend MaxRewards for Android). (thepointsparty)
5. **Fragility when banks change sites:** auto-add "occasionally breaks"; Chase Offers fix in July 2025; Safari setup worked on iPad but not iPhone for one reviewer. (wallethacks; App Store notes)
6. **Performance:** "very laggy" (Chrome reviews); release notes on speeding up for users with many offers. (chromewebstore; Play release notes)
7. **Data glitches:** "All of my credit cards disappeared"; data not always showing across the app. (justuseapp, sparse)
8. **Support gaps:** one Google Play user with unanswered emails after an accidental purchase (developer replied with refund steps). (play.google.com)
9. **Trust and privacy worries:** compared to Honey; one user "worries when anything wants my credit card info". v8's Keychain credential storage may raise this further. (addons.mozilla.org; justuseapp)
10. **No transaction data**, so no spend tracking or minimum-spend progress tracked from actual transactions; it relies on user-set values. (pointbagel.com)
11. Rotating categories are not auto-activated (vs MaxRewards Gold). (competitor-authored comparison)

**Not covered:** Reddit (r/churning, r/CreditCards, r/awardtravel) and FlyerTalk threads in depth (one FlyerTalk user paid for "Chrome-only CardPointers Plus" to add Amex and Chase offers to all cards). These need a manual read.

## 8. Timeline

- 2019: Founded; web MVP; v1.0 with Watch app featured by Apple (watchOS 6).
- Early: Chrome extension for Amex and Chase offers (Doctor of Credit), later Citi, BofA, Wells Fargo, US Bank.
- 2022: Founder goes full-time; 9to5Mac indie interview.
- Feb 2024: Vision Pro app.
- Aug–Sep 2024: CardPointers 6 (AutoPilot Live Activity, controls). (x.com/emcro/status/1825168825311977866; 9to5mac 2024-09-14)
- Sep 2025: CardPointers 7 (iOS 26, Liquid Glass, Apple Intelligence "Ask AI", Offer Streak).
- 2026 (date unclear, help article about 9 months old in search): MCP server + CLI.
- Mar 2026: Android 7.x redesign.
- Sep 2026: CardPointers 8 (in-app nightly sync, Visual Intelligence, 36 App Intents).
- Oct 1, 2026: price rise to $99.99/yr and $299.99 lifetime.

## 9. Implications for a competitor (analysis, not sourced fact)

- The moat is **offer automation across 6 issuers** plus deep native iOS integration and an affiliate-blogger distribution network. It is not the data itself, since the card database is matched by others.
- The visible gaps are Android quality, price sensitivity (repeated increases, $99.99/yr), fragility when bank sites change, no transaction-based tracking (minimum spend progress, actual credit usage), no automated rotating-category activation, and trust concerns about stored credentials.
- Because it is a solo developer, breadth beyond iOS will likely stay thin.

---

## Sources

- https://help.cardpointers.com/article/44-who-makes-cardpointers-and-how-did-it-start
- https://www.crunchbase.com/person/emmanuel-crouvisier
- https://indiegoodies.com/interviews/emmanuel_crouvisier
- https://www.producthunt.com/@emcro/activity
- https://www.producthunt.com/products/cardpointers
- https://subclub.com/episode/from-zero-revenue-to-a-full-time-gig-in-less-than-a-year-emmanuel-crouvisier-cardpointers
- https://www.revenuecat.com/customers/cardpointers
- https://hurdygurdytravel.com/2025/03/31/interview-with-emmanuel-crouvisier-of-cardpointers/
- https://www.everand.com/podcast/589146191/Episode-19-CardPointers-What-Card-to-Use-App-has-Saved-Users-24-million-with-Emmanuel-Crouvisier
- https://www.zoominfo.com/c/cardpointers/1321326917
- https://www.cbinsights.com/company/cardpointers
- https://9to5mac.com/2022/09/06/best-credit-cards-rewards-app-iphone/
- https://9to5mac.com/2024/02/12/cardpointers-vision-pro-credit-card-rewards/
- https://9to5mac.com/2024/09/14/indie-app-spotlight-cardpointers/
- https://9to5mac.com/2025/09/22/cardpointers-updated-for-ios-26-with-liquid-glass-design-apple-intelligence-more/
- https://9to5mac.com/2026/09/21/cardpointers-updated-for-ios-27-with-siri-ai-automatic-offer-syncing-and-much-more/
- https://appadvice.com/post/cardpointers-7-is-here-with-liquid-glass-redesign-and-much-more/782394
- https://impresskit.net/press-release/530d1eba-3290-4b2c-bd1f-9a3f89fb10ec
- https://x.com/emcro/status/1967581563815862446
- https://x.com/emcro/status/1825168825311977866
- https://cardpointers.com/v8/
- https://cardpointers.com/v6/
- https://cardpointers.com/pro/
- https://cardpointers.com/extension/
- https://cardpointers.com/llms-full.txt
- https://help.cardpointers.com/article/43-how-much-does-cardpointers-cost
- https://help.cardpointers.com/article/85-in-app-offer-syncing
- https://help.cardpointers.com/article/24-how-to-install-on-safari
- https://help.cardpointers.com/article/26-adding-amex-chase-boa-and-citi-offers
- https://help.cardpointers.com/article/71-adding-an-offer-to-multiple-cards
- https://help.cardpointers.com/article/69-what-are-personal-vs-standard-offers
- https://help.cardpointers.com/article/18-location-reminders
- https://help.cardpointers.com/article/9-nearby-pointers
- https://help.cardpointers.com/article/50-carplay
- https://help.cardpointers.com/article/58-lock-screen-and-control-center-controls
- https://help.cardpointers.com/article/36-what-are-point-values-how-do-i-use-the-points-that-i-earn
- https://help.cardpointers.com/article/52-user-profiles-p2-support
- https://help.cardpointers.com/article/51-can-i-add-my-husband-wifes-cards
- https://help.cardpointers.com/article/79-add-cardpointers-to-claude
- https://help.cardpointers.com/article/81-add-cli-version-of-cardpointers
- https://help.cardpointers.com/article/82-add-cardpointers-to-openclaw
- https://github.com/cardpointers/cli
- https://clawhub.ai/emcro/cardpointers
- https://apps.apple.com/us/app/cardpointers-maximize-rewards/id1472875808
- https://play.google.com/store/apps/details?id=com.cardpointers.app&hl=en_US
- https://www.apkmirror.com/?p=14415486
- https://chromewebstore.google.com/detail/cardpointers-x-credit-car/hlambnnbnnjkabpgemeompijpdliimkm/reviews
- https://addons.mozilla.org/en-US/firefox/addon/cardpointers-x/reviews/
- https://appgoblin.info/apps/1472875808
- https://apppricinglab.com/app/apple/1472875808
- https://apps.appfollow.io/ios/cardpointers-for-credit-cards/1472875808?country=us
- https://justuseapp.com/en/app/1472875808/cardpointers-for-credit-cards/reviews
- https://mwm.ai/apps/cardpointers-for-credit-cards/1472875808
- https://www.doctorofcredit.com/free-chrome-extension-easily-adds-all-available-amex-offers/
- https://www.flyertalk.com/forum/credit-card-programs/2139994-building-app-get-most-cash-back.html
- https://frequentmiler.com/cardpointers/
- https://viewfromthewing.com/amex-and-chase-credit-card-discounts-are-easy-to-miss-cardpointers-loads-them-for-you-and-its-now-50-off/
- https://upgradedpoints.com/credit-cards/cardpointers-review/
- https://upgradedpoints.com/news/cardpointers-sale/
- https://thepointsparty.com/articles/cardpointers-review-maximize-credit-card-rewards
- https://cloud9club.net/card-pointers-review/
- https://thoughtcard.com/cardpointers-review/
- https://saymoola.com/cardpointers-review
- https://wallethacks.com/cardpointers-app-review/
- https://clark.com/credit-cards/cardpointers-review/
- https://boldlygo.world/cardpointers-app-review/
- https://finliteracynow.org/cardpointers-app-review-2025-maximize-your-credit-card-rewards/
- https://www.insideflyer.com/posts/cardpointers-cuts-price-by-half-to-help-users-claim-hidden-credit-card-offers/
- https://dannydealguru.com/50-off-cardpointers-plans/
- https://pointsmilesandbling.com/cardpointers/
- https://www.threads.com/@petitevagabond/post/DWeKLB8FNya/
- https://pointbagel.com/alternatives/cardpointers
- https://financeaidaily.com/blog/cardpointers-vs-maxrewards-vs-kudos-2026/
- https://norteapp.io/best-credit-card-benefit-tracker-apps
- https://personal-finance-tools.pages.dev/blog/best-credit-card-rewards-apps-2026/
- https://www.joinkudos.com/blog/kudos-vs-cardpointers-which-app-maximizes-your-rewards-better-2025
- https://www.saashub.com/compare-cardpointers-vs-naqoda-banking-platform
- https://pointmetotheplane.boardingarea.com/this-app-helps-you-decide-which-credit-card-is-best-to-use-for-any-particular-transaction/
