"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readDb, writeDb, newId } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { computeCommission } from "@/lib/commission";
import type { ActionResult } from "./auth";

export async function purchaseAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Connecte-toi pour effectuer un achat." };
  }
  if (session.role !== "acheteur") {
    return { error: "Seul un compte acheteur peut effectuer un achat." };
  }

  const listingId = String(formData.get("listingId") ?? "");
  const db = readDb();
  const listing = db.listings.find((l) => l.id === listingId);
  if (!listing) {
    return { error: "Annonce introuvable." };
  }
  if (listing.status !== "disponible") {
    return { error: "Cette annonce n'est plus disponible." };
  }
  if (listing.sellerId === session.userId) {
    return { error: "Tu ne peux pas acheter ta propre annonce." };
  }

  const category = db.categories.find((c) => c.id === listing.categoryId);
  if (!category) {
    return { error: "Catégorie de l'annonce introuvable." };
  }

  const { amount: commission } = computeCommission(listing.price, category);

  const transaction = {
    id: newId("t"),
    listingId: listing.id,
    buyerId: session.userId,
    sellerId: listing.sellerId,
    amount: listing.price,
    commission,
    status: "sequestre" as const,
    createdAt: new Date().toISOString(),
    confirmedAt: null,
  };

  db.transactions.push(transaction);
  listing.status = "reserve";
  writeDb(db);

  revalidatePath(`/catalogue/${listing.id}`);
  revalidatePath("/tableau-de-bord");
  redirect("/tableau-de-bord?achat=confirme");
}

export async function confirmReceiptAction(
  transactionId: string
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const db = readDb();
  const transaction = db.transactions.find((t) => t.id === transactionId);
  if (!transaction) return;
  if (transaction.buyerId !== session.userId) return;
  if (transaction.status !== "sequestre") return;

  transaction.status = "confirme";
  transaction.confirmedAt = new Date().toISOString();

  const listing = db.listings.find((l) => l.id === transaction.listingId);
  if (listing) {
    listing.status = "vendu";
  }

  writeDb(db);
  revalidatePath("/tableau-de-bord");
}
