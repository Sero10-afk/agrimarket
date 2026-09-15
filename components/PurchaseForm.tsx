"use client";

import { useActionState } from "react";
import { purchaseAction } from "@/app/actions/transactions";

export default function PurchaseForm({
  listingId,
  disabled,
  disabledReason,
}: {
  listingId: string;
  disabled: boolean;
  disabledReason?: string;
}) {
  const [state, formAction, pending] = useActionState(purchaseAction, {});

  if (disabled) {
    return (
      <p className="rounded border border-line bg-bone/60 p-3 text-sm text-ink-soft">
        {disabledReason}
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="listingId" value={listingId} />
      {state?.error && (
        <p className="mb-3 rounded border border-brick/30 bg-brick/5 p-2 text-sm text-brick">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-ochre px-4 py-2.5 text-sm font-medium text-paper hover:bg-ochre-dark disabled:opacity-60"
      >
        {pending ? "Traitement en cours…" : "Acheter avec paiement séquestre"}
      </button>
    </form>
  );
}
