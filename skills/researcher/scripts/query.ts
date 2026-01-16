#!/usr/bin/env npx tsx
const query = process.argv.slice(2).join(' ')

if (!query) {
  console.error('Usage: npx tsx query.ts "your question"')
  process.exit(1)
}

const apiKey = process.env.AI_GATEWAY_API_KEY
if (!apiKey) {
  console.error('Missing AI_GATEWAY_API_KEY env var')
  console.error('Get one at: https://vercel.com/account/settings')
  process.exit(1)
}

async function main() {
  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-pro',
      messages: [{ role: 'user', content: query }],
    }),
  })

  if (!response.ok) {
    console.error('Error:', response.status, await response.text())
    process.exit(1)
  }

  const data = await response.json() as { choices: { message: { content: string } }[] }
  console.log(data.choices[0]?.message?.content || 'No response')
}

main().catch(console.error)
