#!/bin/bash
# AFK Ralph - Fully autonomous, leave overnight
# Usage: ./afk-ralph.sh <iterations>

set -e

if [[ -z "$1" ]]; then
  echo "Usage: $0 <iterations>"
  echo "Example: $0 20"
  exit 1
fi

if [[ ! -f "PRD.md" ]]; then
  echo "❌ PRD.md not found. Create one first:"
  echo "   claude  # shift-tab for plan mode, save to PRD.md"
  exit 1
fi

[[ ! -f "progress.txt" ]] && touch progress.txt

echo "🔄 Starting AFK Ralph with $1 iterations..."
echo "   PRD: PRD.md"
echo "   Progress: progress.txt"
echo ""

for ((i=1; i<=$1; i++)); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔄 Iteration $i/$1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  result=$(claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \
1. Find the highest-priority incomplete task. \
2. Implement it following TDD if applicable. \
3. Run tests and type checks. \
4. Commit your changes with a descriptive message. \
5. Update progress.txt with what you did. \
ONLY WORK ON A SINGLE TASK. \
If the PRD is complete, output <promise>COMPLETE</promise>.")

  echo "$result"
  echo ""

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "✅ PRD complete after $i iterations!"
    exit 0
  fi
done

echo "⚠️  Reached max iterations ($1). Check progress.txt for status."
