#!/usr/bin/env bash
#
# install-mcps.sh — install the 3 missing MCPs for calc-empire
#
# After this script:
#   1. Set tokens in env (see TOKEN section below)
#   2. Restart Claude Code so it re-reads MCP config
#   3. Re-run `/seo-calc-empire calc-empire` to sync local artifacts to GitHub/Notion/Gmail
#
set -euo pipefail

echo "==> Installing GitHub MCP"
claude mcp add github --scope user -- npx -y @modelcontextprotocol/server-github

echo "==> Installing Notion MCP"
claude mcp add notion --scope user -- npx -y @notionhq/notion-mcp-server

echo "==> Installing Gmail MCP (Google OAuth — will open browser on first call)"
claude mcp add gmail --scope user -- npx -y @gongrzhe/server-gmail-autoauth-mcp

cat <<'TOKENS'

==> NEXT STEPS — set these tokens in your shell profile (~/.zshrc):

    # GitHub: create a fine-grained PAT at https://github.com/settings/personal-access-tokens
    # Scopes: repo (read/write), workflow, contents
    export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_..."

    # Notion: create an internal integration at https://www.notion.so/profile/integrations
    # Share your "SEO Calculators" workspace with the integration after creating.
    export NOTION_API_KEY="ntn_..."

    # Gmail: no token needed — first call opens browser for Google OAuth.
    # Optional: prime the credentials now by running:
    #   npx -y @gongrzhe/server-gmail-autoauth-mcp auth

==> Then: source ~/.zshrc && restart Claude Code.
TOKENS
