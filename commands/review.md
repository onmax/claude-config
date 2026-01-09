---
description: Review GitHub PRs with multi-agent analysis
allowed-tools: Bash(gh:*), Bash(git:*), Read, Grep, Glob, Task, WebFetch, Skill
argument-hint: [pr-url] or [org/repo#number]
agent-model: opus
---

# Review

Target: $ARGUMENTS

## Input Resolution

1. Full URL → extract org/repo/number from `https://github.com/{org}/{repo}/pull/{number}`
2. `org/repo#number` → use directly
3. `#number` in git repo → detect org/repo from remote, use number
4. Else → ask user for PR URL

---

## Skills Integration

**Invoke `/skill-name` when relevant** (during agent spawning, when unsure about framework patterns).

**Available skills:**
- `/vue` - Vue 3 components, composables, testing
- `/nuxt` - Nuxt 4+ server routes, routing, middleware, composables
- `/nuxt-modules` - Creating/testing Nuxt modules
- `/nuxthub` - Database, KV, blob, cache APIs
- `/reka-ui` - Headless accessible components (Radix Vue)
- `/ts-library` - TypeScript library patterns

---

## Phase 1: Fetch PR Context

```bash
# Get PR metadata
gh pr view {number} --repo {org/repo} --json title,body,author,labels,additions,deletions,changedFiles,baseRefName,headRefName

# Get changed files list
gh pr view {number} --repo {org/repo} --json files --jq '.files[].path'

# Get full diff
gh pr diff {number} --repo {org/repo}
```

Store:
- `PR_TITLE`, `PR_BODY`, `PR_AUTHOR`
- `CHANGED_FILES` (array)
- `PR_DIFF` (full diff content)
- `BASE_BRANCH`, `HEAD_BRANCH`

---

## Phase 2: Agent Selection

Match `CHANGED_FILES` against agent triggers using glob patterns.

### Big Project Detection

A project is considered "big" if ANY of these conditions match:

**Known orgs (always big):**
- `nuxt/*`, `nuxthub/*`, `unjs/*`, `vuejs/*`, `vitejs/*`

**Auto-detection heuristics:**
```bash
# Fetch repo metadata
gh repo view {org/repo} --json stargazerCount,forkCount,issues,hasWikiEnabled,hasDiscussionsEnabled,repositoryTopics
```

Project is big if:
- Stars >= 500
- Forks >= 100
- Has `CONTRIBUTING.md` or `CODE_OF_CONDUCT.md`
- Has `.github/ISSUE_TEMPLATE/` directory
- Has `GOVERNANCE.md` or `MAINTAINERS.md`
- Topics include: `framework`, `library`, `sdk`, `cli`
- Multiple maintainers in recent commits (`git shortlog -sn --since="1 year ago" | wc -l` >= 5)

**Fallback known list:**
```bash
BIG_PROJECTS=("nuxt/nuxt" "nuxt/nuxt.com" "nuxt/devtools" "nuxt/scripts" "nuxt/fonts" "nuxt/image" "nuxt/content" "nuxt/ui" "nuxt/eslint" "nuxthub/core" "nuxthub/cli" "unjs/h3" "unjs/nitro" "unjs/ofetch" "unjs/unbuild" "unjs/consola")
```

Cache detection result for the PR session to avoid repeated API calls.

### Always Spawn
- `security-reviewer` - OWASP, secrets, injection, auth
- `code-quality` - DRY, complexity, CLAUDE.md compliance
- `code-simplifier` - Simplify & refine for clarity, consistency, maintainability
- `silent-failure-hunter` - Error handling, silent failures, inadequate fallbacks

### Always Spawn (Big Projects Only)
When org/repo matches `BIG_PROJECTS`:
- `context-explorer` - Deep git blame, PR/issue investigation (even for larger PRs)
- `maintainer-mindset` - Architecture, API design, long-term maintainability

For big projects, context-explorer should run regardless of PR size.

### Trigger-Based Agents

| Agent | Triggers |
|-------|----------|
| nuxt-reviewer | `nuxt.config*`, `server/**`, `app/**`, `plugins/**`, `middleware/**` |
| vue-reviewer | `*.vue`, `components/**`, `composables/**` |
| api-reviewer | `server/api/**`, `server/routes/**` |
| nuxthub-reviewer | `hub/**`, `drizzle/**`, `server/database/**` |
| auth-reviewer | `auth/**`, `**/auth*`, `**/session*` |
| db-reviewer | `schema/**`, `migrations/**`, `drizzle/**` |
| a11y-reviewer | `*.vue` |
| i18n-reviewer | `locales/**`, `**/i18n*` |
| typescript-reviewer | `*.ts` (when complex types detected) |
| type-design-analyzer | `*.ts`, `*.tsx` (type definitions) |
| comment-analyzer | `*.ts`, `*.js`, `*.vue`, `*.tsx`, `*.jsx` (files with comments/docs) |
| test-analyzer | `*.test.*`, `*.spec.*`, `**/__tests__/**` |
| deps-reviewer | `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json` |
| config-reviewer | `*.config.ts`, `*.config.js`, `.env*` |
| ci-reviewer | `.github/**`, `Dockerfile`, `docker-compose*` |
| documentation | `*.md`, `docs/**` |

### Utility Agents (spawn on-demand)
- `git-validator` - Git history, commit hygiene
- `context-explorer` - Understand unfamiliar codebase areas (auto for big projects)
- `maintainer-mindset` - Architecture, long-term maintainability (auto for big projects)
- `drawbacks-analyzer` - Tradeoffs, potential issues
- `performance` - Performance implications

---

## Phase 3: Clone & Setup

```bash
# Clone to temp dir for file access
cd /tmp && rm -rf pr-review-{number} && mkdir pr-review-{number}
gh pr checkout {number} --repo {org/repo} --detach -C pr-review-{number}
```

Working directory: `/tmp/pr-review-{number}`

---

## Phase 4: Parallel Review

Spawn selected agents in parallel using Task tool with model="opus". Each agent receives:
- PR title, body, author
- Changed files list
- Full diff
- Working directory path

**Agent prompt template:**

```
You are reviewing PR #{number}: {title}

Changed files:
{files_list}

Diff:
{diff}

Working directory: /tmp/pr-review-{number}

{agent_specific_prompt from .claude/commands/review/{agent}.md}

**Output format:**
For each finding:
- Severity: CRITICAL | HIGH | MEDIUM | LOW
- File: path/to/file.ts:42
- Issue: Brief description
- Evidence: Code snippet
- Suggestion: How to fix (optional)
- Confidence: 0-100

Only report findings with confidence >= 80.
```

---

## Phase 5: Aggregate Findings

Collect all agent outputs. Categorize:

### 🔴 Blockers (CRITICAL/HIGH with confidence >= 90)
Must address before merge.

### 🟡 Suggestions (MEDIUM or HIGH with confidence 80-89)
Should consider addressing.

### 🟢 Minor/Informational (LOW)
Nice to have, optional.

---

## Phase 6: Report

Output structured summary:

```md
# PR Review: {title}

**Author:** {author}
**Files changed:** {count}
**Agents spawned:** {agent_list}

## 🔴 Blockers ({count})
{findings}

## 🟡 Suggestions ({count})
{findings}

## 🟢 Minor ({count})
{findings}

## Summary
{overall_assessment}
```

---

## Agent Definitions

Agent prompts loaded from:
- `~/.claude/commands/review/` - local review agents
- `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-simplifier/agents/` - code-simplifier
- `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/pr-review-toolkit/agents/` - silent-failure-hunter, type-design-analyzer, comment-analyzer

Each agent file:

```yaml
---
name: agent-name
description: What this agent reviews
triggers: ["pattern1", "pattern2"]
---

{agent prompt body}
```

**Marketplace agent usage:**
Reference by path: `marketplaces/claude-plugins-official/plugins/code-simplifier/agents/code-simplifier.md`
