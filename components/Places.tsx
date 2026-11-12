"use client";

import { useSyncExternalStore } from "react";
import { mapsUrl, type Market } from "@/lib/content";

export function Directions({ address }: { address: string }) {
  return (
    <a
      href={mapsUrl(address)}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold text-ranger underline decoration-ranger/30 underline-offset-4 hover:decoration-ranger"
    >
      Directions
    </a>
  );
}

function subscribe() {
  return () => {};
}

function todayStamp() {
  const now = new Date();
  return `${now.getMonth() + 1}-${now.getDay()}`;
}

export function TodayMark({ market }: { market: Market }) {
  const stamp = useSyncExternalStore(subscribe, todayStamp, () => "");
  if (!stamp) return null;
  const [month, day] = stamp.split("-").map(Number);
  const today = month >= market.season[0] && month <= market.season[1] && market.days.includes(day);
  if (!today) return null;

  return (
    <span className="rounded-full bg-ranger px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper">
      Today
    </span>
  );
}
