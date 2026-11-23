import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { img } from "@/lib/content/sample-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { FadeIn, RevealMask, ScrubWords } from "@/components/animations/Motion";
import { Picture } from "@/components/ui/Picture";
import { Coverage } from "@/components/sections/Coverage";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "About — A Cinematic Storytelling Studio from Maharashtra",
  description:
    "REELCLICKS.IN is a creative content and cinematic reels agency turning weddings, brands and events into visual stories — serving Nandgaon, Manmad, Nashik, Malegaon and all of Maharashtra.",
  path: "/about",
});

const approach = [
  { n: "01", t: "Listen", d: "Every project starts with a conversation — about the people, the occasion and the feeling you want to keep." },
  { n: "02", t: "Plan", d: "We scout, shape a shot list and plan the day so nothing important is left to chance." },
  { n: "03", t: "Shoot", d: "A calm, unobtrusive crew that reads the room and captures moments as they truly unfold." },
  { n: "04", t: "Craft", d: "Editing, sound and colour grading that turn hours of footage into a story with rhythm and emotion." },
  { n: "05", t: "Deliver", d: "Films and reels delivered in the formats you need — ready for the big screen and the small one." },
];

// Placeholder stills (replace in src/lib/content/sample-data.ts or via the Studio-driven pages)
const heroImage = img("cinema-rig", "A cinema camera rig on set in a dimly lit room");
const philosophyA = img("camera-operator", "A camera operator lining up a shot under blue light");
const philosophyB = img("edit-timeline", "A film being edited on a colour-graded timeline");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageIntro
        index="001"
        label="About"
        title={
          <>
            We turn visions into <em className="text-gold-soft">visual stories.</em>
          </>
        }
        intro="REELCLICKS.IN is a creative content and cinematic reels agency. We produce wedding films, brand stories, corporate productions and premium social content for individuals, couples, businesses, brands and event organisers."
        image={heroImage}
      />

      {/* Philosophy */}
      <section data-section="Philosophy" aria-labelledby="philosophy-title" className="py-24 md:py-40">
        <div className="shell grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="002" title="Philosophy" />
            <RevealText as="h2" id="philosophy-title" className="display mt-10 text-big uppercase">
              More than <em className="text-gold-soft">documentation.</em>
            </RevealText>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ScrubWords
              className="text-[clamp(1.35rem,2vw,2rem)] leading-[1.3]"
              text="We believe every moment deserves more than just documentation. Through creative vision, cinematic storytelling and thoughtful production, we transform ordinary moments into extraordinary visual experiences."
            />
          </div>
        </div>

        <div className="shell mt-20 grid gap-[var(--gutter)] md:mt-32 md:grid-cols-12">
          <RevealMask className="aspect-[4/5] md:col-span-4 md:col-start-2 md:aspect-[3/4]" parallax={6}>
            <Picture image={philosophyA} sizes="(min-width: 768px) 33vw, 100vw" />
          </RevealMask>
          <RevealMask className="aspect-[16/10] md:col-span-6 md:col-start-7 md:mt-[18vh]" direction="left" parallax={6}>
            <Picture image={philosophyB} sizes="(min-width: 768px) 50vw, 100vw" />
          </RevealMask>
        </div>
      </section>

      {/* Mission & vision */}
      <section data-section="Mission & vision" aria-label="Mission and vision" className="border-t border-line">
        <div className="shell grid md:grid-cols-2">
          {[
            {
              k: "Mission",
              h: "To give every story the care of cinema.",
              p: "Whether it's a wedding, a launch or a brand's first campaign, we bring the same craft — thoughtful planning, honest observation and a finish people are proud to share.",
            },
            {
              k: "Vision",
              h: "To be Maharashtra's most trusted name in cinematic storytelling.",
              p: "A studio people return to for the moments that matter most — and recommend to the people they care about.",
            },
          ].map((b, i) => (
            <FadeIn key={b.k} className={`py-16 md:py-24 ${i === 0 ? "md:border-r md:border-line md:pr-[var(--gutter)]" : "border-t border-line md:border-t-0 md:pl-[var(--gutter)]"}`}>
              <p className="label text-gold">{b.k}</p>
              <h2 className="display mt-6 text-[clamp(2rem,3.4vw,3.5rem)] leading-[1.02]">{b.h}</h2>
              <p className="mt-6 max-w-md text-mute">{b.p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section data-section="Approach" aria-labelledby="approach-title" className="border-t border-line py-24 md:py-36">
        <div className="shell">
          <SectionLabel index="004" title="Production approach" />
          <RevealText as="h2" id="approach-title" className="display mt-10 text-giant uppercase">
            From first call
            <br />
            to <em className="text-gold-soft">final cut.</em>
          </RevealText>
          <FadeIn as="ol" className="mt-16 grid border-t border-line md:mt-24 md:grid-cols-5" selector="li" stagger={0.08}>
            {approach.map((s) => (
              <li key={s.n} className="border-b border-line py-8 md:border-b-0 md:border-r md:px-6 md:py-10 md:first:pl-0 md:last:border-r-0">
                <p className="label text-gold">{s.n}</p>
                <h3 className="display mt-6 text-4xl">{s.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{s.d}</p>
              </li>
            ))}
          </FadeIn>
          <div className="mt-16 flex flex-wrap gap-3">
            <ButtonLink href="/services">Explore services</ButtonLink>
            <ButtonLink href="/team" variant="outline">
              Meet the team
            </ButtonLink>
          </div>
        </div>
      </section>

      <Coverage index="005" />
      <ContactCTA index="006" />
    </>
  );
}
