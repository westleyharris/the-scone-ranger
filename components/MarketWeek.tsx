"use client";

import {
  inSeason,
  marketHours,
  marketSeason,
  marketWeekdays,
  marketsOn,
  weekdayNames,
  weekdayShort,
} from "@/lib/market-schedule";
import { Directions, useSpokaneNow } from "@/components/Places";

/** Sun–Sat at a glance: market days stand out and jump to their card; today is filled in. */
export function MarketStrip() {
  const now = useSpokaneNow();

  return (
    <ol className="week-strip" aria-label="Market days">
      {weekdayShort.map((short, weekday) => {
        const count = marketsOn(weekday).length;
        const today = now?.weekday === weekday;
        const label = `${weekdayNames[weekday]}: ${
          count === 0 ? "no market" : `${count} ${count === 1 ? "market" : "markets"}`
        }${today ? " (today)" : ""}`;
        const stamp = (
          <span className="week-stamp" data-market={count > 0 || undefined} data-today={today || undefined}>
            {short}
          </span>
        );

        return (
          <li key={short}>
            {count > 0 ? (
              <a href={`#market-${weekday}`} aria-label={label} className="week-stamp-link">
                {stamp}
              </a>
            ) : (
              <>
                <span aria-hidden="true">{stamp}</span>
                <span className="sr-only">{label}</span>
              </>
            )}
            {today ? (
              <span className="week-today" aria-hidden="true">
                Today
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/** One card per market day, each market with its hours, season and directions. */
export function MarketDays() {
  const now = useSpokaneNow();

  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      {marketWeekdays.map((weekday) => {
        const dayMarkets = marketsOn(weekday);
        const running =
          now !== null && now.weekday === weekday && dayMarkets.some((market) => inSeason(market, now.month));

        return (
          <section
            key={weekday}
            id={`market-${weekday}`}
            className="market-day"
            data-today={running || undefined}
            aria-labelledby={`market-${weekday}-title`}
          >
            <header className="market-day-head">
              <h3 id={`market-${weekday}-title`} className="font-display text-[1.6rem] leading-none text-ink">
                {weekdayNames[weekday]}
              </h3>
              {running ? (
                <span className="market-day-today">Today</span>
              ) : (
                <span className="market-day-count">
                  {dayMarkets.length} {dayMarkets.length === 1 ? "market" : "markets"}
                </span>
              )}
            </header>
            <ul>
              {dayMarkets.map((market) => (
                <li key={market.name} className="market-day-item">
                  <h4 className="font-display text-xl leading-tight text-ink">{market.name}</h4>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-sm">
                    <span className="font-semibold text-ranger">{marketHours(market)}</span>
                    <span className="market-season">{marketSeason(market)}</span>
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-bark">{market.address}</p>
                  <div className="mt-2">
                    <Directions address={market.address} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
