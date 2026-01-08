# Ralph Loop Plugin

Autonomous AI loops for iterative development. Implements Ralph Wiggum technique with PRD+progress workflow.

## Quick Start

```bash
/ralph-loop "Build REST API with tests" --completion-promise "COMPLETE" --max-iterations 50
```

## PRD + Progress Workflow

```bash
# 1. Create PRD using plan mode
claude  # Press shift-tab, iterate, save to PRD.md

# 2. Create progress file
touch progress.txt

# 3. Run Ralph with file references
/ralph-loop --prd PRD.md --progress progress.txt --completion-promise "DONE" --max-iterations 50
```

## Commands

| Command | Description |
|---------|-------------|
| `/ralph-loop` | Start loop with prompt and options |
| `/cancel-ralph` | Cancel active loop |
| `/help` | Show help |

## Options

| Option | Description |
|--------|-------------|
| `--max-iterations <n>` | Stop after N iterations |
| `--completion-promise <text>` | Phrase that signals completion |
| `--prd <file>` | Reference PRD file |
| `--progress <file>` | Reference progress file |

## Permission Modes

For external/autonomous scripts:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `acceptEdits` | Auto-accept file edits | Most Ralph workflows |
| `bypassPermissions` | Skip ALL prompts | CI/CD |

```bash
claude --permission-mode acceptEdits -p "@PRD.md @progress.txt ..."
```

## External Scripts

### ralph-once.sh (human-in-the-loop)
```bash
#!/bin/bash
claude --permission-mode acceptEdits "@PRD.md @progress.txt \
  1. Read PRD and progress. \
  2. Find next incomplete task. \
  3. Implement and commit. \
  4. Update progress.txt. \
  ONLY DO ONE TASK."
```

### afk-ralph.sh (fully autonomous)
```bash
#!/bin/bash
set -e
for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \
    1. Find highest-priority task. \
    2. Run tests and typechecks. \
    3. Commit changes. \
    4. Update progress.txt. \
    If complete: <promise>COMPLETE</promise>.")
  echo "$result"
  [[ "$result" == *"<promise>COMPLETE</promise>"* ]] && exit 0
done
```

## Loop Variations

| Type | Description |
|------|-------------|
| Test Coverage | Write tests until target coverage |
| Linting | Fix lint errors one by one |
| Deduplication | Refactor clones into utilities |
| Issue Triage | Work through GitHub issues |

## Learn More

- Original: https://ghuntley.com/ralph/
- Guide: https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum
