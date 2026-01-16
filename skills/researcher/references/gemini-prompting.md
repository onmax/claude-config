# Gemini 3 Prompting Guide

Best practices for prompting Gemini 3 models.

## Temperature

Keep at **1.0** (default). Gemini 3 is optimized for this value—don't change unless you have a specific reason.

## Prompt Structure

Use XML tags for clear separation:

```xml
<context>
Background information, relevant docs, code snippets
</context>

<task>
What you want the model to do
</task>

<constraints>
- Output format requirements
- Length limits
- Style guidelines
</constraints>
```

## Thinking Levels

Control reasoning depth with `thinkingLevel`:

| Level | Use Case |
|-------|----------|
| `low` | Fast responses, simple tasks |
| `medium` | Balanced (default) |
| `high` | Complex reasoning, multi-step problems |

## Thought Signatures

For multi-turn conversations requiring reasoning continuity, pass back `thoughtSignature` from previous response.

```ts
// First turn
const response1 = await model.generate({ prompt: '...' })
const signature = response1.thoughtSignature

// Second turn - preserves reasoning context
const response2 = await model.generate({
  prompt: '...',
  thoughtSignature: signature
})
```

## Prompting Tips

### Do

- Be specific about output format
- Provide examples when possible
- Use structured prompts (XML tags)
- Specify what NOT to include if needed

### Don't

- Use blanket "do not infer" - be specific about what
- Over-constrain with unnecessary rules
- Mix multiple tasks in one prompt

## Report Structure

When requesting reports, specify structure explicitly:

```
Write a report on X with these sections:
## Executive Summary (2-3 sentences)
## Key Findings (bullet points)
## Detailed Analysis
## Recommendations
```

## Deep Research Specifics

The Deep Research agent (`deep-research-pro-preview`) automatically:
- Searches multiple sources
- Synthesizes information
- Provides citations
- Generates comprehensive reports

Best prompts for deep research:
- Open-ended questions
- Comparative analysis requests
- Historical research
- Technical deep-dives

## Links

- [Deep Research Docs](https://ai.google.dev/gemini-api/docs/deep-research)
- [Gemini 3 Guide](https://ai.google.dev/gemini-api/docs/gemini-3)
- [Prompting Guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/gemini-3-prompting-guide)
