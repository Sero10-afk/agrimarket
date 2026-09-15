"use client";

import { useActionState, useState } from "react";
import { createReviewAction } from "@/app/actions/reviews";

export default function ReviewForm({ transactionId }: { transactionId: string }) {
  const [state, formAction, pending] = useActionState(createReviewAction, {});
  const [submitted, setSubmitted] = useState(false);

  if (submitted && !state?.error) {
    return (
      <p className="mt-2 text-sm text-pasture">Merci pour ton avis !</p>
    );
  }

  return (
    <form
      action={(formData) => {
        setSubmitted(true);
        formAction(formData);
      }}
      className="mt-3 space-y-2 border-t border-line pt-3"
    >
      <input type="hidden" name="transactionId" value={transactionId} />
      {state?.error && (
        <p className="rounded border border-brick/30 bg-brick/5 p-2 text-xs text-brick">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <label className="text-xs text-ink-soft" htmlFor={`rating-${transactionId}`}>
          Note
        </label>
        <select
          id={`rating-${transactionId}`}
          name="rating"
          defaultValue="5"
          className="border border-line bg-paper px-2 py-1 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} / 5
            </option>
          ))}
        </select>
      </div>
      <textarea
        name="comment"
        rows={2}
        placeholder="Un commentaire (optionnel)"
        className="w-full border border-line bg-paper px-2 py-1.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-pasture hover:text-pasture disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Laisser un avis"}
      </button>
    </form>
  );
}
