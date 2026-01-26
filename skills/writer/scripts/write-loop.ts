#!/usr/bin/env npx tsx
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { query } from '@anthropic-ai/claude-code'

const STATE_FILE = '.writer-state.json'

interface WriterState {
  description: string
  template: string
  context?: string
  iterations: Array<{
    draft: string
    feedback?: string
    status: 'pending' | 'approved' | 'needs_revision'
    timestamp: string
  }>
}

const templates = {
  post: `<role>Technical blog post writer</role>

<structure>
- Hook: 1-2 sentences that grab attention
- Problem: What issue does this solve?
- Solution: Step-by-step with code examples
- Takeaways: 2-3 bullet points
- Conclusion: Call to action or next steps
</structure>

<format>
- Use ## for main sections
- Use \`\`\` for code blocks with language tags
- Keep paragraphs short (2-3 sentences max)
</format>

<example>
Input: "How to use TypeScript generics for type-safe API calls"
Output:
## Stop Writing Unsafe API Calls

Every API call is a potential runtime error waiting to happen...

## The Problem
When fetching data, TypeScript can't verify the response shape...

## The Solution
\`\`\`typescript
async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json() as T
}
\`\`\`

## Key Takeaways
- Generics let you define the shape at call-site
- Use type guards for runtime validation
- Combine with zod for full safety

## Next Steps
Try refactoring one API call in your codebase today.
</example>`,

  doc: `<role>Technical documentation writer</role>

<structure>
## Overview
One paragraph explaining what this is and why it matters.

## Installation
\`\`\`bash
# exact commands to install
\`\`\`

## Quick Start
Minimal working example to get started fast.

## API Reference
Functions/methods with params, return types, examples.

## Examples
Real-world usage patterns.
</structure>

<format>
- Use ## for sections, ### for subsections
- Every code block needs a language tag
- Tables for API params: | Param | Type | Description |
</format>

<example>
Input: "Document a useLocalStorage composable"
Output:
## Overview
\`useLocalStorage\` syncs reactive state with localStorage, handling SSR and serialization automatically.

## Installation
\`\`\`bash
npm install @vueuse/core
\`\`\`

## Quick Start
\`\`\`vue
<script setup>
const count = useLocalStorage('counter', 0)
</script>
<template>
  <button @click="count++">{{ count }}</button>
</template>
\`\`\`

## API Reference
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| key | string | required | localStorage key |
| initialValue | T | required | Default value |

## Examples
\`\`\`typescript
// With custom serializer
const user = useLocalStorage('user', null, {
  serializer: { read: JSON.parse, write: JSON.stringify }
})
\`\`\`
</example>`,

  'github-issue': `<role>GitHub issue writer</role>

<structure>
## Problem
What's broken or missing? Be specific.

## Expected Behavior
What should happen instead?

## Current Behavior
What happens now? Include error messages if any.

## Reproduction
Steps or minimal code to reproduce.

## Tasks
Checkbox list of work items.
</structure>

<format>
Output JSON: { "title": "concise title under 60 chars", "body": "markdown body" }
</format>

<example>
Input: "useAsyncData doesn't refresh when key changes"
Output:
{
  "title": "useAsyncData ignores key changes after initial fetch",
  "body": "## Problem\\nChanging the key parameter doesn't trigger a refetch.\\n\\n## Expected Behavior\\nData should refetch when key changes, like React Query.\\n\\n## Current Behavior\\nInitial fetch works, subsequent key changes are ignored.\\n\\n## Reproduction\\n\`\`\`vue\\n<script setup>\\nconst id = ref(1)\\nconst { data } = useAsyncData(\`user-\${id.value}\`, () => fetchUser(id.value))\\nid.value = 2 // doesn't refetch\\n</script>\\n\`\`\`\\n\\n## Tasks\\n- [ ] Add key reactivity\\n- [ ] Add tests\\n- [ ] Update docs"
}
</example>`,
}

const deeplDefaults: Record<string, { style: string, tone: string }> = {
  post: { style: 'business', tone: 'friendly' },
  doc: { style: 'simple', tone: 'confident' },
  'github-issue': { style: 'business', tone: 'diplomatic' },
}

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    context: { type: 'string', short: 'c' },
    template: { type: 'string', short: 't', default: 'post' },
    'max-iterations': { type: 'string', short: 'm', default: '15' },
    'no-grammar': { type: 'boolean', default: false },
    style: { type: 'string', short: 's' },
    tone: { type: 'string', short: 'o' },
    lang: { type: 'string', short: 'l', default: 'en-US' },
    resume: { type: 'boolean', short: 'r', default: false },
    model: { type: 'string', default: 'pro' },
  },
  allowPositionals: true,
})

