#!/bin/bash
# Connect local repo to GitHub and push. Run after creating a repo at github.com/new
# Usage: ./scripts/connect-github.sh https://github.com/YOUR_USERNAME/YOUR_REPO.git

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/connect-github.sh <repo-url>"
  echo "Example: ./scripts/connect-github.sh https://github.com/yourusername/dad-protein.git"
  echo ""
  echo "Create a new repo at https://github.com/new first (do not initialize with README)."
  exit 1
fi

REPO_URL="$1"

# Remove existing origin if present
git remote remove origin 2>/dev/null || true

git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo "Done! Your repo is connected to GitHub."
echo "Next: Link this repo in Netlify (Site configuration → Build & deploy → Link repository)."
