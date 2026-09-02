# MasterKraft Admin

Internal staff admin centre for MasterKraft. Private — not for public deployment.

```bash
npm install
cp .env.example .env.local    # choose the Supabase project, see CLAUDE.md
npm run dev                   # http://localhost:3300
```

Before anyone can sign in, run `supabase/migrations/0001_staff.sql` against the chosen Supabase
project and add yourself to `staff_members`:

```sql
insert into public.staff_members (user_id, full_name, role)
values ('<your auth.users id>', 'Your Name', 'admin');
```

Sign-in is an emailed one-time code. `shouldCreateUser: false` means signing in cannot create an
account — users are provisioned in Supabase first. See `CLAUDE.md` for the security model.
