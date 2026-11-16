# Card Rewards (prototype)

A phone-friendly web app that:

1. **Picks the best card for each purchase.** Search a store (Costco, Whole Foods, Uber…) or a category (dining, gas…) and it ranks the cards in your wallet by the value you'd get back. It knows about network acceptance (Costco takes Visa only), stores that don't count as grocery (Walmart, Target), quarterly 5% categories that need activation, choose-your-category cards, and higher rates that only apply when booking through a card's travel site (shown as tips).
2. **Tracks unused card benefits.** Every monthly, quarterly, half-year and annual credit on your cards, with "use soon or lose it" alerts, a fee-vs-value-used bar per card, and a calendar file of reminders before each credit resets.

No bank linking, no account, nothing sent to a server: your data stays in your browser (`localStorage`). Export/import a backup from the Wallet tab.

It's separate from the Daily Standard website: it is not under `public/`, so the Netlify site deploy is unaffected.

## Run it

```bash
cd apps/card-rewards
npm start          # serves on http://localhost:8080 (needs Python 3)
npm test           # engine unit tests (Node 18+)
```

It must be served over http(s); opening `index.html` directly from disk won't load the JavaScript modules. To use it on your phone, deploy the folder to any static host (e.g. a separate Netlify site with this folder as the publish directory), open it in Safari/Chrome and choose **Add to Home Screen**. It works offline once loaded over https.

## Files

| Path | Purpose |
|---|---|
| `js/data/cards.js` | Card catalog: earning rules, fees, credits (21 popular US cards) |
| `js/data/merchants.js` | ~50 common merchants, their usual category and quirks |
| `js/engine.js` | Ranking, benefit periods, usage summaries, calendar export (no DOM; unit-tested) |
| `js/app.js` | The interface (Pay, Benefits, Wallet tabs) |
| `js/store.js` | Saves state in the browser |
| `tests/engine.test.js` | Unit tests |

## Card data accuracy

The card data was written from public issuer information as of 2026-11-16 and **has not been checked line-by-line against live issuer pages**. Issuers change rates and credits often (Chase Sapphire Reserve and Amex Platinum were overhauled in 2025). Before relying on it, verify each card against its issuer page (linked in the app and in `cards.js`). Users can untick credits and add their own credits or custom cards to correct gaps.

Rotating 5% categories are filled in only for Chase Freedom Flex Q4 2026. Discover and future quarters must be set in the Wallet tab (or added to `quarters` in `cards.js`).

Point values (e.g. 1.25¢ per Chase point when you hold a Sapphire card) are editable estimates, not facts.

## Not built yet (ideas from the research)

- Nearby stores via location (needs a maps/places API)
- Household sharing between two people (needs accounts and a backend)
- Bank linking to confirm credits and spend caps automatically (Plaid/MX)
- Push notifications (needs a server); the calendar export covers reminders for now
- Spend tracking toward category caps
