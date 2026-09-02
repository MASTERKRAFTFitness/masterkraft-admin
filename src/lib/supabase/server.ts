import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for server components, route handlers and middleware.
 *
 * Uses the anon key and the caller's own session, so **RLS is the security
 * boundary** — the same model the portals use. Any check done in React is
 * cosmetic; if a policy does not enforce it, it is not enforced.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Safe to ignore: middleware refreshes the session.
          }
        },
      },
    },
  );
}
