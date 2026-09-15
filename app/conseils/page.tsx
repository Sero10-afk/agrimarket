import Link from "next/link";
import { readDb } from "@/lib/db";

export default async function ConseilsPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme } = await searchParams;
  const db = readDb();

  const themes = Array.from(new Set(db.articles.map((a) => a.theme)));
  const articles = theme
    ? db.articles.filter((a) => a.theme === theme)
    : db.articles;

  const sorted = [...articles].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Conseils d&apos;élevage
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Des repères pratiques pour la santé animale, le commerce et la
        conduite d&apos;élevage.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/conseils"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !theme
              ? "border-pasture bg-pasture text-paper"
              : "border-line text-ink-soft hover:border-pasture"
          }`}
        >
          Tous
        </Link>
        {themes.map((t) => (
          <Link
            key={t}
            href={`/conseils?theme=${encodeURIComponent(t)}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              theme === t
                ? "border-pasture bg-pasture text-paper"
                : "border-line text-ink-soft hover:border-pasture"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {sorted.map((article) => (
          <Link
            key={article.id}
            href={`/conseils/${article.id}`}
            className="block border-b border-line pb-6 last:border-none"
          >
            <p className="text-xs uppercase tracking-wide text-ochre-dark">
              {article.theme}
            </p>
            <h2 className="mt-1 font-display text-xl font-medium text-ink">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
