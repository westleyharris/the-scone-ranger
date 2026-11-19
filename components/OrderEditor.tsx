"use client";

import { useState, useSyncExternalStore } from "react";
import { volumeNote } from "@/lib/content";
import {
  lineTotal,
  mailtoHref,
  MIN_SCONES,
  orderText,
  slipTotal,
  smsHref,
  tiersFor,
} from "@/lib/order";
import { FlavorPicker } from "@/components/FlavorPicker";
import { useOrder } from "@/components/OrderProvider";
import { useSpokaneNow } from "@/components/Places";

const DELIVERY_FEE = 6;

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia("(pointer: coarse)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Touch screens get "Text this order" first: the bakery takes orders by call or text. */
function useTouchScreen() {
  return useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
}

export function OrderEditor({ showIntro = true }: { showIntro?: boolean }) {
  const { mode, setMode, lines, customer, setCustomer, setScones, setTier, removeLine, clear } =
    useOrder();
  const [copied, setCopied] = useState(false);
  const touch = useTouchScreen();
  const now = useSpokaneNow();
  const delivery = customer.fulfillment === "delivery";
  const canSend = lines.length > 0 && customer.name.trim().length > 0;
  const tiers = tiersFor(mode);
  const subtotal = slipTotal(mode, lines, false);
  const today = now
    ? `${now.year}-${String(now.month).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`
    : undefined;

  async function copyOrder() {
    await navigator.clipboard.writeText(orderText(mode, lines, customer));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const sendButtons = [
    { label: "Text this order", href: smsHref(mode, lines, customer) },
    { label: "Email this order", href: mailtoHref(mode, lines, customer) },
  ];
  if (!touch) sendButtons.reverse();

  return (
    <div className="flex flex-col gap-5">
      {showIntro ? (
        <p className="text-sm leading-6 text-bark">
          This writes a text or email to the bakery. Nothing is charged here.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-1 rounded-full bg-foam p-1">
        {(
          [
            ["retail", "My order"],
            ["wholesale", "Coffee shop"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={`rounded-full px-3 py-2 text-sm font-semibold ${
              mode === value ? "bg-ranger text-paper" : "text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "wholesale" ? (
        <label className="block text-sm font-semibold text-ink">
          Cafe
          <input
            value={customer.cafe}
            onChange={(event) => setCustomer({ cafe: event.target.value })}
            className="slip-input"
          />
        </label>
      ) : null}

      {lines.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {lines.map((line) => (
            <li key={line.key} className="rounded-2xl bg-cream p-4 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-xl leading-tight text-ink">{line.name}</p>
                <button
                  type="button"
                  onClick={() => removeLine(line.key)}
                  className="text-sm text-bark underline decoration-line underline-offset-4 hover:text-ink"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center rounded-full bg-paper ring-1 ring-line">
                  <button
                    type="button"
                    aria-label={`Fewer ${line.name}`}
                    disabled={line.scones <= MIN_SCONES}
                    onClick={() => setScones(line.key, line.scones - MIN_SCONES)}
                    className="grid h-9 w-9 place-items-center text-lg text-ink disabled:text-line"
                  >
                    –
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold text-ink">{line.scones}</span>
                  <button
                    type="button"
                    aria-label={`More ${line.name}`}
                    onClick={() => setScones(line.key, line.scones + MIN_SCONES)}
                    className="grid h-9 w-9 place-items-center text-lg text-ink"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-bark">scones</span>
                <label className="text-sm text-bark">
                  <span className="sr-only">Price type for {line.name}</span>
                  <select
                    value={line.tier}
                    onChange={(event) => setTier(line.key, event.target.value)}
                    className="rounded-full border border-line bg-paper px-3 py-2 text-ink"
                  >
                    {tiers.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.label} ${tier.price}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="ml-auto text-sm font-semibold text-ink">${lineTotal(mode, line)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={lines.length === 0 ? "rounded-2xl border border-dashed border-line bg-cream/60 p-4" : ""}>
        <FlavorPicker showQuickAdd={lines.length === 0} />
        {lines.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-bark">Each flavor starts at {MIN_SCONES} scones.</p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={customer.name} onChange={(name) => setCustomer({ name })} autoComplete="name" />
        <Field
          label="Phone"
          value={customer.phone}
          onChange={(phone) => setCustomer({ phone })}
          type="tel"
          autoComplete="tel"
        />
        <Field
          label="Your email"
          value={customer.email}
          onChange={(email) => setCustomer({ email })}
          type="email"
          autoComplete="email"
          className="sm:col-span-2"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Pickup or delivery</legend>
          <div className="mt-2 flex gap-4 text-sm">
            {(
              [
                ["pickup", "Pickup"],
                ["delivery", "Delivery"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={customer.fulfillment === value}
                  onChange={() => setCustomer({ fulfillment: value })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label="Needed by"
          hint="optional"
          value={customer.neededBy}
          onChange={(neededBy) => setCustomer({ neededBy })}
          type="date"
          min={today}
        />
      </div>

      {delivery ? (
        <Field
          label="Delivery address"
          value={customer.address}
          onChange={(address) => setCustomer({ address })}
          autoComplete="street-address"
        />
      ) : null}

      <label className="block text-sm font-semibold text-ink">
        Note
        <textarea
          value={customer.note}
          onChange={(event) => setCustomer({ note: event.target.value })}
          rows={3}
          className="slip-input"
        />
      </label>

      {lines.length > 0 ? (
        <div className="rounded-2xl bg-foam px-4 py-3.5 text-sm leading-6 text-bark">
          <dl className="space-y-1">
            <div className="flex justify-between gap-4">
              <dt>
                Scones ({lines.reduce((sum, line) => sum + line.scones, 0)})
              </dt>
              <dd className="text-ink">${subtotal}</dd>
            </div>
            {delivery ? (
              <div className="flex justify-between gap-4">
                <dt>Delivery</dt>
                <dd className="text-ink">${DELIVERY_FEE}</dd>
              </div>
            ) : null}
            <div className="mt-1.5 flex justify-between gap-4 border-t border-bark/15 pt-2 font-semibold text-ink">
              <dt>Estimated total</dt>
              <dd>${slipTotal(mode, lines, delivery)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs leading-5">
            {delivery ? "Delivery is within 5 miles of downtown Spokane. " : null}
            {volumeNote}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        {sendButtons.map((button, index) =>
          canSend ? (
            <a
              key={button.label}
              href={button.href}
              className={`btn ${index === 0 ? "btn-solid" : "btn-line"} flex-1`}
            >
              {button.label}
            </a>
          ) : (
            <button key={button.label} type="button" disabled className="btn flex-1">
              {button.label}
            </button>
          ),
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-bark">
        {canSend ? null : (
          <p className="mr-auto">{lines.length === 0 ? "Add a flavor to start." : "Add your name to send it."}</p>
        )}
        <button
          type="button"
          disabled={!canSend}
          onClick={copyOrder}
          className="underline decoration-line underline-offset-4 hover:text-ink disabled:no-underline disabled:opacity-50"
        >
          {copied ? "Copied" : "Copy order"}
        </button>
        {lines.length > 0 ? (
          <button type="button" onClick={clear} className="underline decoration-line underline-offset-4 hover:text-ink">
            Clear slip
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  className = "",
  type = "text",
  autoComplete,
  min,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: "text" | "tel" | "email" | "date";
  autoComplete?: string;
  min?: string;
}) {
  return (
    <label className={`block text-sm font-semibold text-ink ${className}`}>
      {label}
      {hint ? <span className="ml-1.5 font-normal text-bark">({hint})</span> : null}
      <input
        type={type}
        value={value}
        min={min}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="slip-input"
      />
    </label>
  );
}
