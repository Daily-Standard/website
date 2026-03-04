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

### Auto-deploy from Git (recommended)

1. Create a new repo at [github.com/new](https://github.com/new) (do not initialize with README).
2. Run: `./scripts/connect-github.sh https://github.com/YOUR_USERNAME/YOUR_REPO.git`
3. In Netlify: **Site configuration** → **Build & deploy** → **Link repository** → select your repo.
4. Every `git push` to `main` triggers a new deployment.

### Manual deploy

- **Drag & drop:** Upload the contents of `public/` to Netlify.

## Local preview

```bash
cd public && python3 -m http.server 8000
# Open http://localhost:8000
```

## Regenerating PDFs

```bash
PYTHONPATH=".venv_pdf:$PYTHONPATH" python3 scripts/generate_all_pdfs.py
```
