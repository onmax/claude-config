---
description: Ralph Setup Wizard - generate long-running agent task scripts
allowed-tools: Bash, Read, Write, AskUserQuestion, Grep, Glob
argument-hint: [task description]
agent-model: opus
---

# Ralph Setup Wizard

Creates autonomous agent task for overnight VPS execution.

Target: $ARGUMENTS

## Phase 1: Sync Config

Sync claude config to ensure latest skills/commands:

```!
bash ~/.claude/.sync-claude-config.sh
```

## Phase 2: Gather Requirements

Use AskUserQuestion to configure task interactively.

**Task Description**: Extract from $ARGUMENTS or ask user

**Pattern Selection**: Ask user to choose pattern type

**Execution Params**: Max iterations, timeout, completion marker

## Phase 3: Generate Task Directory

Create timestamped task directory in current working directory:

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
WORKING_DIR=$(pwd)
TASK_DIR="$WORKING_DIR/ralph-$TIMESTAMP"
mkdir -p "$TASK_DIR/logs"
```

## Phase 4: Generate Files

Based on selected pattern and requirements:

1. **config.json** - Task metadata and settings
2. **run.sh** - All-in-one executable with embedded prompts (chmod +x)
3. **prd.json** - Task breakdown with verification steps (if multi-task)

### Prompt Generation Rules (CRITICAL)

**Apply Opus 4.5 best practices** to ALL generated prompts:

From https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices:

1. **Be explicit with instructions** - Clear, specific about desired output
2. **Add context** - Explain why behaviors are important
3. **Use structured formats** - JSON for state, git for tracking progress
4. **Multi-context workflow patterns**:
   - Read progress files and git logs first
   - Commit atomic changes frequently
   - Update state files after significant work
   - Use tests.json or prd.json for tracking tasks
5. **Avoid "think"** - Use "consider", "evaluate", "believe" instead
6. **XML tags for structure** - Organize different sections
7. **State management**:
   - Structured formats (JSON) for data
   - Unstructured text for progress notes
   - Git for history tracking
8. **Clear success criteria** - ONLY output completion marker when truly done
9. **Tool usage** - Be explicit about when to use tools vs just describing
10. **Encourage complete context usage** - Work systematically until task complete

### Pattern Templates

#### Pattern A: Simple Iteration (Matt's Pattern)

Best for: Focused improvements (test coverage, refactoring, single-feature)

**Characteristics**:
- Fixed number of iterations
- Single focus per iteration
- Completion marker when done
- Resume support

#### Pattern B: Anthropic (Init + Feature Loop)

Best for: Greenfield projects, multi-feature implementations

**Characteristics**:
- Two-phase: Initializer (setup) + Coding loop (implementation)
- Creates prd.json with task breakdown
- One feature per iteration
- Verification steps per feature

#### Pattern C: Continuous (ghuntley)

Best for: Ongoing development, long-running tasks

**Characteristics**:
- Infinite loop until manual stop or completion
- Can edit prompt between iterations
- .stop file to halt
- Best for iterative refinement

## Phase 5: Output Instructions

After generating files, output:

1. **Task location** - Path to ralph-{timestamp}/
2. **Files created** - config.json, run.sh, prd.json
3. **Local testing** - How to run ./run.sh locally
4. **VPS deployment** - rsync command, ssh h instructions
5. **Background execution** - tmux vs nohup examples
6. **Monitoring** - tail logs, check progress.json
7. **Resume** - How to reattach or resume after disconnect

---

---

## Wizard Execution

### Step 1: Sync Config

```!
bash ~/.claude/.sync-claude-config.sh
```

### Step 2: Interactive Configuration

Use AskUserQuestion to gather requirements:

**Question 1**: Pattern Type
- Simple: Fixed iterations, single focus, best for improvements
- Anthropic: Init + feature loop, best for multi-feature projects
- Continuous: Infinite loop, best for ongoing development

**Question 2**: Task Details
- Task description/goal
- Max iterations (default: 20)
- Timeout per iteration in minutes (default: 90)
- Completion marker text (default: COMPLETE)

**Question 3**: For Anthropic pattern only
- Break down features/tasks
- Add verification steps per task

### Step 3: Create Task Directory

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
WORKING_DIR=$(pwd)
TASK_DIR="$WORKING_DIR/ralph-$TIMESTAMP"
mkdir -p "$TASK_DIR/logs"
echo "Created $TASK_DIR"
```

### Step 4: Generate config.json

Create configuration file:

