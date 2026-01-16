---
name: researcher
description: Use for deep research (Gemini Deep Research agent with citations) and technical writing (GitHub issues, blog posts, docs). Uses gemini-cli for writing, Vercel AI Gateway for queries, Google SDK for deep research.
version: 1.0.0
license: MIT
---

# Researcher Skill

Deep research and technical writing using Gemini models.

## Architecture

| Task | Tool | Model |
|------|------|-------|
| Deep research (async, 5-20min) | Google SDK Interactions API | `deep-research-pro-preview` |
| Technical writing | gemini-cli → Vercel AI Gateway fallback | Gemini 2.5 Pro |
| Quick queries | Vercel AI Gateway | Gemini 2.5 Pro |

## When to Use

- **Complex multi-step research** → `scripts/deep-research.ts` (async, takes 5-20min)
- **Technical writing** (issues, posts, docs) → `scripts/write.ts`
- **Quick research queries** → `scripts/query.ts`

## Prerequisites

```bash
# Install gemini-cli (for writing)
npm i -g @google/gemini-cli

# Install SDK (for deep research) - in this skill's directory
cd ~/.claude/skills/researcher && pnpm add @google/genai

# Required env vars in ~/.zshrc
export GOOGLE_AI_KEYS="<key1>,<key2>,<key3>"  # comma-separated for rotation
export AI_GATEWAY_API_KEY="<your-vercel-ai-gateway-key>"
```

Get keys:
- Google AI Studio: https://aistudio.google.com/apikey
- Vercel AI Gateway: https://vercel.com/account/settings

## Scripts

### Deep Research

```bash
npx tsx ~/.claude/skills/researcher/scripts/deep-research.ts "research query"
npx tsx ~/.claude/skills/researcher/scripts/deep-research.ts "TPU history" --output report.md
```

Async operation—polls until complete (5-20min). Returns comprehensive report with citations.

### Write

```bash
npx tsx ~/.claude/skills/researcher/scripts/write.ts github-issue "description"
npx tsx ~/.claude/skills/researcher/scripts/write.ts post "topic" --context notes.md
npx tsx ~/.claude/skills/researcher/scripts/write.ts technical-doc "feature"
```

Templates:
- `github-issue`: Title + body with Problem/Solution/Tasks sections
- `post`: Blog-style with intro, headers, conclusion
- `technical-doc`: Structured docs with overview, usage, examples

### Query

```bash
npx tsx ~/.claude/skills/researcher/scripts/query.ts "what is X?"
```

Instant response via Vercel AI Gateway.

## Available References

| Reference | Purpose |
|-----------|---------|
| **[references/gemini-prompting.md](references/gemini-prompting.md)** | Prompting best practices for Gemini 3 |

## Quick Prompting Tips

- Temperature: keep at **1.0** (Gemini 3 default)
- Structure with XML: `<context>`, `<task>`, `<constraints>`
- Thinking: `low` (fast) vs `high` (deep reasoning)
- For reports: specify structure in prompt (headers, sections)
