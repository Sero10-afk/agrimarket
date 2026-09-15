import type { Category } from "./types";

/**
 * Calcule la commission AgriMarket pour une vente donnée, à partir des
 * paliers dégressifs définis sur la catégorie de l'annonce.
 *
 * Les paliers sont ordonnés du plus bas au plus haut plafond ; le premier
 * palier dont le prix est inférieur ou égal au plafond (maxPrice) s'applique.
 * Un plafond `null` signifie "sans limite" et doit être le dernier palier.
 */
export function computeCommission(
  price: number,
  category: Category
): { rate: number; amount: number; net: number } {
  const tier =
    category.commissionTiers.find(
      (t) => t.maxPrice === null || price <= t.maxPrice
    ) ?? category.commissionTiers[category.commissionTiers.length - 1];

  const rate = tier.rate;
  const amount = Math.round(price * rate);
  const net = price - amount;

  return { rate, amount, net };
}

export function formatFcfa(value: number): string {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}
