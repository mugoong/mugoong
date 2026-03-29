# MUGOONG

Inbound traveler platform for discovering and booking curated Korea experiences.

## What is automated now

- `pull_request` and `push` run GitHub Actions quality checks from `.github/workflows/ci.yml`.
- `push` to `main` runs `.github/workflows/deploy-production.yml`.
- Supabase production migrations are applied automatically from `supabase/migrations/`.
- Vercel production deployment can happen in one of two ways:
  - Recommended if already connected: Vercel Git Integration deploys automatically from `main`
  - Optional GitHub Actions path: add the Vercel secrets below and the workflow will deploy production explicitly

## One-time setup

### 1. GitHub repository secrets

Add these in `GitHub > Settings > Secrets and variables > Actions`.

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Notes:

- The current Supabase project ref is `qsifjnbjlejowdvvmnlt` and is already wired into the workflow.
- If you already use Vercel Git Integration, you can leave the `VERCEL_*` secrets empty. The workflow will skip the CLI deployment step and Vercel will keep deploying from GitHub automatically.
- Do not use both Vercel Git Integration and the Vercel CLI deployment path unless you intentionally want duplicate production deployments. If you add `VERCEL_*` secrets, it is cleaner to disable auto-deploy in Vercel Git settings.

### 2. Vercel production environment variables

Set these in `Vercel > Project Settings > Environment Variables`.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BUSINESS_EMAIL`

Add any future mail provider or payment secrets there as well.

### 3. First Supabase sync

This repository now tracks schema changes in:

- `supabase/migrations/20260330000100_baseline_schema.sql`

After the GitHub secrets are added, the next push to `main` will link to the hosted project and run `supabase db push` automatically.

## Daily workflow

### App code only

1. Make code changes.
2. Push to a feature branch and open a PR.
3. Merge to `main`.
4. GitHub Actions verifies the build.
5. Vercel deploys production automatically through Git Integration or the optional CLI job.

### Database changes

1. Add a new SQL file in `supabase/migrations/` with a timestamp prefix.
2. Commit that migration with the application change.
3. Merge to `main`.
4. GitHub Actions applies the migration to the hosted Supabase project before the Vercel deployment step.

Keep `supabase-schema.sql` as a human-readable reference snapshot, but treat `supabase/migrations/` as the source of truth for production schema changes.

## Local checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Deployment files

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-production.yml`
- `supabase/config.toml`
- `supabase/migrations/20260330000100_baseline_schema.sql`
