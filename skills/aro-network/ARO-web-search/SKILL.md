---
name: ARO-web-search
description: Web search using ARO's self-hosted SearX instance with IP rotation. Zero dependencies, no API keys required. Returns search results with title, URL, snippet, and source engine.
metadata:
  version: "1.0.0"
  author: "ARO"
  tags: ["search", "web", "searx", "no-api-key"]
---

# ARO-web-search - Zero-Dependency Web Search

Web search skill using ARO's self-hosted SearX instance. **Zero dependencies** - only requires Node.js (which OpenClaw already needs).

## Purpose

- Web search without API keys
- Use ARO's SearX + IP rotation infrastructure
- **No Python required**
- **No pip install required**

## Configuration

### Option 1: OpenClaw Config File (Recommended)

Edit `~/.openclaw/openclaw.json`, add:

```json
{
  "skills": {
    "ARO-web-search": {
      "url": "https://sear-api.aro.network"
    }
  }
}
```

### Option 2: Environment Variable

```bash
export SEARX_URL="https://sear-api.aro.network"
```

### Option 3: Command Line Argument

```bash
node search.js "query" --url=https://your-searx-instance.com
```

### Option 4: Edit Code Directly

Edit `search.js`, line 13:

```javascript
const DEFAULT_SEARX_URL = 'https://sear-api.aro.network';
```

## Configuration Priority

1. Command line `--url` parameter (highest priority)
2. Environment variable `SEARX_URL`
3. `~/.openclaw/openclaw.json` configuration
4. Default value in code (lowest priority)

## When to Use

Use this skill when you need to:
- Search current information
- Look up technical docs
- Verify facts
- Research topics beyond training data

## Usage

```bash
# Basic search
node search.js "openclaw features"

# With time filter
node search.js "AI news" --time=week

# JSON output for agents
node search.js "query" --json
```

## Requirements

- **Node.js only** (OpenClaw already requires this)
- SearX instance running and accessible

## Files

- `search.js` - Pure Node.js, no npm packages needed
- `SKILL.md` - This file

## How It Works

1. Configure your SearX URL (see above)
2. Run `node search.js "your query"`
3. Returns search results (title, URL, snippet)
4. If you need full page content, use `web_fetch` on the URL

## Output Format

```
[1] Page Title
    URL: https://example.com/page
    Snippet: Description of the page content...
    Source: [via google,bing]

[2] Another Title
    URL: https://...
    ...
```

## License

MIT
