In all interactions and commit messages, be extremely concise and sacrifice grammar for the shake of clarity.

# Bash commands

- Use `ni` for package management (auto-detects manager)
- Aliases:
  - `b` for running build scripts
  - `nr <script-name>` to run any other build script
  - `nun` for uninstalling packages
  - `lf` to run lint fix
  - `tp` to run typecheck

- I prefer comments to be concise. They should explain the why, rather the what. Only keep the comments that are necessary to undersand the code. But, if reading the code is enough avoid adding comments.
- always commit messages of one line with less than 50 chars. Unless you really think is convinient to have a proper descriptions, just use one line
- Everytime you need to interact with a repo (creating new pr, updating issue...) use the gh cli
- Use python3 and not python command for running python. Same for pip3 instead of pip. Make sure to run fnm use 24 to change node version to 24 which should be the one that has all the configurations in my system
- When asked to download a website try to use https://github.com/harlan-zw/mdream to get the website as md
- remember. in tailwindcss and unocss, instead of using w-X and h-X to create a square, use the utility size-X
- when i use the `n/` i refer to `~/nimiq/` folder. when i refer to `p/` i refer to personal. For example, check out n/ui, should be ~/nimiq/ui
- try to keep the code in one line. JSON files with multiple keys? try one line unless they are very very long. or if array has multiple objects, if each object kinda fits in one line keep it in one line. This improves readability with less lines in general. same for function declaration with params.
- keep the PR description simple. Somethin like: wht we had before, what we expected. The actual change

## CLI

- Your primary method for interacting with GitHub should be the `gh` cli
- Your primary method for interacting with Vercel should be the `vercel` cli
  - `vercel api` - direct API access from terminal (`vercel api ls` to list, `vercel api [endpoint]` to call)
- `wrangler` - Cloudflare Workers CLI
- NuxtHub CLI is DEPRECATED. Never use `npx nuxthub`. Deployments happen via git push → Cloudflare CI

## Plans

- Make plans extremely concise. Scannable over readable.
- At the end of each plan, give me a list of unresolved questions if any. Make the questions extremely concise. Sacrifice grammar in shake of concision

## Subagents

- Always use `model: "opus"` when spawning subagents via Task tool

## Project Folders

- `~/repros/` - Bug reproductions (git repo). See its CLAUDE.md for workflow
- `~/templates/` - Starter templates (antfu, atinux, nuxt-ui, supersaas, vaul-vue)
- `~/references/` - Source code refs (better-auth, h3, nitro, nuxt-core, vitest, etc.)
- `~/nuxt/skills/` - Claude skills for Nuxt ecosystem
