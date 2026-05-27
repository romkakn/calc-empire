#!/usr/bin/env bash
#
# notify-roma.sh — gmail substitute. Writes a notification file Roma can read.
# When gmail MCP is installed this can be re-wired to send a real email.
#
# Usage:
#   ./scripts/notify-roma.sh "<subject>" "<body markdown>"
#   ./scripts/notify-roma.sh "<subject>" - <<EOF
#   body
#   EOF
#
set -euo pipefail
SUBJ="${1:?subject required}"
shift
BODY="${1:-}"
[[ "${BODY}" == "-" ]] && BODY="$(cat)"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
SLUG="$(echo "${SUBJ}" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-' | cut -c1-60)"
DIR="$(git rev-parse --show-toplevel)/.notifications"
mkdir -p "${DIR}"
FILE="${DIR}/${TS}-${SLUG}.md"

cat > "${FILE}" <<EOF
---
to: romaknafel@gmail.com
subject: ${SUBJ}
sent_at: ${TS}
status: pending-gmail-mcp
---

Hi Roma,

${BODY}

—
Sent by calc-empire automation. When the gmail MCP is installed, prior notifications can be batch-flushed via \`scripts/flush-notifications.sh\`.
EOF

echo "Wrote ${FILE}"
