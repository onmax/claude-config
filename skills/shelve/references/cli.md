# Shelve CLI Reference

## Installation

```bash
bun add -d @shelve/cli
# or: pnpm add -D @shelve/cli
```

## Commands

### login
Authenticate with Shelve. Get token from [app.shelve.cloud/user/tokens](https://app.shelve.cloud/user/tokens).
```bash
shelve login
```

### logout
Remove local credentials from `~/.shelve`.
```bash
shelve logout
```

### me
Show currently logged-in user info.
```bash
shelve me
```

### pull
Pull env vars from Shelve to local `.env` file.
```bash
shelve pull           # prompts for environment
shelve pull --env production
```

### push
Push local `.env` to Shelve.
```bash
shelve push           # prompts for environment
shelve push --env staging
```

### run
Inject secrets from Shelve into command (uses `ni` under the hood).
```bash
shelve run dev
shelve run build
shelve run dev:app --env development
```

### create
Create new project in Shelve.
```bash
shelve create
shelve create --name my-project --slug my-team
```

### config
Show current resolved configuration.
```bash
shelve config
```

### generate
Generate files like `.env.example`.
```bash
shelve generate
```

### upgrade
Upgrade CLI to latest version.
```bash
shelve upgrade
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `project` | string | `SHELVE_PROJECT` or package.json name | Project name |
| `slug` | string | `SHELVE_TEAM_SLUG` | Team slug (from team settings) |
| `token` | string | `~/.shelve` or `SHELVE_TOKEN` | Auth token |
| `url` | string | `https://app.shelve.cloud` | Shelve instance URL |
| `defaultEnv` | string | - | Default env for run/push/pull (skips prompt) |
| `confirmChanges` | boolean | `false` | Confirm before applying changes |
| `envFileName` | string | `.env` | Name of env file |
| `autoUppercase` | boolean | `true` | Uppercase env var keys |
| `autoCreateProject` | boolean | `true` | Auto-create project if missing |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SHELVE_PROJECT` | Project name |
| `SHELVE_TEAM_SLUG` | Team slug |
| `SHELVE_TOKEN` | Auth token |
| `SHELVE_URL` | Instance URL |
| `SHELVE_DEFAULT_ENV` | Default environment |

## Monorepo Config

Root `shelve.json`:
```json
{ "slug": "nuxtlabs" }
```

Package `apps/web/shelve.json`:
```json
{ "project": "@nuxt/web", "envFileName": ".env.local" }
```

Running `shelve pull` at root pulls for all packages with `shelve.json`.
