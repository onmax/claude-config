# Wrangler.jsonc Templates for NuxtHub v0.10

Alternative to configuring bindings in `nuxt.config.ts`. Use wrangler.jsonc when you prefer file-based configuration or need features not supported in nuxt.config.

## Minimal (Database Only)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db", "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }]
}
```

## Full Stack (DB + KV + Blob + Cache)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db", "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }],
  "kv_namespaces": [
    { "binding": "KV", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
    { "binding": "CACHE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
  ],
  "r2_buckets": [{ "binding": "BLOB", "bucket_name": "my-app-bucket" }]
}
```

## Required Binding Names

| Feature      | Binding Name | Type         |
| ------------ | ------------ | ------------ |
| Database     | `DB`         | D1           |
| Key-Value    | `KV`         | KV Namespace |
| Cache        | `CACHE`      | KV Namespace |
| Blob Storage | `BLOB`       | R2 Bucket    |

## Creating Resources via CLI

```bash
# D1 Database
npx wrangler d1 create my-app-db
# Output: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# KV Namespace for storage
npx wrangler kv namespace create KV
# Output: id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# KV Namespace for cache
npx wrangler kv namespace create CACHE
# Output: id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# R2 Bucket
npx wrangler r2 bucket create my-app-bucket
# Bucket name is used directly, no ID needed
```

## Multi-Environment Setup

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db-prod", "database_id": "prod-db-id" }],
  "env": {
    "staging": {
      "d1_databases": [{ "binding": "DB", "database_name": "my-app-db-staging", "database_id": "staging-db-id" }]
    }
  }
}
```

Deploy with: `CLOUDFLARE_ENV=staging nuxt build && npx wrangler deploy`

## nuxt.config Alternative

Prefer configuring in `nuxt.config.ts` to avoid wrangler.jsonc:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    cloudflare: {
      wrangler: {
        compatibility_flags: ['nodejs_compat'],
        d1_databases: [{ binding: 'DB', database_id: '<id>' }],
        kv_namespaces: [
          { binding: 'KV', id: '<kv-id>' },
          { binding: 'CACHE', id: '<cache-id>' }
        ],
        r2_buckets: [{ binding: 'BLOB', bucket_name: '<bucket>' }]
      }
    }
  }
})
```

NuxtHub generates the wrangler.json during build from this config.
