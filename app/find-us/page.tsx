import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/PageIntro";
import { MarketList, StockistList } from "@/components/PlaceList";
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
      <div className="mt-14 grid gap-16 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl text-ink">Venues</h2>
          <p className="mt-4 max-w-xl text-lg leading-8">{venuesIntro}</p>
          <div className="mt-6">
            <StockistList />
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl text-ink">Farmers’ Markets</h2>
          <p className="mt-4 max-w-xl text-lg leading-8">{marketsIntro}</p>
          <div className="mt-6">
            <MarketList />
          </div>
        </section>
      </div>
    </Container>
  );
}
