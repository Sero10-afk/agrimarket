"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded border border-brick/30 bg-brick/5 p-2 text-sm text-brick">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Nom complet
        </label>
        <input
          type="text"
          name="name"
          required
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
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
          minLength={6}
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Téléphone
        </label>
        <input
          type="tel"
          name="phone"
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Localisation
        </label>
        <input
          type="text"
          name="location"
          placeholder="ex. Parakou"
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Je suis
        </label>
        <select
          name="role"
          defaultValue="acheteur"
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        >
          <option value="acheteur">Acheteur</option>
          <option value="eleveur">Éleveur</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-pasture px-4 py-2.5 text-sm font-medium text-paper hover:bg-pasture-dark disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-pasture hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
