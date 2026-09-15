import { notFound } from "next/navigation";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import CommentForm from "@/components/CommentForm";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = readDb();
  const article = db.articles.find((a) => a.id === id);
  if (!article) notFound();

  const session = await getSession();
  const comments = db.comments
    .filter((c) => c.articleId === id)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const userName = (userId: string) =>
    db.users.find((u) => u.id === userId)?.name ?? "Utilisateur";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/conseils" className="text-sm text-ink-soft hover:text-pasture">
        ← Tous les conseils
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wide text-ochre-dark">
        {article.theme}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
        {article.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">
        {article.content}
      </p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-lg font-medium text-ink">
          Questions ({comments.length})
        </h2>

        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="ledger-row pb-4">
              <p className="text-sm font-medium text-ink">
                {userName(comment.authorId)}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{comment.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {session ? (
            <CommentForm articleId={article.id} />
          ) : (
            <p className="text-sm text-ink-soft">
              <Link href="/connexion" className="text-pasture hover:underline">
                Connecte-toi
              </Link>{" "}
              pour poser une question.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
