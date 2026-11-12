"use client";

import { useEffect } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Stitch } from "@/components/Marks";
import { OrderEditor } from "@/components/OrderEditor";
import { useOrder } from "@/components/OrderProvider";

export function OrderSlip() {
  const { open, setOpen, lines } = useOrder();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close order slip"
        className="absolute inset-0 bg-ink/40"
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="slip-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-cream shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-cream/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <BrandMark className="h-12 w-12 shrink-0" />
            <div>
              <h2 id="slip-title" className="font-display text-3xl leading-none text-ink">
                Order slip
              </h2>
              <Stitch className="mt-2 w-16 text-rope" />
              <p className="mt-1 text-sm text-bark">
                {lines.length === 0
                  ? "No scones yet"
                  : `${lines.length} flavor${lines.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-foam"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </button>
        </div>
        <div className="px-5 py-5">
          <OrderEditor />
        </div>
      </aside>
    </div>
  );
}
