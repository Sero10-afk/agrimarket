"use client";

import { useActionState } from "react";
import type { Category } from "@/lib/types";
import { createListingAction } from "@/app/actions/listings";

export default function ListingForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createListingAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded border border-brick/30 bg-brick/5 p-2 text-sm text-brick">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Titre de l&apos;annonce
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="ex. Taurillon Borgou, 18 mois"
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Catégorie
        </label>
        <select
          name="categoryId"
          required
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        >
          <option value="">Choisir…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Race
          </label>
          <input
            type="text"
            name="breed"
            className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Âge
          </label>
          <input
            type="text"
            name="age"
            placeholder="ex. 18 mois"
            className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Prix (FCFA)
          </label>
          <input
            type="number"
            name="price"
            required
            min={1}
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
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Statut sanitaire
        </label>
        <select
          name="healthStatus"
          defaultValue="sain"
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        >
          <option value="sain">Sain</option>
          <option value="vaccine">Vacciné</option>
          <option value="en_observation">En observation</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-pasture px-4 py-2.5 text-sm font-medium text-paper hover:bg-pasture-dark disabled:opacity-60"
      >
        {pending ? "Publication…" : "Publier l'annonce"}
      </button>
    </form>
  );
}
