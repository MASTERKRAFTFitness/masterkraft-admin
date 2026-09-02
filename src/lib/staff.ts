import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Is the current session a MasterKraft staff member?
 *
 * Backed by the `staff_members` table (see supabase/migrations/0001_staff.sql).
 * Membership is a row, not a claim in the JWT, so access can be revoked without
 * waiting for a token to expire.
 *
 * This returns a boolean for rendering decisions. It is NOT the security
 * boundary — RLS policies calling is_masterkraft_staff() are.
 */
export async function currentStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("staff_members")
    .select("user_id, full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? { ...data, email: user.email } : null;
}
