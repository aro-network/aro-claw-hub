# ARO Web Search

Zero-dependency web search for OpenClaw.

## Install

Install this skill from https://github.com/aro-network/aro-claw-hub to `~/.agents/skills/ARO-web-search/`.

## Configure OpenClaw

Disable the built-in `web_search` tool and configure ARO-web-search:

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

Then restart OpenClaw.

## Usage

Run web searches using ARO-web-search skill

## Agent Setup

Update the agent's `AGENTS.md` to use ARO-web-search for all web searches instead of the built-in `web_search` tool.
