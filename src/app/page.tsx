import { currentStaff } from "@/lib/staff";
import { redirect } from "next/navigation";

export default async function Home() {
  const staff = await currentStaff();

  // Signed in, but not on the staff list. Middleware cannot catch this — it has
  // no table access on the edge — so the check lands here.
  if (!staff) redirect("/login?denied=1");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-[var(--color-mk-accent)]">MasterKraft</p>
      <h1 className="mt-2 text-3xl font-semibold">Staff admin centre</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Signed in as {staff.full_name ?? staff.email} ({staff.role}).
      </p>

      <div className="mt-10 rounded-lg border border-[var(--color-mk-line)] p-6 dark:border-neutral-800">
        <h2 className="font-medium">No modules yet</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Add each admin area as a route under <code>src/app/</code>. Decide first which
          Supabase project this instance administers — see <code>.env.example</code>.
        </p>
      </div>
    </main>
  );
}
