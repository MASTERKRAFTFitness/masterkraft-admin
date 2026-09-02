"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Email one-time code. No passwords held here — Supabase Auth owns that.
 * Being able to sign in does not grant access: `staff_members` decides that.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="text-sm uppercase tracking-widest text-[var(--color-mk-accent)]">MasterKraft</p>
      <h1 className="mt-2 text-2xl font-semibold">Staff sign-in</h1>

      {sent ? (
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          If that address belongs to a staff account, a sign-in code is on its way.
        </p>
      ) : (
        <form onSubmit={send} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@masterkraft.com"
            className="w-full rounded border border-[var(--color-mk-line)] px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button className="w-full rounded bg-[var(--color-mk-accent)] px-3 py-2 font-medium text-white">
            Email me a code
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </main>
  );
}
