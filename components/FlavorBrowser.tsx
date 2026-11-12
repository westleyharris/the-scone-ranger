"use client";

import { useMemo, useState } from "react";
import { flavorNames, flavorSlug } from "@/lib/content";
import { useOrder } from "@/components/OrderProvider";
import { Photo } from "@/components/Photo";

export function AddButton({ name }: { name: string }) {
  const { addFlavor } = useOrder();
  return (
    <button
      type="button"
      onClick={() => addFlavor(name)}
      className="btn btn-solid btn-sm"
    >
      Add to slip
    </button>
  );
}

export function FlavorBrowser({ photos }: { photos: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"listed" | "az">("listed");
  const photographed = useMemo(() => new Set(photos), [photos]);

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
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((name) => (
            <li key={name} className="flex flex-col overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
              {photographed.has(flavorSlug(name)) ? (
                <div className="aspect-square bg-foam">
                  <Photo file={`flavors/${flavorSlug(name)}.jpg`} label={name} showLabel={false} />
                </div>
              ) : (
                <div className="flex h-24 items-end bg-foam px-5 pb-4" aria-hidden="true">
                  <span className="font-display text-4xl leading-none text-ranger/25">{name.charAt(0)}</span>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-5">
                <h2 className="font-display text-[1.65rem] leading-none text-ink">{name}</h2>
                <div className="mt-auto">
                  <AddButton name={name} />
                </div>
              </div>
            </li>
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
