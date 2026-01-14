---
name: update-deps
description: "Update project dependencies. Runs pnpm upgrade, checks outdated packages (including pre-releases), fixes common issues (link: refs, caret removal), rebuilds lockfile, runs lint/build to verify. Does NOT commit changes."
user_invocable: true
license: MIT
---

# Update Dependencies

Guide for updating project dependencies safely.

## Step-by-Step Process

### 1. Ensure Clean State

Check clean working directory. If already on a `chore/` branch, stay on it.

```bash
git status  # Should show clean or be on chore/* branch
```

### 2. Initial Install

```bash
pnpm install
```

### 3. Run pnpm upgrade

```bash
pnpm upgrade -r
```

After upgrade, check git diff for issues:
- Range types shouldn't change in `dependencies` (e.g., `"^2.0.1"` must stay `"^2.0.1"`, not `"2.0.1"`)
- No `link:..` conversions for workspace packages

**Fix workspace link references:**

```bash
git diff --name-only | xargs grep -l '"link:' 2>/dev/null
```

If found, revert to original format (usually `"latest"` or version).

**Fix caret prefix removal:**

If deps lost `^` prefix in root package.json, restore manually.

### 4. Check Outdated

```bash
pnpm outdated -r
```

**IMPORTANT**: `pnpm outdated` doesn't show pre-release updates. For beta/alpha/rc packages:

```bash
pnpm show <package-name> versions --json | grep -E "beta|alpha|rc" | tail -5
# or
pnpm show <package-name> versions
```

### 5. Update Dependencies

Manually update all deps in package.json:
- Keep range prefix (`^`)
- Update beta/alpha/rc to latest pre-release
- Update both `dependencies` and `devDependencies`

### 6. Clean Install

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm i
```

### 7. Lint and Build

```bash
pnpm lint:fix  # or: lf
pnpm build     # or: b
```

### 8. Fix Issues

If lint/type errors:
1. Fix manually following project conventions
2. Re-run lint:fix and typecheck
3. Report remaining issues at the end

### 9. Final

Do NOT commit. Summarize what changed.

## Common Issues

### Breaking Changes
- Check changelog/release notes
- Update code for new API
- Consider pinning to previous major if too extensive

### Build Failures
- Check TypeScript errors first: `pnpm test:types` or `tp`
- Review deprecated APIs
- Update deps one at a time to isolate

### Lock File Conflicts
- Test thoroughly after major bumps
- Review changelogs for significant updates
