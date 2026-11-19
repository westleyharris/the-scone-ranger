"use client";

import { Fragment } from "react";
import { site, stockists } from "@/lib/content";
import { marketHours, monthName, nextMarketDay, seasonSpan, weekdayNames } from "@/lib/market-schedule";
import { useOrder } from "@/components/OrderProvider";
import { Directions, useSpokaneNow } from "@/components/Places";

const yearRound = stockists.flatMap((group) => group.places.map((place) => place.name));

/**
 * Answers the page's own question, "what's going on right now?": the market
 * running today or next, or, out of season, where to find scones instead.
 * Before the browser takes over it shows only what is true every day.
 */
export function RightNow() {
  const now = useSpokaneNow();
  const { setOpen } = useOrder();
  const next = now ? nextMarketDay(now) : null;

  let title = "Where to find Scone Ranger scones";
  let lead = "You’ll find our scones year-round at";
  if (now && next) {
    lead = "Year-round, you’ll also find our scones at";
    if (next.offset === 0) title = "Find us at the market today.";
    else if (next.offset === 1) title = "Find us at the market tomorrow.";
    else title = `Next market: ${weekdayNames[next.weekday]}.`;
  } else if (now && now.month < seasonSpan.start) {
    title = `Farmers’ markets start back up in ${monthName(seasonSpan.start)}.`;
  } else if (now) {
    title = "Market season is over for this year.";
    lead = "You’ll still find our scones year-round at";
  }

  return (
    <section className="right-now" aria-labelledby="right-now-title">
      <div className="min-w-0">
        <p className="right-now-eyebrow">
          <span className="right-now-dot" data-live={next?.offset === 0 || undefined} aria-hidden="true" />
          Right now
          {/* On phones the date drops to its own line, lined up with "Right now". */}
          {now ? (
            <span className="basis-full pl-[1.1rem] text-paper/60 sm:basis-auto sm:pl-0">
              <span className="hidden sm:inline" aria-hidden="true">
                ·{" "}
              </span>
              {weekdayNames[now.weekday]}, {monthName(now.month)} {now.day}
            </span>
          ) : null}
        </p>
        <h2 id="right-now-title" className="mt-3 font-display text-[1.75rem] leading-[1.15] text-paper sm:text-[2.35rem]">
          {title}
        </h2>

        {next ? (
          <ul className="right-now-markets">
            {next.markets.map((market) => (
              <li key={market.name}>
                <p className="font-display text-xl leading-tight text-paper">{market.name}</p>
                <p className="mt-1.5 text-sm leading-6 text-paper/70">
                  <span className="font-semibold text-rope">{marketHours(market)}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  {market.address}
                </p>
                <div className="mt-2">
                  <Directions address={market.address} tone="light" />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-5 max-w-2xl leading-7 text-paper/80">
          {lead}{" "}
          {yearRound.map((name, index) => (
            <Fragment key={name}>
              {index > 0 ? (index === yearRound.length - 1 ? " and " : ", ") : null}
              <strong className="font-semibold text-paper">{name}</strong>
            </Fragment>
          ))}
          .
        </p>
      </div>

      <div className="right-now-actions">
        <button type="button" className="btn btn-light" onClick={() => setOpen(true)}>
          Order direct
        </button>
        <p className="text-xs leading-5 text-paper/60">
          Delivery within 5 miles of downtown Spokane is $6.
          <br />
          Or call or text{" "}
          <a className="font-semibold text-paper underline decoration-rope/50 underline-offset-2 hover:decoration-rope" href={site.phoneHref}>
            {site.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
