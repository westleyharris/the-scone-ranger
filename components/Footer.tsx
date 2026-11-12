import Link from "next/link";
import { interviewUrl, nav, site } from "@/lib/content";
import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/Container";
import { Stitch } from "@/components/Marks";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="h-[3px] bg-rope" />
      <div className="mt-1.5 h-[3px] bg-rope/50" />
      <Container className="grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <BrandMark className="h-16 w-16" />
          <p className="mt-5 font-display text-3xl leading-none">{site.name}</p>
          <Stitch className="mt-4 w-24 text-rope" />
          <p className="mt-3 text-sm text-paper/70">{site.place}</p>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-rope uppercase">Contact</p>
          <a className="mt-4 block text-lg font-semibold hover:text-rope" href={site.phoneHref}>
            {site.phoneDisplay}
          </a>
          <a className="mt-1 block text-sm text-paper/75 hover:text-rope" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="mt-5 inline-flex text-sm font-semibold underline decoration-rope/50 underline-offset-4 hover:decoration-rope" href={interviewUrl}>
            Interview
          </a>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 md:col-span-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-rope uppercase">Visit</p>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-rope">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </Container>
      <Container className="border-t border-paper/10 py-5 text-xs tracking-wide text-paper/50">
        {site.name} · {site.place}
      </Container>
    </footer>
  );
}
