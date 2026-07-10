# VaporCast Live Avatar Provider Setup

This project now supports provider-backed live avatar streaming for photoreal presenters.

## 1) Configure environment

Copy `.env.example` to `.env` (or your deployment secret manager) and set:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VAPORCAST_AVATAR_PROVIDER=heygen` or `tavus`
- `HEYGEN_API_KEY` when using HeyGen
- `TAVUS_API_KEY` when using Tavus

## 2) Restart the app

Restart the server so environment changes are loaded.

## 3) Use the Avatar Studio

Open `/dashboard/avatars`:

1. Click `Check provider readiness`
2. Click `Start live avatar`
3. Enter script and click `Speak with lip sync`
4. Use `Generate presenter video` to push script + selected presenter settings into the current VaporCast video generation workflow.

## 4) Validation checklist

- Avatar stream loads in live preview panel
- `Speak with lip sync` triggers provider speech task
- Lip sync and expressions are visible in provider output
- `Generate presenter video` creates a job and status updates appear
- `npm run build` succeeds

## Notes

- Without provider env vars, the UI intentionally blocks live startup and shows missing variable names.
- Existing authentication, Supabase integration, and video generation routes remain unchanged.
