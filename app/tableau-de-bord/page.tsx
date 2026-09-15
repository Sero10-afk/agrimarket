import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatFcfa } from "@/lib/commission";
import { StatusBadge } from "@/components/Badge";
import { deleteListingAction, toggleFeatureListingAction } from "@/app/actions/listings";
import { confirmReceiptAction } from "@/app/actions/transactions";
import { reviewKycAction } from "@/app/actions/admin";
import ReviewForm from "@/components/ReviewForm";

const kycLabels: Record<string, string> = {
  non_soumis: "Non soumis",
  en_attente: "En attente",
  valide: "Validé",
  refuse: "Refusé",
};

const transactionStatusLabels: Record<string, string> = {
  sequestre: "Paiement en séquestre",
  confirme: "Confirmée — payée à l'éleveur",
  litige: "En litige",
  rembourse: "Remboursée",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const db = readDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) redirect("/connexion");

  const categoryName = (id: string) =>
    db.categories.find((c) => c.id === id)?.name ?? "Autre";
  const userName = (id: string) =>
    db.users.find((u) => u.id === id)?.name ?? "Utilisateur";

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Bonjour, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Compte {user.role === "eleveur" ? "éleveur" : user.role === "acheteur" ? "acheteur" : "administrateur"} ·{" "}
        {user.location}
      </p>

      {user.role === "eleveur" && (
        <div className="mt-4 inline-flex items-center gap-2 border border-line px-3 py-1.5 text-sm">
          <span className="text-ink-soft">Statut KYC :</span>
          <span
            className={
              user.kycStatus === "valide"
                ? "font-medium text-pasture"
                : user.kycStatus === "refuse"
                ? "font-medium text-brick"
                : "font-medium text-ochre-dark"
            }
          >
            {kycLabels[user.kycStatus]}
          </span>
        </div>
      )}

      {/* ÉLEVEUR */}
      {user.role === "eleveur" && (
        <>
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">
                Mes annonces
              </h2>
              <Link
                href="/deposer-annonce"
                className="text-sm font-medium text-pasture hover:text-pasture-dark"
              >
                + Nouvelle annonce
              </Link>
            </div>
            <div className="mt-4">
              {db.listings.filter((l) => l.sellerId === user.id).length === 0 ? (
                <p className="border border-dashed border-line p-6 text-center text-sm text-ink-soft">
                  Tu n&apos;as pas encore publié d&apos;annonce.
                </p>
              ) : (
                db.listings
                  .filter((l) => l.sellerId === user.id)
                  .map((listing) => (
                    <div
                      key={listing.id}
                      className="ledger-row flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <Link
                          href={`/catalogue/${listing.id}`}
                          className="font-medium text-ink hover:text-pasture"
                        >
                          {listing.title}
                        </Link>
                        <p className="text-xs text-ink-soft">
                          {categoryName(listing.categoryId)} ·{" "}
                          {formatFcfa(listing.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={listing.status} />
                        {listing.status !== "vendu" && (
                          <form action={deleteListingAction.bind(null, listing.id)}>
                            <button
                              type="submit"
                              className="text-xs text-brick hover:underline"
                            >
                              Supprimer
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Mes ventes
            </h2>
            <div className="mt-4">
              {db.transactions.filter((t) => t.sellerId === user.id).length === 0 ? (
                <p className="border border-dashed border-line p-6 text-center text-sm text-ink-soft">
                  Aucune vente pour l&apos;instant.
                </p>
              ) : (
                db.transactions
                  .filter((t) => t.sellerId === user.id)
                  .map((transaction) => {
                    const listing = db.listings.find(
                      (l) => l.id === transaction.listingId
                    );
                    return (
                      <div key={transaction.id} className="ledger-row py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-ink">
                              {listing?.title ?? "Annonce supprimée"}
                            </p>
                            <p className="text-xs text-ink-soft">
                              Acheteur : {userName(transaction.buyerId)} · Net :{" "}
                              {formatFcfa(transaction.amount - transaction.commission)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-ochre-dark">
                            {transactionStatusLabels[transaction.status]}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>
        </>
      )}

      {/* ACHETEUR */}
      {user.role === "acheteur" && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">
            Mes achats
          </h2>
          <div className="mt-4">
            {db.transactions.filter((t) => t.buyerId === user.id).length === 0 ? (
              <p className="border border-dashed border-line p-6 text-center text-sm text-ink-soft">
                Tu n&apos;as pas encore d&apos;achat.{" "}
                <Link href="/catalogue" className="text-pasture hover:underline">
                  Parcourir le catalogue
                </Link>
              </p>
            ) : (
              db.transactions
                .filter((t) => t.buyerId === user.id)
                .map((transaction) => {
                  const listing = db.listings.find(
                    (l) => l.id === transaction.listingId
                  );
                  const alreadyReviewed = db.reviews.some(
                    (r) =>
                      r.transactionId === transaction.id &&
                      r.authorId === user.id
                  );
                  return (
                    <div key={transaction.id} className="ledger-row py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink">
                            {listing?.title ?? "Annonce supprimée"}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Vendeur : {userName(transaction.sellerId)} ·{" "}
                            {formatFcfa(transaction.amount)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-ochre-dark">
                            {transactionStatusLabels[transaction.status]}
                          </p>
                          {transaction.status === "sequestre" && (
                            <form
                              action={confirmReceiptAction.bind(
                                null,
                                transaction.id
                              )}
                              className="mt-2"
                            >
                              <button
                                type="submit"
                                className="rounded bg-pasture px-3 py-1.5 text-xs font-medium text-paper hover:bg-pasture-dark"
                              >
                                Confirmer la réception
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                      {transaction.status === "confirme" && !alreadyReviewed && (
                        <ReviewForm transactionId={transaction.id} />
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </section>
      )}

      {/* ADMIN */}
      {user.role === "admin" && (
        <>
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Vérifications KYC en attente
            </h2>
            <div className="mt-4">
              {db.users.filter((u) => u.kycStatus === "en_attente").length === 0 ? (
                <p className="border border-dashed border-line p-6 text-center text-sm text-ink-soft">
                  Aucune vérification en attente.
                </p>
              ) : (
                db.users
                  .filter((u) => u.kycStatus === "en_attente")
                  .map((candidate) => (
                    <div
                      key={candidate.id}
                      className="ledger-row flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium text-ink">{candidate.name}</p>
                        <p className="text-xs text-ink-soft">
                          {candidate.email} · {candidate.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <form
                          action={reviewKycAction.bind(null, candidate.id, "valide")}
                        >
                          <button
                            type="submit"
                            className="rounded bg-pasture px-3 py-1.5 text-xs font-medium text-paper hover:bg-pasture-dark"
                          >
                            Valider
                          </button>
                        </form>
                        <form
                          action={reviewKycAction.bind(null, candidate.id, "refuse")}
                        >
                          <button
                            type="submit"
                            className="rounded border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick hover:bg-brick/5"
                          >
                            Refuser
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Toutes les annonces
            </h2>
            <div className="mt-4">
              {db.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="ledger-row flex items-center justify-between py-3"
                >
                  <div>
                    <Link
                      href={`/catalogue/${listing.id}`}
                      className="font-medium text-ink hover:text-pasture"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-ink-soft">
                      {categoryName(listing.categoryId)} ·{" "}
                      {userName(listing.sellerId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={listing.status} />
                    <form
                      action={toggleFeatureListingAction.bind(null, listing.id)}
                    >
                      <button
                        type="submit"
                        className="text-xs text-ink-soft hover:text-ochre-dark"
                      >
                        {listing.featured ? "Retirer la mise en avant" : "Mettre en avant"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
