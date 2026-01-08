#!/bin/bash
# Ralph Once - Human-in-the-loop, run manually, watch, repeat

set -e

if [[ ! -f "PRD.md" ]]; then
  echo "❌ PRD.md not found. Create one first:"
  echo "   claude  # shift-tab for plan mode, save to PRD.md"
  exit 1
fi

[[ ! -f "progress.txt" ]] && touch progress.txt

claude --permission-mode acceptEdits "@PRD.md @progress.txt \
1. Read the PRD and progress file. \
2. Find the next incomplete task and implement it. \
3. Run tests and type checks. \
4. Commit your changes. \
5. Update progress.txt with what you did. \
ONLY DO ONE TASK AT A TIME."
