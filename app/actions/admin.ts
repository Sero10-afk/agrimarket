"use server";

import { revalidatePath } from "next/cache";
import { readDb, writeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function reviewKycAction(
  userId: string,
  decision: "valide" | "refuse"
): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "admin") return;

  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;

  user.kycStatus = decision;
  if (decision === "valide" && !user.badges.includes("eleveur_verifie")) {
    user.badges.push("eleveur_verifie");
  }
  if (decision === "refuse") {
    user.badges = user.badges.filter((b) => b !== "eleveur_verifie");
  }

  writeDb(db);
  revalidatePath("/tableau-de-bord");
}
