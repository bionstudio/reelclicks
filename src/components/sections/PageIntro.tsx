import type { ReactNode } from "react";
import type { MediaImage } from "@/types/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { RevealMask } from "@/components/animations/Motion";
import { Picture } from "@/components/ui/Picture";
import { FadeIn } from "@/components/animations/Motion";

/** Opening title card for inner pages. */
export function PageIntro({
  index,
  label,
  title,
  intro,
  image,
  aside,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: MediaImage;
  aside?: ReactNode;
}) {
  return (
    <header data-section={label} className="relative pb-16 pt-[calc(var(--header-h)+5rem)] md:pb-24 md:pt-[calc(var(--header-h)+8rem)]">
      <div className="shell">
        <SectionLabel index={index} title={label} />
        <RevealText as="h1" split="words" trigger="intro" className="display mt-10 max-w-[18ch] text-mega md:mt-14">
          {title}
        </RevealText>
        {(intro || aside) && (
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
            {intro && (
              <FadeIn className="text-lead leading-snug text-paper/80 md:col-span-6" delay={0.3}>
                {intro}
              </FadeIn>
            )}
            {aside && <div className="md:col-span-4 md:col-start-9">{aside}</div>}
          </div>
        )}
      </div>
      {image && (
        <div className="shell mt-16 md:mt-24">
          <RevealMask className="aspect-[4/5] w-full sm:aspect-[16/9] md:aspect-[21/9]" parallax={8}>
            <Picture image={image} sizes="100vw" preload />
          </RevealMask>
        </div>
      )}
    </header>
  );
}
