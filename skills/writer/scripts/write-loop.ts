#!/usr/bin/env npx tsx
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { query, type Message } from '@anthropic-ai/claude-code'

const templates = {
  post: `You are writing a technical blog post. Structure:
- Hook intro (1-2 sentences)
- Problem statement
- Solution with code examples
- Key takeaways
- Conclusion

Use markdown headers (##). Be concise but thorough.`,

  doc: `You are writing technical documentation. Structure:
## Overview
Brief description.

## Installation
\`\`\`bash
# commands
\`\`\`

## Usage
Code examples with explanations.

## API Reference
If applicable.

## Examples
Real-world usage examples.`,

  'github-issue': `You are writing a GitHub issue. Structure:
## Problem
Brief description of the issue.

## Expected Behavior
What should happen.

## Current Behavior
What happens now.

## Tasks
- [ ] Task 1
- [ ] Task 2

Output JSON: { "title": "...", "body": "..." }`,
}

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    context: { type: 'string', short: 'c' },
    template: { type: 'string', short: 't', default: 'post' },
    'max-iterations': { type: 'string', short: 'm', default: '5' },
  },
  allowPositionals: true,
})

const template = (values.template || 'post') as keyof typeof templates
const description = positionals.join(' ')
const maxIterations = Number.parseInt(values['max-iterations'] || '5', 10)

if (!description) {
  console.error('Usage: npx tsx write-loop.ts "description" [--template post|doc|github-issue] [--context file.md]')
  process.exit(1)
}

const contextContent = values.context ? readFileSync(values.context, 'utf-8') : ''

async function callGemini(prompt: string, feedback?: string): Promise<string | null> {
  const systemPrompt = templates[template]
  let userPrompt = contextContent
    ? `<context>\n${contextContent}\n</context>\n\n<task>\n${prompt}\n</task>`
    : prompt

  if (feedback) {
    userPrompt += `\n\n<feedback>\nPrevious draft received this feedback. Please revise:\n${feedback}\n</feedback>`
  }

  // Try gemini-cli first
  const result = spawnSync('gemini', [
    '--model', 'gemini-2.5-pro',
    '-p', `${systemPrompt}\n\n${userPrompt}`,
  ], { encoding: 'utf-8', timeout: 180000 })

  if (result.status === 0 && result.stdout) {
    return result.stdout
  }

  // Fallback to Vercel AI Gateway
  const apiKey = process.env.AI_GATEWAY_API_KEY
  if (!apiKey) {
    console.error('gemini-cli failed and AI_GATEWAY_API_KEY not set')
    return null
  }

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    console.error('Vercel AI Gateway error:', await response.text())
    return null
  }

  const data = await response.json() as { choices: { message: { content: string } }[] }
  return data.choices[0]?.message?.content || null
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

Be strict but fair. Only approve if genuinely good.`

  let fullResponse = ''

  for await (const msg of query({
    prompt: reviewPrompt,
    options: {
      maxTurns: 1,
      allowedTools: [],
    },
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

  // Default to feedback if unclear
  return { approved: false, feedback: trimmed }
}

async function main() {
  console.log(`Writing ${template}: "${description}"`)
  console.log(`Max iterations: ${maxIterations}\n`)

  let feedback: string | undefined
  let finalDraft: string | null = null

  for (let i = 1; i <= maxIterations; i++) {
    console.log(`--- Iteration ${i}/${maxIterations} ---`)
    console.log('Generating draft with Gemini...')

    const draft = await callGemini(description, feedback)
    if (!draft) {
      console.error('Failed to generate draft')
      process.exit(1)
    }

    console.log('Reviewing with Claude...')
    const review = await reviewWithClaude(draft)

    if (review.approved) {
      console.log('✓ Draft approved!\n')
      finalDraft = draft
      break
    }

    console.log(`✗ Feedback: ${review.feedback}\n`)
    feedback = review.feedback

    if (i === maxIterations) {
      console.log('Max iterations reached, using last draft.\n')
      finalDraft = draft
    }
  }

  if (finalDraft) {
    console.log('=== FINAL DRAFT ===\n')
    console.log(finalDraft)
  }
}

main().catch(console.error)
