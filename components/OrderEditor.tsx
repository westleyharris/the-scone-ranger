"use client";

import { useState } from "react";
import {
  deliveryDetail,
  deliveryFee,
  retailHeading,
  retailLines,
  volumeNote,
  wholesalePrices,
} from "@/lib/content";
import { lineTotal, mailtoHref, MIN_SCONES, orderText, slipTotal, tiersFor } from "@/lib/order";
import { useOrder } from "@/components/OrderProvider";

export function OrderEditor({ showIntro = true }: { showIntro?: boolean }) {
  const { mode, setMode, lines, customer, setCustomer, setScones, setTier, removeLine, clear } =
    useOrder();
  const [copied, setCopied] = useState(false);
  const delivery = customer.fulfillment === "delivery";
  const canSend = lines.length > 0 && customer.name.trim().length > 0;
  const tiers = tiersFor(mode);

  async function copyOrder() {
    await navigator.clipboard.writeText(orderText(mode, lines, customer));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      {showIntro ? (
        <p className="text-sm leading-6 text-bark">
          This writes an email to the bakery. Nothing is charged here.
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
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 font-normal"
          />
        </label>
      ) : null}

      {lines.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-cream/60 px-4 py-8 text-center text-sm leading-6 text-bark">
          Add flavors from the menu. Each flavor starts at 6 scones.
        </p>
      ) : (
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
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={customer.name} onChange={(name) => setCustomer({ name })} />
        <Field label="Phone" value={customer.phone} onChange={(phone) => setCustomer({ phone })} />
        <Field
          label="Your email"
          value={customer.email}
          onChange={(email) => setCustomer({ email })}
          className="sm:col-span-2"
        />
      </div>

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

      {delivery ? (
        <Field
          label="Delivery address"
          value={customer.address}
          onChange={(address) => setCustomer({ address })}
        />
      ) : null}

      <label className="block text-sm font-semibold text-ink">
        Note
        <textarea
          value={customer.note}
          onChange={(event) => setCustomer({ note: event.target.value })}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 font-normal"
        />
      </label>

      <div className="rounded-2xl bg-foam px-4 py-3 text-sm leading-6 text-bark">
        <p>{mode === "wholesale" ? wholesalePrices : retailHeading}</p>
        {mode === "retail"
          ? retailLines.map((line) => (
              <p key={line}>{line}</p>
            ))
          : null}
        <p>
          {deliveryFee} {deliveryDetail}
        </p>
        <p>{volumeNote}</p>
        <p className="mt-2 font-semibold text-ink">
          Estimated total: ${slipTotal(mode, lines, delivery)}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {canSend ? (
          <a
            href={mailtoHref(mode, lines, customer)}
            className="btn btn-solid flex-1"
          >
            Email this order
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="btn flex-1"
          >
            Email this order
          </button>
        )}
        <button
          type="button"
          disabled={!canSend}
          onClick={copyOrder}
          className="btn btn-line flex-1 disabled:border-0"
        >
          {copied ? "Copied" : "Copy order"}
        </button>
      </div>
      {lines.length > 0 ? (
        <button type="button" onClick={clear} className="self-start text-sm text-bark underline">
          Clear slip
        </button>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-semibold text-ink ${className}`}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 font-normal"
      />
    </label>
  );
}
