import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-pasture">
          AgriMarket
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
          <Link href="/catalogue" className="hover:text-pasture">
            Catalogue
          </Link>
          <Link href="/conseils" className="hover:text-pasture">
            Conseils
          </Link>
          {session?.role === "eleveur" && (
            <Link href="/deposer-annonce" className="hover:text-pasture">
              Déposer une annonce
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/tableau-de-bord"
                className="text-sm font-medium text-ink-soft hover:text-pasture"
              >
                {session.name.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-pasture hover:text-pasture"
                >
                  Se déconnecter
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-sm font-medium text-ink-soft hover:text-pasture"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded bg-pasture px-3 py-1.5 text-sm font-medium text-paper hover:bg-pasture-dark"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
