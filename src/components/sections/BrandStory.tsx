import type { HomeContent } from "@/types/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { RevealMask, Parallax, ScrubWords } from "@/components/animations/Motion";
import { Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/Button";

export function BrandStory({ home }: { home: HomeContent }) {
  const [portrait, landscape] = home.storyImages;
  return (
    <section id="story" data-section="The story" aria-labelledby="story-title" className="relative py-28 md:py-44">
      <div className="shell">
        <SectionLabel index="002" title="The story" />

        <RevealText
          as="h2"
          id="story-title"
          split="words"
          className="display mt-10 max-w-[14ch] text-mega uppercase md:mt-14"
        >
          {home.storyHeading}
        </RevealText>

        <div className="mt-16 grid gap-y-14 md:mt-24 md:grid-cols-12 md:gap-x-[var(--gutter)]">
          {/* tall portrait, offset left */}
          <div className="md:col-span-5 md:col-start-1">
            <RevealMask className="aspect-[4/5] w-full md:aspect-[3/4]" parallax={6}>
              <Picture image={portrait} sizes="(min-width: 768px) 40vw, 100vw" />
            </RevealMask>
            <p className="label mt-4 flex justify-between">
              <span>FR.002/A</span>
              <span>Stillness</span>
            </p>
          </div>

          {/* narrative + second image */}
          <div className="flex flex-col justify-between gap-14 md:col-span-6 md:col-start-7">
            <ScrubWords text={home.storyBody} className="text-[clamp(1.35rem,2.1vw,2.1rem)] leading-[1.3] text-paper" />

            <div>
              <Parallax speed={14}>
                <RevealMask className="aspect-[16/10] w-full md:w-[88%] md:ml-auto" direction="left">
                  <Picture image={landscape} sizes="(min-width: 768px) 45vw, 100vw" />
                </RevealMask>
              </Parallax>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 md:ml-auto md:w-[88%]">
                <p className="label max-w-[22rem]">Wedding films · Reels · Brand stories · Corporate · Events · Travel</p>
                <ButtonLink href="/about" variant="outline">
                  Our approach
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
