#!/usr/bin/env bash
# IndexNow ping — push every page URL in the sitemap (index or flat) to
# Bing/Yandex so they crawl new pages within minutes instead of waiting for
# their normal schedule. Google partially honours Bing's IndexNow signal too.
#
# How it works:
#   1. The key file at /<KEY>.txt proves ownership of the host.
#   2. We fetch /sitemap.xml. If it's a sitemap index we walk every child
#      sitemap and collect their <loc> URLs; if it's a flat sitemap we use
#      its <loc> URLs directly.
#   3. POST the deduped URL list to api.indexnow.org.

set -euo pipefail

KEY="7b3a5e8c4f1d24a6b9e3c0d5f8a2461b"
HOST="${SITE_HOST:-calc-empire-roma-s-projects3.vercel.app}"
SITEMAP="https://${HOST}/sitemap.xml"

echo "Fetching ${SITEMAP}..."
INDEX_XML=$(curl -sf "${SITEMAP}")

if echo "${INDEX_XML}" | grep -q "<sitemapindex"; then
  echo "Sitemap index detected — walking child sitemaps."
  CHILDREN=$(echo "${INDEX_XML}" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g')
  TMP=$(mktemp)
  trap 'rm -f "$TMP"' EXIT
  for child in ${CHILDREN}; do
    echo "  fetch ${child}"
    curl -sf "${child}" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' >> "${TMP}" || true
  done
  URLS=$(sort -u "${TMP}")
else
  echo "Flat sitemap detected."
  URLS=$(echo "${INDEX_XML}" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | sort -u)
fi

COUNT=$(echo "${URLS}" | grep -c '^http' || echo 0)
echo "Collected ${COUNT} unique URLs."
if [ "${COUNT}" -eq 0 ]; then
  echo "Nothing to ping — exiting."
  exit 0
fi

# Build the JSON urlList. IndexNow accepts up to 10,000 URLs per request;
# we're always well under that.
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

echo "Pinging IndexNow with ${COUNT} URLs..."
HTTP_CODE=$(curl -sS -o /tmp/indexnow.out -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${BODY}")

echo "IndexNow responded ${HTTP_CODE}."
cat /tmp/indexnow.out
echo
