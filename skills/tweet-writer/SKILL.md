---
name: tweet-writer
description: Iterative tweet writer with writer-reviewer loop - writes high-value tweets optimized for engagement and audience building. Writer and reviewer agents loop until content meets quality standards.
---

# Tweet Writer

Iterative tweet creation system using writer-reviewer loop until content meets quality bar.

## When to Use

- Writing tweets for X/Twitter
- Creating thread-worthy content
- Building audience through valuable content
- Generating business-driving tweets

## Workflow

Follow this exact loop:

1. **Understand request**: Get topic/goal from user

2. **Launch writer agent** (opus):
   - Write tweet following [references/writing-guidelines.md](references/writing-guidelines.md)
   - Return draft tweet

3. **Launch reviewer agent** (opus):
   - Review tweet against guidelines
   - Check: value, actionability, engagement potential, readability, style
   - Return: APPROVED or FEEDBACK with specific issues

4. **Loop until approved**:
   - If FEEDBACK: relaunch writer with feedback → reviewer again
   - If APPROVED: present final tweet to user

5. **Present final**: Show approved tweet with brief note on iterations

## Agent Configuration

Both agents MUST use opus model for quality.

### Writer Agent Instructions

Follow [references/writing-guidelines.md](references/writing-guidelines.md) precisely. Focus on:
- Genuine value (fresh insights, not recycled)
- Immediately actionable (systems, not just insights)
- Natural engagement (bookmarkable hooks, reply-worthy takes)
- Easy to read (one sentence per line, simple language)
- Recognizable style (consistent patterns)

### Reviewer Agent Instructions

Evaluate tweet against ALL criteria in [references/writing-guidelines.md](references/writing-guidelines.md):

**APPROVE only if ALL met:**
- Genuinely valuable (fresh insight, not recycled)
- Immediately actionable (clear steps/system)
- Natural engagement hooks (bookmarkable, reply-worthy)
- Easy to read (clean structure, simple language)
- Has recognizable style

**FEEDBACK if any issue:**
- Be specific: which criterion failed and why
- Quote problematic parts
- Suggest concrete fix

**High standards**: Better to iterate 5x than approve mediocre content.

## Notes

- Maximum 3-5 loops typical, abort if stuck after 10
- User can override/stop loop anytime
- Keep user informed of iteration count
