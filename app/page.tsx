import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { AddButton } from "@/components/FlavorBrowser";
import { Container } from "@/components/Container";
import { Eyebrow, Stitch } from "@/components/Marks";
import { Photo } from "@/components/Photo";
import { MarketList, StockistList } from "@/components/PlaceList";
import {
  featured,
  findPrompt,
  flavorSlug,
  marketsIntro,
  menuFollowup,
  site,
  story,
  venuesIntro,
  wholesalePitch,
} from "@/lib/content";
import { flavorPhotoSlugs } from "@/lib/photos";

export default function Home() {
  const [hook, ...rest] = story[0].split(" You see, ");
  const support = `You see, ${rest.join(" You see, ")}`;
  const photographed = new Set(flavorPhotoSlugs());

  return (
    <>
      <section>
        <Container className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-20">
          <div>
            <Eyebrow>{site.place}</Eyebrow>
            <h1 className="mt-4 max-w-xl font-headline text-[1.85rem] leading-[1.16] text-ink sm:text-[2.65rem] sm:leading-[1.12] lg:text-[3.05rem]">
              {hook}
            </h1>
            <Stitch className="mt-5 w-24 text-rope" />
            <p className="mt-5 max-w-md text-base leading-7 text-bark sm:text-lg sm:leading-8">{support}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/flavors"
                className="btn btn-solid"
              >
                Flavors
              </Link>
              <Link
                href="/find-us"
                className="btn btn-line"
              >
                Find Us
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl pb-8 lg:max-w-none">
            <Photo
              file="hero-scone.jpg"
              label="David and Evelyn Ainley, the owners of The Scone Ranger"
              frame="blob"
              fit="cover"
            />
            <div className="seal-sway absolute -bottom-2 left-3 z-10 w-20 sm:left-5 sm:w-28">
              <BrandMark
                alt="Hand-crafted by the Scone Ranger, Spokane, WA"
                className="aspect-square w-full shadow-[0_14px_30px_rgba(42,33,28,0.22)]"
              />
            </div>
          </div>
        </Container>
      </section>

      <Stitch className="text-bark/55" />
      <section className="bg-paper">
        <Container className="py-16 lg:py-24">
          <div className="max-w-2xl">
            <Eyebrow>The menu</Eyebrow>
            <p className="mt-4 text-lg leading-8">{menuFollowup}</p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li key={item.name} className="flex flex-col overflow-hidden rounded-3xl bg-cream ring-1 ring-line">
                {photographed.has(flavorSlug(item.name)) ? (
                  <div className="aspect-[4/3] bg-foam">
                    <Photo file={`flavors/${flavorSlug(item.name)}.jpg`} label={item.name} showLabel={false} />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h2 className="font-display text-[1.7rem] leading-none text-ink">{item.name}</h2>
                    <Stitch className="mt-3 w-10 text-rope" />
                    <p className="mt-3 text-sm leading-6 text-bark">{item.quote}</p>
                  </div>
                  <div className="mt-auto">
                    <AddButton name={item.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/flavors"
            className="mt-8 inline-flex text-sm font-semibold text-ranger underline decoration-ranger/30 underline-offset-4 hover:decoration-ranger"
          >
            All flavors
          </Link>
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
