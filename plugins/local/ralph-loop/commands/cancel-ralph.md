---
description: "Cancel active Ralph Loop"
allowed-tools: ["Bash(test -f .claude/ralph-loop.local.md:*)", "Bash(rm .claude/ralph-loop.local.md)", "Read(.claude/ralph-loop.local.md)"]
hide-from-slash-command-tool: "true"
---

# Cancel Ralph

1. Check if `.claude/ralph-loop.local.md` exists: `test -f .claude/ralph-loop.local.md && echo "EXISTS" || echo "NOT_FOUND"`
2. **If NOT_FOUND**: Say "No active Ralph loop found."
3. **If EXISTS**: Read file to get iteration, remove it, report: "Cancelled Ralph loop (was at iteration N)"