const template = (values.template || 'post') as keyof typeof templates
const description = positionals.join(' ')
const maxIterations = Number.parseInt(values['max-iterations'] || '15', 10)
const skipGrammar = values['no-grammar'] || false
const templateDefaults = deeplDefaults[template] || deeplDefaults.post
const writingStyle = values.style || templateDefaults.style
const writingTone = values.tone || templateDefaults.tone
const targetLang = values.lang || 'en-US'
const shouldResume = values.resume || false
const modelOption = values.model || 'pro'

// API key rotation - supports GOOGLE_AI_KEYS (comma-separated) or individual GOOGLE_AI_KEY_1/2/3
const apiKeys = process.env.GOOGLE_AI_KEYS
  ? process.env.GOOGLE_AI_KEYS.split(',').map(k => k.trim()).filter(Boolean)
  : [process.env.GOOGLE_AI_KEY_1, process.env.GOOGLE_AI_KEY_2, process.env.GOOGLE_AI_KEY_3].filter(Boolean) as string[]

let currentKeyIndex = 0

function isQuotaError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')
}

async function callWithRotation<T>(fn: (key: string) => Promise<T>): Promise<T> {
  if (apiKeys.length === 0) {
    throw new Error('No Google AI API keys found. Set GOOGLE_AI_KEY_1, GOOGLE_AI_KEY_2, or GOOGLE_AI_KEY_3')
  }

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      return await fn(apiKeys[currentKeyIndex])
    } catch (e) {
      if (isQuotaError(e) && i < apiKeys.length - 1) {
        console.log(`Key ${currentKeyIndex + 1} quota exceeded, rotating...`)
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
        continue
      }
      throw e
    }
  }
  throw new Error('All API keys exhausted')
}

function loadState(): WriterState | null {
  if (!existsSync(STATE_FILE)) return null
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'))
  } catch {
    return null
  }
}

function saveState(state: WriterState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

const contextContent = values.context ? readFileSync(values.context, 'utf-8') : ''

async function callGemini(prompt: string, feedback?: string): Promise<string> {
  const systemPrompt = templates[template]
  let userPrompt = contextContent
    ? `<context>\n${contextContent}\n</context>\n\n<task>\n${prompt}\n</task>`
    : prompt

  if (feedback) {
    userPrompt += `\n\n<feedback>\nPrevious draft received this feedback. Please revise:\n${feedback}\n</feedback>`
  }

  return callWithRotation(async (apiKey) => {
    const google = createGoogleGenerativeAI({ apiKey })
    const modelConfig = modelOption === 'pro-think'
      ? { google: { thinkingConfig: { thinkingLevel: 'high' as const } } }
      : undefined

    const { text } = await generateText({
      model: google('gemini-3-pro-preview'),
      system: systemPrompt,
      prompt: userPrompt,
      maxRetries: 3,
      abortSignal: AbortSignal.timeout(120_000),
      ...(modelConfig && { providerOptions: modelConfig }),
    })

    return text
  })
}

async function reviewWithClaude(draft: string): Promise<{ approved: boolean, feedback?: string }> {
  const reviewPrompt = `Review this draft for quality, clarity, and completeness.

<draft>
${draft}
</draft>

Evaluate:
1. Is the content accurate and well-structured?
2. Is the writing clear and concise?
3. Are code examples (if any) correct?
4. Is anything missing or unclear?

Respond with EXACTLY one of:
- "APPROVED" if the draft is ready to publish
- "FEEDBACK: <your specific feedback>" if revisions needed

Approve if the draft is accurate, clear, and reasonably complete.
Minor improvements are always possible - don't require perfection.
Approve unless there are significant issues with accuracy, clarity, or structure.`

  let fullResponse = ''

  for await (const msg of query({
    prompt: reviewPrompt,
    options: { maxTurns: 1, allowedTools: [] },
  })) {
    if (msg.type === 'assistant' && msg.message?.content) {
      for (const block of msg.message.content) {
        if (block.type === 'text') fullResponse += block.text
      }
    }
  }

  const trimmed = fullResponse.trim()
  if (trimmed.startsWith('APPROVED')) {
    return { approved: true }
  }

  const feedbackMatch = trimmed.match(/^FEEDBACK:\s*(.+)/s)
  if (feedbackMatch) {
    return { approved: false, feedback: feedbackMatch[1].trim() }
  }

  return { approved: false, feedback: trimmed }
}

async function improveWithDeepL(text: string, style: string, tone: string, lang: string): Promise<string | null> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.deepl.com/v2/write/rephrase', {
    method: 'POST',
    headers: { 'DeepL-Auth-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: [text], target_lang: lang.replace('-', '_').toUpperCase(), writing_style: style, tone }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!response.ok) {
    console.error('DeepL API error:', await response.text())
    return null
  }

  const data = await response.json() as { translations: { text: string }[] }
  return data.translations?.[0]?.text || null
}

