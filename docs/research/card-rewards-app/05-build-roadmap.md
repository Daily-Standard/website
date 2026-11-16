# Card Rewards: build roadmap research

Date: 2026-11-16. Scope: what the next features need (hosting, push, nearby stores, accounts and sharing, bank linking, native app, card data upkeep, monetization), with sourced costs and a phased plan.

**How this was researched, and its limits.** Every official vendor page I tried (developers.google.com/.cn, developers.cloudflare.com, plaid.com, teller.io, wiki.openstreetmap.org) was blocked from WebFetch in this network, so most facts come from search-result snippets. Where a figure appears only on a third-party site, or sources disagree, it is marked **[unverified]** or **[conflicting]**. Check prices on the vendor's own page before you commit money. I did not invent any price or limit. Where I computed a cost from a sourced unit price, the arithmetic and assumptions are stated.

**Starting point** (from `apps/card-rewards/README.md` and `js/engine.js`): a static PWA with vanilla JS ES modules and a service worker (`sw.js`). Card and merchant data is bundled as JS modules (`js/data/cards.js`, `js/data/merchants.js`), state lives in `localStorage`, and `engine.js` holds the pure ranking and benefit-period logic, with tests. It has no backend, account or network calls. The repo root `netlify.toml` already deploys `public/` for the main site.

---

## 1. Hosting and deploy

