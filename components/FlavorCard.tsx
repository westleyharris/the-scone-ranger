"use client";

import Image from "next/image";
import { useState } from "react";
import { defaultRetailTier, retailTiers } from "@/lib/order";
import type { FlavorPhoto } from "@/lib/photo-types";
import { FlavorPopup } from "@/components/FlavorPopup";
import { Mask } from "@/components/Marks";
import { useOrder } from "@/components/OrderProvider";

function retailPrice(name: string) {
  const tier = defaultRetailTier(name);
  return retailTiers.find((item) => item.id === tier)?.price ?? retailTiers[0].price;
}

function isSavory(name: string) {
  return /cheddar|bacon|chive|garlic/i.test(name) || (/cheese/i.test(name) && !/cream cheese/i.test(name));
}

function isSeasonal(name: string) {
  return /seasonal|egg nog|peppermint|pumpkin|gingerbread|hallowicious/i.test(name);
}

export function FlavorCard({
  name,
  photo,
  surface = "cream",
  sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw",
  headingLevel = "h2",
  featured = false,
}: {
  name: string;
  photo?: FlavorPhoto;
  /** Colour of the section behind the card; used to cut the seal button out of the tile. */
  surface?: "cream" | "paper";
  sizes?: string;
  headingLevel?: "h2" | "h3";
  /** Larger display treatment for the home menu row. */
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Heading = headingLevel;
  const price = retailPrice(name);
  const savory = isSavory(name);
  const seasonal = isSeasonal(name);
  const meta = [
    `$${price} / dozen`,
    savory ? "Savory" : null,
    seasonal ? "Seasonal" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      className={`group flex flex-col items-center text-center ${
        surface === "paper" ? "[--surface:var(--paper)]" : "[--surface:var(--cream)]"
      }`}
    >
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`flavor-tile relative w-full cursor-pointer overflow-hidden text-left transition-[transform,filter] ${
            featured ? "aspect-[5/6]" : "aspect-square"
          }`}
        >
          <span className="sr-only">Open {name} details</span>
          {photo ? (
            photo.cutout ? (
              <>
                <span className="flavor-plate-glow" aria-hidden="true" />
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes={sizes}
                  className={`flavor-cutout object-contain object-center ${
                    featured ? "p-[1%] pt-[2%] pb-[8%]" : "p-[1%] pt-[2%] pb-[8%]"
                  }`}
                />
              </>
            ) : (
              <div className="flavor-medallion">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes={sizes}
                  className="flavor-photo object-cover object-center"
                />
              </div>
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
              <Mask className={featured ? "h-14 w-14 text-ranger/18" : "h-12 w-12 text-ranger/20"} />
            </div>
          )}
        </button>
        <AddSeal name={name} />
      </div>

      <div className="mt-9 w-full px-1 text-center">
        <Heading
          className={`font-display leading-[1.1] text-ink ${
            featured
              ? "text-[1.45rem] sm:text-[1.7rem] lg:text-[1.85rem]"
              : "text-[1.25rem] sm:text-[1.45rem]"
          }`}
        >
          <button type="button" onClick={() => setOpen(true)} className="cursor-pointer">
            {name}
          </button>
        </Heading>
        <p
          className={`mt-2.5 font-semibold tracking-[0.18em] text-bark uppercase ${
            featured ? "text-[0.7rem] sm:text-[0.74rem]" : "text-[0.65rem] sm:text-[0.7rem]"
          }`}
        >
          <button type="button" onClick={() => setOpen(true)} className="cursor-pointer tracking-[0.18em]">
            {meta}
          </button>
        </p>
      </div>

      {open ? <FlavorPopup name={name} photo={photo} onClose={() => setOpen(false)} /> : null}
    </li>
  );
}

function AddSeal({ name }: { name: string }) {
  const { addFlavor, lines } = useOrder();
  const onSlip = lines
    .filter((line) => line.name === name)
    .reduce((sum, line) => sum + line.scones, 0);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        addFlavor(name);
      }}
      aria-label={onSlip ? `Add 6 more ${name} to slip (${onSlip} on slip)` : `Add ${name} to slip`}
      title="Add to slip"
      data-on-slip={onSlip > 0 || undefined}
      className="add-seal absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center justify-center"
    >
      {onSlip ? (
        <span className="font-display text-[0.95rem] leading-none font-semibold">{onSlip}</span>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
          <path
            d="M8 2.5v11M2.5 8h11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
