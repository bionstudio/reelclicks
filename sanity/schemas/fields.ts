import { defineField } from "sanity";

/** Image with required alt text (accessibility + SEO) and hotspot cropping. */
export const imageField = (name: string, title: string, opts: { required?: boolean; description?: string } = {}) =>
  defineField({
    name,
    title,
    type: "image",
    description: opts.description,
    options: { hotspot: true, metadata: ["lqip", "palette"] },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        description: "Describe what is in the image for screen readers and search engines.",
        validation: (r) => r.required().warning("Alt text is important for accessibility and SEO."),
      }),
    ],
    validation: opts.required ? (r) => r.required() : undefined,
  });

const VIDEO_URL = /^https:\/\/(res\.cloudinary\.com\/|(www\.)?youtube\.com\/|youtu\.be\/|(www\.|player\.)?vimeo\.com\/|.+\.(mp4|webm|m4v)(\?.*)?$)/i;

export const videoUrlField = (name: string, title: string, opts: { required?: boolean; description?: string } = {}) =>
  defineField({
    name,
    title,
    type: "url",
    description:
      opts.description ??
      "Recommended: upload to Cloudinary and paste the video URL (it is optimised automatically). YouTube and Vimeo links also work for the lightbox player.",
    validation: (r) => {
      const rule = r.uri({ scheme: ["https"] }).custom((v) => {
        if (!v) return true;
        return VIDEO_URL.test(String(v)) || "Use a Cloudinary, YouTube, Vimeo or direct .mp4/.webm URL";
      });
      return opts.required ? rule.required() : rule;
    },
  });

export const phoneField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description: "10-digit Indian mobile number, e.g. 9112626278",
    validation: (r) => r.required().regex(/^\d{10}$/, { name: "10-digit mobile number" }),
  });
