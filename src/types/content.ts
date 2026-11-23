/**
 * Content models shared by the CMS (Sanity) adapter and the bundled sample
 * content. Every UI component consumes these types only — never raw CMS
 * documents — so the data source can change without touching the UI.
 */

export type MediaImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny base64 placeholder (Sanity provides this automatically). */
  blurDataURL?: string;
};

export type VideoKind = "file" | "youtube" | "vimeo";

export type MediaVideo = {
  /** MP4 / Cloudinary URL, or a YouTube / Vimeo page URL. */
  src: string;
  kind: VideoKind;
  /** Optional lighter rendition for small screens / slow networks. */
  mobileSrc?: string;
};

export const PROJECT_CATEGORIES = [
  { value: "weddings", label: "Weddings" },
  { value: "wedding-reels", label: "Wedding Cinematic Reels" },
  { value: "brand", label: "Brand & Promotional Films" },
  { value: "corporate", label: "Corporate Productions" },
  { value: "events", label: "Events" },
  { value: "travel-lifestyle", label: "Travel & Lifestyle" },
  { value: "social", label: "Social Media Content" },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];

export type Orientation = "landscape" | "portrait";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  client?: string;
  location?: string;
  summary: string;
  description: string[];
  cover: MediaImage;
  video?: MediaVideo;
  gallery: MediaImage[];
  date: string; // ISO date
  featured: boolean;
  order: number;
  orientation: Orientation;
  /** True for demo/placeholder work that must be replaced with real projects. */
  isSample: boolean;
};

export type Service = {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string[];
  included: string[];
  audience: string[];
  image: MediaImage;
  secondaryImage?: MediaImage;
  relatedCategory?: ProjectCategory;
  order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  intro: string;
  bio?: string[];
  phone: string;
  whatsapp: string;
  email?: string;
  portrait?: MediaImage;
  order: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context?: string; // e.g. "Wedding film, Nashik"
  date?: string;
};

export type Showreel = {
  title: string;
  year: string;
  duration?: string;
  video: MediaVideo;
  poster: MediaImage;
  isSample: boolean;
};

export type HomeContent = {
  heroHeadingLines: string[];
  heroAccentLine: string;
  heroSupporting: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroVideo: MediaVideo;
  heroPoster: MediaImage;
  heroIsSample: boolean;
  storyHeading: string;
  storyBody: string;
  storyImages: [MediaImage, MediaImage];
};
