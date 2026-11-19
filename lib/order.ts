import {
  deliveryDetail,
  deliveryFee,
  emailLine,
  orderHeading,
  retailHeading,
  retailLines,
  site,
  volumeNote,
  wholesalePrices,
} from "@/lib/content";
import { monthName, weekdayNames } from "@/lib/market-schedule";

export const retailTiers = [
  { id: "standard", label: "Standard", price: 50 },
  { id: "vegan", label: "Vegan", price: 50 },
  { id: "gluten-free", label: "Gluten-free", price: 60 },
  { id: "cheese", label: "Cheese filled", price: 60 },
  { id: "sugar-free", label: "Sugar-free", price: 60 },
  { id: "huckleberry", label: "Huckleberry", price: 75 },
] as const;

export const wholesaleTiers = [
  { id: "standard", label: "Standard", price: 32 },
  { id: "premium", label: "Premium", price: 36 },
] as const;

export type RetailTier = (typeof retailTiers)[number]["id"];
export type WholesaleTier = (typeof wholesaleTiers)[number]["id"];
export type OrderMode = "retail" | "wholesale";

export const MIN_SCONES = 6;

export function normalizeScones(value: number) {
  if (!Number.isFinite(value)) return MIN_SCONES;
  return Math.max(MIN_SCONES, Math.round(value / MIN_SCONES) * MIN_SCONES);
}

export type OrderLine = {
  key: string;
  name: string;
  tier: string;
  scones: number;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  fulfillment: "pickup" | "delivery";
  address: string;
  note: string;
  cafe: string;
  /** "YYYY-MM-DD" from the date field, or "" when not given. */
  neededBy: string;
};

export const emptyCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  fulfillment: "pickup",
  address: "",
  note: "",
  cafe: "",
  neededBy: "",
};

export function defaultRetailTier(name: string): RetailTier {
  if (/huckleberry/i.test(name)) return "huckleberry";
  if (/cheddar|cheese/i.test(name) && !/cream cheese/i.test(name)) return "cheese";
  return "standard";
}

export function tiersFor(mode: OrderMode) {
  return mode === "wholesale" ? wholesaleTiers : retailTiers;
}

export function priceFor(mode: OrderMode, tier: string) {
  const match = tiersFor(mode).find((item) => item.id === tier);
  return match?.price ?? tiersFor(mode)[0].price;
}

export function labelFor(mode: OrderMode, tier: string) {
  const match = tiersFor(mode).find((item) => item.id === tier);
  return match?.label ?? tiersFor(mode)[0].label;
}

export function lineTotal(mode: OrderMode, line: OrderLine) {
  return Math.round((priceFor(mode, line.tier) * line.scones) / 12);
}

export function slipTotal(mode: OrderMode, lines: OrderLine[], delivery: boolean) {
  const goods = lines.reduce((sum, line) => sum + lineTotal(mode, line), 0);
  return goods + (delivery ? 6 : 0);
}

/** "Saturday, November 21" from "2026-11-21"; "" if the value isn't a date. */
export function formatNeededBy(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";
  const [year, month, day] = match.slice(1).map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${weekdayNames[weekday]}, ${monthName(month)} ${day}`;
}

export function orderText(mode: OrderMode, lines: OrderLine[], customer: Customer) {
  const delivery = customer.fulfillment === "delivery";
  const neededBy = formatNeededBy(customer.neededBy);
  const itemLines = lines.map((line) => {
    const price = priceFor(mode, line.tier);
    return `${line.name} — ${line.scones} scones — ${labelFor(mode, line.tier)} — $${price}/dozen — $${lineTotal(mode, line)}`;
  });

  const blocks = [
    orderHeading,
    "",
    mode === "wholesale" ? "Coffee shop order" : "Scone order",
    customer.cafe && mode === "wholesale" ? `Cafe: ${customer.cafe}` : "",
    `Name: ${customer.name}`,
    customer.phone ? `Phone: ${customer.phone}` : "",
    customer.email ? `Email: ${customer.email}` : "",
    `Pickup or delivery: ${delivery ? "Delivery" : "Pickup"}`,
    delivery && customer.address ? `Address: ${customer.address}` : "",
    neededBy ? `Needed by: ${neededBy}` : "",
    "",
    ...itemLines,
    "",
    mode === "wholesale" ? wholesalePrices : retailHeading,
    ...(mode === "wholesale" ? [] : retailLines),
    deliveryFee,
    deliveryDetail,
    volumeNote,
    "",
    `Estimated total: $${slipTotal(mode, lines, delivery)}`,
    customer.note ? "" : "",
    customer.note ? `Note: ${customer.note}` : "",
    "",
    `${emailLine}`,
    `Call or text: ${site.phoneDisplay}`,
  ].filter((line) => line !== "");

  return blocks.join("\n");
}

export function mailtoHref(mode: OrderMode, lines: OrderLine[], customer: Customer) {
  const subject =
    mode === "wholesale"
      ? `Wholesale scone order — ${customer.cafe || customer.name}`
      : `Scone order — ${customer.name}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderText(mode, lines, customer))}`;
}

/**
 * The order as a text message: just what the bakery needs to reply,
 * without the price list the email carries.
 */
export function orderMessage(mode: OrderMode, lines: OrderLine[], customer: Customer) {
  const delivery = customer.fulfillment === "delivery";
  const neededBy = formatNeededBy(customer.neededBy);
  const head = [
    mode === "wholesale" ? `Coffee shop order${customer.cafe ? ` for ${customer.cafe}` : ""}` : "Scone order",
    `From: ${customer.name}`,
    neededBy ? `Needed by: ${neededBy}` : "",
    delivery ? `Delivery${customer.address ? ` to ${customer.address}` : ""}` : "Pickup",
  ];
  const items = lines.map(
    (line) => `${line.name}: ${line.scones} scones (${labelFor(mode, line.tier)}) $${lineTotal(mode, line)}`,
  );
  const foot = [
    `Estimated total: $${slipTotal(mode, lines, delivery)}${delivery ? " incl. $6 delivery" : ""}`,
    customer.note ? `Note: ${customer.note}` : "",
  ];
  return [head, items, foot]
    .map((block) => block.filter(Boolean).join("\n"))
    .filter(Boolean)
    .join("\n\n");
}

/** Opens Messages with the order filled in. "?&body=" is the form both iOS and Android read. */
export function smsHref(mode: OrderMode, lines: OrderLine[], customer: Customer) {
  return `${site.smsHref}?&body=${encodeURIComponent(orderMessage(mode, lines, customer))}`;
}
