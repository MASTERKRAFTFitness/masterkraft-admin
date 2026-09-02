import { currentStaff } from "@/lib/staff";
import { ADMINISTERED, configuredProjects, type ProjectKey } from "@/lib/supabase/projects";
import { redirect } from "next/navigation";

export default async function Home() {
  const staff = await currentStaff();

  // Signed in, but not on the staff list. Middleware cannot catch this — it has
  // no table access on the edge — so the check lands here.
  if (!staff) redirect("/login?denied=1");

  const configured = new Set<ProjectKey>(configuredProjects());
  const projects = (Object.keys(ADMINISTERED) as ProjectKey[]).map((k) => ({
    key: k,
    ...ADMINISTERED[k],
    ready: configured.has(k),
  }));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-[var(--color-mk-accent)]">MasterKraft</p>
      <h1 className="mt-2 text-3xl font-semibold">Staff admin centre</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Signed in as {staff.full_name ?? staff.email} ({staff.role}).
      </p>

      <h2 className="mt-12 text-sm font-medium uppercase tracking-wide text-neutral-500">
        Databases administered
      </h2>
      <ul className="mt-3 divide-y divide-[var(--color-mk-line)] rounded-lg border border-[var(--color-mk-line)] dark:divide-neutral-800 dark:border-neutral-800">
        {projects.map((p) => (
          <li key={p.key} className="flex items-start justify-between gap-6 p-5">
            <div>
              <p className="font-medium">{p.label}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.note}</p>
            </div>
            <span
              className={
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
                (p.ready
                  ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400")
              }
            >
              {p.ready ? "connected" : "not configured"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
        No admin modules built yet. Each one reaches its database via{" "}
        <code>adminDb(&quot;portals&quot;)</code> or <code>adminDb(&quot;catalogues&quot;)</code>,
        which refuses to hand back a client unless the caller is staff.
      </p>
    </main>
  );
}
