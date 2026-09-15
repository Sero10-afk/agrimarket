"use server";

import { revalidatePath } from "next/cache";
import { readDb, writeDb, newId } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ActionResult } from "./auth";

export async function createReviewAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Connecte-toi pour laisser un avis." };
  }

  const transactionId = String(formData.get("transactionId") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!rating || rating < 1 || rating > 5) {
    return { error: "La note doit être comprise entre 1 et 5." };
  }

  const db = readDb();
  const transaction = db.transactions.find((t) => t.id === transactionId);
  if (!transaction || transaction.status !== "confirme") {
    return { error: "Cette transaction n'est pas encore finalisée." };
  }
  if (
    transaction.buyerId !== session.userId &&
    transaction.sellerId !== session.userId
  ) {
    return { error: "Tu n'es pas concerné par cette transaction." };
  }

  const targetId =
    transaction.buyerId === session.userId
      ? transaction.sellerId
      : transaction.buyerId;

  const alreadyReviewed = db.reviews.some(
    (r) => r.transactionId === transactionId && r.authorId === session.userId
  );
  if (alreadyReviewed) {
    return { error: "Tu as déjà laissé un avis pour cette transaction." };
  }

  db.reviews.push({
    id: newId("r"),
    transactionId,
    authorId: session.userId,
    targetId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  revalidatePath("/tableau-de-bord");
  return {};
}
