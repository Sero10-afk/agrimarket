"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded border border-brick/30 bg-brick/5 p-2 text-sm text-brick">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-pasture px-4 py-2.5 text-sm font-medium text-paper hover:bg-pasture-dark disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-pasture hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
