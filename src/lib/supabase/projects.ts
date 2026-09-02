import "server-only";

/**
 * The databases this admin centre administers.
 *
 * MasterKraft's data is spread across separate Supabase projects, and Supabase
 * Auth is per-project — a session in one is not a session in another. So:
 *
 *   home        - staff identity lives here. Sessions are real, RLS applies.
 *   administered - reached with a service-role key, which BYPASSES RLS.
 *
 * Adding the CRM later means one entry here plus two env vars. Nothing else in
 * the app should know how many databases there are.
 */
export const ADMINISTERED = {
  portals: {
    label: "Portals",
    urlEnv: "PORTALS_SUPABASE_URL",
    keyEnv: "PORTALS_SERVICE_ROLE_KEY",
    note: "HQ + partner portals (masterkraft-portals-hq)",
  },
  catalogues: {
    label: "Catalogues",
    urlEnv: "CATALOGUES_SUPABASE_URL",
    keyEnv: "CATALOGUES_SERVICE_ROLE_KEY",
    note: "Gated brand catalogues (masterkraft-portals-franchisee, branch catalogue-gated)",
  },
  // crm: { label: "CRM", urlEnv: "CRM_SUPABASE_URL", keyEnv: "CRM_SERVICE_ROLE_KEY", note: "" },
} as const;

export type ProjectKey = keyof typeof ADMINISTERED;

/** Which administered projects are actually configured in this environment. */
export function configuredProjects(): ProjectKey[] {
  return (Object.keys(ADMINISTERED) as ProjectKey[]).filter((k) => {
    const p = ADMINISTERED[k];
    return Boolean(process.env[p.urlEnv] && process.env[p.keyEnv]);
  });
}
