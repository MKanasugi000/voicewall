# VoiceWall - Session Handoff Document
*Last updated: 2026-03-09*

## Project Overview
VoiceWall is a testimonial collection/management Micro-SaaS tool. The user (金杉昌俊) is a programming beginner who wants maximum automation from Claude.

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router) + TypeScript
- **UI:** React 19.2.4 with inline styles (no CSS framework)
- **Backend:** Supabase (PostgreSQL)
- **Hosting:** Vercel (Hobby/free plan)
- **Repo:** https://github.com/MKanasugi000/voicewall
- **Live site:** https://voicewall.vercel.app
- **Languages:** Japanese + English (toggle on landing page)

## Supabase Configuration
- **Project name:** voicewall
- **Project ID:** viirgzvyqmiiommyrhsm
- **URL:** https://viirgzvyqmiiommyrhsm.supabase.co
- **Region:** Asia-Pacific (ap-southeast-1)
- **Database table:** `waitlist` (id BIGINT PK, email TEXT UNIQUE, created_at TIMESTAMPTZ)
- **RLS:** Enabled with "Allow public insert" policy for `{public}` role (INSERT only, WITH CHECK true)
- **Anon key:** Stored in `.env.local` (not committed to git)

## Project Structure
```
C:\Users\duper\voicewall\
├── .env.local                    # Supabase URL + Anon Key (gitignored)
├── .gitignore
├── deploy.ps1                    # One-command build + git + Vercel deploy
├── next.config.ts
├── package.json                  # includes @supabase/supabase-js ^2.49.0
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              # Landing page with waitlist form (async fetch)
    │   └── api/
    │       └── waitlist/
    │           └── route.ts      # POST endpoint for waitlist signup
    └── lib/
        └── supabase.ts           # Supabase client initialization
```

## Git Status (as of session end)
Last committed: `734eeb6 Update: 2026-03-08 21:33`

**Uncommitted changes (need deploy):**
- `package.json` — added `@supabase/supabase-js` dependency
- `src/app/page.tsx` — waitlist form now calls `/api/waitlist` API (async)
- `src/app/api/waitlist/route.ts` — NEW: API route for Supabase insert
- `src/lib/supabase.ts` — NEW: Supabase client
- `.env.local` — NEW: environment variables (gitignored)

## What Has Been Done
1. Created Next.js project with full Japanese/English landing page
2. Deployed to Vercel via CLI (live at voicewall.vercel.app)
3. Set up GitHub repo (MKanasugi000/voicewall)
4. Created `deploy.ps1` automation script (npm install → build → git commit → push → vercel deploy)
5. Created Supabase project "voicewall" via browser automation
6. Created `waitlist` table in Supabase with RLS + anon insert policy
7. Wrote Supabase integration code (client, API route, updated page.tsx)
8. Retrieved anon key and set it in `.env.local`
9. Set Vercel environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
10. Deployed to Vercel with env vars (successful)
11. **Fixed RLS bug:** Removed `.select()` from `route.ts` insert call — Supabase client executes SELECT after INSERT when `.select()` is used, but there was no SELECT RLS policy, causing "new row violates row-level security policy" error

## What Needs To Be Done Next (in order)
1. **User runs on PC:** `cd C:\Users\duper\voicewall && powershell -ExecutionPolicy Bypass -File deploy.ps1`
2. **Test:** Submit an email on https://voicewall.vercel.app and verify it appears in Supabase dashboard

## Future Roadmap
- Connect GitHub to Vercel for auto-deploy (currently using CLI deploy)
- User dashboard for managing testimonials
- Testimonial collection form (public-facing)
- Embeddable widget for displaying testimonials on other sites
- Stripe integration for Pro/Business plans
- Email notification system

## Important Notes
- User's OS: Windows (PowerShell)
- Project was initially on D:\mildsolt\voicewall, moved to C:\Users\duper\voicewall due to Cowork sandbox limitations
- PowerShell scripts must use ASCII-only (Japanese characters cause encoding errors)
- Cowork VM cannot run `npm install` / `npm run build` on mounted Windows directories (EPERM errors) — user must run these on their PC
- `.env.local` is in `.gitignore` so it won't be pushed to GitHub
