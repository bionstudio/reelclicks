import { defineField, defineType, defineArrayMember } from "sanity";
import { PROJECT_CATEGORIES } from "../../src/types/content";
import { imageField, videoUrlField } from "./fields";

export const project = defineType({
  name: "project",
  title: "Portfolio project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "settings", title: "Display settings" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required().max(80) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "content",
      options: { list: PROJECT_CATEGORIES.map((c) => ({ title: c.label, value: c.value })), layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "client",
      title: "Client name (optional)",
      type: "string",
      group: "content",
      description: "Only add a client name with their permission.",
    }),
    defineField({ name: "location", type: "string", group: "content", description: "e.g. Nashik, Maharashtra" }),
    defineField({
      name: "summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "One or two sentences shown on cards and in search results.",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "description",
      title: "Project description",
      type: "text",
      rows: 8,
      group: "content",
      description: "Separate paragraphs with a blank line.",
    }),
    defineField({ name: "date", title: "Project date", type: "date", group: "content", validation: (r) => r.required() }),
    {
      ...imageField("cover", "Cover image", { required: true, description: "High-quality still from the film. Used as the poster." }),
      group: "media",
    },
    { ...videoUrlField("videoUrl", "Video URL"), group: "media" },
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true, metadata: ["lqip"] },
          fields: [defineField({ name: "alt", type: "string", title: "Alternative text" })],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "orientation",
      type: "string",
      group: "settings",
      initialValue: "landscape",
      description: "Portrait suits 9:16 reels; landscape suits films.",
      options: {
        list: [
          { title: "Landscape (16:9)", value: "landscape" },
          { title: "Portrait (9:16 reel)", value: "portrait" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Featured projects appear on the homepage.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "settings",
      description: "Lower numbers appear first. You can also drag to reorder in the 'Portfolio' list.",
    }),
    defineField({
      name: "hidden",
      title: "Hide from website",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Temporarily unpublish without deleting. (Unpublishing from the document menu also works.)",
    }),
    defineField({
      name: "isSample",
      title: "Sample / demo project",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Marks demo content. Shows a 'Sample' label on the site. Delete these once real work is added.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", category: "category", media: "cover", featured: "featured", hidden: "hidden", sample: "isSample" },
    prepare({ title, category, media, featured, hidden, sample }) {
      const label = PROJECT_CATEGORIES.find((c) => c.value === category)?.label ?? category;
      const flags = [featured && "★ Featured", hidden && "Hidden", sample && "Sample"].filter(Boolean).join(" · ");
      return { title, subtitle: [label, flags].filter(Boolean).join(" — "), media };
    },
  },
});
