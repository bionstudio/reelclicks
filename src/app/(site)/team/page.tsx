import type { Metadata } from "next";
import { getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/sections/PageIntro";
import { TeamGrid } from "@/components/sections/TeamSection";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = pageMetadata({
  title: "Team — Huzef Shaikh & Adil Shaikh",
  description:
    "Meet the people behind REELCLICKS.IN: Founder Huzef Shaikh and CEO Adil Shaikh. Call or WhatsApp them directly to plan your wedding film, reel or brand production.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Team", path: "/team" }])} />
      <PageIntro
        index="001"
        label="Team"
        title={
          <>
            The people behind <em className="text-gold-soft">the lens.</em>
          </>
        }
        intro="Talk to us directly — the people who plan your shoot are the people you speak to."
      />
      <section data-section="Founders" aria-label="Team members" className="pb-28 md:pb-40">
        <div className="shell">
          <TeamGrid team={team} headingLevel="h2" />
        </div>
      </section>
      <ContactCTA index="002" />
    </>
  );
}