async function mergeWithClaude(original: string, deeplOutput: string): Promise<string> {
  const mergePrompt = `Compare these two versions and merge intelligently.

<original>
${original}
</original>

<deepl_improved>
${deeplOutput}
</deepl_improved>

Apply DeepL's grammar/style improvements BUT preserve:
- Code blocks (\`\`\`...\`\`\`) exactly as in original
- Markdown structure (headers, lists, links)
- Technical terms and jargon
- Intentional stylistic choices from original

Output ONLY the merged text, no explanations.`

  let mergedText = ''
  for await (const msg of query({
    prompt: mergePrompt,
    options: { maxTurns: 1, allowedTools: [] },
  })) {
    if (msg.type === 'assistant' && msg.message?.content) {
      for (const block of msg.message.content) {
        if (block.type === 'text') mergedText += block.text
      }
    }
  }

  return mergedText.trim() || original
}

async function main() {
  let state: WriterState | null = null
  let startIteration = 1
  let feedback: string | undefined

  if (shouldResume) {
    state = loadState()
    if (state) {
      console.log(`Resuming from state: ${state.iterations.length} iterations completed`)
      startIteration = state.iterations.length + 1
      const lastIteration = state.iterations[state.iterations.length - 1]
      if (lastIteration?.status === 'needs_revision') {
        feedback = lastIteration.feedback
      }
    } else {
      console.log('No state file found, starting fresh')
    }
  }

  if (!state) {
    if (!description) {
      console.error('Usage: npx tsx write-loop.ts "description" [--template post|doc|github-issue] [--context file.md] [--resume] [--model pro|pro-think]')
      process.exit(1)
    }
    state = { description, template, context: contextContent || undefined, iterations: [] }
  }

  console.log(`Writing ${template}: "${state.description}"`)
  console.log(`Model: ${modelOption === 'pro-think' ? 'gemini-3-pro (thinking)' : 'gemini-3-pro'}`)
  console.log(`Max iterations: ${maxIterations}, starting from: ${startIteration}\n`)

  let finalDraft: string | null = null

  for (let i = startIteration; i <= maxIterations; i++) {
    console.log(`--- Iteration ${i}/${maxIterations} ---`)
    console.log('Generating draft with Gemini...')

    try {
      const draft = await callGemini(state.description, feedback)

      console.log('Reviewing with Claude...')
      const review = await reviewWithClaude(draft)

      if (review.approved) {
        console.log('✓ Draft approved!\n')
        state.iterations.push({ draft, status: 'approved', timestamp: new Date().toISOString() })
        saveState(state)
        finalDraft = draft
        break
      }

      console.log(`✗ Feedback: ${review.feedback}\n`)
      state.iterations.push({ draft, feedback: review.feedback, status: 'needs_revision', timestamp: new Date().toISOString() })
      saveState(state)
      feedback = review.feedback

      if (i === maxIterations) {
        console.log('Max iterations reached, using last draft.\n')
        finalDraft = draft
      }
    } catch (e) {
      console.error(`Error in iteration ${i}:`, e instanceof Error ? e.message : e)
      console.log('State saved. Run with --resume to continue.\n')
      saveState(state)
      process.exit(1)
    }
  }

  if (finalDraft) {
    if (!skipGrammar && process.env.DEEPL_API_KEY) {
      console.log('=== GRAMMAR STEP ===')
      console.log(`Style: ${writingStyle}, Tone: ${writingTone}, Lang: ${targetLang}`)
      console.log('Improving with DeepL...')
      const improved = await improveWithDeepL(finalDraft, writingStyle, writingTone, targetLang)
      if (improved) {
        console.log('Merging with Claude...')
        finalDraft = await mergeWithClaude(finalDraft, improved)
        console.log('✓ Grammar step complete\n')
      } else {
        console.log('⚠ DeepL failed, skipping grammar step\n')
      }
    } else if (!skipGrammar) {
      console.log('⚠ DEEPL_API_KEY not set, skipping grammar step\n')
    }

    console.log('=== FINAL DRAFT ===\n')
    console.log(finalDraft)
    console.log('\n=== ITERATION SUMMARY ===')
    console.log(`Total iterations: ${state.iterations.length}/${maxIterations}`)
    const lastLog = state.iterations[state.iterations.length - 1]
    console.log(`Final status: ${lastLog?.status === 'approved' ? '✓ Approved' : '⚠ Max iterations reached'}`)
    console.log('\nIteration history:')
    for (let idx = 0; idx < state.iterations.length; idx++) {
      const log = state.iterations[idx]
      const statusIcon = log.status === 'approved' ? '✓' : '✗'
      const feedbackSummary = log.feedback ? ` - ${log.feedback.slice(0, 100)}${log.feedback.length > 100 ? '...' : ''}` : ''
      console.log(`  ${idx + 1}. [${statusIcon}] ${log.status}${feedbackSummary}`)
    }
    console.log('=========================\n')
  }
}

main().catch((e) => {
  console.error('Fatal error:', e instanceof Error ? e.message : e)
  process.exit(1)
})
