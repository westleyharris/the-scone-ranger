"use client";

import { useState } from "react";

/**
 * Shows public/images/{file} when that picture exists.
 * Flavor photos: public/images/flavors/{slug}.jpg (png, jpeg, and webp also work).
 */
const extraExtensions = ["png", "jpeg", "webp", "jpg"];

const tones = [
  "from-[#F8EADF] to-[#E7CDB6]",
  "from-[#F6E4DC] to-[#E4C4BC]",
  "from-[#F3E6D4] to-[#DCCFB6]",
  "from-[#F7EBDD] to-[#E5D0C0]",
];

function tone(file: string) {
  const n = [...file].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tones[n % tones.length];
}

function sourcesFor(file: string) {
  const match = file.match(/^(.*)\.(jpg|jpeg|png|webp)$/i);
  const base = match ? match[1] : file;
  const first = (match?.[2] ?? "jpg").toLowerCase();
  const extensions = [first, ...extraExtensions.filter((ext) => ext !== first)];
  return extensions.map((ext) => `/images/${base}.${ext}`);
}

export function Photo({
  file,
  label,
  frame = "plain",
  fit = "contain",
  showLabel = true,
  className = "",
}: {
  file: string;
  label: string;
  frame?: "plain" | "blob" | "poster" | "square";
  fit?: "contain" | "cover";
  showLabel?: boolean;
  className?: string;
}) {
  const sources = sourcesFor(file);
  const [index, setIndex] = useState(0);
  const shape =
    frame === "blob"
      ? "rounded-[1.75rem] sm:rounded-[2.25rem]"
      : frame === "poster"
        ? "rounded-sm border-[10px] border-[#E7D3B4] shadow-[0_22px_50px_rgba(42,33,28,0.18)]"
        : frame === "square"
          ? "aspect-square rounded-[1.5rem] sm:rounded-[1.75rem]"
          : "rounded-[1.6rem]";
  const box =
    frame === "blob"
      ? "aspect-[3/2] w-full"
      : frame === "square"
        ? "aspect-square w-full"
        : "h-full w-full";
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  if (index < sources.length) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sources[index]}
        alt={label}
        className={`${box} bg-foam ${fitClass} ${shape} ${className}`}
        onError={() => setIndex((current) => current + 1)}
      />
    );
  }

  const initial = label.trim().charAt(0).toUpperCase();

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${tone(file)} ${shape} ${className}`}
    >
      <span aria-hidden="true" className="font-display text-5xl text-ranger/20">
        {initial}
      </span>
      {showLabel ? (
        <p className="mt-3 max-w-[16rem] px-6 text-center font-display text-lg leading-snug text-ink">
          {label}
        </p>
      ) : null}
    </div>
  );
}
