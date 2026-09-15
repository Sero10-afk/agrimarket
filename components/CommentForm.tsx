"use client";

import { useActionState } from "react";
import { createCommentAction } from "@/app/actions/comments";

export default function CommentForm({ articleId }: { articleId: string }) {
  const [state, formAction, pending] = useActionState(createCommentAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="articleId" value={articleId} />
      {state?.error && (
        <p className="rounded border border-brick/30 bg-brick/5 p-2 text-sm text-brick">
          {state.error}
        </p>
      )}
      <textarea
        name="content"
        required
        rows={3}
        placeholder="Pose ta question sur cet article…"
        className="w-full border border-line bg-paper px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-pasture px-4 py-2 text-sm font-medium text-paper hover:bg-pasture-dark disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
