import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { MarketDays, MarketStrip } from "@/components/MarketWeek";
import { PageIntro } from "@/components/PageIntro";
import { StockistList } from "@/components/PlaceList";
import { RightNow } from "@/components/RightNow";
import { findPrompt, marketsIntro, venuesIntro } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find Us",
  description: findPrompt,
};

export default function FindUsPage() {
  return (
    <Container className="py-12 sm:py-16 md:py-20">
      <PageIntro eyebrow="Spokane" title="Find Us">
        <p>{findPrompt}</p>
      </PageIntro>

      <RightNow />

      <section
        className="mt-20 grid gap-8 sm:mt-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16"
        aria-labelledby="venues-title"
      >
        <div>
          <h2 id="venues-title" className="font-display text-3xl text-ink md:text-4xl">
            Venues
          </h2>
          <p className="mt-4 max-w-md text-lg leading-8">{venuesIntro}</p>
        </div>
        <StockistList />
      </section>

      <section className="mt-20 sm:mt-24" aria-labelledby="markets-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
          <div>
            <h2 id="markets-title" className="font-display text-3xl text-ink md:text-4xl">
              Farmers’ Markets
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8">{marketsIntro}</p>
          </div>
          <MarketStrip />
        </div>
        <MarketDays />
      </section>
    </Container>
  );
}
