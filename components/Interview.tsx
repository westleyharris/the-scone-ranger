"use client";

import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { interviewEmbed, kxlyCaption } from "@/lib/content";

export function Interview() {
  const [playing, setPlaying] = useState(false);

  return (
    <figure id="interview" className="scroll-mt-32 lg:sticky lg:top-32">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink shadow-[0_22px_50px_rgba(42,33,28,0.18)]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${interviewEmbed}?autoplay=1&rel=0`}
            title={kxlyCaption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex h-full w-full cursor-pointer flex-col text-left"
            aria-label="Play interview"
          >
            <img
              src="/images/interview-still.jpg"
              alt=""
              className="poster-still absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,28,24,0.05),rgba(42,28,24,0.38)_72%),linear-gradient(to_top,rgba(26,18,16,0.55),transparent_42%)]" />

            <span className="relative flex flex-1 items-center justify-center">
              <span className="relative grid h-[5.5rem] w-[5.5rem] place-items-center">
                <svg viewBox="0 0 100 100" className="stitch-spin absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#e8c48a"
                    strokeWidth="1.7"
                    strokeDasharray="1.4 6.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-cream text-ranger shadow-[0_14px_32px_rgba(26,18,16,0.4)] transition duration-300 group-hover:scale-105 group-hover:bg-rope">
                  <PlayMark />
                </span>
              </span>
            </span>

            <span className="relative">
              <span className="block h-[3px] bg-rope" />
              <span className="mt-1 block h-[3px] bg-rope/65" />
              <span className="flex items-center gap-3 bg-ink/88 px-4 py-3 backdrop-blur-sm">
                <BrandMark className="h-12 w-12 shrink-0 ring-2 ring-cream/90" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-[0.2em] text-rope uppercase">
                    KXLY · 2012
                  </span>
                  <span className="mt-1 block truncate font-display text-lg leading-none text-paper sm:text-xl">
                    The Singing Scone Ranger
                  </span>
                </span>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 text-sm leading-6 text-bark">{kxlyCaption}</figcaption>
    </figure>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden="true">
      <path d="M8 5.2v13.6L19.2 12 8 5.2Z" fill="currentColor" />
    </svg>
  );
}