### Netlify: a second site from a subfolder of this repo
- Create a **new Netlify site** linked to the same repo. Set **Base directory = `apps/card-rewards`**, leave the build command empty, and set the **Publish directory** to the base itself. Netlify treats the publish directory as relative to the base directory, and runs the install and build steps in the base directory ([Netlify support guide](https://answers.netlify.com/t/support-guide-what-if-my-project-folder-is-not-the-root-of-my-git-repository/123), [Netlify build config docs](https://docs.netlify.com/build/configure-builds/overview)).
- A `base` set in a root-level `netlify.toml` overrides the UI ([Netlify docs](https://docs.netlify.com/build/configure-builds/overview)). The root `netlify.toml` here sets only `publish = "public"` and no `base`, so it should not conflict. For multiple sites from one repo, Netlify recommends keeping each site's `netlify.toml`, `_redirects` and `_headers` in its own package directory ([Netlify blog: better monorepos](https://www.netlify.com/blog/better-monorepos-on-netlify), [monorepo docs](https://docs.netlify.com/build/configure-builds/monorepos/)). Recommendation: add `apps/card-rewards/netlify.toml` with `publish = "."` and headers that stop the service worker being cached (`Cache-Control: no-cache` on `/sw.js`). Test on a deploy preview, because I could not confirm from the docs which `netlify.toml` wins when the base is a subfolder.
- Both sites will rebuild on every push. Netlify's `[build] ignore` command (for example `git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- .`) can skip builds when a site's folder didn't change. This comes from my knowledge of Netlify, not from a source fetched today, so verify it in Netlify's docs.
- **Free tier (credit-based):** the Free plan has **300 credits/month**. It is a hard cap with no overage billing, and third-party sources say sites **pause until the monthly reset** when the credits run out ([Netlify changelog](https://www.netlify.com/changelog/netlify-pricing-update-introducing-credit-based-plans/), [netli.fyi](https://netli.fyi/blog/netlify-free-plan-limits-2026), [supadrop](https://supadrop.host/blog/netlify-pricing-free-tier-limits/)). The credit cost per GB of bandwidth is **[conflicting]**: sources say 10 or 20 credits/GB. Pro's allowance is also **[conflicting]** (3,000 vs 5,000 credits), and one source says pricing changed again in April 2026. The credits are shared across the team, so the main Dad Gains site and this app would draw on the same 300.

### Alternatives
| Host | Free tier (sourced) | Fit |
|---|---|---|
| **Cloudflare Pages / Workers static assets** | Static-asset requests are **free and unlimited** on free and paid plans. Pages Free has 500 builds/month ([CF Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/index.md), [temps.sh](https://temps.sh/blog/cloudflare-pages-free-tier-limits-2026)). Cloudflare is steering new projects toward Workers with static assets **[secondary source]** ([eastondev](https://eastondev.com/blog/en/posts/dev/20260526-cloudflare-free-limits/)). | Best fit if a push or API backend will also live on Workers. Supports the root-directory setting for monorepos. |
| GitHub Pages | ~100 GB/month soft bandwidth limit, commercial use allowed **[unverified, single third-party source]** ([cmaven](https://cmaven.github.io/en/hosting/netlify-vercel-static-hosting-comparison/)) | Fine for a static PWA. Has no functions, and serving a subfolder needs an Actions workflow. |
| Vercel Hobby | **Non-commercial, personal use only** ([Vercel docs](https://vercel.com/docs/plans/hobby)) | Not suitable once the app is monetized, unless you pay for Pro. |

**Recommendation:** for the prototype, deploy now as a second Netlify site (no new vendor). Once Phase 2 adds a backend, move to **Cloudflare (Workers static assets + Worker API + cron)**. It removes the shared 300-credit risk and puts the static files, push sender and API on one free or $5 plan.

---

## 2. Web push and the PWA's limits on iOS and Android in 2026

**iOS / iPadOS**
- Web push works **only for Home Screen web apps** on iOS/iPadOS **16.4+**. Safari tabs can't subscribe. The permission prompt must follow a user tap inside the installed app, and after **"Don't Allow" iOS won't prompt again** for that app ([MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide), [Pushpad](https://pushpad.xyz/blog/ios-special-requirements-for-web-push-notifications), [OneSignal docs](https://documentation.onesignal.com/docs/en/web-push-for-ios)).
- **Declarative Web Push** shipped in iOS/iPadOS **18.4** (March 2025). The push payload describes the notification, so Safari can show it without running the service worker. Other browsers don't support it as of late 2026 **[single vendor source]**, so keep a service-worker `push` handler as well ([WebKit blog](https://webkit.org/?p=16535), [WWDC25 session 235](https://developer.apple.com/br/videos/play/wwdc2025/235/), [Aimtell](https://aimtell.com/blog/state-of-declarative-web-push-2026)).
- On **iOS 26+**, sites added to the Home Screen open as web apps by default ([firt.dev](https://firt.dev/notes/pwa-ios/), [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)). I found no iOS 27 changes for web apps **[unverified]**.
- Standard web push (Safari 16+) **does not require a paid Apple Developer membership** ([AppleInsider](https://appleinsider.com/articles/22/06/21/apples-relationship-with-web-apps-will-improve-in-2023/), [Apple forum](https://developer.apple.com/forums/thread/767613)). It uses the standard Web Push protocol with VAPID keys.

**Background work**
- **Periodic Background Sync is not supported in Safari/iOS** through 26.5 per caniuse, and isn't in Firefox. It is supported in **Chromium** (Chrome 80+), including Chrome Android, and **only for installed PWAs** ([caniuse](https://caniuse.com/wf-periodic-background-sync), [web.dev](https://web.dev/patterns/web-apps/periodic-background-sync), [MDN](https://developer.mozilla.org/docs/Web/API/PeriodicSyncManager)).
- Conclusion: on iPhone the web app cannot wake itself up. Every "credit expires in 3 days" or "activate Q1 categories" reminder must be **sent from a server**. On Android, web push works in Chrome, and periodic sync could serve as a fallback for installed users.

**What you need**
1. A VAPID key pair (the private key stays on the server).
2. A `push` + `notificationclick` handler in `sw.js` (the app already has a service worker).
3. A server to store `PushSubscription` objects and send pushes. Each subscription has to be tied to the reminders it should receive. That means sending the server a reminder schedule (credit IDs and reset dates), which ends the app's "nothing leaves your browser" promise. Make it opt-in and send only the minimum (dates and short labels, not spend data).

**Minimal backend options**
| Option | Sourced limits and costs | Notes |
|---|---|---|
| **Cloudflare Worker + Cron Trigger + D1/KV** | Free: 100,000 requests/day, **10 ms CPU per invocation (cron too)**, 5 cron triggers per account ([CF limits](https://developers.cloudflare.com/workers/platform/limits)). Paid: **$5/month minimum**, includes 10M requests and 30M CPU-ms, then $0.30 per extra million requests ([CF pricing](https://developers.cloudflare.com/workers/platform/pricing/)). | The Node `web-push` package fails on Workers (`crypto.createECDH`). Use a WebCrypto library such as **@pushforge/builder**, web-push-neo or web-push-browser ([pushforge](https://github.com/draphy/pushforge), [web-push-neo](https://github.com/ryoppippi/web-push-neo)). VAPID signing plus payload encryption per subscriber may exceed the free tier's 10 ms CPU limit, so plan on the $5 Paid plan. |
| Supabase Edge Function + `pg_cron` | Free: 500,000 invocations/month. Pro: 2M included, then $2 per million ([Supabase docs](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations)). | Free projects **pause after 7 days of inactivity**, which stops cron jobs ([runhooks](https://runhooks.app/blog/preventing-supabase-free-tier-pausing/)). Use Pro ($25) if push depends on it. A good fit if accounts are also on Supabase (section 4). |

**Recommendation:** in Phase 1, add opt-in push on a **Cloudflare Worker with a daily cron**, a WebCrypto push library and a D1 table of subscriptions plus reminder dates. Keep the existing .ics calendar export as the fallback for people who decline notifications or never install the app.

---

## 3. "Nearby stores"

**Browser constraints.** The Geolocation API needs HTTPS and a user permission grant, and it works **only while the page is open**. The web has no background location and no geofencing, so "you're at Costco, use card X" alerts are impossible in a PWA. (The foreground-only constraint is standard platform behavior. Combined with the lack of background sync on iOS above, the web can't do geofence notifications.) A PWA can offer **"Stores near me" on tap**.

**What the feature needs.** Only the *identity/brand* of nearby stores (Costco, Whole Foods, Shell…), matched to `merchants.js`. It doesn't need ratings, photos or hours, so the cheapest field tier of any provider is enough.

| Provider | Pricing / quota (sourced) | Storage / caching terms | Notes |
|---|---|---|---|
| **Google Places API (New)** | Since 2025-03-01 the $200 credit is gone. Each SKU gets a free monthly cap instead: **Essentials 10,000, Pro 5,000, Enterprise 1,000** ([Google March 2025 changes](https://developers.google.com/maps/billing-and-pricing/march-2025), [Google FAQ](https://developers.google.cn/maps/billing-and-pricing/faq?authuser=1)). **Nearby Search Pro: $32 per 1,000** after 5,000 free ([Google pricing list](https://developers.google.com/maps/billing/pricing), [OpenPlacesAPI](https://openplacesapi.com/blog/google-places-api-pricing)). **Text Search Essentials (IDs Only) is free and unlimited**, but returns only place IDs. Place Details Essentials at $5/1,000 is **[unverified]**. | `place_id` may be stored indefinitely. lat/lng may be cached **up to 30 days**. Other fields have no caching exception **[third-party]** ([Places policies](https://developers.google.cn/maps/documentation/places/web-service/policies?authuser=4), [Service Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms/index-20240422)). | The best data, but the most expensive at scale. |
| **Apple MapKit JS** | Free **250,000 map views + 25,000 service calls per day** per Apple Developer Program membership. Search counts as a service call, and the quota is shared with the Apple Maps Server API ([Apple MapKit JS pricing](https://developer.apple.com/maps/mapkitjs/pricing), [WWDC22 notes](https://wwdcnotes.com/notes/wwdc22/10006)). One forum post says the dashboard now shows limits **per month** **[unverified]** ([Apple forum](https://developer.apple.com/forums/thread/818109)). Above the quota you fill in a capacity-request form. | Requires the $99/year developer membership. | Works in any browser via JS, and has a points-of-interest category filter. **Recommended.** |
| Foursquare Places API | Pro endpoints with free calls: 10,000 vs 500 is **[conflicting]**. ~$15–$18.75 per 1,000 **[unverified unit]** ([Foursquare pricing](https://foursquare.com/pricing/), [Foursquare upcoming changes](https://docs.foursquare.com/developer/reference/upcoming-changes)). | — | The **FSQ Open Source Places** dataset (~100M places) is Apache 2.0 with attribution, now gated behind registration ([Foursquare blog](https://foursquare.com/resources/blog/data/evolving-fsq-open-source-places/), [HF](https://huggingface.co/datasets/foursquare/fsq-os-places)). Could serve a self-hosted chain lookup. |
| Mapbox Search Box (category search) | Free sessions: 500 vs 2,500 is **[conflicting]**. Preview pricing of ~$3 per 1,000 sessions **[unverified]** ([Mapbox Search JS pricing](https://docs.mapbox.com/mapbox-search-js/guides/pricing/), [PricingSaaS](https://pricingsaas.com/companies/mapbox/diffs/2026W40)). | Results are for **temporary use only**. Storing them needs a sales contract ([Mapbox temp vs permanent](https://docs.mapbox.com/help/dive-deeper/understand-temporary-vs-permanent-geocoding/)). | — |
| OpenStreetMap via public Overpass | No price. The often-quoted "<10,000 queries/day, <1 GB/day" comes from a third-party directory **[unverified]**. The OSM wiki says to divide those numbers by 100 for regular use, and to self-host or pay for commercial use. Limits count per app across all users ([OSM wiki](https://wiki.openstreetmap.org/wiki/Overpass_API), [apis.io](https://apis.io/providers/openstreetmap/), [OSM help](https://help.openstreetmap.org/questions/52384/very-restrictive-usage-limit-on-the-overpass-api-since-a-while)). | ODbL (share-alike on derived databases). | OSM's `brand:wikidata` tags make chain matching easy, but the **public instance is not suitable for a production app**. |

**Worked cost example (my arithmetic, using the sourced Google unit price).** Assume 10,000 users × 10 nearby searches/month = 100,000 Nearby Search Pro calls. That is (100,000 − 5,000) × $0.032 ≈ **$3,040/month**. The same load on MapKit JS is ~3,300 calls/day, well under 25,000/day, so **$0 beyond the $99/year membership**.

**Recommendation:** use **Apple MapKit JS** point-of-interest search, called on tap. Round coordinates (~100 m) before sending, cache results in memory for the session only, and map the returned names and categories to `merchants.js` with the existing fuzzy matching. Keep a manual "search a store" fallback. Revisit Google only if MapKit's US coverage proves poor in testing. Background "you're at a store" alerts need the native app (section 6).

---

## 4. Accounts and household sharing

| | Supabase | Firebase | Cloudflare D1 + your own auth |
|---|---|---|---|
| Free tier | 500 MB DB, **50,000 MAU**, 5 GB egress, 2 projects. **Pauses after 1 week of inactivity**. Pro **$25/month**, then $0.00325/MAU over the included amount ([makerkit](https://makerkit.dev/blog/saas/supabase-pricing), [activepieces](https://www.activepieces.com/blog/supabase-pricing-free-tier-limits-pro-costs-egress.md)) **[third-party; confirm at supabase.com/pricing]** | Spark: **50,000 Firestore reads + 20,000 writes per day** ([Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)). Auth ~50K MAU **[unverified]**. Cloud Storage requires Blaze from Feb 2026 **[secondary]** ([agentdeals](https://agentdeals.dev/vendor/firebase)) | D1 on Workers Free: 500 MB per database, 5 GB per account. ~5M rows read and 100K rows written per day **[secondary]**. Over-limit queries **fail** since enforcement began 2026-09-01 ([CF changelog](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/), [D1 FAQ](https://developers.cloudflare.com/d1/reference/faq)) |
| Sharing model | Postgres **row-level security (RLS)**: a `household_members` table plus policies ([Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security)) | Security Rules on documents | You write the authorization checks in the Worker |
| Passkeys | **Beta** since 2026-05-28. "Experimental, API may change" ([Supabase changelog](https://supabase.com/changelog/46458-passkeys-for-supabase-auth-beta), [docs](https://supabase.com/docs/guides/auth/passkeys)) | (not researched) | Via an auth library (not researched) |

**RLS pattern for a shared wallet.** Tables: `households(id)`, `household_members(household_id, user_id, role)`, and `wallet_cards`, `benefit_usage` and `settings` each keyed by `household_id`. The policy: `household_id in (select household_id from household_members where user_id = (select auth.uid()))`. Wrapping `auth.uid()` in a `select` is Supabase's performance advice. To avoid infinite recursion when `household_members` has RLS too, put the membership lookup in a `security definer` function with a pinned `search_path` ([MakerKit RLS best practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices), [DEV: recursion gotcha](https://dev.to/mateuszingano/the-supabase-rls-gotcha-nobody-warns-you-about-infinite-recursion-in-multi-tenant-policies-42jm)). Invites: a single-use token row that an Edge Function redeems into a membership.

**End-to-end encryption (optional, privacy as a selling point).** The data here (which cards you hold, benefit-usage ticks) is low-sensitivity but personal. Options: (a) encrypt the wallet JSON client-side with a household key, store ciphertext in one `blob` column, and wrap the household key for each member's public key with libsodium **sealed boxes**. WebCrypto has no sealed-box primitive, so this needs libsodium ([DEV E2EE post](https://dev.to/webdevtodayjason/building-a-social-platform-with-client-side-end-to-end-encryption-36b2)). (b) Use a local-first E2EE sync library: **Evolu** (MIT, self-hostable relay) **[third-party listing]** ([toolradar](https://toolradar.com/tools/evolu-local-first)) or **secsync** (beta) ([secsync](https://awesome.ecosyste.ms/projects/github.com%2Fnikgraf%2Fsecsync)). The tradeoffs: E2EE blocks server-side push scheduling from wallet data (the client must upload a separate plaintext reminder schedule), and key loss on device reset needs a recovery-key flow. Recommendation: **start without E2EE**, collect only what is needed, and revisit if users ask.

**Sign-in methods.** Offer magic link plus Google, and **Sign in with Apple**. If an iOS app later offers Google login, App Store guideline 4.8 requires an "equivalent" privacy-preserving login option. Sign in with Apple satisfies it ([Apple forum on 4.8](https://developer.apple.com/forums/thread/765145), [vp0](https://vp0.com/blogs/apple-sign-in-required-rejection-fix-swiftui)). Add passkeys once Supabase's support leaves beta.

**Recommendation:** use **Supabase** (Postgres and RLS fit the household model, auth is built in, and Edge Functions plus pg_cron can also run push). Move to **Pro ($25/month)** before real users so the project never pauses. If you'd rather stay all-Cloudflare, D1 plus a Worker works, but you'd write the auth and authorization yourself.

---

## 5. Bank linking (later)

**Why it's useful:** automatically confirming credit usage ("$15 Uber credit used") and tracking spend toward category caps.

**Plaid**
- **Free Trial plan** (US/CA teams created on or after **2026-04-15**): production APIs including Transactions, **capped at 10 Items**, with no business registration or security questionnaire. Choose "Personal use" at signup ([Plaid support: Trial plan](https://support.plaid.com/hc/en-us/articles/39994173227159-What-is-the-Plaid-Trial-plan), [Plaid billing](https://plaid.com/en-eu/docs/account/billing/)). **Limited Production is closed to new US/CA signups** as of the same date ([Plaid support](https://support.plaid.com/hc/en-us/articles/16110110883479-How-are-Sandbox-Production-Trial-plan-and-Limited-Production-different)).
- **Full Production:** Production approval, company information, an MSA addendum, and a **security questionnaire** reviewed by Plaid's Risk team ([Plaid help center](https://plaid.zendesk.com/api/v2/help_center/en-us/articles/15373800196759.json), [Developer Policy](https://plaid.com/developer-policy/)). Anecdotally it is geared to companies ([Bubble forum](https://forum.bubble.io/t/plaid-oauth-access-how-strict/258045)). Practically this means a legal entity, a privacy policy, MFA and access controls, and encryption at rest.
- **Pricing:** Transactions is billed as a **subscription fee per connected Item** ([Plaid billing docs](https://plaid.com/en-eu/docs/account/billing/)). I found **no published per-Item dollar price**. Third-party estimates vary (Vendr: $0.30–$0.60 per call) **[unverified]** ([Vendr](https://www.vendr.com/marketplace/plaid)). Treat it as quote-based.
- **Categories:** `personal_finance_category` **v2 (PFCv2)**: teams that enabled Transactions before ~Dec 2025 get v1 by default and can opt in with the version parameter; newer teams may get v2 only ([Plaid PFC migration guide](https://plaid.com/docs/transactions/pfc-migration/)). **I found no evidence that Plaid returns raw MCCs** on Transactions. A write-up describes its taxonomy as replacing MCCs ([Glenbrook](https://glenbrook.com/payments_views/plaid-a-modern-api-for-card-data/)). **[Uncertain: check the response schema in Sandbox.]** This matters because issuers award bonus rates by MCC. PFC plus `merchant_name` is an approximation, so the app should present matches as "likely".

**Teller:** free for independent developers, with **100 live connections** on the developer tier. Production requires a paid account, and the per-connection price was not found ([teller.io](https://teller.io/), [Rutter guide](https://docs.rutter.com/platforms/banking/teller)). Smaller institution coverage than Plaid **[general knowledge, verify]**.

**MX:** no public free tier or pricing. It is enterprise or quote-based ([toolradar](https://toolradar.com/tools/mx/pricing), [activepieces](https://www.activepieces.com/blog/plaid-pricing-2026-cost-per-connection-and-request)). Not suitable at this stage.

**Apple FinanceKit (native iOS only):** reads Apple Card, Apple Cash and Savings transactions on iOS 17.4+. It requires an **organization** developer account and a managed entitlement that Apple reviews ([Apple FinanceKit](https://developer.apple.com/financekit), [docs](https://developer.apple.com/documentation/financekit.md)). It covers only Apple's own cards in the US.

**What it would take:** a backend (access tokens must never reach the browser), a webhook receiver for `SYNC_UPDATES_AVAILABLE`, encrypted token storage, a merchant-to-category mapping layer, an LLC, a privacy policy and data-deletion flow, and Plaid's questionnaire. **Recommendation:** prototype on Plaid's **Trial plan (10 Items)** for yourself and a few testers in Phase 4. Commit to full Production only once paid users ask for it, and after getting a Plaid quote.

---

## 6. Native app path

**Native-only features that matter for this app**
- **Background "you're at a store" alerts:** Core Location region monitoring is limited to **20 regions per app**. The workaround is to register only nearby stores and swap them as the user moves ([Apple Location Awareness guide](https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/LocationAwarenessPG/RegionMonitoring/RegionMonitoring.html), [Radar](https://radar.com/blog/limitations-of-ios-geofencing)). Whether the newer `CLMonitor` has the same limit is **[unverified]** ([Apple forum](https://developer.apple.com/forums/thread/736099)).
- **Home Screen / Lock Screen widgets** ("best card for groceries", "expiring credits"), **Apple Watch** complications, and **Siri/App Intents/Shortcuts** ("Which card for Costco?"). These need native Swift extensions **[general knowledge]**.
- **Reliable local notifications** without a server, and **FinanceKit** (above).

**Options**
| Path | Pros | Cons |
|---|---|---|
| **Capacitor wrap** of the existing PWA, plus native Swift extensions for widgets and App Intents | Reuses `engine.js`, the data and the UI. Plugins exist for geofencing and local notifications. | **Guideline 4.2 (minimum functionality) risk**: a Capacitor app with native location features was still rejected as "not sufficiently differentiated from web browsing" ([Apple forum](https://developer.apple.com/forums/thread/812889), [MobiLoud](https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper)). Widgets still need Swift, with data shared through an App Group. |
| React Native | Cross-platform. `engine.js` is pure JS and portable. | Full UI rewrite. Widgets and Watch still need native code. |
| SwiftUI rewrite | Best widgets, Watch and App Intents integration. | iOS only, and the engine must be ported. Keeping it in JS (JavaScriptCore) is an option. |

**App Store rules for finance apps**
- **Guideline 5.1.1(ix):** apps in highly regulated fields (banking, **financial services**, …) or handling sensitive data must be submitted by a **legal entity enrolled as an organization**, not an individual ([conductatlas summary](https://conductatlas.com/platform/apple/apple-app-store-review-guidelines/provision/CA-P-019068/regulated-and-sensitive-apps-must-be-submitted-by-legal-entities/), [Apple forum rejection](https://developer.apple.com/forums/thread/740042)). **Uncertain:** whether a rewards optimizer with **no bank linking** counts as "financial services". I found no official ruling, and a forum asking about a read-only bank-data app got no clear answer. Once Plaid or FinanceKit linking exists, assume it does. **Recommendation:** enroll as an **organization (LLC + D-U-N-S)** from the start. The fee is the same **$99/year**, and organization enrollment can take days to about two weeks ([Adalo guide](https://studio.adalo.com/blog/apple-developer-program-guide), [twinr](https://twinr.dev/blogs/apple-developer-program-enrollment-guide)). FinanceKit also requires an organization account.

**Recommendation:** stay a PWA until there is traction (push, nearby-on-tap and sync all work on the web). Then build **Capacitor + Swift extensions (widget, App Intents, geofencing)**. That makes the native value obvious to reviewers and reuses the tested engine. Consider SwiftUI only if iOS becomes most of the revenue.

---

## 7. Card data upkeep

**Sources**
- **Issuer pages** (already linked per card in `cards.js`): the ground truth.
- **Quarterly categories:** Doctor of Credit posts each quarter, for example [Discover Q1 2026](https://www.doctorofcredit.com/discover-q1-2026-5-categories-grocery-wholesale-streaming/), and NerdWallet covers each Discover quarter ([Q4 2026](https://www.nerdwallet.com/credit-cards/news/discover-bonus-categories-q4-2026), [Q3 2026](https://www.nerdwallet.com/credit-cards/news/discover-5-percent-bonus-categories-q3-2026)). Discover Q1 2026 activation opened **Dec 1** ([Slickdeals](https://slickdeals.net/f/18907483-discover-it-cardholders-q1-2026-5-categories-are-wholesale-clubs-grocery-and-select-streaming)). **Q1 2027 categories were not found** as of today, and I found no Chase Freedom 2026/2027 data in this pass.
- **Commercial APIs**
  - **StackEasy:** "4,211 US cards", daily sync, human-verified corrections, `/v1/categories` and `/v1/best-cards`. Keys are **granted manually, no self-serve**. Tiers seen on mirrored pages: Dev free (1,000 calls/month), Builder $49, Pro $199, Scale $499. **[unverified; pages conflict across languages]** Caching only from Pro, and redistribution only with the Scale commercial license ([mcpservers mirror](https://mcpservers.org/servers/www-stackeasy-ai-developers)). It is unclear whether it models rotating quarters.
  - **Rewards CC API:** claims ~99.5% US card coverage (bonuses, benefits, spend categories) and is listed as paid. **No pricing found** ([Product Hunt](https://www.producthunt.com/products/rewards-credit-card-api)).

**Update workflow (recommended)**
1. Move card data out of the JS bundle into a versioned **`cards.json`** served next to the app. The service worker uses stale-while-revalidate, so data fixes ship without a code release. Give each card `sourceUrl`, `lastVerified` and `version`.
2. Run a **scheduled GitHub Action** (weekly) that fetches each issuer page and flags changes by hashing the relevant section, then opens an issue. A human verifies and edits the JSON. Unit tests (`engine.test.js`) and a schema check run on the PR.
3. Keep a **quarterly calendar checklist**: around the 15th of the last month of each quarter, update `quarters` for Discover, Chase Freedom Flex, Citi Custom Cash notes and similar, from issuer announcements cross-checked with Doctor of Credit.
4. Add an in-app "Report wrong data" link (prefilled email or form).
5. Revisit a commercial API at ~1,000+ users or 50+ cards. Request a StackEasy Dev key now to test whether its data matches yours.

---

## 8. Monetization

- **PWA (web):** charge with **Stripe** directly: 2.9% + 30¢ per US card transaction ([Stripe US pricing](https://stripe.com/us/pricing?locale=fr)), plus Stripe Billing ~0.7% of billing volume **[secondary]** ([NerdWallet](https://www.nerdwallet.com/business/software/learn/stripe-fees)). Apple takes no cut on web sales. Stripe Checkout and the Customer Portal avoid building payment UI. Entitlements go in Supabase via webhook.
- **Native iOS:** digital subscriptions sold in the app use **In-App Purchase**. The **Small Business Program** cuts the commission to **15%** for developers under $1M/year in proceeds ([Apple](https://developer.apple.com/app-store/small-business-program/), [RevenueCat blog](https://revenuecat.com/blog/enroll-app-store-small-business-program)).
- **US external payment links:** after the 2025 contempt ruling, Apple must allow US apps to link out to web purchases. In **Dec 2025 the Ninth Circuit** upheld contempt but said Apple **may charge some commission** for costs "genuinely and reasonably necessary" for link-outs, to be set by the district court. Apple may also keep links from being more prominent than IAP ([neonpay summary](https://www.neonpay.com/blog/the-latest-epic-v.-apple-appeal-ruling-december-2025-what-changed-for-game-developers), [MacRumors Apr 2026](https://www.macrumors.com/2026/04/29/epic-games-wins-reversal-app-store-fee-battle/)). On **2026-06-30 the Supreme Court granted cert**, limited to the contempt question ([IPWatchdog](https://ipwatchdog.com/2026/06/30/high-court-grants-cert-in-apples-challenge-to-ninth-circuit-contempt-ruling-in-app-store-dispute/), [Daring Fireball](https://daringfireball.net/linked/2026/06/30/scotus-apple-epic)). In May 2026 Apple said it wanted to keep the current **zero-fee link-out** structure while appealing ([MacRumors May 2026](https://www.macrumors.com/2026/05/04/apple-supreme-court-app-store-fee-pause/)). **Status as of Nov 2026 is uncertain.** Design for a possible future link-out fee, and check the current App Review Guidelines (3.1.1 / 3.1.3) before launch.
- **RevenueCat:** free up to **$2,500 monthly tracked revenue**, then **1% of all tracked revenue**. It supports App Store, Google Play and web (RevenueCat Web Billing / Stripe / Paddle) under one entitlement system ([RevenueCat pricing](https://revenuecat.com/pricing), [costbench](https://costbench.com/software/subscription-billing/revenuecat/free-plan/)).

**Recommendation:** web-first with **Stripe Checkout** (Phase 3). When the native app ships, add IAP through **RevenueCat**, with web purchases synced through Stripe in RevenueCat so one entitlement covers both. In the US build, add an external "Subscribe on the web" link if it is still fee-free at the time.

---

## 9. Recommended phased roadmap

| Phase | Build | New vendors / costs |
|---|---|---|
| **0. Ship the prototype (1–2 days)** | Second Netlify site (base `apps/card-rewards`) or Cloudflare static. Add `cards.json` with `lastVerified`. Add a "report wrong data" link. Q1 2027 rotating categories once announced. | $0 |
| **1. Reminders and nearby (2–4 weeks)** | Opt-in web push: Worker + cron + D1, VAPID, WebCrypto push library, keeping the .ics fallback. "Stores near me" on tap via **MapKit JS**. Weekly GitHub Action that diffs issuer pages. | Cloudflare Workers Paid $5/month (to avoid the 10 ms CPU cap). Apple Developer Program $99/year as an **organization** (LLC + D-U-N-S, start now) |
| **2. Accounts and household (4–6 weeks)** | Supabase Auth (magic link, Google, Apple), import from `localStorage`, `households` + RLS sharing, invite links. Optionally move push scheduling to Supabase. | Supabase Pro $25/month |
| **3. Monetize (2–3 weeks)** | Stripe Checkout + Customer Portal. Premium = household sharing, push, nearby, spend-cap tracking. Privacy policy and terms. | Stripe 2.9% + 30¢ (+~0.7% Billing) per sale |
| **4. Native + bank-link pilot (2–3 months)** | Capacitor app with Swift widget, App Intents and geofencing (20-region rotation). RevenueCat + IAP. Plaid **Trial (10 Items)** pilot to auto-detect credit usage, checking PFCv2 and MCC availability in Sandbox first. | RevenueCat free to $2.5k MTR, then 1%. Apple 15% (Small Business Program) |
| **5. Scale (when demand exists)** | Plaid full Production (questionnaire, quote), FinanceKit entitlement, commercial card-data API if manual upkeep breaks down. | Quote-based |

### Rough monthly running costs (infrastructure only, excluding payment fees, domain and your time)

Assumptions: 1 push/user/day at most, 10 nearby searches/user/month, small database (<500 MB). Apple's $99/year ≈ $8.25/month.

| Item | 100 users | 1,000 users | 10,000 users | Source / note |
|---|---|---|---|---|
| Static hosting (Cloudflare) | $0 | $0 | $0 | Static requests free and unlimited |
| Push sender (Workers) | $0–5 | $5 | $5 | ≤300k pushes/month at 10k users, inside the 10M included requests |
| Accounts / DB (Supabase) | $0 (Free; pauses after 7 days idle) to $25 | $25 | $25 (+ MAU and egress overage only past Pro's included amounts; MAU 10k < 50k) | Pro included amounts beyond 50k MAU **[not verified]** |
| Nearby (MapKit JS) | $8.25 | $8.25 | $8.25 | 10k users ≈ 3.3k calls/day, under 25k/day. *Google equivalent ≈ $0 / $160 / $3,040* (my arithmetic, $32/1k after 5k free) |
| Card data | $0 (manual) | $0 to $49 (StackEasy Builder **[unverified]**) | $199 (StackEasy Pro, if caching needed **[unverified]**) | Optional |
| Bank linking | Plaid Trial $0 (≤10 Items) | Quote | Quote | No public per-Item price found |
| **Total (excluding optional data API and Plaid)** | **≈ $8–38** | **≈ $38** | **≈ $38+** | |

Payment fees scale with revenue, not users: Stripe ~3.6% + 30¢ per web sale, and Apple 15% + RevenueCat 1% (above $2.5k MTR) per in-app sale.

### Key uncertainties to resolve before spending money
1. Netlify credit cost per GB and how the 300 credits are shared across sites.
2. Whether MapKit JS quotas are now monthly rather than daily.
3. Whether Plaid exposes MCCs. Its per-Item Transactions price.
4. Whether Apple treats a no-bank-link rewards optimizer as "financial services" under 5.1.1(ix). Enrolling as an organization avoids the question.
5. The current Epic v. Apple link-out commission status (Supreme Court case pending).
6. StackEasy's actual tiers and whether it models rotating quarters.

*Note: many official vendor pages could not be fetched from this network: developers.google.com, developers.cloudflare.com, plaid.com, teller.io and wiki.openstreetmap.org. Allowing those domains would let these figures be verified directly.*
