# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

**MasterKraft's staff admin centre** — an internal tool for MasterKraft staff. Next.js (App Router)
+ TypeScript + Tailwind 4 + Supabase, matching the stack and conventions of
`masterkraft-portals-franchisee`. Created 2 Sep 2026; the module routes are not built yet.

## It administers several databases

MasterKraft's data lives in separate Supabase projects, and this admin centre spans them:

| Role | Ref | What |
|---|---|---|
| **home** | *(choose — see below)* | staff identity: `auth.users` + `staff_members` |
| administered | `yvalgutmowcvhrnpsbob` | the portals (`masterkraft-portals-hq`) |
| administered | `pmydkwszkgjnolrcnenh` | "Catalogues" (`masterkraft-portals-franchisee`, branch `catalogue-gated`) |
| administered | *later* | the CRM, to be migrated here |

`src/lib/supabase/projects.ts` is the only place that knows how many databases exist. Adding the CRM
is one entry there plus two env vars.

## Security model — READ THIS, it is not uniform

**Supabase Auth is per-project.** A session in the home project is not a session in any other, so
this app cannot use RLS as its boundary everywhere. Two different regimes apply:

**Home project — RLS is the boundary, as in the portals.**
- `src/middleware.ts` only checks a session *exists*. It runs on the edge with no table access, so it
  cannot check staff membership — don't add that there and assume it's enforced.
- `src/lib/staff.ts` `currentStaff()` reads `staff_members` for rendering decisions.
- The real gate is `is_masterkraft_staff()`, called from the RLS policies of every table this app
  touches. **A table without such a policy is not protected by anything in this repo.**
- `staff_members` has no insert/update/delete policy on purpose: staff are added deliberately from
  the SQL editor, never through the app.

**Administered projects — YOUR CODE is the boundary. There is no safety net.**
- Reached only via `adminDb(project)` in `src/lib/supabase/admin.ts`, using a **service-role key that
  bypasses RLS entirely**.
- The staff check lives *inside* `adminDb()` rather than in its callers, so a client cannot be
  obtained without it having run. **Do not add a variant that skips it**, and do not cache the
  returned client across requests.
- Every module reaching an administered project is one bug away from unrestricted read/write there.
  Treat those route handlers with the care that implies: validate inputs, scope queries explicitly,
  never interpolate user input into filters.
- `server-only` makes importing `admin.ts` from a client component a build error. Keep it that way.

## Running locally

```
npm install
cp .env.example .env.local   # then fill in
npm run dev                  # port 3300
```

Ports in use across the MasterKraft apps: 3100 HQ portal, 3200 franchisee, 3210 catalogues, 3300 here.

## Deployment

Not deployed yet. When it is: Vercel, MASTERKRAFT team, and **`robots` is set to `noindex, nofollow`
in `src/app/layout.tsx`** — keep it that way, this is a private staff tool.

## Git identity — read this before your first push

This repo belongs to the **MASTERKRAFTFitness** GitHub account, and this machine has several. The
remote uses an SSH host alias so the right key is chosen automatically:

```
git@github-masterkraft:MASTERKRAFTFitness/masterkraft-admin.git
```

Confirm with `ssh -T git@github-masterkraft` → "Hi MASTERKRAFTFitness!". If a push ever says
**"Repository not found"**, that is GitHub's message for *both* "does not exist" *and* "your
credentials cannot see it" — check the identity first, don't assume the repo is missing.
