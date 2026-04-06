---
name: ARO-web-search
description: "Web search using ARO self-hosted SearX instance. Use when user asks to search the web, look up information, research topics, find documentation, or verify facts. Triggers include 'search', 'look up', 'google', 'find info', 'research'."
metadata:
  version: "1.0.0"
  author: "ARO"
allowed-tools: Bash(node:*)
---

# ARO Web Search

Web search via ARO's self-hosted SearX instance. Zero dependencies, no API keys.

<when_to_use>

- User asks to search the web or look something up
- Need current information beyond training data
- Research topics, find documentation, verify facts
- WebSearch tool is unavailable or fails

</when_to_use>

## How to Search

Run the search script via Bash:

```bash
# Basic search
node ~/.claude/skills/ARO-web-search/search.js "query"

# With time filter (day, week, month, year)
node ~/.claude/skills/ARO-web-search/search.js "AI news" --time=week

# JSON output for structured processing
node ~/.claude/skills/ARO-web-search/search.js "query" --json

# Limit results
node ~/.claude/skills/ARO-web-search/search.js "query" --limit=5
```

## Search Workflow

1. **Search:** Run `node ~/.claude/skills/ARO-web-search/search.js "query"`
2. **Review results:** Check titles, URLs, snippets
3. **Deep dive:** Use `mcp__web_reader__webReader` on relevant URLs for full content
4. **Synthesize:** Combine results into answer with citations

## Configuration

- **SearX endpoint:** `https://sear-api.aro.network`
- **Override:** Set `SEARX_URL` env var or edit `search.js` line 13
- **Config file:** `~/.openclaw/openclaw.json` -> `skills.searx.url`

## Output Format

```
[1] Page Title
    URL: https://example.com/page
    Snippet: Description of the page content...
    [via google,bing]
```

## Important Notes

- This is a **search-only** tool. For full page content, use `mcp__web_reader__webReader`
- The SearX instance aggregates multiple search engines (Google, Bing, Brave, etc.)
- No API keys required — uses ARO's self-hosted infrastructure
- Supports time filtering with `--time` flag

<rules>

ALWAYS:
- Use this skill for ALL web search needs
- Use `--json` when you need structured results for processing
- Combine with `mcp__web_reader__webReader` for full page content
- Include source URLs in your response

NEVER:
- Use the built-in `WebSearch` tool (it fails with GLM model proxy)
- Overwhelm the SearX instance with rapid successive requests
- Return search results without reviewing them first

</rules>
