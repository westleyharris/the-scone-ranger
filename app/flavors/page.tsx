import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { FlavorBrowser } from "@/components/FlavorBrowser";
import { PageIntro } from "@/components/PageIntro";
import { menuFollowup, menuNote } from "@/lib/content";
import { flavorPhotoSlugs } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Flavors",
  description: menuNote,
};

export default function FlavorsPage() {
  return (
    <Container className="py-12 sm:py-16 md:py-20">
      <PageIntro eyebrow="The menu" title="Flavors">
        <p>{menuNote}</p>
        <p>{menuFollowup}</p>
      </PageIntro>
      <div className="mt-10">
        <FlavorBrowser photos={flavorPhotoSlugs()} />
      </div>
    </Container>
  );
}
