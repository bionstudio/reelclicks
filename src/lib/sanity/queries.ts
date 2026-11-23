import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
  "alt": coalesce(alt, ""),
  hotspot
}`;

const projectFields = /* groq */ `
  "id": _id,
  "slug": slug.current,
  title,
  category,
  client,
  location,
  summary,
  description,
  "cover": cover${imageFields},
  videoUrl,
  "gallery": gallery[]${imageFields},
  date,
  "featured": coalesce(featured, false),
  "order": coalesce(order, 999),
  "orientation": coalesce(orientation, "landscape"),
  "isSample": coalesce(isSample, false)
`;

/* Unpublished documents (drafts) are never returned with the "published" perspective. */
export const projectsQuery = defineQuery(
  `*[_type == "project" && defined(slug.current) && coalesce(hidden, false) == false] | order(order asc, date desc){${projectFields}}`,
);

export const projectBySlugQuery = defineQuery(
  `*[_type == "project" && slug.current == $slug && coalesce(hidden, false) == false][0]{${projectFields}}`,
);

export const servicesQuery = defineQuery(
  `*[_type == "service" && defined(slug.current)] | order(order asc){
    "id": _id, "slug": slug.current, title, shortTitle, tagline, description, included, audience,
    "image": image${imageFields}, "secondaryImage": secondaryImage${imageFields}, relatedCategory,
    "order": coalesce(order, 999)
  }`,
);

export const teamQuery = defineQuery(
  `*[_type == "teamMember"] | order(order asc){
    "id": _id, name, role, intro, bio, phone, whatsapp, email, "portrait": portrait${imageFields}, "order": coalesce(order, 999)
  }`,
);

export const testimonialsQuery = defineQuery(
  `*[_type == "testimonial" && verified == true] | order(coalesce(date, _createdAt) desc){
    "id": _id, quote, name, context, date
  }`,
);

export const homeQuery = defineQuery(
  `*[_type == "homePage" && _id == "homePage"][0]{
    heroHeadingLines, heroAccentLine, heroSupporting, primaryCtaLabel, secondaryCtaLabel,
    heroVideoUrl, heroVideoMobileUrl, "heroPoster": heroPoster${imageFields},
    storyHeading, storyBody, "storyImages": storyImages[]${imageFields}
  }`,
);

export const showreelQuery = defineQuery(
  `*[_type == "showreel" && _id == "showreel"][0]{
    title, year, duration, videoUrl, "poster": poster${imageFields}
  }`,
);
