#!/usr/bin/env npx tsx
import { GoogleGenAI } from '@google/genai'
import { writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { output: { type: 'string', short: 'o' } },
  allowPositionals: true,
})

const query = positionals[0]
if (!query) {
  console.error('Usage: npx tsx deep-research.ts "research query" [--output file.md]')
  process.exit(1)
}

// Keys from env: GOOGLE_AI_KEYS="key1,key2,key3"
const API_KEYS = process.env.GOOGLE_AI_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || []
if (!API_KEYS.length) {
  console.error('Missing GOOGLE_AI_KEYS env var (comma-separated)')
  process.exit(1)
}

const QUOTA_WAIT_MS = 5 * 60 * 1000 // 5 min wait when all keys exhausted
const exhaustedKeys = new Map<string, number>() // key -> timestamp when exhausted

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const keyId = (k: string) => `...${k.slice(-8)}`

function getAvailableKey(): string | null {
  const now = Date.now()
  // First try keys that haven't been exhausted
  for (const key of API_KEYS) {
    if (!exhaustedKeys.has(key)) return key
  }
  // Check if any exhausted key has cooled down
  for (const key of API_KEYS) {
    const exhaustedAt = exhaustedKeys.get(key)!
    if (now - exhaustedAt > QUOTA_WAIT_MS) {
      exhaustedKeys.delete(key)
      return key
    }
  }
  return null
}

function markExhausted(key: string) {
  exhaustedKeys.set(key, Date.now())
  console.log(`Key ${keyId(key)} hit quota, marked exhausted`)
}

function isQuotaError(err: unknown): boolean {
  const msg = String(err).toLowerCase()
  return msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')
}

async function runResearch(apiKey: string) {
  const client = new GoogleGenAI({ apiKey })

  let interaction = await client.aio.interactions.create({
    input: query,
    agent: 'deep-research-pro-preview-12-2025',
    background: true,
    store: true,
    agentConfig: { type: 'deep-research', thinkingSummaries: 'auto' },
  })

  console.log(`Interaction ID: ${interaction.id}`)

  let dots = 0
  while (interaction.status !== 'completed') {
    if (interaction.status === 'failed') {
      throw new Error(`Research failed: ${JSON.stringify(interaction.error)}`)
    }

    process.stdout.write(`\rResearching${'.'.repeat(dots % 4).padEnd(4)}`)
    dots++

    await sleep(10000)
    interaction = await client.aio.interactions.get({ id: interaction.id! })
  }

  return interaction.outputs?.at(-1)?.text || 'No output generated'
}

async function main() {
  console.log(`Starting deep research: "${query}"`)
  console.log(`Available keys: ${API_KEYS.length}`)
  console.log('This may take 5-20 minutes...\n')

  while (true) {
    const apiKey = getAvailableKey()

    if (!apiKey) {
      // All keys exhausted, wait for cooldown
      const nextAvailable = Math.min(...[...exhaustedKeys.values()]) + QUOTA_WAIT_MS
      const waitMs = nextAvailable - Date.now()
      console.log(`\nAll keys exhausted. Waiting ${Math.ceil(waitMs / 60000)} min...`)
      await sleep(waitMs + 1000)
      continue
    }

    console.log(`Using key: ${keyId(apiKey)}`)

    try {
      const output = await runResearch(apiKey)

      console.log('\n\nResearch complete!\n')

      if (values.output) {
        writeFileSync(values.output, output)
        console.log(`Saved to: ${values.output}`)
      }
      else {
        console.log('---\n')
        console.log(output)
      }
      return // Success, exit
    }
    catch (err) {
      if (isQuotaError(err)) {
        markExhausted(apiKey)
        console.log('Retrying with another key...\n')
        continue
      }
      throw err // Non-quota error, bail
    }
  }
}

main().catch(console.error)
