# ARO-web-search (Claude Code Edition)

Web search skill for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) using ARO's self-hosted SearX instance.

This is the Claude Code compatible version of [ARO-web-search](../ARO-web-search/).

## Install

```bash
# Symlink into Claude Code skills directory
ln -s ~/my/aro-claw-hub/skills/ARO-web-search-claude ~/.claude/skills/ARO-web-search
```

## Usage in Claude Code

After installation, Claude Code will automatically use this skill when web search is needed:

```
> search for "harness engineering 2026"
> /ARO-web-search "latest React docs"
```

Or Claude will invoke it directly via:
```bash
node ~/.claude/skills/ARO-web-search/search.js "query"
```

## Requirements

- **Node.js only** (no npm dependencies)
- Access to SearX endpoint (`https://sear-api.aro.network`)

## Files

- `SKILL.md` - Claude Code skill definition
- `search.js` - Zero-dependency Node.js search script
- `README.md` - This file

## Differences from OpenClaw Version

| | OpenClaw | Claude Code |
|---|---|---|
| SKILL.md format | OpenClaw spec | Claude Code frontmatter |
| Trigger | OpenClaw config | `/ARO-web-search` or auto |
| AGENTS.md | Yes | Not needed |

## License

MIT
