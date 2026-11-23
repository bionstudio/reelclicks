import type { MediaImage } from "@/types/content";

export type SanityImageResult = {
  src?: string | null;
  width?: number | null;
  height?: number | null;
  lqip?: string | null;
  alt?: string | null;
} | null;

/**
 * Converts a projected Sanity image into the shared MediaImage shape.
 * Images are served from cdn.sanity.io and optimised by next/image; Sanity's
 * built-in LQIP is used as the blur placeholder.
 */
export function toMediaImage(img: SanityImageResult | undefined, fallbackAlt = ""): MediaImage | undefined {
  if (!img?.src || !img.width || !img.height) return undefined;
  return {
    src: `${img.src}?auto=format&fit=max`,
    width: img.width,
    height: img.height,
    alt: img.alt || fallbackAlt,
    blurDataURL: img.lqip || undefined,
  };
}
