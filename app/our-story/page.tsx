import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Interview } from "@/components/Interview";
import { PageIntro } from "@/components/PageIntro";
import { Testimonies } from "@/components/Testimonies";
import { about, story, testimonies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description: story[0],
};

export default function StoryPage() {
  return (
    <>
      <Container className="py-12 sm:py-16 md:py-20">
        <PageIntro eyebrow="About" title="Our Story" />
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl space-y-6 text-lg leading-8">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="space-y-6 border-t border-line pt-6">
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <Interview />
        </div>
      </Container>
      <Testimonies quotes={testimonies} />
    </>
  );
}
