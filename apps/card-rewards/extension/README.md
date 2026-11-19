# Offer Helper (Chrome extension, personal use)

Adds every Amex or Chase offer shown on the page you're on, then copies the offer list into the Card Rewards app so it can show **offers at brands you've already bought from**.

## How it works

- It runs **only when you click it**, on the tab you're on (Chrome's `activeTab` permission). It has no access to any site until you click it there.
- It works inside your own logged-in page. It never sees or stores your password and sends nothing anywhere.
- It clicks one "Add to Card" button every 2–4 seconds, like a person would, and stops when none are left (or after 150 by default).

**Risk:** Amex's offer terms (updated July 2026) don't allow automated offer adding, and banks can flag or lock accounts for automated activity. Running it yourself on your own login is lower risk than giving your password to a service, but it isn't zero. Use it at your own risk.

## Install (once)

1. Get this folder onto your computer: on GitHub, open the `claude/cardpointers-app-research-ynd8w2` branch of `Daily-Standard/website`, choose **Code → Download ZIP**, and unzip it.
2. In Chrome, go to `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick the `apps/card-rewards/extension` folder.
4. Pin "Card Rewards - Offer Helper" from the puzzle-piece menu so its icon stays visible.

## Use it

1. Log in to americanexpress.com and open **Offers** (the list of available offers). For Chase, log in to chase.com and open **Chase Offers → See all offers** for one card.
2. Scroll to the bottom once so all offers load.
3. Click the extension icon, then **Add all offers on this page**. Keep the tab open; you can watch the count go up. **Stop** ends it early.
4. Repeat for each card (with Amex, switch cards at the top of the Offers page).
5. Click **Copy offer list for the app**, open the Card Rewards app, go to **Benefits → Card offers → Paste offer list**, paste and save.

To see which offers match places you shop, import a statement (Benefits → Import a statement) for each card. The app then lists offers at brands on your statements, and shows a tip on the Pay screen when you search a store that has an offer.

## If it finds no offers

The bank pages couldn't be inspected when this was built, so it looks for buttons by their text (such as "Add to Card"). If it says no offers were found:

1. Open **Settings and troubleshooting** in the popup and click **Diagnose this page**.
2. Copy the report and send it to Claude. It lists only the names of buttons on the page (no account numbers or balances), so the button patterns can be fixed.

As a quick fix, you can also type the exact text of the add button in **Extra button text** and try again.
