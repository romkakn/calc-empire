#!/usr/bin/env bash
#
# push-to-github.sh — wire up the GitHub remote and push the initial commit.
# Run after `install-mcps.sh` and once $GITHUB_PERSONAL_ACCESS_TOKEN is exported.
#
# Usage:
#   ./scripts/push-to-github.sh <github-username> [repo-name]
#
# Example:
#   ./scripts/push-to-github.sh romaknafel calc-empire
#
set -euo pipefail

USER="${1:?GitHub username required}"
REPO="${2:-calc-empire}"
TOKEN="${GITHUB_PERSONAL_ACCESS_TOKEN:?GITHUB_PERSONAL_ACCESS_TOKEN not set}"

echo "==> Creating private repo ${USER}/${REPO}"
curl -fsSL -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO}\",\"private\":true,\"description\":\"SEO calculator empire — programmatic\"}" \
  >/dev/null

echo "==> Adding remote and pushing"
git remote add origin "https://github.com/${USER}/${REPO}.git" 2>/dev/null || \
  git remote set-url origin "https://github.com/${USER}/${REPO}.git"

git branch -M main
git push -u origin main

echo "==> Done. Repo: https://github.com/${USER}/${REPO}"
