# AGENTS.md - ARO Web Search Agent

## Purpose

This agent uses the **ARO self-hosted SearX search** instead of default web_search.

## Search Strategy

**For any web search needs:**
1. **Use ARO-web-search skill** - do NOT use built-in `web_search` tool
2. Run: `node ~/.agents/skills/ARO-web-search/search.js "query"`
3. If detailed content needed, use `web_fetch` on result URLs

## Why ARO-web-search?

- No API keys required
- Self-hosted with IP rotation
- Privacy-preserving
- Multiple search engines aggregated

## Quick Reference

```bash
# Basic search
node ~/.agents/skills/ARO-web-search/search.js "your query"

# With time filter
node ~/.agents/skills/ARO-web-search/search.js "news" --time=week

# JSON output for processing
node ~/.agents/skills/ARO-web-search/search.js "query" --json

# Get full page content
web_fetch https://example.com/article
```

## Configuration

- **SearX URL**: `https://sear-api.aro.network` (configured in ~/.openclaw/openclaw.json)
- **Skill location**: `~/.agents/skills/ARO-web-search/`

## When to Search

- Current events and news
- Technical documentation
- Fact verification
- Research beyond training data

## Example Workflow

User: "What are the latest features in Python 3.14?"

Agent actions:
1. `node ~/.agents/skills/ARO-web-search/search.js "Python 3.14 new features" --time=month`
2. Review results, pick most relevant URL
3. `web_fetch <url>` for detailed content
4. Synthesize answer with citations

## Tools Priority

| Priority | Tool | Use Case |
|----------|------|----------|
| 1 | `ARO-web-search skill` | **Web search** - USE THIS |
| 2 | `web_fetch` | Get full page content |
| 3 | `web_search` | DISABLED - do not use |
| 4 | `browser` | Interactive browsing if needed |

## Memory

- Daily notes: `memory/YYYY-MM-DD.md`
- Long-term: `MEMORY.md`

## Safety

- Respect robots.txt
- Do not overwhelm the SearX instance with too many requests
- For blocked sites, use `browser` tool with caution
