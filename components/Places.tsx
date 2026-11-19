"use client";

import { useMemo, useSyncExternalStore } from "react";
import { mapsUrl, type Market } from "@/lib/content";
import { isMarketToday, parseSpokaneStamp, spokaneStamp, type SpokaneNow } from "@/lib/market-schedule";

export function Directions({ address, tone = "dark" }: { address: string; tone?: "dark" | "light" }) {
  return (
    <a
      href={mapsUrl(address)}
      target="_blank"
      rel="noreferrer"
      className={`text-sm font-semibold underline underline-offset-4 ${
        tone === "light"
          ? "text-paper decoration-rope/50 hover:decoration-rope"
          : "text-ranger decoration-ranger/30 hover:decoration-ranger"
      }`}
    >
      Directions
    </a>
  );
}

/** Re-reads the clock every minute, so a page left open rolls on to the next market. */
function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/**
 * Spokane's date and hour, or null on the server. The page is prerendered,
 * so anything that depends on the day is worked out in the browser.
 */
export function useSpokaneNow(): SpokaneNow | null {
  const stamp = useSyncExternalStore(subscribeToClock, () => spokaneStamp(), () => "");
  return useMemo(() => (stamp ? parseSpokaneStamp(stamp) : null), [stamp]);
}

export function TodayMark({ market }: { market: Market }) {
  const now = useSpokaneNow();
  if (!now || !isMarketToday(market, now)) return null;

  return (
    <span className="rounded-full bg-ranger px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper">
      Today
    </span>
  );
}
