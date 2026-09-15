"use server";

import { redirect } from "next/navigation";
import { readDb, writeDb, newId } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import type { Role } from "@/lib/types";

export interface ActionResult {
  error?: string;
}

export async function registerAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "acheteur") as Role;
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!name || !email || !password) {
    return { error: "Nom, email et mot de passe sont obligatoires." };
  }
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }
  if (!["eleveur", "acheteur"].includes(role)) {
    return { error: "Rôle invalide." };
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: newId("u"),
    name,
    email,
    passwordHash,
    role,
    phone,
    location,
    kycStatus: "non_soumis" as const,
    badges: [],
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect("/tableau-de-bord");
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe sont obligatoires." };
  }

  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect("/tableau-de-bord");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
