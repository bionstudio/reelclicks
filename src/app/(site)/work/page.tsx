import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageIntro } from "@/components/sections/PageIntro";
import { WorkGrid } from "@/components/portfolio/WorkGrid";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Work — Wedding Films, Cinematic Reels & Brand Films",
  description:
    "Explore REELCLICKS.IN films: cinematic weddings, wedding reels, brand and promotional films, corporate productions, events, travel and social media content from across Maharashtra.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  const hasSamples = projects.some((p) => p.isSample);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <PageIntro
        index="001"
        label="The work"
        title={
          <>
            Every frame, <em>a story.</em>
          </>
        }
        intro="A selection of films across weddings, brands, corporate productions, events, travel and social content. Press play on any frame."
        aside={
          hasSamples ? (
            <p className="label border-l border-lime/40 pl-4 leading-relaxed">
              Films marked <span className="sample-badge mx-1">Sample</span> are demonstration pieces showing how projects are presented. Real REELCLICKS
              films are added through the Studio.
            </p>
          ) : undefined
        }
      />
      <section data-section="All films" aria-label="Portfolio" className="pb-28 md:pb-40">
        <div className="shell">
          <WorkGrid projects={projects} />
        </div>
      </section>
      <ContactCTA index="002" />
    </>
  );
}
