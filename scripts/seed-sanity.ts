/**
 * Builds seed/reelclicks.ndjson from the bundled sample content so a fresh
 * Sanity dataset starts with the same structure the site ships with.
 *
 *   npm run seed:build
 *   npx sanity dataset import seed/reelclicks.ndjson production
 *
 * Images are referenced with `_sanityAsset: "image@file://…"` — the Sanity CLI
 * uploads them during import. Sample projects keep `isSample: true` so they are
 * clearly labelled on the site until replaced. Videos stay as URLs; replace them
 * with Cloudinary links once real footage is uploaded.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { sampleHome, sampleProjects, sampleServices, sampleShowreel, sampleTeam } from "@/lib/content/sample-data";
import { SITE_URL } from "@/lib/site";
import type { MediaImage } from "@/types/content";

const ROOT = path.resolve(__dirname, "..");

const image = (img?: MediaImage) =>
  img && {
    _type: "image",
    _sanityAsset: `image@${pathToFileURL(path.join(ROOT, "public", img.src)).href}`,
    alt: img.alt,
  };

/** Local demo videos must be publicly reachable for the CMS; point them at the deployed site. */
const videoUrl = (src?: string) => (src ? (src.startsWith("http") ? src : `${SITE_URL}${src}`) : undefined);

const key = (i: number) => `k${i.toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const docs: Record<string, unknown>[] = [];

sampleProjects.forEach((p) =>
  docs.push({
    _id: p.id,
    _type: "project",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    category: p.category,
    summary: p.summary,
    description: p.description.join("\n\n"),
    date: p.date,
    cover: image(p.cover),
    videoUrl: videoUrl(p.video?.src),
    gallery: p.gallery.map((g, i) => ({ ...image(g), _key: key(i) })),
    orientation: p.orientation,
    featured: p.featured,
    order: p.order,
    hidden: false,
    isSample: true,
  }),
);

sampleServices.forEach((s) =>
  docs.push({
    _id: s.id,
    _type: "service",
    title: s.title,
    shortTitle: s.shortTitle,
    slug: { _type: "slug", current: s.slug },
    tagline: s.tagline,
    description: s.description.join("\n\n"),
    included: s.included,
    audience: s.audience,
    image: image(s.image),
    secondaryImage: image(s.secondaryImage),
    relatedCategory: s.relatedCategory,
    order: s.order,
  }),
);

sampleTeam.forEach((t) =>
  docs.push({
    _id: t.id,
    _type: "teamMember",
    name: t.name,
    role: t.role,
    intro: t.intro,
    phone: t.phone,
    whatsapp: t.whatsapp,
    email: t.email,
    order: t.order,
  }),
);

docs.push({
  _id: "homePage",
  _type: "homePage",
  heroHeadingLines: sampleHome.heroHeadingLines,
  heroAccentLine: sampleHome.heroAccentLine,
  heroSupporting: sampleHome.heroSupporting,
  primaryCtaLabel: sampleHome.primaryCtaLabel,
  secondaryCtaLabel: sampleHome.secondaryCtaLabel,
  heroVideoUrl: videoUrl(sampleHome.heroVideo.src),
  heroVideoMobileUrl: videoUrl(sampleHome.heroVideo.mobileSrc),
  heroPoster: image(sampleHome.heroPoster),
  storyHeading: sampleHome.storyHeading,
  storyBody: sampleHome.storyBody,
  storyImages: sampleHome.storyImages.map((g, i) => ({ ...image(g), _key: key(i) })),
});

docs.push({
  _id: "showreel",
  _type: "showreel",
  title: sampleShowreel.title,
  year: sampleShowreel.year,
  duration: sampleShowreel.duration,
  videoUrl: videoUrl(sampleShowreel.video.src),
  poster: image(sampleShowreel.poster),
});

const clean = (o: unknown): unknown =>
  Array.isArray(o)
    ? o.map(clean)
    : o && typeof o === "object"
      ? Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => [k, clean(v)]))
      : o;

mkdirSync(path.join(ROOT, "seed"), { recursive: true });
const file = path.join(ROOT, "seed", "reelclicks.ndjson");
writeFileSync(file, docs.map((d) => JSON.stringify(clean(d))).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents → ${path.relative(ROOT, file)}`);
