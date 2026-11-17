"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  defaultRetailTier,
  emptyCustomer,
  MIN_SCONES,
  normalizeScones,
  type Customer,
  type OrderLine,
  type OrderMode,
} from "@/lib/order";

const STORAGE_KEY = "scone-ranger-slip-v2";

type Stored = {
  mode: OrderMode;
  lines: OrderLine[];
  customer: Customer;
};

const serverSnapshot: Stored = {
  mode: "retail",
  lines: [],
  customer: emptyCustomer,
};

let snapshot: Stored = serverSnapshot;
let clientReady = false;
const listeners = new Set<() => void>();

function lineKey(name: string, tier: string) {
  return `${name}::${tier}`;
}

function mergeLines(lines: OrderLine[]): OrderLine[] {
  const merged: OrderLine[] = [];
  for (const line of lines) {
    const index = merged.findIndex((item) => item.key === line.key);
    if (index === -1) merged.push({ ...line });
    else {
      const existing = merged[index];
      merged[index] = { ...existing, scones: existing.scones + line.scones };
    }
  }
  return merged;
}

function sanitize(value: unknown): Stored {
  if (!value || typeof value !== "object") return serverSnapshot;
  const parsed = value as Partial<Stored>;
  const mode = parsed.mode === "wholesale" ? "wholesale" : "retail";
  const lines = Array.isArray(parsed.lines)
    ? parsed.lines.flatMap((line) => {
        if (!line || typeof line.name !== "string" || typeof line.tier !== "string") return [];
        const saved = line as OrderLine & { dozens?: number };
        const raw = Number(
          saved.scones ?? (typeof saved.dozens === "number" ? saved.dozens * 12 : NaN),
        );
        const scones = normalizeScones(raw);
        if (!Number.isFinite(raw) || raw < MIN_SCONES) return [];
        return [{ name: line.name, tier: line.tier, scones, key: lineKey(line.name, line.tier) }];
      })
    : [];
  const customer = { ...emptyCustomer, ...(parsed.customer ?? {}) };
  if (customer.fulfillment !== "delivery") customer.fulfillment = "pickup";
  return { mode, lines: mergeLines(lines), customer };
}

function readStorage(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return serverSnapshot;
    return sanitize(JSON.parse(raw));
  } catch {
    return serverSnapshot;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return clientReady ? snapshot : serverSnapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function write(next: Stored) {
  snapshot = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

type OrderContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  lines: OrderLine[];
  customer: Customer;
  setCustomer: (patch: Partial<Customer>) => void;
  addFlavor: (name: string) => void;
  setScones: (key: string, scones: number) => void;
  setTier: (key: string, tier: string) => void;
  removeLine: (key: string) => void;
  clear: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    clientReady = true;
    snapshot = readStorage();
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<OrderContextValue>(
    () => ({
      open,
      setOpen,
      mode: stored.mode,
      lines: stored.lines,
      customer: stored.customer,
      setMode: (next) => {
        write({
          ...stored,
          mode: next,
          lines: mergeLines(
            stored.lines.map((line) => {
              const tier = next === "wholesale" ? "standard" : defaultRetailTier(line.name);
              return { ...line, tier, key: lineKey(line.name, tier) };
            }),
          ),
        });
      },
      setCustomer: (patch) => write({ ...stored, customer: { ...stored.customer, ...patch } }),
      addFlavor: (name) => {
        const tier = stored.mode === "wholesale" ? "standard" : defaultRetailTier(name);
        const key = lineKey(name, tier);
        const existing = stored.lines.find((line) => line.key === key);
        const lines = existing
          ? stored.lines.map((line) =>
              line.key === key ? { ...line, scones: line.scones + MIN_SCONES } : line,
            )
          : [...stored.lines, { key, name, tier, scones: MIN_SCONES }];
        write({ ...stored, lines });
        setOpen(true);
      },
      setScones: (key, scones) => {
        write({
          ...stored,
          lines: stored.lines.map((line) =>
            line.key === key ? { ...line, scones: normalizeScones(scones) } : line,
          ),
        });
      },
      setTier: (key, tier) => {
        write({
          ...stored,
          lines: mergeLines(
            stored.lines.map((line) =>
              line.key === key ? { ...line, tier, key: lineKey(line.name, tier) } : line,
            ),
          ),
        });
      },
      removeLine: (key) =>
        write({ ...stored, lines: stored.lines.filter((line) => line.key !== key) }),
      clear: () => write({ ...stored, lines: [] }),
    }),
    [open, stored],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
}
