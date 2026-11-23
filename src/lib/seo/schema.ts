import { SITE_URL, site } from "@/lib/site";
import type { Project, Service } from "@/types/content";

const ORG_ID = `${SITE_URL}/#organization`;

/** Organization + LocalBusiness (the agency operates from a known region with phone contacts). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: site.name,
        alternateName: "REELCLICKS",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        slogan: site.tagline,
        description: site.description,
        email: site.email,
        telephone: `+91${site.people.founder.phone}`,
        sameAs: [site.instagram.url],
        founder: { "@type": "Person", name: site.people.founder.name },
        employee: [{ "@type": "Person", name: site.people.ceo.name, jobTitle: "CEO" }],
        // No street address is published yet; add `address` here once the studio address is confirmed.
        areaServed: [
          { "@type": "State", name: "Maharashtra" },
          ...site.locations.map((l) => ({ "@type": "City", name: l })),
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: `+91${site.people.founder.phone}`,
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi", "Marathi"],
          },
          {
            "@type": "ContactPoint",
            telephone: `+91${site.people.ceo.phone}`,
            contactType: "sales",
            areaServed: "IN",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: site.name,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description.join(" "),
    serviceType: service.title,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "State", name: "Maharashtra" },
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image.src.startsWith("http") ? service.image.src : `${SITE_URL}${service.image.src}`,
  };
}

export function projectSchema(project: Project) {
  const thumb = project.cover.src.startsWith("http") ? project.cover.src : `${SITE_URL}${project.cover.src}`;
  const base = {
    "@context": "https://schema.org",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    creator: { "@id": ORG_ID },
    dateCreated: project.date,
  };
  if (project.video?.kind === "file") {
    return {
      ...base,
      "@type": "VideoObject",
      thumbnailUrl: thumb,
      uploadDate: project.date,
      contentUrl: project.video.src.startsWith("http") ? project.video.src : `${SITE_URL}${project.video.src}`,
    };
  }
  return { ...base, "@type": "CreativeWork", image: thumb };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
