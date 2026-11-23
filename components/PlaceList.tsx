import { markets, stockists } from "@/lib/content";
import { DayStamp, Mask } from "@/components/Marks";
import { Directions, TodayMark } from "@/components/Places";

export function StockistList() {
  return (
    <div className="grid gap-8">
      {stockists.map((group) => (
        <section key={group.city}>
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-bark uppercase">
            <Mask className="h-8 w-8 text-ranger" />
            {group.city}
          </h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {group.places.map((place) => (
              <li key={place.name} className="py-4">
                <p className="font-display text-2xl leading-none text-ink">{place.name}</p>
                <p className="mt-2 text-sm leading-6 text-bark">{place.address}</p>
                <div className="mt-3">
                  <Directions address={place.address} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function MarketList() {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {markets.map((market) => (
        <li key={market.name} className="flex gap-4 py-5">
          <div className="flex shrink-0 gap-1.5 pt-0.5">
            {market.days.map((day, index) => (
              <DayStamp key={day} day={day} tilt={index % 2 === 0 ? -8 : 7} />
            ))}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="font-display text-2xl leading-none text-ink">{market.name}</h3>
              <TodayMark market={market} />
            </div>
            <p className="mt-2 text-sm font-semibold text-ranger">{market.when}</p>
            <p className="mt-1 text-sm leading-6 text-bark">{market.address}</p>
            <div className="mt-3">
              <Directions address={market.address} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
