import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatFcfa } from "@/lib/commission";
import { HealthBadge, StatusBadge } from "./Badge";

export default function ListingCard({
  listing,
  categoryName,
}: {
  listing: Listing;
  categoryName: string;
}) {
  return (
    <Link
      href={`/catalogue/${listing.id}`}
      className="ledger-row group block px-1 py-4 first:pt-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft/70">
            {categoryName} · {listing.location}
          </p>
          <h3 className="mt-1 font-display text-lg font-medium text-ink group-hover:text-pasture">
            {listing.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <HealthBadge status={listing.healthStatus} />
            <StatusBadge status={listing.status} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-lg font-semibold text-pasture">
            {formatFcfa(listing.price)}
          </p>
          <p className="mt-1 text-xs text-ink-soft">{listing.age}</p>
        </div>
      </div>
    </Link>
  );
}
