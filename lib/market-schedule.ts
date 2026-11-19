import { markets, type Market } from "@/lib/content";

export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Wall-clock time in Spokane, whatever the visitor's own time zone. Month is 1–12, weekday 0 = Sunday. */
export type SpokaneNow = {
  year: number;
  month: number;
  day: number;
  hour: number;
  weekday: number;
};

const spokaneClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  hourCycle: "h23",
});

/** Spokane's date and hour as "YYYY-M-D-H": a plain string, so React can compare snapshots cheaply. */
export function spokaneStamp(date = new Date()) {
  const parts = spokaneClock.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "0";
  return [pick("year"), pick("month"), pick("day"), pick("hour")].join("-");
}

export function parseSpokaneStamp(stamp: string): SpokaneNow {
  const [year, month, day, hour] = stamp.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, hour, weekday };
}

export function monthName(month: number) {
  return monthNames[month - 1];
}

export function inSeason(market: Market, month: number) {
  return month >= market.season[0] && month <= market.season[1];
}

export function isMarketToday(market: Market, now: SpokaneNow) {
  return inSeason(market, now.month) && market.days.includes(now.weekday);
}

function formatHour(hour: number) {
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${hour < 12 ? "am" : "pm"}`;
}

/** "3pm – 7pm" */
export function marketHours(market: Market) {
  return `${formatHour(market.hours[0])} – ${formatHour(market.hours[1])}`;
}

/** "May – October" */
export function marketSeason(market: Market) {
  return `${monthName(market.season[0])} – ${monthName(market.season[1])}`;
}

/** Every market held on this weekday, in season or not, earliest first. */
export function marketsOn(weekday: number) {
  return markets.filter((market) => market.days.includes(weekday)).sort((a, b) => a.hours[0] - b.hours[0]);
}

/** Weekdays with at least one market, Sunday first. */
export const marketWeekdays = [...new Set(markets.flatMap((market) => market.days))].sort((a, b) => a - b);

/** First and last month of the market season, across all markets. */
export const seasonSpan = {
  start: Math.min(...markets.map((market) => market.season[0])),
  end: Math.max(...markets.map((market) => market.season[1])),
};

export type MarketDay = {
  /** Days from today: 0 is today, 1 tomorrow. */
  offset: number;
  weekday: number;
  month: number;
  day: number;
  markets: Market[];
};

/**
 * The next day within a week that has a market in season. Today counts only
 * while at least one of its markets is still open.
 */
export function nextMarketDay(now: SpokaneNow): MarketDay | null {
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(Date.UTC(now.year, now.month - 1, now.day + offset));
    const month = date.getUTCMonth() + 1;
    const weekday = date.getUTCDay();
    const open = marketsOn(weekday).filter(
      (market) => inSeason(market, month) && (offset > 0 || now.hour < market.hours[1]),
    );
    if (open.length > 0) return { offset, weekday, month, day: date.getUTCDate(), markets: open };
  }
  return null;
}