```json
{
  "name": "task-name-from-user",
  "pattern": "simple|anthropic|continuous",
  "model": "opus",
  "working_dir": "/absolute/path/to/project",
  "max_iterations": 20,
  "timeout_minutes": 90,
  "completion_marker": "<promise>COMPLETE</promise>",
  "created_at": "2026-01-07T12:00:00Z",
  "description": "User's task description"
}
```

### Step 5: Generate run.sh

**CRITICAL**: Embed prompt using Opus 4.5 best practices from https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices

Generate all-in-one executable bash script with:
- Config reading
- Lock file management
- Progress tracking
- Timeout handling (using `timeout` command)
- Embedded prompt in heredoc
- Pattern-specific loop logic
- Completion detection
- Error handling

**Prompt Template Structure** (apply to ALL patterns):

```markdown
# Task: {task-name}

<task_overview>
{user-provided-description}
</task_overview>

<working_directory>
{absolute-path}
</working_directory>

<critical_instructions>
## State Management (Read This First Every Iteration)

1. **Check current state**: Read progress.json to understand where you left off
2. **Review git history**: Run `git log --oneline -10` to see recent commits
3. **Understand context**: You're in a multi-iteration autonomous loop

## Your Responsibilities

1. **Incremental progress**: Make steady advances on specific tasks, not everything at once
2. **Commit frequently**: Atomic commits with clear messages (feat/fix/refactor: description)
3. **Update progress.json**: After significant work, update your progress
4. **Test before committing**: Run tests. If failing, fix and re-test
5. **Save state**: Before context limit, ensure state is saved to files

## Success Criteria

{pattern-specific-criteria}

## Completion Signal

ONLY output {completion-marker} when:
- ALL requirements are met
- Tests are passing
- Code is committed
- You have verified correctness

Do NOT output false completion signals. Trust the process.
</critical_instructions>

<execution_guidelines>
## Tool Usage

Be explicit and proactive:
- If you need to read a file, read it immediately
- If you need to edit code, make the changes directly
- If you need to run tests, execute them
- Default to taking action rather than only suggesting

## Error Recovery

If stuck or encountering errors:
1. Document the blocker in progress.json
2. Consider alternative approaches
3. Search for relevant code/docs
4. Try a different strategy

## Context Awareness

Your context window will be automatically managed. Do not stop tasks early due to token concerns. As you approach limits:
1. Save current progress to files
2. Update progress.json with current state
3. Commit any uncommitted work
4. Continue working - context will refresh

Complete tasks fully, even if end of budget is approaching.
</execution_guidelines>

<available_skills>
## Skills You Can Invoke

Use /skill-name when relevant:
- /vue - Vue 3 components, composables
- /nuxt - Nuxt 4+ server routes, middleware
- /nuxt-ui - @nuxt/ui components
- /nuxthub - Database, KV, blob APIs
- /reka-ui - Headless accessible components
- /ts-library - TypeScript library patterns

Invoke skills when you need domain-specific guidance.
</available_skills>

{pattern-specific-instructions}
```

### Step 6: Generate prd.json (Anthropic pattern only)

If Anthropic pattern selected, create task breakdown file:

```json
{
  "task-1-slug": {
    "description": "Clear description of what needs to be built",
    "verification": [
      "Specific check 1 (e.g., API endpoint returns correct data)",
      "Specific check 2 (e.g., Tests pass: pnpm test feature)",
      "Specific check 3 (e.g., UI shows expected behavior)"
    ],
    "passes": false
  },
  "task-2-slug": {
    "description": "Next task description",
    "verification": [
      "Verification step 1",
      "Verification step 2"
    ],
    "passes": false
  }
}
```

### Step 7: Make run.sh Executable

```bash
chmod +x "$TASK_DIR/run.sh"
```

### Step 8: Output Instructions

Print comprehensive VPS deployment guide:

