import type { Metadata, Viewport } from "next";
import { Calistoga, Fraunces, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { site, story } from "@/lib/content";
import { Footer } from "@/components/Footer";
import { Header, HeaderFallback } from "@/components/Header";
import { OrderProvider } from "@/components/OrderProvider";
import { OrderSlip } from "@/components/OrderSlip";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const calistoga = Calistoga({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-calistoga",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesconeranger.com"),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: story[0],
  // iOS Safari otherwise wraps plain-text phone numbers and street addresses in its own
  // links before React loads, which breaks hydration. The site already links them itself.
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

/** Matches the header bar, so phone browsers colour their own bar to meet it. */
export const viewport: Viewport = {
  themeColor: "#fbf6ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${calistoga.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <OrderProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
          <OrderSlip />
        </OrderProvider>
      </body>
    </html>
  );
}
