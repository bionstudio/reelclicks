import type { MediaVideo, VideoKind } from "@/types/content";
import { optimizeCloudinaryVideo } from "@/lib/cloudinary/video";

export function detectVideoKind(url: string): VideoKind {
  if (/youtu\.be|youtube\.com/i.test(url)) return "youtube";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  return "file";
}

export function toMediaVideo(src?: string | null, mobileSrc?: string | null): MediaVideo | undefined {
  if (!src) return undefined;
  const kind = detectVideoKind(src);
  return {
    src: kind === "file" ? optimizeCloudinaryVideo(src) : src,
    kind,
    mobileSrc: mobileSrc ? optimizeCloudinaryVideo(mobileSrc, { width: 960 }) : undefined,
  };
}

/** Converts a YouTube / Vimeo page URL into a privacy-friendly embed URL. */
export function embedUrl(video: MediaVideo): string | null {
  if (video.kind === "youtube") {
    const m = video.src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1` : null;
  }
  if (video.kind === "vimeo") {
    const m = video.src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1` : null;
  }
  return null;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