```text
✅ Ralph task created: {task-dir}

Pattern: {pattern}
Max iterations: {N}
Timeout per iteration: {timeout}m
Working directory: {working-dir}

═══════════════════════════════════════════════════════════
LOCAL TESTING (Optional)
═══════════════════════════════════════════════════════════

cd {task-dir}
./run.sh

═══════════════════════════════════════════════════════════
VPS EXECUTION (Recommended for Overnight)
═══════════════════════════════════════════════════════════

## 1. Copy to VPS
rsync -avz {task-dir}/ h:{task-dir}/

## 2. Connect and Start Background Session
ssh h
cd {task-dir}

## Option A: tmux (Recommended - Can Reattach)
tmux new -s ralph-{timestamp}
./run.sh
# Press Ctrl+B, then D to detach
# Exit ssh - tmux session continues running

## Option B: nohup (Simpler but No Reattach)
nohup ./run.sh > output.log 2>&1 &
# Note the PID, then exit ssh

## 3. Disconnect Safely
exit

═══════════════════════════════════════════════════════════
MONITORING FROM LOCAL MACHINE
═══════════════════════════════════════════════════════════

## Check progress
ssh h "cat {task-dir}/progress.json | jq"

## Watch logs (live tail)
ssh h "tail -f {task-dir}/logs/iter-*.log"

## Check if still running
ssh h "pgrep -f 'ralph-{timestamp}'"

═══════════════════════════════════════════════════════════
RESUME AFTER RECONNECT
═══════════════════════════════════════════════════════════

ssh h
cd {task-dir}

## If using tmux
tmux attach -t ralph-{timestamp}

## If using nohup
tail -f output.log  # Check output
cat progress.json | jq  # Check state

═══════════════════════════════════════════════════════════
STOPPING THE TASK
═══════════════════════════════════════════════════════════

## If using tmux
tmux attach -t ralph-{timestamp}
# Press Ctrl+C

## If using nohup
pkill -f 'ralph-{timestamp}'

## For continuous pattern
touch {task-dir}/.stop

═══════════════════════════════════════════════════════════
REVIEW BEFORE RUNNING
═══════════════════════════════════════════════════════════

Review and edit if needed:
- {task-dir}/run.sh (all prompts embedded)
- {task-dir}/config.json (settings)
- {task-dir}/prd.json (task breakdown)

Then deploy to VPS and run!
═══════════════════════════════════════════════════════════
```

---

## Pattern-Specific run.sh Templates

### Simple Pattern Template

