import type { Metadata } from "next";
import { getFeaturedProjects, getHome, getProjects, getServices, getShowreel, getTeam, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { Hero } from "@/components/hero/Hero";
import { BrandStory } from "@/components/sections/BrandStory";
import { ShowreelSection } from "@/components/sections/ShowreelSection";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { ServicesIndex } from "@/components/services/ServicesIndex";
import { Coverage } from "@/components/sections/Coverage";
import { TeamGrid } from "@/components/sections/TeamSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Cinematic Wedding Films, Reels & Brand Production in Maharashtra",
    description: site.description,
    path: "/",
  }),
  title: { absolute: `${site.name} — Cinematic Wedding Films, Reels & Brand Production in Maharashtra` },
};

export default async function HomePage() {
  const [home, reel, featured, all, services, team, testimonials] = await Promise.all([
    getHome(),
    getShowreel(),
    getFeaturedProjects(5),
    getProjects(),
    getServices(),
    getTeam(),
    getTestimonials(),
  ]);

  const n = (i: number) => String(i).padStart(3, "0");
  const hasQuotes = testimonials.length > 0;

  return (
    <>
      <Hero home={home} />
      <BrandStory home={home} />
      <ShowreelSection reel={reel} />
      <SelectedWorks projects={featured} total={all.length} />

      <section data-section="Services" aria-labelledby="services-title" className="relative py-24 md:py-36">
        <div className="shell">
          <div className="mb-16 grid items-end gap-10 md:mb-24 md:grid-cols-12">
            <div className="md:col-span-7">
              <SectionLabel index="005" title="What we make" />
              <RevealText as="h2" id="services-title" className="display mt-10 text-giant uppercase">
                Eight ways
                <br />
                to tell a <em className="text-gold-soft">story.</em>
              </RevealText>
            </div>
            <p className="max-w-sm text-mute md:col-span-4 md:col-start-9">
              From the first look at a wedding to a brand&apos;s next campaign — every production gets the same cinematic care.
            </p>
          </div>
          <ServicesIndex services={services} />
        </div>
      </section>

      <Coverage index="006" />

      <section data-section="The team" aria-labelledby="team-title" className="relative py-24 md:py-36">
        <div className="shell">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-24">
            <div>
              <SectionLabel index="007" title="Behind the lens" />
              <RevealText as="h2" id="team-title" className="display mt-10 text-giant uppercase">
                The people
                <br />
                behind the <em className="text-gold-soft">lens.</em>
              </RevealText>
            </div>
            <ButtonLink href="/team" variant="outline">
              Meet the team
            </ButtonLink>
          </div>
          <TeamGrid team={team} />
        </div>
      </section>

      <Testimonials items={testimonials} index={n(8)} />
      <ContactCTA index={n(hasQuotes ? 9 : 8)} />
    </>
  );
}
