# Daily Standard

Clear grass-fed whey protein isolate for dads. 20g protein. 80 calories. 5 ingredients.

## Project structure

```
├── public/          # Deployed to Netlify (website only)
│   ├── index.html
│   ├── css/
│   └── images/
├── docs/             # Strategy docs, PDFs (not deployed)
├── scripts/          # PDF generation scripts (not deployed)
├── netlify.toml     # Netlify publish dir = public
└── README.md
```

## Deploying

### Netlify CLI (easiest — no GitHub needed)

1. **One-time: link the project**
   ```bash
   cd "/Users/stevenbigio/Cursor Projects/Dad Protein"
   npx netlify link
   ```
   When prompted, choose one of:
   - **Use current git remote origin** — if you want to use the GitHub repo
   - **Search by project name** — if you already have a Netlify site (e.g. "Daily Standard")
   - **Choose from recently updated projects** — to pick an existing site

2. **Deploy**
   ```bash
   cd "/Users/stevenbigio/Cursor Projects/Dad Protein"
   npm run deploy
   ```
   Runs from the **project root** so Netlify publishes `public/` (per `netlify.toml`) **and** ships `netlify/functions/` (Mailchimp).

3. **Domain (dadgains.co), Mailchimp check, analytics** → [docs/NETLIFY_DADGAINS_SETUP.md](docs/NETLIFY_DADGAINS_SETUP.md)

### Auto-deploy from Git

1. Create a new repo at [github.com/new](https://github.com/new) (do not initialize with README).
2. Run: `./scripts/connect-github.sh https://github.com/YOUR_USERNAME/YOUR_REPO.git`
3. In Netlify: **Site configuration** → **Build & deploy** → **Link repository** → select your repo.
4. Every `git push` to `main` triggers a new deployment.

### Manual deploy

- **Drag & drop:** Only uploads static files — **Mailchimp won’t work** without also deploying `netlify/functions/`. Prefer **Git** or **`npm run deploy`** from the project root.

## Local preview

**Static only (no Mailchimp function):**

```bash
cd public && python3 -m http.server 8000
# Open http://localhost:8000
```

**With Netlify functions** (waitlist / checkout email) from project root:

```bash
npm run dev
```

## Mailchimp (waitlist signups)

The form sends emails to Mailchimp via a Netlify function. See [docs/MAILCHIMP_SETUP.md](docs/MAILCHIMP_SETUP.md) for setup steps.

## Paid test (Instagram / Meta)

See [docs/INSTAGRAM_CAMPAIGN_TEST.md](docs/INSTAGRAM_CAMPAIGN_TEST.md) for a $350 / 7-day validation plan. **Shop:** [public/shop.html](public/shop.html) → checkout simulates purchase; at payment, users see “sold out” and submit email (tag: `checkout-soldout`).

## Regenerating PDFs

```bash
PYTHONPATH=".venv_pdf:$PYTHONPATH" python3 scripts/generate_all_pdfs.py
```
