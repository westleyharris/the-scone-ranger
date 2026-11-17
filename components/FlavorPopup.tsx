"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { quoteForFlavor } from "@/lib/content";
import { defaultRetailTier, MIN_SCONES, retailTiers } from "@/lib/order";
import type { FlavorPhoto } from "@/lib/photo-types";
import { Stitch, Wheat } from "@/components/Marks";
import { useOrder } from "@/components/OrderProvider";

function retailPrice(name: string) {
  const tier = defaultRetailTier(name);
  return retailTiers.find((item) => item.id === tier)?.price ?? retailTiers[0].price;
}

function retailLabel(name: string) {
  const tier = defaultRetailTier(name);
  return retailTiers.find((item) => item.id === tier)?.label ?? retailTiers[0].label;
}

function isSavory(name: string) {
  return /cheddar|bacon|chive|garlic/i.test(name) || (/cheese/i.test(name) && !/cream cheese/i.test(name));
}

function isSeasonal(name: string) {
  return /seasonal|egg nog|peppermint|pumpkin|gingerbread|hallowicious/i.test(name);
}

export function FlavorPopup({
  name,
  photo,
  onClose,
}: {
  name: string;
  photo?: FlavorPhoto;
  onClose: () => void;
}) {
  const { addFlavor, lines, setOpen } = useOrder();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const price = retailPrice(name);
  const label = retailLabel(name);
  const quote = quoteForFlavor(name);
  const savory = isSavory(name);
  const seasonal = isSeasonal(name);
  const onSlip = lines
    .filter((line) => line.name === name)
    .reduce((sum, line) => sum + line.scones, 0);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function addAndMaybeOpen() {
    addFlavor(name);
  }

  function addAndOpenSlip() {
    addFlavor(name);
    onClose();
    setOpen(true);
  }

  return createPortal(
    <div className="flavor-popup-root fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close flavor"
        className="flavor-popup-veil absolute inset-0 bg-ranger-deep/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flavor-popup-panel relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-cream shadow-[0_30px_80px_rgba(42,33,28,0.45)] sm:rounded-[1.75rem]"
      >
        <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-ink shadow-[0_0_0_1px_rgba(58,42,36,0.2)] backdrop-blur hover:bg-paper"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="flavor-popup-stage relative shrink-0 overflow-hidden px-5 pt-8 pb-1 sm:px-10 sm:pt-12 sm:pb-2">
          <div className="flavor-popup-halo" aria-hidden="true" />
          <div className="relative mx-auto aspect-square w-full max-w-[13.5rem] sm:max-w-[20rem]">
            {photo ? (
              photo.cutout ? (
                <>
                  <span className="flavor-plate-glow !bottom-[8%] !left-[12%] !right-[12%] !h-[22%]" aria-hidden="true" />
                  <Image
                    src={photo.src}
                    alt={`${name} scone`}
                    fill
                    sizes="(min-width: 640px) 320px, 70vw"
                    className="flavor-popup-scone object-contain object-center p-[4%] drop-shadow-[0_22px_18px_rgba(42,33,28,0.32)]"
                    priority
                  />
                </>
              ) : (
                <div className="flavor-medallion !inset-[6%]">
                  <Image
                    src={photo.src}
                    alt={`${name} scones`}
                    fill
                    sizes="(min-width: 640px) 320px, 70vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center" aria-hidden="true">
                <Wheat className="h-20 w-20 text-ranger/20" />
              </div>
            )}
          </div>
        </div>

        <div className="ticket relative overflow-y-auto border-t border-line bg-paper px-6 pt-6 pb-7 pl-9 sm:px-9 sm:pt-7 sm:pb-8 sm:pl-11">
          <div className="flex flex-wrap items-center gap-2">
            {seasonal ? <Tag>Seasonal</Tag> : null}
            {savory ? <Tag>Savory</Tag> : null}
            {label !== "Standard" ? <Tag>{label}</Tag> : null}
          </div>

          <h2 id={titleId} className="mt-3 font-display text-[2rem] leading-[1.05] text-ink sm:text-[2.35rem]">
            {name}
          </h2>
          <Stitch className="mt-4 w-20 text-rope" />
          <p className="mt-4 text-[0.72rem] font-semibold tracking-[0.22em] text-bark uppercase">
            ${price} / dozen
          </p>
          <p className="mt-2 text-sm leading-6 text-bark">
            {MIN_SCONES} scone minimum per flavor
          </p>

          {quote ? (
            <blockquote className="mt-5 border-l-2 border-ranger/30 pl-4 font-display text-[1.05rem] leading-7 text-ink italic sm:text-[1.1rem]">
              {quote}
            </blockquote>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-solid flex-1" onClick={addAndMaybeOpen}>
              {onSlip ? `Add 6 more · ${onSlip} on slip` : `Add ${MIN_SCONES} to slip`}
            </button>
            <button type="button" className="btn btn-line flex-1" onClick={addAndOpenSlip}>
              {onSlip ? "View slip" : "Add & view slip"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-foam px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-ranger uppercase">
      {children}
    </span>
  );
}
