import "server-only";
import { cache } from "react";
import type { HomeContent, Project, ProjectCategory, Service, Showreel, TeamMember, Testimonial } from "@/types/content";
import { PROJECT_CATEGORIES } from "@/types/content";
import { isSanityConfigured } from "@/lib/sanity/env";
import { sanityFetch } from "@/lib/sanity/client";
import { toMediaImage, type SanityImageResult } from "@/lib/sanity/image";
import {
  homeQuery,
  projectBySlugQuery,
  projectsQuery,
  servicesQuery,
  showreelQuery,
  teamQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";
import { toMediaVideo } from "@/lib/utils/video";
import { cloudinaryPoster } from "@/lib/cloudinary/video";
import { sampleHome, sampleProjects, sampleServices, sampleShowreel, sampleTeam, sampleTestimonials } from "./sample-data";

/**
 * Single content API for the whole site.
 * - Sanity configured  → reads published CMS content (cached, webhook-revalidated).
 * - Sanity not set up   → serves the bundled sample content so the site still runs.
 */

const paragraphs = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : typeof v === "string"
      ? v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
      : [];

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

const validCategory = (c: unknown): ProjectCategory =>
  (PROJECT_CATEGORIES.find((x) => x.value === c)?.value ?? "weddings") as ProjectCategory;

type RawProject = Record<string, unknown> & {
  cover?: SanityImageResult;
  gallery?: SanityImageResult[];
  videoUrl?: string;
};

function mapProject(p: RawProject): Project | null {
  const title = String(p.title ?? "");
  const cover = toMediaImage(p.cover, title);
  if (!p.slug || !title || !cover) return null;
  return {
    id: String(p.id),
    slug: String(p.slug),
    title,
    category: validCategory(p.category),
    client: (p.client as string) || undefined,
    location: (p.location as string) || undefined,
    summary: String(p.summary ?? ""),
    description: paragraphs(p.description),
    cover,
    video: toMediaVideo(p.videoUrl),
    gallery: (p.gallery ?? []).map((g) => toMediaImage(g, title)).filter((g): g is NonNullable<typeof g> => !!g),
    date: String(p.date ?? new Date().toISOString().slice(0, 10)),
    featured: Boolean(p.featured),
    order: Number(p.order ?? 999),
    orientation: p.orientation === "portrait" ? "portrait" : "landscape",
    isSample: Boolean(p.isSample),
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isSanityConfigured) return sampleProjects;
  const raw = await sanityFetch<RawProject[]>({ query: projectsQuery, tags: ["project"] });
  return raw.map(mapProject).filter((p): p is Project => !!p);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  if (!isSanityConfigured) return sampleProjects.find((p) => p.slug === slug) ?? null;
  const raw = await sanityFetch<RawProject | null>({ query: projectBySlugQuery, params: { slug }, tags: ["project"] });
  return raw ? mapProject(raw) : null;
});

