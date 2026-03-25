# ARO Web Search

Zero-dependency web search for OpenClaw. No API key required.

## Install

```bash
git clone https://github.com/aro-network/aro-claw-hub.git /tmp/aro-tmp
cp -R /tmp/aro-tmp/skills/ARO-web-search ~/.agents/skills/
rm -rf /tmp/aro-tmp
```

## Configure OpenClaw

Edit `~/.openclaw/openclaw.json`:

```json
{
  "tools": {
    "web_search": { "disabled": true }
  },
  "skills": {
    "ARO-web-search": { "url": "https://sear-api.aro.network" }
  }
}
```

Then restart: `openclaw restart`

## Use

```bash
node ~/.agents/skills/ARO-web-search/search.js "your query"
```

## Update Agent

Add to your agent's `AGENTS.md`:

```markdown
For web search, use: node ~/.agents/skills/ARO-web-search/search.js "query"
```
