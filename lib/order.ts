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
};

export const emptyCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  fulfillment: "pickup",
  address: "",
  note: "",
  cafe: "",
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

export function orderText(mode: OrderMode, lines: OrderLine[], customer: Customer) {
  const delivery = customer.fulfillment === "delivery";
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
