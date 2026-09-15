import Link from "next/link";
import { readDb } from "@/lib/db";
import ListingCard from "@/components/ListingCard";

export default function HomePage() {
  const db = readDb();

  const availableListings = db.listings.filter((l) => l.status === "disponible");
  const latestListings = [...availableListings]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  const verifiedSellers = db.users.filter(
    (u) => u.role === "eleveur" && u.kycStatus === "valide"
  ).length;
  const totalListings = db.listings.length;
  const soldListings = db.listings.filter((l) => l.status === "vendu").length;

  const categoryName = (id: string) =>
    db.categories.find((c) => c.id === id)?.name ?? "Autre";

  const latestArticles = [...db.articles]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-5 md:py-24">
          <div className="md:col-span-3">
            <h1 className="max-w-lg font-display text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
              Le marché du bétail, tenu comme un vrai registre.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-soft">
              AgriMarket connecte éleveurs et acheteurs autour d&apos;annonces
              vérifiées, d&apos;un paiement protégé en séquestre et de conseils
              vétérinaires pour limiter les mauvaises surprises.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogue"
                className="rounded bg-pasture px-5 py-2.5 text-sm font-medium text-paper hover:bg-pasture-dark"
              >
                Parcourir le catalogue
              </Link>
              <Link
                href="/inscription"
                className="rounded border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-pasture hover:text-pasture"
              >
                Déposer une annonce
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-line bg-bone/60 p-6">
              <p className="text-xs uppercase tracking-wide text-ink-soft/70">
                Le carnet du marché
              </p>
              <dl className="mt-4 space-y-3">
                <div className="ledger-row flex items-baseline justify-between pb-3">
                  <dt className="text-sm text-ink-soft">Éleveurs vérifiés</dt>
                  <dd className="font-display text-2xl font-semibold text-pasture">
                    {verifiedSellers}
                  </dd>
                </div>
                <div className="ledger-row flex items-baseline justify-between py-3">
                  <dt className="text-sm text-ink-soft">Annonces publiées</dt>
                  <dd className="font-display text-2xl font-semibold text-pasture">
                    {totalListings}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between pt-3">
                  <dt className="text-sm text-ink-soft">Ventes finalisées</dt>
                  <dd className="font-display text-2xl font-semibold text-pasture">
                    {soldListings}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Catégories
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {db.categories.map((category) => {
            const count = db.listings.filter(
              (l) => l.categoryId === category.id && l.status === "disponible"
            ).length;
            return (
              <Link
                key={category.id}
                href={`/catalogue?categorie=${category.slug}`}
                className="border border-line p-4 hover:border-pasture"
              >
                <p className="font-display text-lg font-medium text-ink">
                  {category.name}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {count} annonce{count > 1 ? "s" : ""} disponible
                  {count > 1 ? "s" : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dernières annonces */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Dernières annonces
            </h2>
            <Link
              href="/catalogue"
              className="text-sm font-medium text-pasture hover:text-pasture-dark"
            >
              Voir tout le catalogue
            </Link>
          </div>
          <div className="mt-6">
            {latestListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                categoryName={categoryName(listing.categoryId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Conseils d&apos;élevage
          </h2>
          <Link
            href="/conseils"
            className="text-sm font-medium text-pasture hover:text-pasture-dark"
          >
            Tous les conseils
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              href={`/conseils/${article.id}`}
              className="border border-line p-5 hover:border-pasture"
            >
              <p className="text-xs uppercase tracking-wide text-ochre-dark">
                {article.theme}
              </p>
              <h3 className="mt-2 font-display text-lg font-medium text-ink">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="border-t border-line bg-pasture">
        <div className="mx-auto max-w-6xl px-6 py-14 text-paper">
          <h2 className="font-display text-2xl font-semibold">
            Ce qu&apos;en disent les éleveurs
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <blockquote className="border-l-2 border-ochre pl-4">
              <p className="text-paper/90">
                Le paiement en séquestre m&apos;a rassuré : l&apos;acheteur ne
                pouvait plus se rétracter après avoir vu l&apos;animal, mais
                moi je n&apos;étais payé qu&apos;à la confirmation.
              </p>
              <cite className="mt-3 block text-sm text-paper/70 not-italic">
                Idrissou B., éleveur à Parakou
              </cite>
            </blockquote>
            <blockquote className="border-l-2 border-ochre pl-4">
              <p className="text-paper/90">
                Voir le badge éleveur vérifié avant d&apos;acheter m&apos;a
                évité un déplacement inutile jusqu&apos;à Nikki.
              </p>
              <cite className="mt-3 block text-sm text-paper/70 not-italic">
                Fabrice K., acheteur à Cotonou
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Prêt à vendre ou à acheter en confiance ?
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/inscription"
            className="rounded bg-pasture px-5 py-2.5 text-sm font-medium text-paper hover:bg-pasture-dark"
          >
            Créer un compte gratuitement
          </Link>
          <Link
            href="/catalogue"
            className="rounded border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-pasture hover:text-pasture"
          >
            Parcourir le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
