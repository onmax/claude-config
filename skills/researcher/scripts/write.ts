#!/usr/bin/env npx tsx
import { execSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

const templates = {
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

  'post': `You are writing a technical blog post. Structure:
- Hook intro (1-2 sentences)
- Problem statement
- Solution with code examples
- Key takeaways
- Conclusion

Use markdown headers (##). Be concise but thorough.`,

  'technical-doc': `You are writing technical documentation. Structure:
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
}

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { context: { type: 'string', short: 'c' } },
  allowPositionals: true,
})

const template = positionals[0] as keyof typeof templates
const description = positionals.slice(1).join(' ')

if (!template || !templates[template] || !description) {
  console.error('Usage: npx tsx write.ts <template> "description" [--context file.md]')
  console.error('Templates:', Object.keys(templates).join(', '))
  process.exit(1)
}

const contextContent = values.context ? readFileSync(values.context, 'utf-8') : ''

const systemPrompt = templates[template]
const userPrompt = contextContent
  ? `<context>\n${contextContent}\n</context>\n\n<task>\n${description}\n</task>`
  : description

async function tryGeminiCli(): Promise<string | null> {
  try {
    const result = spawnSync('gemini', [
      '--model', 'gemini-2.5-pro',
      '-p', `${systemPrompt}\n\n${userPrompt}`,
    ], { encoding: 'utf-8', timeout: 120000 })

    if (result.status === 0 && result.stdout) {
      return result.stdout
    }
    return null
  }
  catch {
    return null
  }
}

async function tryVercelGateway(): Promise<string | null> {
  const apiKey = process.env.AI_GATEWAY_API_KEY
  if (!apiKey) {
    console.error('Warning: AI_GATEWAY_API_KEY not set, cannot fallback')
    return null
  }

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
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

async function main() {
  console.log(`Writing ${template}...`)

  // Try gemini-cli first
  let result = await tryGeminiCli()

  if (!result) {
    console.log('gemini-cli failed, trying Vercel AI Gateway...')
    result = await tryVercelGateway()
  }

  if (!result) {
    console.error('All providers failed')
    process.exit(1)
  }

  console.log('\n---\n')
  console.log(result)
}

main().catch(console.error)
