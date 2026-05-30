#!/usr/bin/env bash
# IndexNow ping — push all sitemap URLs to Bing/Yandex (and indirectly Google via Bing signals).
#
# How it works:
#   1. The key file at /<KEY>.txt proves ownership of the host.
#   2. We POST a JSON body of URLs to api.indexnow.org; engines fetch each one
#      within minutes instead of waiting for their normal crawl schedule.
#
# Run manually after a publish, or wire it into the GitHub Action that runs
# after a successful Vercel deploy.

set -euo pipefail

KEY="7b3a5e8c4f1d24a6b9e3c0d5f8a2461b"
HOST="${SITE_HOST:-calc-empire-roma-s-projects3.vercel.app}"
SITEMAP="https://${HOST}/sitemap.xml"

echo "Fetching ${SITEMAP}..."
URLS=$(curl -sf "${SITEMAP}" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g')
COUNT=$(echo "${URLS}" | wc -l | tr -d ' ')
echo "Found ${COUNT} URLs."

# IndexNow accepts up to 10,000 URLs per request; we'll always be well under.
URL_JSON=$(echo "${URLS}" | awk 'BEGIN{ORS=""}{print (NR>1?",":"") "\"" $0 "\""}')

BODY=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "https://${HOST}/${KEY}.txt",
  "urlList": [${URL_JSON}]
}
EOF
)

echo "Pinging IndexNow..."
HTTP_CODE=$(curl -sS -o /tmp/indexnow.out -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${BODY}")

echo "IndexNow responded ${HTTP_CODE}."
cat /tmp/indexnow.out
echo