```bash
#!/bin/bash
set -euo pipefail

# Task Directory
TASK_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$TASK_DIR/config.json"
PROGRESS_FILE="$TASK_DIR/progress.json"

# Read Config
MAX_ITER=$(jq -r '.max_iterations' "$CONFIG_FILE")
WORKING_DIR=$(jq -r '.working_dir' "$CONFIG_FILE")
TIMEOUT=$(jq -r '.timeout_minutes // 90' "$CONFIG_FILE")
MARKER=$(jq -r '.completion_marker' "$CONFIG_FILE")
DESCRIPTION=$(jq -r '.description' "$CONFIG_FILE")

# Helpers
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { log "ERROR: $*"; exit 1; }
get_progress() { [ -f "$PROGRESS_FILE" ] && jq -r ".$1 // empty" "$PROGRESS_FILE"; }
update_progress() {
    [ ! -f "$PROGRESS_FILE" ] && echo '{}' > "$PROGRESS_FILE"
    TMP=$(mktemp)
    jq ".$1 = \"$2\"" "$PROGRESS_FILE" > "$TMP" && mv "$TMP" "$PROGRESS_FILE"
}

# Lock File
LOCK="$TASK_DIR/.lock"
if [ -f "$LOCK" ] && [ -d "/proc/$(cat "$LOCK" 2>/dev/null)" ]; then
    die "Already running (PID $(cat "$LOCK"))"
fi
echo $$ > "$LOCK"
trap "rm -f '$LOCK'" EXIT

# Resume Support
START_ITER=$(get_progress current_iteration || echo 1)
[ "$START_ITER" = "null" ] && START_ITER=1

cd "$WORKING_DIR" || die "Cannot cd to $WORKING_DIR"

log "Starting Ralph task: $(basename "$TASK_DIR")"
log "Pattern: Simple | Max iterations: $MAX_ITER | Timeout: ${TIMEOUT}m"

# Embedded Prompt (Opus 4.5 optimized)
read -r -d '' PROMPT <<'PROMPT_EOF' || true
# Task: {TASK_NAME}

<task_overview>
{TASK_DESCRIPTION}
</task_overview>

<working_directory>
{WORKING_DIR}
</working_directory>

<critical_instructions>
## State Management (Read This FIRST Every Iteration)

1. **Check progress.json**: Understand where you left off
2. **Review git history**: `git log --oneline -10` shows recent work
3. **Context**: Multi-iteration autonomous loop, incremental progress

## Your Responsibilities

1. **Incremental progress**: Make steady advances, not everything at once
2. **Atomic commits**: Frequent commits with clear messages (feat/fix/refactor: description)
3. **Update progress.json**: After significant work, document progress
4. **Test before committing**: Run tests. If failing, fix and re-test. NEVER commit failing tests
5. **Save state**: Keep work committed and progress updated

## Success Criteria

{SUCCESS_CRITERIA}

## Completion Signal

ONLY output {MARKER} when:
- ALL requirements met
- Tests passing
- Code committed
- Verified correctness

Do NOT output false completion. Trust the process.
</critical_instructions>

<execution_guidelines>
## Tool Usage - Be Proactive

Default to ACTION not suggestions:
- Need to read file? Read it immediately
- Need to edit code? Make changes directly
- Need to run tests? Execute them
- Take action rather than only describing

## Error Recovery

If stuck:
1. Document blocker in progress.json
2. Consider alternative approaches
3. Search relevant code/docs
4. Try different strategy

## Context Awareness

Context window will be managed automatically. Do NOT stop early due to token concerns.

As you approach limits:
1. Save progress to files
2. Update progress.json
3. Commit uncommitted work
4. Continue - context will refresh

Complete tasks fully, even if end of budget approaching.
</execution_guidelines>

<available_skills>
Invoke /skill-name when relevant:
- /vue, /nuxt, /nuxt-ui, /nuxthub, /reka-ui, /ts-library
</available_skills>

<current_iteration_context>
You are in iteration {ITERATION} of {MAX_ITER}.
Read progress.json and git log to understand current state.
Make incremental progress on the task.
Commit atomic changes.
Update progress.json after significant work.
</current_iteration_context>
PROMPT_EOF

# Replace placeholders
PROMPT="${PROMPT//\{TASK_NAME\}/$(jq -r '.name' "$CONFIG_FILE")}"
PROMPT="${PROMPT//\{TASK_DESCRIPTION\}/$DESCRIPTION}"
PROMPT="${PROMPT//\{WORKING_DIR\}/$WORKING_DIR}"
PROMPT="${PROMPT//\{MARKER\}/$MARKER}"
PROMPT="${PROMPT//\{MAX_ITER\}/$MAX_ITER}"
PROMPT="${PROMPT//\{SUCCESS_CRITERIA\}/Complete the task: $DESCRIPTION}"

# Main Loop
for ((i=START_ITER; i<=MAX_ITER; i++)); do
    log "═══ Iteration $i/$MAX_ITER ═══"

    # Replace iteration placeholder
    ITER_PROMPT="${PROMPT//\{ITERATION\}/$i}"

    # Run with timeout
    LOG_FILE="$TASK_DIR/logs/iter-$(printf '%03d' $i).log"

    if timeout "${TIMEOUT}m" claude -p --model opus \
        --system-prompt "$ITER_PROMPT" \
        "Continue task. Iteration $i of $MAX_ITER. Read progress.json for state." \
        2>&1 | tee "$LOG_FILE"; then

        EXIT_CODE=0
    else
        EXIT_CODE=$?
    fi

    # Handle timeout (exit code 124)
    if [ $EXIT_CODE -eq 124 ]; then
        log "❌ TIMEOUT after ${TIMEOUT}min"
        update_progress "status" "timeout_error"
        update_progress "failed_iteration" "$i"
        exit 1
    fi

    # Handle other errors
    if [ $EXIT_CODE -ne 0 ]; then
        log "❌ ERROR (exit code: $EXIT_CODE)"
        update_progress "status" "error"
        update_progress "failed_iteration" "$i"
        exit 1
    fi

    # Update progress
    update_progress "current_iteration" "$i"
    update_progress "last_checkpoint" "$(date -Iseconds)"
    update_progress "last_log" "$LOG_FILE"

    # Check completion
    if grep -q "$MARKER" "$LOG_FILE"; then
        log "✅ Task COMPLETE at iteration $i"
        update_progress "status" "completed"
        update_progress "completed_at" "$(date -Iseconds)"
        exit 0
    fi

    log "Iteration $i done. Continuing..."
    sleep 2  # Brief pause between iterations
done

log "⚠️  Max iterations ($MAX_ITER) reached without completion"
update_progress "status" "max_iterations_reached"
exit 0
```

### Anthropic Pattern Template

For Anthropic pattern, generate two-phase script:
1. **Init phase**: Creates prd.json, init.sh, baseline commit
2. **Feature loop**: Iterates through prd.json tasks

Similar structure but checks prd.json for incomplete tasks and processes one per iteration.

### Continuous Pattern Template

Similar to Simple but:
- `while true` instead of `for` loop
- Check for `.stop` file each iteration
- No max iterations (runs until stopped or complete)

---

## Now Execute

Run the wizard based on $ARGUMENTS and user's current working directory.