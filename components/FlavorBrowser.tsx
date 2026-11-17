"use client";

import { useMemo, useState } from "react";
import { flavorNames } from "@/lib/content";
import { FlavorCard } from "@/components/FlavorCard";
import { flavorPhotoFor, type FlavorPhotos } from "@/lib/photo-types";

export function FlavorBrowser({ photos }: { photos: FlavorPhotos }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"listed" | "az">("listed");

  const flavors = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = flavorNames.filter((name) => name.toLowerCase().includes(q));
    if (sort === "az") {
      return [...filtered].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    }
    return filtered;
  }, [query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1 text-sm font-semibold text-ink">
          <span className="sr-only">Search flavors</span>
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flavors"
            className="w-full rounded-full border border-line bg-paper py-3 pr-5 pl-11 text-base font-normal text-ink placeholder:text-bark/70"
          />
        </label>
        <div className="grid grid-cols-2 rounded-full bg-foam p-1 sm:flex">
          {(
            [
              ["listed", "As listed"],
              ["az", "A–Z"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                sort === value ? "bg-ink text-paper" : "text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {flavors.length === 0 ? (
        <p className="mt-10 text-bark">No flavors match.</p>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
          {flavors.map((name) => (
            <FlavorCard key={name} name={name} photo={flavorPhotoFor(photos, name)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-bark"
    >
      <circle cx="8.5" cy="8.5" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 12.5 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
