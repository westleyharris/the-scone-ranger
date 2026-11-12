import { Stitch } from "@/components/Marks";

const SHORT_LIMIT = 96;

export function Testimonies({ quotes }: { quotes: readonly string[] }) {
  const shorts = quotes.filter((quote) => quote.length <= SHORT_LIMIT);
  const longs = quotes.filter((quote) => quote.length > SHORT_LIMIT);

  return (
    <section id="testimonies" className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 pt-16 md:px-8 lg:pt-24">
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Testimonies</h2>
        <Stitch className="mt-4 w-24 text-rope" />
      </div>

      <div className="ticker-mask relative mt-8 w-full overflow-hidden bg-ranger py-6 text-paper">
        <div className="ticker-track flex w-max items-center">
          <TickerRow quotes={shorts} />
          <TickerRow quotes={shorts} hidden />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-x-12 px-5 py-12 sm:py-16 md:grid-cols-2 md:px-8">
        {longs.map((quote, index) => {
          const featured = index % 4 === 0;
          return (
            <blockquote
              key={quote}
              className={featured ? "border-t-2 border-ranger py-6 md:col-span-2" : "border-t border-line py-6"}
            >
              <p
                className={
                  featured
                    ? "max-w-4xl font-headline text-[1.45rem] leading-snug text-ink sm:text-[1.85rem]"
                    : "text-base leading-7 text-ink"
                }
              >
                {quote}
              </p>
            </blockquote>
          );
        })}
      </div>
    </section>
  );
}

function TickerRow({ quotes, hidden = false }: { quotes: readonly string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {quotes.map((quote) => (
        <li key={`${hidden ? "copy" : "live"}-${quote}`} className="flex items-center">
          <p className="max-w-sm px-8 font-headline text-lg leading-snug text-paper sm:max-w-md sm:text-2xl">{quote}</p>
          <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rope" />
        </li>
      ))}
    </ul>
  );
}
