---
description: "Start Ralph Loop in current session"
argument-hint: "PROMPT [--max-iterations N] [--completion-promise TEXT] [--prd FILE] [--progress FILE]"
allowed-tools: ["Bash(${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.sh:*)"]
hide-from-slash-command-tool: "true"
---

# Ralph Loop Command

Execute the setup script to initialize the Ralph loop:

```!
"${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.sh" $ARGUMENTS
```

Work on the task. When you try to exit, the Ralph loop feeds the SAME PROMPT back for the next iteration. You'll see your previous work in files and git history.

CRITICAL: If a completion promise is set, ONLY output it when completely TRUE. Do not lie to escape the loop.
