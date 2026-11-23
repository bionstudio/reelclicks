import type { Metadata } from "next";
import { SITE_URL, site } from "@/lib/site";

/** Builds unique, complete metadata (canonical, Open Graph, Twitter) for a page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { src: string; width?: number; height?: number; alt?: string };
}): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const images = image
    ? [{ url: image.src.startsWith("http") ? image.src : `${SITE_URL}${image.src}`, width: image.width, height: image.height, alt: image.alt }]
    : undefined; // falls back to the generated /opengraph-image
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} — ${site.name}`,
      description,
      siteName: site.name,
      locale: "en_IN",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
