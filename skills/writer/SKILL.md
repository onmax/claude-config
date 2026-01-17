---
name: writer
description: Iterative writing loop. Gemini 3 Pro writes, Claude Agent SDK reviews autonomously. Use for blog posts, docs, technical content needing quality iteration.
---

# Writer Skill

Iterative writing loop that combines Gemini 3 Pro's writing capabilities with Claude's review.

## Flow

1. User provides topic/context
2. Gemini 3 Pro writes draft
3. Claude Agent SDK reviews autonomously
4. If not approved, Gemini rewrites with feedback
5. Loop until approved (max 5 iterations)

## Usage

```bash
npx tsx ~/.claude/skills/writer/scripts/write-loop.ts "Write a blog post about Vue 3 composition API"
```

With context file:
```bash
npx tsx ~/.claude/skills/writer/scripts/write-loop.ts "Write docs for this component" --context ./Component.vue
```

## Environment Variables

- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key (for Gemini)

## Templates

- `post` - Technical blog post
- `doc` - Documentation
- `github-issue` - GitHub issue

```bash
npx tsx ~/.claude/skills/writer/scripts/write-loop.ts --template post "Vue 3 reactivity deep dive"
```
