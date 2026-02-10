---
name: write-a-prd
description: Conversational PRD writer - interview, scope, write, then create Linear/GitHub issue. Use when planning a new feature or product requirement.
---

# Write a PRD

This skill will be invoked when the user wants to create a PRD. Go through the steps below. You may skip steps if you don't consider them necessary.

1. Ask the user for a long, detailed description of the problem they want to solve and any potential ideas for solutions.

2. Explore the repo to verify their assertions and understand the current state of the codebase.

3. Ask whether they have considered other options, and present other options to them.

4. Interview the user about the implementation. Be extremely detailed and thorough.

5. Hammer out the exact scope of the implementation. Work out what you plan to build and what you DON'T plan to build as part of this PRD.

6. Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

7. Once you have a complete understanding of the problem and solution, write the PRD using the template below.

8. Ask user where to publish: Linear issue (via MCP `create_issue`) or GitHub issue (via `gh issue create`).

## PRD Template

```markdown
## Problem Statement
The problem that the user is facing, from the user's perspective.

## Solution
The solution to the problem, from the user's perspective.

## User Stories
A LONG, numbered list of user stories. Each user story should be in the format of:
1. As an <actor>, I want a <feature>, so that <benefit>

Example:
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending

This list of user stories should be extremely extensive and cover all aspects of the feature.

## 'Polishing' Requirements
Once the user stories are complete, we will end up with a working, but not refined, feature or application. After the work is complete, we should enter a polishing phase.

This should be a list of checks that we want to make at the end of the work to polish and refine the work done for maximum user enjoyment and experience.

They should not meaningfully extend the work but instead ensure harmony of all created elements and ensure any errors are properly handled and make things delightful and beautiful.

## Implementation Decisions
A list of implementation decisions that were made. This can include:
- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Testing Decisions
A list of testing decisions that were made. Include:
- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope
A description of the things that are out of scope for this PRD.

## Further Notes
Any further notes about the feature.
```
