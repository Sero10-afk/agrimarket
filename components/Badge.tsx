import type { HealthStatus, ListingStatus } from "@/lib/types";

const healthLabels: Record<HealthStatus, string> = {
  sain: "Sain",
  vaccine: "Vacciné",
  en_observation: "En observation",
};

const healthStyles: Record<HealthStatus, string> = {
  sain: "bg-pasture/10 text-pasture-dark border-pasture/30",
  vaccine: "bg-ochre/10 text-ochre-dark border-ochre/30",
  en_observation: "bg-brick/10 text-brick border-brick/30",
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${healthStyles[status]}`}
    >
      {healthLabels[status]}
    </span>
  );
}

const statusLabels: Record<ListingStatus, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
};

const statusStyles: Record<ListingStatus, string> = {
  disponible: "bg-pasture text-paper",
  reserve: "bg-ochre text-paper",
  vendu: "bg-ink-soft text-paper",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
