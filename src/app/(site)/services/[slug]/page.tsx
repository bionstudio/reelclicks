import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjects, getServiceBySlug, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceChapter } from "@/components/services/ServiceChapter";
import { WorkGrid } from "@/components/portfolio/WorkGrid";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return { title: "Service not found" };
  return pageMetadata({
    title: `${s.title} in Maharashtra`,
    description: `${s.tagline} ${s.description[0] ?? ""}`.slice(0, 160),
    path: `/services/${s.slug}`,
    image: s.image,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, services, projects] = await Promise.all([getServiceBySlug(slug), getServices(), getProjects()]);
  if (!service) notFound();

  const related = service.relatedCategory ? projects.filter((p) => p.category === service.relatedCategory).slice(0, 4) : [];
  const idx = services.findIndex((s) => s.slug === service.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
      <div className="shell pt-[calc(var(--header-h)+3rem)]">
        <Link href="/services" className="label inline-flex items-center gap-2 text-paper hover:text-lime">
          <ArrowLeft size={14} /> All services
        </Link>
      </div>

      {/* h1 for the page; the chapter provides the visual title */}
      <h1 className="sr-only">{service.title} — REELCLICKS.IN</h1>
      <ServiceChapter service={service} variant={0} />

      {related.length > 0 && (
        <section data-section="Related films" aria-labelledby="related-title" className="border-t border-line py-24 md:py-32">
          <div className="shell">
            <SectionLabel index="002" title="Related films" />
            <h2 id="related-title" className="display mb-16 mt-8 text-big">
              Recent {service.shortTitle.toLowerCase()} work
            </h2>
            <WorkGrid projects={related} showFilters={false} />
          </div>
        </section>
      )}

      {next && next.slug !== service.slug && (
        <section aria-label="Next service" className="border-t border-line">
          <Link href={`/services/${next.slug}`} className="group shell flex items-end justify-between gap-8 py-20 md:py-28">
            <span>
              <span className="label block">Next — {next.number}</span>
              <span className="display mt-6 block text-giant leading-none transition-colors duration-500 group-hover:text-lime">
                {next.shortTitle}
              </span>
            </span>
            <span className="mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-lime md:h-24 md:w-24">
              <ArrowUpRight strokeWidth={1.25} />
            </span>
          </Link>
        </section>
      )}

      <ContactCTA index="003" context={service.title.toLowerCase()} />
    </>
  );
}
