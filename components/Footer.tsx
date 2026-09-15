export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-base text-pasture">AgriMarket</p>
          <p>Le marché du bétail, en confiance — Parakou, Bénin</p>
        </div>
        <p className="mt-4 text-xs text-ink-soft/70">
          Projet de démonstration. Les transactions et paiements affichés sont
          simulés à des fins pédagogiques.
        </p>
      </div>
    </footer>
  );
}
