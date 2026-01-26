# Shelve Skill

Secrets management platform. CLI syncs `.env` files with cloud storage.

## When to Use

Load this skill when user mentions:
- "shelve" (the platform)
- Syncing env vars / secrets with team
- Pulling/pushing environment variables
- Running commands with injected secrets

## Quick Reference

```bash
# Auth
shelve login              # Authenticate with token from app.shelve.cloud/user/tokens
shelve logout             # Remove local credentials
shelve me                 # Show current user

# Core operations
shelve pull               # Pull env vars from Shelve → local .env
shelve push               # Push local .env → Shelve
shelve run <cmd>          # Run command with injected secrets (no .env file needed)

# Project management
shelve create             # Create new project
shelve config             # Show current configuration
shelve generate           # Generate .env.example
shelve upgrade            # Upgrade CLI
```

## Configuration

Config loaded from `shelve.json` (or `shelve.config.json`, `.shelverc.json`):

```json
{ "$schema": "https://raw.githubusercontent.com/HugoRCD/shelve/main/packages/types/schema.json", "slug": "team-slug", "project": "project-name", "confirmChanges": true, "autoCreateProject": true }
```

## Monorepo Support

Root `shelve.json` defines shared config (e.g., `slug`). Each package has own `shelve.json` with `project` name. Running commands at root executes for all packages with config.

## References

@cli.md - Full CLI commands and config options