export async function getFeaturedProjects(limit = 5) {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export const getServices = cache(async (): Promise<Service[]> => {
  if (!isSanityConfigured) return sampleServices;
  const raw = await sanityFetch<Array<Record<string, unknown>>>({ query: servicesQuery, tags: ["service"] });
  return raw
    .map((s, i): Service | null => {
      const title = String(s.title ?? "");
      const image = toMediaImage(s.image as SanityImageResult, title);
      if (!s.slug || !title || !image) return null;
      return {
        id: String(s.id),
        slug: String(s.slug),
        number: String(i + 1).padStart(2, "0"),
        title,
        shortTitle: String(s.shortTitle || title),
        tagline: String(s.tagline ?? ""),
        description: paragraphs(s.description),
        included: strings(s.included),
        audience: strings(s.audience),
        image,
        secondaryImage: toMediaImage(s.secondaryImage as SanityImageResult, title),
        relatedCategory: s.relatedCategory ? validCategory(s.relatedCategory) : undefined,
        order: Number(s.order ?? 999),
      };
    })
    .filter((s): s is Service => !!s);
});

export async function getServiceBySlug(slug: string) {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  if (!isSanityConfigured) return sampleTeam;
  const raw = await sanityFetch<Array<Record<string, unknown>>>({ query: teamQuery, tags: ["teamMember"] });
  return raw.map((t) => ({
    id: String(t.id),
    name: String(t.name ?? ""),
    role: String(t.role ?? ""),
    intro: String(t.intro ?? ""),
    bio: paragraphs(t.bio),
    phone: String(t.phone ?? ""),
    whatsapp: String(t.whatsapp ?? "").replace(/\D/g, ""),
    email: (t.email as string) || undefined,
    portrait: toMediaImage(t.portrait as SanityImageResult, `Portrait of ${t.name}`),
    order: Number(t.order ?? 999),
  }));
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!isSanityConfigured) return sampleTestimonials;
  return sanityFetch<Testimonial[]>({ query: testimonialsQuery, tags: ["testimonial"] });
});

export const getHome = cache(async (): Promise<HomeContent> => {
  if (!isSanityConfigured) return sampleHome;
  const h = await sanityFetch<Record<string, unknown> | null>({ query: homeQuery, tags: ["homePage"] });
  if (!h) return sampleHome;
  const heroVideo = toMediaVideo(h.heroVideoUrl as string, h.heroVideoMobileUrl as string);
  const poster =
    toMediaImage(h.heroPoster as SanityImageResult, "REELCLICKS.IN cinematic hero") ??
    (heroVideo && cloudinaryPoster(heroVideo.src)
      ? { src: cloudinaryPoster(heroVideo.src)!, width: 1920, height: 1080, alt: "REELCLICKS.IN cinematic hero" }
      : sampleHome.heroPoster);
  const storyImgs = ((h.storyImages as SanityImageResult[]) ?? []).map((i) => toMediaImage(i)).filter(Boolean);
  const lines = strings(h.heroHeadingLines);
  return {
    heroHeadingLines: lines.length ? lines : sampleHome.heroHeadingLines,
    heroAccentLine: String(h.heroAccentLine || sampleHome.heroAccentLine),
    heroSupporting: String(h.heroSupporting || sampleHome.heroSupporting),
    primaryCtaLabel: String(h.primaryCtaLabel || sampleHome.primaryCtaLabel),
    secondaryCtaLabel: String(h.secondaryCtaLabel || sampleHome.secondaryCtaLabel),
    heroVideo: heroVideo ?? sampleHome.heroVideo,
    heroPoster: poster,
    heroIsSample: !heroVideo,
    storyHeading: String(h.storyHeading || sampleHome.storyHeading),
    storyBody: String(h.storyBody || sampleHome.storyBody),
    storyImages:
      storyImgs.length >= 2 ? [storyImgs[0]!, storyImgs[1]!] : sampleHome.storyImages,
  };
});

export const getShowreel = cache(async (): Promise<Showreel> => {
  if (!isSanityConfigured) return sampleShowreel;
  const s = await sanityFetch<Record<string, unknown> | null>({ query: showreelQuery, tags: ["showreel"] });
  const video = toMediaVideo(s?.videoUrl as string);
  if (!s || !video) return sampleShowreel;
  const poster =
    toMediaImage(s.poster as SanityImageResult, "REELCLICKS.IN showreel") ??
    (cloudinaryPoster(video.src)
      ? { src: cloudinaryPoster(video.src)!, width: 1920, height: 1080, alt: "REELCLICKS.IN showreel" }
      : sampleShowreel.poster);
  return {
    title: String(s.title || "Showreel"),
    year: String(s.year || new Date().getFullYear()),
    duration: (s.duration as string) || undefined,
    video,
    poster,
    isSample: false,
  };
});

export { categoryLabel } from "@/lib/utils/category";
