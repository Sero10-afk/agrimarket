import Link from "next/link";
import { readDb } from "@/lib/db";
import ListingCard from "@/components/ListingCard";
import type { HealthStatus } from "@/lib/types";

interface SearchParams {
  categorie?: string;
  prixMax?: string;
  localisation?: string;
  statutSanitaire?: string;
  tri?: string;
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const db = readDb();

  const categoryName = (id: string) =>
    db.categories.find((c) => c.id === id)?.name ?? "Autre";

  let listings = db.listings.filter((l) => l.status !== "vendu");

  if (params.categorie) {
    const category = db.categories.find((c) => c.slug === params.categorie);
    if (category) {
      listings = listings.filter((l) => l.categoryId === category.id);
    }
  }

  if (params.prixMax) {
    const max = Number(params.prixMax);
    if (!Number.isNaN(max)) {
      listings = listings.filter((l) => l.price <= max);
    }
  }

  if (params.localisation) {
    const loc = params.localisation.toLowerCase();
    listings = listings.filter((l) => l.location.toLowerCase().includes(loc));
  }

  if (params.statutSanitaire) {
    listings = listings.filter(
      (l) => l.healthStatus === (params.statutSanitaire as HealthStatus)
    );
  }

  if (params.tri === "prix_asc") {
    listings = [...listings].sort((a, b) => a.price - b.price);
  } else if (params.tri === "prix_desc") {
    listings = [...listings].sort((a, b) => b.price - a.price);
  } else {
    listings = [...listings].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }

  const locations = Array.from(new Set(db.listings.map((l) => l.location)));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Catalogue
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {listings.length} annonce{listings.length > 1 ? "s" : ""} correspond
        {listings.length > 1 ? "ent" : ""} à ta recherche.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <form className="space-y-6 border border-line p-5 md:sticky md:top-6 md:self-start">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Catégorie
            </label>
            <select
              name="categorie"
              defaultValue={params.categorie ?? ""}
              className="mt-2 w-full border border-line bg-paper px-2 py-1.5 text-sm"
            >
              <option value="">Toutes</option>
              {db.categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Prix maximum (FCFA)
            </label>
            <input
              type="number"
              name="prixMax"
              defaultValue={params.prixMax ?? ""}
              placeholder="ex. 200000"
              className="mt-2 w-full border border-line bg-paper px-2 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Localisation
            </label>
            <select
              name="localisation"
              defaultValue={params.localisation ?? ""}
              className="mt-2 w-full border border-line bg-paper px-2 py-1.5 text-sm"
            >
              <option value="">Toutes</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Statut sanitaire
            </label>
            <select
              name="statutSanitaire"
              defaultValue={params.statutSanitaire ?? ""}
              className="mt-2 w-full border border-line bg-paper px-2 py-1.5 text-sm"
            >
              <option value="">Tous</option>
              <option value="sain">Sain</option>
              <option value="vaccine">Vacciné</option>
              <option value="en_observation">En observation</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Trier par
            </label>
            <select
              name="tri"
              defaultValue={params.tri ?? "recent"}
              className="mt-2 w-full border border-line bg-paper px-2 py-1.5 text-sm"
            >
              <option value="recent">Plus récent</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-pasture px-3 py-2 text-sm font-medium text-paper hover:bg-pasture-dark"
          >
            Filtrer
          </button>
          <Link
            href="/catalogue"
            className="block text-center text-xs text-ink-soft hover:text-pasture"
          >
            Réinitialiser
          </Link>
        </form>

        <div>
          {listings.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-sm text-ink-soft">
              Aucune annonce ne correspond à ces critères. Essaie d&apos;élargir
              ta recherche.
            </p>
          ) : (
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                categoryName={categoryName(listing.categoryId)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
