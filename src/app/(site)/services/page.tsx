import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/sections/PageIntro";
import { ServiceChapter } from "@/components/services/ServiceChapter";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = pageMetadata({
  title: "Services — Wedding Shoots, Cinematic Reels, Brand & Corporate Films",
  description:
    "Professional wedding shoots, wedding cinematic reels, brand and promotional films, corporate and business meeting shoots, event coverage, travel and lifestyle reels and social media content across Maharashtra.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageIntro
        index="001"
        label="Services"
        title={
          <>
            What we <em>make.</em>
          </>
        }
        intro="Eight crafts, one standard. Whether it's a wedding, a brand or a boardroom, every production is planned, shot and finished with cinematic care."
        aside={
          <nav aria-label="Services on this page">
            <ol className="label space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`#${s.slug}`} className="flex gap-4 text-mute hover:text-paper">
                    <span className="text-lime">{s.number}</span> {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        }
      />
      {services.map((s, i) => (
        <ServiceChapter key={s.id} service={s} variant={(i % 3) as 0 | 1 | 2} />
      ))}
      <ContactCTA index="009" />
    </>
  );
}
