import { defineArrayMember, defineField, defineType } from "sanity";
import { PROJECT_CATEGORIES } from "../../src/types/content";
import { imageField, phoneField, videoUrlField } from "./fields";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "shortTitle", title: "Short title", type: "string", description: "Used in menus and the footer." }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", validation: (r) => r.max(120) }),
    defineField({
      name: "description",
      type: "text",
      rows: 6,
      description: "Separate paragraphs with a blank line.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "included", title: "What's included", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "audience", title: "Suitable for", type: "array", of: [defineArrayMember({ type: "string" })] }),
    imageField("image", "Main image", { required: true }),
    imageField("secondaryImage", "Secondary image"),
    defineField({
      name: "relatedCategory",
      title: "Related portfolio category",
      type: "string",
      options: { list: PROJECT_CATEGORIES.map((c) => ({ title: c.label, value: c.value })) },
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tagline", media: "image" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Short introduction", type: "text", rows: 3 }),
    defineField({
      name: "bio",
      title: "Biography (optional)",
      type: "text",
      rows: 6,
      description: "Only include verified facts. Separate paragraphs with a blank line.",
    }),
    phoneField("phone", "Phone"),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      description: "Country code + number, digits only, e.g. 919112626278",
      validation: (r) => r.required().regex(/^\d{11,13}$/, { name: "WhatsApp number with country code" }),
    }),
    defineField({ name: "email", type: "string", validation: (r) => r.email() }),
    imageField("portrait", "Portrait"),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "portrait" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Client name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "context", type: "string", description: "e.g. Wedding film, Nashik" }),
    defineField({ name: "date", type: "date" }),
    defineField({
      name: "verified",
      title: "Verified and approved for publishing",
      type: "boolean",
      initialValue: false,
      description: "Only verified testimonials, with the client's permission, are shown on the website.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote", verified: "verified" },
    prepare: ({ title, subtitle, verified }) => ({ title: `${verified ? "✓" : "○"} ${title}`, subtitle }),
  },
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Brand story" },
  ],
  fields: [
    defineField({
      name: "heroHeadingLines",
      title: "Hero heading lines",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      description: "Each entry is shown on its own line. Default: \"We don't just\" / \"capture moments.\"",
      validation: (r) => r.max(4),
    }),
    defineField({ name: "heroAccentLine", title: "Hero accent line", type: "string", group: "hero", description: "Shown in italic gold, e.g. \"We make them timeless.\"" }),
    defineField({ name: "heroSupporting", title: "Supporting text", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "primaryCtaLabel", title: "Primary button label", type: "string", group: "hero" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary button label", type: "string", group: "hero" }),
    { ...videoUrlField("heroVideoUrl", "Hero background video", { description: "Cloudinary or .mp4 URL. Keep it short (10–25s), silent and loopable." }), group: "hero" },
    { ...videoUrlField("heroVideoMobileUrl", "Hero video — mobile version (optional)", { description: "A lighter or vertical cut for phones." }), group: "hero" },
    { ...imageField("heroPoster", "Hero poster image", { description: "Shown while the video loads and when video is unavailable." }), group: "hero" },
    defineField({ name: "storyHeading", title: "Story heading", type: "string", group: "story" }),
    defineField({ name: "storyBody", title: "Story text", type: "text", rows: 4, group: "story" }),
    defineField({
      name: "storyImages",
      title: "Story images (2)",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true, metadata: ["lqip"] },
          fields: [defineField({ name: "alt", type: "string", title: "Alternative text" })],
        }),
      ],
      validation: (r) => r.max(2),
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const showreel = defineType({
  name: "showreel",
  title: "Showreel",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "Showreel" }),
    defineField({ name: "year", type: "string", initialValue: String(new Date().getFullYear()) }),
    defineField({ name: "duration", type: "string", description: "e.g. 01:45" }),
    videoUrlField("videoUrl", "Showreel video", { required: true }),
    imageField("poster", "Poster image"),
  ],
  preview: { select: { title: "title", subtitle: "year", media: "poster" } },
});

export const schemaTypes = [
  // project is imported separately to keep the file readable
  service,
  teamMember,
  testimonial,
  homePage,
  showreel,
];
