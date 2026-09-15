"use server";

import { revalidatePath } from "next/cache";
import { readDb, writeDb, newId } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ActionResult } from "./auth";

export async function createCommentAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Connecte-toi pour poser une question." };
  }

  const articleId = String(formData.get("articleId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { error: "Le commentaire ne peut pas être vide." };
  }

  const db = readDb();
  const article = db.articles.find((a) => a.id === articleId);
  if (!article) {
    return { error: "Article introuvable." };
  }

  db.comments.push({
    id: newId("cm"),
    articleId,
    authorId: session.userId,
    content,
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  revalidatePath(`/conseils/${articleId}`);
  return {};
}
