#!/bin/bash
# Ralph Loop Setup Script - Creates state file for in-session Ralph loop

set -euo pipefail

PROMPT_PARTS=()
MAX_ITERATIONS=0
COMPLETION_PROMISE="null"
PRD_FILE=""
PROGRESS_FILE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      cat << 'HELP_EOF'
Ralph Loop - Interactive self-referential development loop

USAGE:
  /ralph-loop [PROMPT...] [OPTIONS]

ARGUMENTS:
  PROMPT...    Initial prompt (can be multiple words without quotes)

OPTIONS:
  --max-iterations <n>           Maximum iterations before auto-stop (default: unlimited)
  --completion-promise '<text>'  Promise phrase (USE QUOTES for multi-word)
  --prd <file>                   Reference a PRD file (adds @file to prompt)
  --progress <file>              Reference a progress file (adds @file to prompt)
  -h, --help                     Show this help

DESCRIPTION:
  Starts a Ralph Loop in your CURRENT session. The stop hook prevents
  exit and feeds your output back as input until completion or iteration limit.

  To signal completion, output: <promise>YOUR_PHRASE</promise>

EXAMPLES:
  /ralph-loop Build a todo API --completion-promise 'DONE' --max-iterations 20
  /ralph-loop --prd PRD.md --progress progress.txt --max-iterations 30
  /ralph-loop "@PRD.md @progress.txt Implement next task" --completion-promise 'COMPLETE'

PRD + PROGRESS WORKFLOW:
  1. Create PRD using plan mode: claude (shift-tab)
  2. Create progress file: touch progress.txt
  3. Run: /ralph-loop --prd PRD.md --progress progress.txt --max-iterations 50

PERMISSION MODES (for external scripts):
  --permission-mode acceptEdits      Auto-accept file edits
  --permission-mode bypassPermissions  Skip ALL prompts (CI/CD)

STOPPING:
  Only by reaching --max-iterations or detecting --completion-promise
HELP_EOF
      exit 0
      ;;
    --max-iterations)
      [[ -z "${2:-}" ]] && echo "❌ --max-iterations requires a number" >&2 && exit 1
      [[ ! "$2" =~ ^[0-9]+$ ]] && echo "❌ --max-iterations must be a positive integer, got: $2" >&2 && exit 1
      MAX_ITERATIONS="$2"
      shift 2
      ;;
    --completion-promise)
      [[ -z "${2:-}" ]] && echo "❌ --completion-promise requires text" >&2 && exit 1
      COMPLETION_PROMISE="$2"
      shift 2
      ;;
    --prd)
      [[ -z "${2:-}" ]] && echo "❌ --prd requires a file path" >&2 && exit 1
      PRD_FILE="$2"
      shift 2
      ;;
    --progress)
      [[ -z "${2:-}" ]] && echo "❌ --progress requires a file path" >&2 && exit 1
      PROGRESS_FILE="$2"
      shift 2
      ;;
    *)
      PROMPT_PARTS+=("$1")
      shift
      ;;
  esac
done

# Build prompt with file references
PROMPT=""
[[ -n "$PRD_FILE" ]] && PROMPT="@$PRD_FILE "
[[ -n "$PROGRESS_FILE" ]] && PROMPT="$PROMPT@$PROGRESS_FILE "
PROMPT="$PROMPT${PROMPT_PARTS[*]}"

[[ -z "$PROMPT" ]] && echo "❌ No prompt provided. Use /ralph-loop --help" >&2 && exit 1

mkdir -p .claude

[[ -n "$COMPLETION_PROMISE" ]] && [[ "$COMPLETION_PROMISE" != "null" ]] && COMPLETION_PROMISE_YAML="\"$COMPLETION_PROMISE\"" || COMPLETION_PROMISE_YAML="null"

cat > .claude/ralph-loop.local.md <<EOF
---
active: true
iteration: 1
max_iterations: $MAX_ITERATIONS
completion_promise: $COMPLETION_PROMISE_YAML
started_at: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
---

$PROMPT
EOF

cat <<EOF
🔄 Ralph loop activated!

Iteration: 1
Max iterations: $(if [[ $MAX_ITERATIONS -gt 0 ]]; then echo $MAX_ITERATIONS; else echo "unlimited"; fi)
Completion promise: $(if [[ "$COMPLETION_PROMISE" != "null" ]]; then echo "${COMPLETION_PROMISE//\"/} (ONLY output when TRUE!)"; else echo "none"; fi)
$(if [[ -n "$PRD_FILE" ]]; then echo "PRD: $PRD_FILE"; fi)
$(if [[ -n "$PROGRESS_FILE" ]]; then echo "Progress: $PROGRESS_FILE"; fi)

⚠️  Loop runs infinitely unless --max-iterations or --completion-promise set!
EOF

echo ""
echo "$PROMPT"

if [[ "$COMPLETION_PROMISE" != "null" ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "To complete: <promise>$COMPLETION_PROMISE</promise>"
  echo "ONLY output when statement is TRUE. Do NOT lie to exit!"
  echo "═══════════════════════════════════════════════════════════"
fi
