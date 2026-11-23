import Image from "next/image";
import type { MediaImage } from "@/types/content";
import { cn } from "@/lib/utils/cn";

/**
 * Optimised, layout-shift-free image. `fill` mode is used inside sized frames
 * (most editorial layouts); intrinsic mode preserves the image's own ratio.
 */
export function Picture({
  image,
  sizes,
  className,
  fill = true,
  preload = false,
  quality = 75,
  position,
}: {
  image: MediaImage;
  sizes: string;
  className?: string;
  fill?: boolean;
  preload?: boolean;
  quality?: 60 | 75 | 85;
  position?: string;
}) {
  const common = {
    src: image.src,
    alt: image.alt,
    sizes,
    quality,
    preload,
    placeholder: image.blurDataURL ? ("blur" as const) : ("empty" as const),
    blurDataURL: image.blurDataURL,
    style: position ? { objectPosition: position } : undefined,
  };
  return fill ? (
    <Image {...common} fill className={cn("object-cover", className)} />
  ) : (
    <Image {...common} width={image.width} height={image.height} className={cn("h-auto w-full", className)} />
  );
}
