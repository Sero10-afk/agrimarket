import { notFound } from "next/navigation";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { computeCommission, formatFcfa } from "@/lib/commission";
import { HealthBadge, StatusBadge } from "@/components/Badge";
import PurchaseForm from "@/components/PurchaseForm";

const badgeLabels: Record<string, string> = {
  eleveur_verifie: "Éleveur vérifié",
  vaccination_a_jour: "Vaccination à jour",
  equipe: "Équipe AgriMarket",
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = readDb();
  const listing = db.listings.find((l) => l.id === id);
  if (!listing) notFound();

  const category = db.categories.find((c) => c.id === listing.categoryId);
  const seller = db.users.find((u) => u.id === listing.sellerId);
  const session = await getSession();

  const sellerReviews = db.reviews.filter((r) => r.targetId === seller?.id);
  const avgRating =
    sellerReviews.length > 0
      ? (
          sellerReviews.reduce((sum, r) => sum + r.rating, 0) /
          sellerReviews.length
        ).toFixed(1)
      : null;

  const commission = category
    ? computeCommission(listing.price, category)
    : null;

  let disabledReason: string | undefined;
  if (!session) {
    disabledReason = "Connecte-toi avec un compte acheteur pour acheter.";
  } else if (session.role !== "acheteur") {
    disabledReason = "Seul un compte acheteur peut effectuer un achat.";
  } else if (listing.status !== "disponible") {
    disabledReason = "Cette annonce n'est plus disponible à l'achat.";
  } else if (listing.sellerId === session.userId) {
    disabledReason = "Tu ne peux pas acheter ta propre annonce.";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/catalogue"
        className="text-sm text-ink-soft hover:text-pasture"
      >
        ← Retour au catalogue
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <div className="flex h-64 items-center justify-center border border-line bg-bone/60 text-sm text-ink-soft">
            Photo non disponible — démonstration
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <HealthBadge status={listing.healthStatus} />
            <StatusBadge status={listing.status} />
            <span className="text-xs uppercase tracking-wide text-ink-soft/70">
              {category?.name ?? "Autre"}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
            {listing.title}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {listing.breed} · {listing.age} · {listing.location}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft">
            {listing.description}
          </p>

          {seller && (
            <div className="mt-10 border border-line p-5">
              <p className="text-xs uppercase tracking-wide text-ink-soft/70">
                Éleveur
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-medium text-ink">
                    {seller.name}
                  </p>
                  <p className="text-sm text-ink-soft">{seller.location}</p>
                </div>
                {avgRating && (
                  <p className="font-display text-lg font-semibold text-ochre-dark">
                    {avgRating} / 5
                  </p>
                )}
              </div>
              {seller.badges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {seller.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-pasture/30 bg-pasture/10 px-2.5 py-0.5 text-xs font-medium text-pasture-dark"
                    >
                      {badgeLabels[b] ?? b}
                    </span>
                  ))}
                </div>
              )}
              {sellerReviews.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {sellerReviews.slice(0, 3).map((review) => (
                    <li key={review.id} className="ledger-row pb-3 text-sm">
                      <p className="text-ochre-dark">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                      {review.comment && (
                        <p className="mt-1 text-ink-soft">{review.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit border border-line p-5">
          <p className="text-xs uppercase tracking-wide text-ink-soft/70">
            Achat sécurisé
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-pasture">
            {formatFcfa(listing.price)}
          </p>

          {commission && (
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Prix annoncé</dt>
                <dd>{formatFcfa(listing.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  Commission AgriMarket ({(commission.rate * 100).toFixed(1)}%)
                </dt>
                <dd>{formatFcfa(commission.amount)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-medium text-ink">
                <dt>Reversé à l&apos;éleveur</dt>
                <dd>{formatFcfa(commission.net)}</dd>
              </div>
            </dl>
          )}

          <p className="mt-4 text-xs text-ink-soft">
            Ton paiement est conservé en séquestre jusqu&apos;à ce que tu
            confirmes la bonne réception de l&apos;animal. L&apos;éleveur
            n&apos;est payé qu&apos;à ce moment-là.
          </p>

          <div className="mt-5">
            <PurchaseForm
              listingId={listing.id}
              disabled={!!disabledReason}
              disabledReason={disabledReason}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
