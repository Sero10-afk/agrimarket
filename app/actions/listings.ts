"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readDb, writeDb, newId } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { HealthStatus } from "@/lib/types";
import type { ActionResult } from "./auth";

export async function createListingAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || session.role !== "eleveur") {
    return { error: "Seul un compte éleveur peut déposer une annonce." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const price = Number(formData.get("price"));
  const location = String(formData.get("location") ?? "").trim();
  const healthStatus = String(
    formData.get("healthStatus") ?? "sain"
  ) as HealthStatus;
  const age = String(formData.get("age") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();

  if (!title || !description || !categoryId || !price || price <= 0) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const db = readDb();
  const category = db.categories.find((c) => c.id === categoryId);
  if (!category) {
    return { error: "Catégorie invalide." };
  }

  const listing = {
    id: newId("l"),
    sellerId: session.userId,
    categoryId,
    title,
    description,
    price,
    location: location || "Non précisé",
    healthStatus,
    age: age || "Non précisé",
    breed: breed || "Non précisé",
    images: [],
    status: "disponible" as const,
    featured: false,
    createdAt: new Date().toISOString(),
  };

  db.listings.push(listing);
  writeDb(db);

  revalidatePath("/catalogue");
  revalidatePath("/tableau-de-bord");
  redirect(`/catalogue/${listing.id}`);
}

export async function deleteListingAction(listingId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const db = readDb();
  const listing = db.listings.find((l) => l.id === listingId);
  if (!listing) return;
  if (listing.sellerId !== session.userId && session.role !== "admin") return;

  db.listings = db.listings.filter((l) => l.id !== listingId);
  writeDb(db);

  revalidatePath("/catalogue");
  revalidatePath("/tableau-de-bord");
}

export async function toggleFeatureListingAction(
  listingId: string
): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "admin") return;

  const db = readDb();
  const listing = db.listings.find((l) => l.id === listingId);
  if (!listing) return;

  listing.featured = !listing.featured;
  writeDb(db);

  revalidatePath("/catalogue");
  revalidatePath("/");
}
