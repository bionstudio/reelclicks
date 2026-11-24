import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, getProjects, getServices } from "@/lib/content";
import { categoryLabel } from "@/lib/utils/category";
import { formatProjectDate } from "@/lib/utils/cn";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, projectSchema } from "@/lib/seo/schema";
import { whatsappHref, site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { FadeIn, RevealMask } from "@/components/animations/Motion";
import { Picture } from "@/components/ui/Picture";
import { VideoPlayer } from "@/components/portfolio/VideoPlayer";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils/cn";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return { title: "Film not found" };
  return pageMetadata({
    title: `${p.title} — ${categoryLabel(p.category)}`,
    description: p.summary,
    path: `/work/${p.slug}`,
    image: p.cover,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, all, services] = await Promise.all([getProjectBySlug(slug), getProjects(), getServices()]);
  if (!project) notFound();

  const i = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(i + 1) % all.length] : null;
  const service = services.find((s) => s.relatedCategory === project.category);
  const portrait = project.orientation === "portrait";

  return (
    <article>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/${project.slug}` },
        ])}
      />

      <header data-section="The film" className="pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+6rem)]">
        <div className="shell">
          <Link href="/work" className="label inline-flex items-center gap-2 text-paper hover:text-lime">
            <ArrowLeft size={14} /> All work
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <SectionLabel index={String(i + 1).padStart(3, "0")} title={categoryLabel(project.category)} />
            {project.isSample && <span className="sample-badge">Sample project</span>}
          </div>
          <RevealText as="h1" split="words" trigger="intro" className="display mt-8 text-mega">
            {project.title}
          </RevealText>
        </div>

        <div className={cn("shell mt-12 md:mt-16", portrait && "md:flex md:justify-center")}>
          {project.video ? (
            <div className={portrait ? "mx-auto w-full max-w-[min(26rem,100%)]" : ""}>
              <VideoPlayer
                video={project.video}
                poster={project.cover}
                title={project.title}
                ratio={portrait ? "9 / 16" : "16 / 9"}
              />
            </div>
          ) : (
            <RevealMask className="aspect-video w-full">
              <Picture image={project.cover} sizes="100vw" preload />
            </RevealMask>
          )}
        </div>
      </header>

      <section data-section="Notes" aria-label="About this project" className="py-20 md:py-32">
        <div className="shell grid gap-14 md:grid-cols-12">
          <FadeIn className="md:col-span-4">
            <dl className="label grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:grid-cols-1">
              <div>
                <dt>Category</dt>
                <dd className="mt-1 text-paper">{categoryLabel(project.category)}</dd>
              </div>
              {project.client && (
                <div>
                  <dt>Client</dt>
                  <dd className="mt-1 text-paper">{project.client}</dd>
                </div>
              )}
              {project.location && (
                <div>
                  <dt>Location</dt>
                  <dd className="mt-1 text-paper">{project.location}</dd>
                </div>
              )}
              <div>
                <dt>Date</dt>
                <dd className="mt-1 text-paper">{formatProjectDate(project.date)}</dd>
              </div>
            </dl>
          </FadeIn>
          <div className="md:col-span-7 md:col-start-6">
            <RevealText as="p" className="display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
              {project.summary}
            </RevealText>
            <FadeIn className="mt-10 space-y-5 text-lg leading-relaxed text-mute">
              {project.description.map((para, k) => (
                <p key={k}>{para}</p>
              ))}
            </FadeIn>
            <div className="mt-12 flex flex-wrap gap-3">
              <ButtonLink
                href={whatsappHref(site.people.founder.whatsapp, `a film like "${project.title}"`)}
                variant="lime"
                icon={<WhatsAppIcon size={16} />}
              >
                I want a film like this
              </ButtonLink>
              {service && (
                <ButtonLink href={`/services/${service.slug}`} variant="outline">
                  {service.shortTitle}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section data-section="Frames" aria-label="Stills" className="pb-24 md:pb-36">
          <div className="shell grid gap-[var(--gutter)] md:grid-cols-12">
            {project.gallery.map((g, k) => (
              <RevealMask
                key={g.src}
                className={cn(
                  "w-full",
                  k % 3 === 0 ? "aspect-[16/10] md:col-span-7" : k % 3 === 1 ? "aspect-[4/5] md:col-span-4 md:col-start-9 md:mt-[14vh]" : "aspect-[16/9] md:col-span-8 md:col-start-3",
                )}
              >
                <Picture image={g} sizes="(min-width: 768px) 60vw, 100vw" />
              </RevealMask>
            ))}
          </div>
        </section>
      )}

      {next && next.slug !== project.slug && (
        <section aria-label="Next film" className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group shell block py-20 md:py-28">
            <p className="label">Next film</p>
            <div className="mt-6 flex items-end justify-between gap-8">
              <p className="display text-giant leading-none transition-colors duration-500 group-hover:text-lime">
                {next.title}
              </p>
              <span className="mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-lime md:h-24 md:w-24">
                <ArrowUpRight strokeWidth={1.25} />
              </span>
            </div>
          </Link>
        </section>
      )}
    </article>
  );
}
