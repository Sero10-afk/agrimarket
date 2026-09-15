import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (session.role !== "eleveur") redirect("/tableau-de-bord");

  const db = readDb();

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Déposer une annonce
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        La commission AgriMarket est calculée automatiquement selon la
        catégorie et le prix — tu verras le montant net avant publication sur
        la fiche de l&apos;annonce.
      </p>
      <div className="mt-8">
        <ListingForm categories={db.categories} />
      </div>
    </div>
  );
}
