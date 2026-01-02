---
description: Find open issues in Nuxt repos, fix, multi-agent review, validate CI
allowed-tools: Bash(gh:*), Bash(git:*), Bash(pnpm:*), Bash(ni:*), Bash(nr:*), Bash(cd:*), Bash(cp:*), Bash(rm:*), Bash(mkdir:*), Bash(ls:*), Bash(cat:*), Bash(echo:*), Read, Edit, Write, Grep, Glob, Task, WebFetch, Skill
argument-hint: [issue-url] or [org/repo] (auto-detects from ~/nuxt/XXX)
---

# Hunt

Target: $ARGUMENTS

## Repo Resolution

1. URL provided → skip to Phase 1
2. org/repo arg → use that
3. In ~/nuxt/XXX → map folder to repo
4. Else → hunt across default repos

| Folder | Repo |
|--------|------|
| nuxt | nuxt/nuxt |
| ui | nuxt/ui |
| content | nuxt/content |
| image | nuxt/image |
| nitro | nuxt/nitro |
| hub | nuxt-hub/core |
| studio | nuxt/studio |
| eslint | nuxt/eslint |
| website | nuxt/nuxt.com |

Default hunt order: nuxt/nuxt, nuxt/ui, nuxt-hub/core, nuxt/content, nuxt/image

---

## Skills Integration

**Invoke `/skill-name` at ANY step** when relevant (before coding, when unsure, during review, in reproductions).

**Available skills:**
- `/vue` - Vue 3 components, composables, testing
- `/nuxt` - Nuxt 4+ server routes, routing, middleware, composables
- `/nuxt-ui` - @nuxt/ui v4 styled components
- `/nuxt-content` - Content v3 collections, MDC, queries
- `/nuxt-modules` - Creating/testing Nuxt modules
- `/nuxthub` - Database, KV, blob, cache APIs
- `/nuxthub-migration` - Migrating NuxtHub projects
- `/reka-ui` - Headless accessible components (Radix Vue)
- `/document-writer` - Blog posts, documentation
- `/personal-ts-setup` - Project scaffolding, CI, releases
- `/unocss-onmax` - UnoCSS attribute mode patterns

---

## Phase 0: Issue Hunt

### 0.1 Search for Candidates

```bash
# By reactions (community interest)
gh issue list --repo {org/repo} --state open --limit 50 --json number,title,body,labels,comments,reactionGroups,createdAt,author,assignees

# Recently active
gh issue list --repo {org/repo} --state open --sort updated --limit 30 --json number,title,body,labels,comments,assignees
```

### 0.2 Filter Criteria

**Exclude (must pass ALL):**
- Has assignee → someone working on it
- Labels: `wontfix`, `duplicate`, `invalid`, `stale`, `needs-triage`
- Title/body contains: "feature request", "enhancement", "discussion", "RFC"
- Body < 50 chars or missing reproduction steps
- Author has < 5 repos or account < 30 days (spam indicator)
- Comments contain "I'm working on this" or linked PR
- Issue > 1 year old with no recent activity

**Prefer:**
- Has reproduction steps or stackblitz/repo link
- Has positive reactions (👍 > 3)
- Labels: `bug`, `confirmed`, `help wanted`, `good first issue`
- Comments from maintainers acknowledging the bug
- Clear expected vs actual behavior
- Affects recent versions

### 0.3 Deep Validation (top 3 candidates)

**CRITICAL: Skip issues with existing PRs. Search thoroughly using ALL methods:**

```bash
# 1. Search by issue number (catches "Closes #X", "Fixes #X", "Resolves #X", etc.)
gh pr list --repo {org/repo} --state all --search "{number}" --json number,state,title

# 2. Search by keywords from issue title
gh pr list --repo {org/repo} --state all --search "{keywords}" --json number,state,title

# 3. MANDATORY: Check timeline for cross-references (most reliable)
gh api repos/{org}/{repo}/issues/{number}/timeline --jq '.[] | select(.event == "cross-referenced") | .source.issue | {number, title, state, html_url}'

# 4. Read full issue + all comments (check for "I'm working on this", PR links)
gh issue view {number} --repo {org/repo} --comments
```

**If ANY of these show an existing PR (open or recently closed) → SKIP the issue.**

### 0.4 Related Issues Context

```bash
gh issue list --repo {org/repo} --state all --search "{key-terms-from-issue}" --limit 10 --json number,title,state,labels
```

Understand from related issues:
- Previous fix attempts
- Edge cases discovered
- Maintainer preferences on solution approach

### 0.5 Select Issue

Pick issue with highest score:
1. Clear reproduction
2. Community interest (reactions)
3. Maintainer acknowledgment
4. No competing PRs
5. Feasible fix scope

**ASK USER:** "Found issue #{number}: {title}. Link: https://github.com/{org}/{repo}/issues/{number}. Proceed?"

---

## Phase 1-6: Fix Flow

Follow ~/repros/CLAUDE.md workflow:

### Phase 1: Understand Issue
- Parse URL → extract org/repo/number/type
- Fetch via `gh issue view` or `gh pr view`
- Identify affected package from repo

### Phase 1.1: Code History Investigation

Before changing any code, understand its history:

