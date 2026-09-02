import "server-only";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { ADMINISTERED, type ProjectKey } from "./projects";
import { currentStaff } from "@/lib/staff";

/**
 * A service-role client for one administered project.
 *
 * **This bypasses RLS.** There is no database-level protection behind it, which
 * is why the staff check is inside this function rather than left to callers —
 * you cannot obtain the client without it having run. Do not export a variant
 * that skips it, and never import this module from a client component
 * (`server-only` makes that a build error).
 *
 * Throws if the caller is not staff, or if the project is not configured.
 */
export async function adminDb(project: ProjectKey): Promise<SupabaseClient> {
  const staff = await currentStaff();
  if (!staff) throw new Error("adminDb: not a staff member");

  const { urlEnv, keyEnv, label } = ADMINISTERED[project];
  const url = process.env[urlEnv];
  const key = process.env[keyEnv];
  if (!url || !key) {
    throw new Error(`adminDb: ${label} is not configured (${urlEnv} / ${keyEnv})`);
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
