# Dad Gains on Netlify (dadgains.co)

How the repo connects to Netlify, how deploys work, and how to add **dadgains.co** while you iterate.

## What deploys

- **Site files:** everything under `public/` (see `netlify.toml` → `publish = "public"`).
- **Serverless:** `netlify/functions/subscribe.js` (Mailchimp). Deploy **from the project root** so Netlify sees both `public/` and `netlify/functions/`.

## Day-to-day workflow

| Goal | What to do |
|------|------------|
| **Preview locally (static only)** | `cd public && python3 -m http.server 8080` → open http://localhost:8080 |
| **Preview with Mailchimp function** | From project root: `npm run dev` → uses `netlify dev` (needs Netlify CLI + linked site + env vars in Netlify or a local `.env`) |
| **Ship to production** | Push to the branch Netlify has connected (e.g. `main`), **or** run `npm run deploy` from project root |
| **Draft URL (share before prod)** | `npx netlify deploy` (no `--prod`) → get a unique deploy preview link |

## One-time: link this folder to your Netlify site

```bash
cd "/Users/stevenbigio/Cursor Projects/Dad Protein"
npx netlify link
```

Pick the site that should receive Dad Gains (or create a new site in the Netlify UI first).

## Custom domain: dadgains.co

1. Netlify → your site → **Domain management** → **Add domain** → enter `dadgains.co` and `www.dadgains.co`.
2. Follow Netlify’s DNS instructions at your registrar (often **Netlify DNS** or **A/CNAME** records they show you).
3. This repo’s `netlify.toml` redirects **HTTP → HTTPS** and **`www` → apex** (`https://dadgains.co`). If you prefer **www** as the canonical URL, swap the `to` / `from` in the `dadgains` redirect block to point everything to `https://www.dadgains.co`.

**Keep `dailystandardprotein.com`?** If that domain should also hit this site, add it under the same Netlify site as an alias, or add redirects in `netlify.toml` to send traffic to `https://dadgains.co` (we can add that when you’re ready).

## Environment variables (Mailchimp)

Site settings → **Environment variables**:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_LIST_ID`

After changing vars: **Deploys** → **Trigger deploy** → **Clear cache and deploy site** (or push a commit).

Details: [MAILCHIMP_SETUP.md](./MAILCHIMP_SETUP.md).

## Analytics (not wired yet)

When you choose a tool:

- **Plausible:** Uncomment/adjust the script in `public/index.html` and set `data-domain="dadgains.co"` (or your exact hostname).
- **Google Analytics 4:** Uncomment the GA block in `public/index.html` and replace the measurement ID.

Optional: add the same snippet to `shop.html`, `checkout.html`, etc., or use a small shared include later.

## Social / Open Graph

`og:image` should eventually be a **JPG or PNG** (~1200px wide); many networks ignore SVG for previews.
