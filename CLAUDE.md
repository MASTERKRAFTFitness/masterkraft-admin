# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

**MasterKraft's staff admin centre** — an internal tool for MasterKraft staff. Next.js (App Router)
+ TypeScript + Tailwind 4 + Supabase, matching the stack and conventions of
`masterkraft-portals-franchisee`. Created 2 Sep 2026; the module routes are not built yet.

## Which Supabase project?

**Decide this deliberately — MasterKraft has two, and they are different databases:**

| Ref | Project | Used by |
|---|---|---|
| `yvalgutmowcvhrnpsbob` | the portals | `masterkraft-portals-hq` |
| `pmydkwszkgjnolrcnenh` | "Catalogues" | `masterkraft-portals-franchisee` (branch `catalogue-gated`) |

Nothing is hardcoded — it comes from `NEXT_PUBLIC_SUPABASE_URL` (see `.env.example`). Whichever you
point at, `supabase/migrations/0001_staff.sql` must be run **in that project** before anyone can
sign in, and `staff_members` rows added by hand.

## Security model

Same as the portals: **Postgres RLS is the security boundary.** Everything in React or middleware is
cosmetic UX.

- `src/middleware.ts` only checks a session *exists*. It runs on the edge with no table access, so it
  cannot check staff membership — don't add that there and assume it's enforced.
- `src/lib/staff.ts` `currentStaff()` reads `staff_members` for rendering decisions.
- The real gate is `is_masterkraft_staff()` in Postgres, called from the RLS policies of every table
  this app touches. **A table without such a policy is not protected by anything in this repo.**
- `staff_members` has no insert/update/delete policy on purpose: staff are added deliberately from
  the SQL editor, never through the app.
- The service-role key must stay server-side. It is not used anywhere yet; keep it that way unless a
  route genuinely needs to bypass RLS, and document why if so.

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