```bash
# Blame specific file/function to find when lines were added
git blame -L {start},{end} {file}

# Get commit details
git show {commit-hash} --stat

# Find associated PR
gh pr list --repo {org/repo} --state merged --search {commit-hash}
# Or search by commit message keywords
gh search prs --repo {org/repo} "{keywords}"
```

For each function/block being modified:
1. Find commit that introduced it
2. Read original PR description and discussion
3. Understand what issue it fixed
4. Check if related tests exist
5. Document chronological history

**Expected output format:**

```md
## History (with PR/commit links)
1. {date} - {author} added {function/code} ([PR #{num}]({link}) or [commit]({link})) - {why it was added, what problem it solved}
2. {date} - {author} modified ([PR #{num}]({link})) - {what changed, why}
3. {date} - Current issue: {what's broken now}

## Context for Maintainer
- **What we had:** {original behavior and why it existed}
- **Current problem:** {what's broken, edge case, or regression}
- **How fix solves both:** {explains that fix handles original case + new case}
```

**Example (PR #33990):**
```md
## History
1. Aug 2021 - Pooya Parsa added encodePath() ([initial commit](link)) - needed for Nuxt 3 pages system URL handling
2. Jun 2023 - Daniel Roe added colon escaping ([PR #21731](https://github.com/nuxt/nuxt/pull/21731)) - fixed Arabic pages breaking because : is Vue Router's dynamic param syntax
3. Dec 2025 - Current issue: unicode paths (测试.vue) cause 404 on client navigation

## Context for Maintainer
- **What we had:** encodePath() + colon escaping to handle special chars in routes
- **Current problem:** encodePath() breaks unicode navigation, but we still need colon escaping
- **How fix solves both:** Remove encodePath() (fixes unicode) but keep colon escaping (preserves Arabic page fix). Also discovered: need to escape backslashes too (edge case: a\:b.vue)
```

### Phase 2: Create Reproduction
- Create folder: `~/repros/{lib}-{issue}/`
- Scaffold minimal Nuxt project reproducing bug
- Write README.md: Problem, Verify commands, Expected, Actual
- Run verification to confirm bug exists

### Phase 3: Fix

**IMPORTANT: Invoke relevant skills before writing code** (see Skills Integration above)

- Copy: `cp -r ~/repros/{lib}-{issue} ~/repros/{lib}-{issue}-fixed`
- Create pnpm patch: `pnpm patch {package}` → edit → `pnpm patch-commit`
- Verify fix works
- Update README with Fix section

### Phase 4: Commit & Push
```bash
cd ~/repros
git add {lib}-{issue} {lib}-{issue}-fixed
git commit -m "add {lib}-{issue} repro"
git push
```

### Phase 5: Validate in /tmp (virgin env)
```bash
cd /tmp && rm -rf test-repro && mkdir test-repro && cd test-repro
git clone --depth 1 --filter=blob:none --sparse https://github.com/onmax/repros.git
cd repros && git sparse-checkout set {lib}-{issue}
cd {lib}-{issue} && pnpm i && {verify-command}
# Confirm bug reproduces

git sparse-checkout add {lib}-{issue}-fixed
cd ../{lib}-{issue}-fixed && pnpm i && {verify-command}
# Confirm fix works
```

### Phase 6: Create PR

**ASK USER** before running `gh pr create`

PR body format:
```md
Fixes #{issue-number}

## Problem
{1-2 sentences describing current bug}

## Context
<!-- Include relevant history so maintainer understands the full picture -->
- {date}: {what was added} ([PR #{num}](link)) - {why}
- {date}: {modification} ([PR #{num}](link)) - {why}
- Now: {current issue}

**What we had:** {original behavior}
**Current problem:** {what's broken}
**How this fix handles both:** {brief explanation}

## Solution
{Brief fix approach}

## StackBlitz

| | Link | Expected |
|---|---|---|
| Bug | [{lib}-{issue}](https://stackblitz.com/github/onmax/repros/tree/main/{lib}-{issue}?startScript=build) | ❌ Build fails |
| Fix | [{lib}-{issue}-fixed](https://stackblitz.com/github/onmax/repros/tree/main/{lib}-{issue}-fixed?startScript=build) | ✅ Build succeeds |

## CLI Reproduction
\`\`\`bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/onmax/repros.git
cd repros && git sparse-checkout set {lib}-{issue}
cd {lib}-{issue} && pnpm i && {verify command}
\`\`\`

## Verify fix
\`\`\`bash
git sparse-checkout add {lib}-{issue}-fixed
cd ../{lib}-{issue}-fixed && pnpm i && {verify command}
\`\`\`
```

---

## Phase 7: Multi-Agent Review

After PR created, invoke `/review` skill to run multi-agent analysis.

If blockers found:
1. Apply fixes
2. Update PR
3. Re-run `/review`
4. Repeat until all 🟢

---

## Phase 8: CI Validation

### 8.1 Monitor CI

```bash
gh pr checks {pr-number} --repo {org/repo} --watch
```

### 8.2 Handle Failures

If check fails:
1. Get logs: `gh run view {run-id} --repo {org/repo} --log-failed`
2. Identify root cause
3. Fix locally
4. Push fix
5. Re-run monitoring

### 8.3 Complete

All ✅ → PR ready for maintainer review
Any ❌ → loop back to fix
