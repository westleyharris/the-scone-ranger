import { menuNote, volumeNote } from "@/lib/content";
import { MIN_SCONES, retailTiers, wholesaleTiers } from "@/lib/order";

/**
 * Every price on one board, read from the same tiers the order slip uses,
 * so the two can never disagree.
 */
export function PriceBoard() {
  return (
    <section id="prices" className="price-board" aria-labelledby="prices-title">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="prices-title" className="font-display text-3xl leading-none text-ink">
          Prices
        </h2>
        <p className="price-board-unit">Per dozen</p>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-10">
        <PriceList title="Retail" tiers={retailTiers} />
        <PriceList title="Coffee shops" tiers={wholesaleTiers} />
      </div>
      <p className="mt-5 text-sm leading-6 text-bark">{menuNote}</p>

      <dl className="price-facts">
        <div>
          <dt>Minimum</dt>
          <dd>{MIN_SCONES} scones per flavor</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>$6, within 5 miles of downtown Spokane</dd>
        </div>
        <div>
          <dt>Volume</dt>
          <dd>{volumeNote}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-bark">
        Smaller sized scones are made to order. Ask for details and pricing.
      </p>
    </section>
  );
}

function PriceList({
  title,
  tiers,
}: {
  title: string;
  tiers: readonly { id: string; label: string; price: number }[];
}) {
  return (
    <div>
      <h3 className="price-board-group">{title}</h3>
      <ul className="mt-3">
        {tiers.map((tier) => (
          <li key={tier.id} className="price-row">
            <span>{tier.label}</span>
            <span className="price-row-leader" aria-hidden="true" />
            <span className="price-row-price">${tier.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
