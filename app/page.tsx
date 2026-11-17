import Link from "next/link";
import { Container } from "@/components/Container";
import { FlavorCard } from "@/components/FlavorCard";
import { HeroPortrait } from "@/components/HeroPortrait";
import { Eyebrow, Stitch } from "@/components/Marks";
import { MarketList, StockistList } from "@/components/PlaceList";
import {
  featured,
  findPrompt,
  marketsIntro,
  menuFollowup,
  site,
  story,
  venuesIntro,
  wholesalePitch,
} from "@/lib/content";
import { flavorPhotoFor } from "@/lib/photo-types";
import { flavorPhotos } from "@/lib/photos";

export default function Home() {
  const [hook, ...rest] = story[0].split(" You see, ");
  const support = `You see, ${rest.join(" You see, ")}`;
  const photos = flavorPhotos();

  return (
    <>
      <section>
        <Container className="grid items-center gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-20">
          <div>
            <Eyebrow>{site.place}</Eyebrow>
            <h1 className="mt-4 max-w-xl font-headline text-[1.85rem] leading-[1.16] text-ink sm:text-[2.65rem] sm:leading-[1.12] lg:text-[3.15rem]">
              {hook}
            </h1>
            <Stitch className="mt-5 w-24 text-rope" />
            <p className="mt-5 max-w-md text-base leading-7 text-bark sm:text-lg sm:leading-8">{support}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/flavors" className="btn btn-solid">
                Flavors
              </Link>
              <Link href="/find-us" className="btn btn-line">
                Find Us
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xl lg:max-w-none">
            <HeroPortrait />
          </div>
        </Container>
      </section>

      <Stitch className="text-bark/55" />
      <section className="bg-paper">
        <Container className="py-16 lg:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div className="max-w-2xl">
              <Eyebrow>The menu</Eyebrow>
              <p className="mt-4 text-lg leading-8">{menuFollowup}</p>
            </div>
            <Link href="/flavors" className="btn btn-line self-start sm:self-auto">
              All flavors
            </Link>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-16 sm:grid-cols-3 sm:gap-x-10 lg:mt-20 lg:gap-x-16 lg:gap-y-20">
            {featured.map((name) => (
              <FlavorCard
                key={name}
                name={name}
                photo={flavorPhotoFor(photos, name)}
                surface="paper"
                featured
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 28vw, 44vw"
              />
            ))}
          </ul>
        </Container>
      </section>
      <Stitch className="text-bark/55" />

      <section>
        <Container className="py-16 lg:py-24">
          <h2 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
            {findPrompt}
          </h2>
          <Stitch className="mt-5 w-24 text-rope" />
          <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-lg leading-8">{venuesIntro}</p>
              <div className="mt-6">
                <StockistList />
              </div>
            </div>
            <div>
              <p className="text-lg leading-8">{marketsIntro}</p>
              <div className="mt-6">
                <MarketList />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Stitch className="text-bark/55" />
      <section className="bg-foam/45">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <p className="text-lg leading-8">{story[1]}</p>
          <div>
            <p className="text-lg leading-8">{story[2]}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/our-story"
                className="text-sm font-semibold text-ranger underline decoration-ranger/30 underline-offset-4 hover:decoration-ranger"
              >
                Our Story
              </Link>
              <Link
                href="/our-story#interview"
                className="text-sm font-semibold text-ranger underline decoration-ranger/30 underline-offset-4 hover:decoration-ranger"
              >
                Watch the interview
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Stitch className="text-rope" />
      <section className="bg-ranger text-paper">
        <Container className="grid items-end gap-8 py-16 md:grid-cols-[minmax(0,1fr)_auto] md:py-20">
          <p className="max-w-3xl font-display text-3xl leading-snug md:text-[2.4rem]">{wholesalePitch}</p>
          <div className="flex flex-col items-start gap-4">
            <Link href="/contact" className="btn btn-light">
              Contact
            </Link>
            <a className="text-sm font-semibold text-paper underline decoration-paper/40 underline-offset-4" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
