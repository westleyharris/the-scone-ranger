import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Stitch } from "@/components/Marks";
import { OrderEditor } from "@/components/OrderEditor";
import { PageIntro } from "@/components/PageIntro";
import { PriceBoard } from "@/components/PriceBoard";
import { callLine, emailLine, orderHeading, site, wholesalePitch } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: orderHeading,
};

/*
  Phones read top to bottom: how to reach the bakery, then the order slip,
  then prices. From lg the slip moves to its own column beside the rest.
*/
export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16 md:py-20">
      <PageIntro eyebrow="Wholesale and orders" title="Contact" />
      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-16">
        <div className="space-y-8">
          <h2 className="max-w-xl font-display text-3xl leading-snug text-ink">{orderHeading}</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn btn-solid">
              Call
            </a>
            <a href={site.smsHref} className="btn btn-line">
              Text
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-line">
              Email
            </a>
          </div>
          <p className="text-lg leading-8">
            {callLine}
            <br />
            <a className="underline decoration-ranger/30 underline-offset-4 hover:decoration-ranger" href={`mailto:${site.email}`}>
              {emailLine}
            </a>
          </p>
        </div>

        <div
          id="order"
          className="ticket scroll-mt-32 rounded-3xl bg-paper p-5 pl-9 shadow-[0_24px_60px_rgba(42,33,28,0.08)] ring-1 ring-line sm:p-7 sm:pl-11 lg:col-start-2 lg:row-span-3 lg:row-start-1"
        >
          <h2 className="font-display text-4xl text-ink">Order slip</h2>
          <Stitch className="mt-4 w-20 text-rope" />
          <div className="mt-6">
            <OrderEditor showIntro />
          </div>
        </div>

        <PriceBoard />

        <p className="text-lg leading-8">{wholesalePitch}</p>
      </div>
    </Container>
  );
}
