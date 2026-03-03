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

1. **Manual (drag & drop):** Upload the contents of `public/` to Netlify.
2. **From Git:** Connect this repo to Netlify. It will deploy from `public/` automatically on each push.

## Local preview

```bash
cd public && python3 -m http.server 8000
# Open http://localhost:8000
```

## Regenerating PDFs

```bash
PYTHONPATH=".venv_pdf:$PYTHONPATH" python3 scripts/generate_all_pdfs.py
```
