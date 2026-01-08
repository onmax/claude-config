#!/bin/bash
# Ralph Loop Stop Hook - Prevents session exit, feeds prompt back

set -euo pipefail

HOOK_INPUT=$(cat)
RALPH_STATE_FILE=".claude/ralph-loop.local.md"

[[ ! -f "$RALPH_STATE_FILE" ]] && exit 0

FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$RALPH_STATE_FILE")
ITERATION=$(echo "$FRONTMATTER" | grep '^iteration:' | sed 's/iteration: *//')
MAX_ITERATIONS=$(echo "$FRONTMATTER" | grep '^max_iterations:' | sed 's/max_iterations: *//')
COMPLETION_PROMISE=$(echo "$FRONTMATTER" | grep '^completion_promise:' | sed 's/completion_promise: *//' | sed 's/^"\(.*\)"$/\1/')

[[ ! "$ITERATION" =~ ^[0-9]+$ ]] && echo "⚠️  State file corrupted (iteration)" >&2 && rm "$RALPH_STATE_FILE" && exit 0
[[ ! "$MAX_ITERATIONS" =~ ^[0-9]+$ ]] && echo "⚠️  State file corrupted (max_iterations)" >&2 && rm "$RALPH_STATE_FILE" && exit 0

if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $ITERATION -ge $MAX_ITERATIONS ]]; then
  echo "🛑 Ralph loop: Max iterations ($MAX_ITERATIONS) reached."
  rm "$RALPH_STATE_FILE"
  exit 0
fi

TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path')
[[ ! -f "$TRANSCRIPT_PATH" ]] && echo "⚠️  Transcript not found" >&2 && rm "$RALPH_STATE_FILE" && exit 0

! grep -q '"role":"assistant"' "$TRANSCRIPT_PATH" && echo "⚠️  No assistant messages" >&2 && rm "$RALPH_STATE_FILE" && exit 0

LAST_LINE=$(grep '"role":"assistant"' "$TRANSCRIPT_PATH" | tail -1)
[[ -z "$LAST_LINE" ]] && rm "$RALPH_STATE_FILE" && exit 0

LAST_OUTPUT=$(echo "$LAST_LINE" | jq -r '.message.content | map(select(.type == "text")) | map(.text) | join("\n")' 2>&1)
[[ $? -ne 0 ]] && rm "$RALPH_STATE_FILE" && exit 0
[[ -z "$LAST_OUTPUT" ]] && rm "$RALPH_STATE_FILE" && exit 0

if [[ "$COMPLETION_PROMISE" != "null" ]] && [[ -n "$COMPLETION_PROMISE" ]]; then
  PROMISE_TEXT=$(echo "$LAST_OUTPUT" | perl -0777 -pe 's/.*?<promise>(.*?)<\/promise>.*/$1/s; s/^\s+|\s+$//g; s/\s+/ /g' 2>/dev/null || echo "")
  if [[ -n "$PROMISE_TEXT" ]] && [[ "$PROMISE_TEXT" = "$COMPLETION_PROMISE" ]]; then
    echo "✅ Ralph loop: Detected <promise>$COMPLETION_PROMISE</promise>"
    rm "$RALPH_STATE_FILE"
    exit 0
  fi
fi

NEXT_ITERATION=$((ITERATION + 1))
PROMPT_TEXT=$(awk '/^---$/{i++; next} i>=2' "$RALPH_STATE_FILE")
[[ -z "$PROMPT_TEXT" ]] && rm "$RALPH_STATE_FILE" && exit 0

TEMP_FILE="${RALPH_STATE_FILE}.tmp.$$"
sed "s/^iteration: .*/iteration: $NEXT_ITERATION/" "$RALPH_STATE_FILE" > "$TEMP_FILE"
mv "$TEMP_FILE" "$RALPH_STATE_FILE"

[[ "$COMPLETION_PROMISE" != "null" ]] && [[ -n "$COMPLETION_PROMISE" ]] && SYSTEM_MSG="🔄 Ralph iteration $NEXT_ITERATION | To stop: <promise>$COMPLETION_PROMISE</promise>" || SYSTEM_MSG="🔄 Ralph iteration $NEXT_ITERATION | No completion promise - runs infinitely"

jq -n --arg prompt "$PROMPT_TEXT" --arg msg "$SYSTEM_MSG" '{"decision": "block", "reason": $prompt, "systemMessage": $msg}'
exit 0
