---
description: "Explain Ralph Loop plugin"
---

# Ralph Loop Plugin Help

## What is Ralph?

Ralph is a technique for running AI coding agents in a loop. Same prompt repeatedly. AI picks tasks from PRD, commits after each feature. Come back to working code.

**Core concept:** Stop hook intercepts exit, feeds same prompt back. Each iteration sees modified files and git history.

## Commands

### /ralph-loop <PROMPT> [OPTIONS]

```
/ralph-loop "Refactor cache layer" --max-iterations 20
/ralph-loop "Add tests" --completion-promise "TESTS COMPLETE"
/ralph-loop --prd PRD.md --progress progress.txt --max-iterations 30
```

**Options:**
- `--max-iterations <n>` - Stop after N iterations
- `--completion-promise <text>` - Phrase that signals completion
- `--prd <file>` - Reference a PRD file
- `--progress <file>` - Reference a progress file

### /cancel-ralph

Cancel active Ralph loop.

## PRD + Progress Pattern

```bash
# 1. Create PRD using plan mode
claude  # shift-tab for plan mode, save to PRD.md

# 2. Create progress file
touch progress.txt

# 3. Run Ralph
/ralph-loop --prd PRD.md --progress progress.txt --completion-promise "DONE" --max-iterations 50
```

## Permission Modes (external scripts)

- `acceptEdits` - Auto-accept file edits (recommended)
- `bypassPermissions` - Skip ALL prompts (CI/CD)
- `plan` - Read-only mode

## Loop Variations

- **Test Coverage** - Write tests until target
- **Linting** - Fix lint errors one by one
- **Deduplication** - Refactor clones
- **Issue Triage** - Work through GitHub issues

## Learn More

- Original: https://ghuntley.com/ralph/
- Guide: https://www.aihero.dev/tips-for-ai-coding-with-ralph-wiggum
