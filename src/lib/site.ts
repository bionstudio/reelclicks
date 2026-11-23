/** Brand-level constants. Contact details here are the agency's own. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://reelclicks.in").replace(/\/$/, "");

export const site = {
  name: "REELCLICKS.IN",
  shortName: "REELCLICKS",
  tagline: "Turning Moments Into Memories.",
  concept: "Every frame has a story.",
  description:
    "REELCLICKS.IN is a cinematic reels and video production agency crafting wedding films, brand stories, corporate productions and premium social content across Maharashtra.",
  email: "huzefshaikh940@gmail.com",
  instagram: {
    handle: "@reel_clicks.in",
    url: "https://www.instagram.com/reel_clicks.in/",
  },
  locations: ["Nandgaon", "Manmad", "Nashik", "Malegaon"],
  coverage: "All over Maharashtra",
  people: {
    founder: { name: "Huzef Shaikh", role: "Founder", phone: "9112626278", whatsapp: "919112626278" },
    ceo: { name: "Adil Shaikh", role: "CEO", phone: "9922801923", whatsapp: "919922801923" },
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

export function telHref(phone: string) {
  return `tel:+91${phone.replace(/\D/g, "").slice(-10)}`;
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

/**
 * WhatsApp deep link with a meaningful, pre-filled enquiry. `context` lets each
 * CTA describe what the visitor was looking at (a service, a film, etc.).
 */
export function whatsappHref(number: string, context?: string) {
  const lines = [
    "Hi REELCLICKS.IN 👋",
    context
      ? `I'm interested in ${context} and would love to discuss my project.`
      : "I'd love to discuss a shoot with your team.",
    "",
    "Name: ",
    "Date of event / project: ",
    "Location: ",
    "A little about what we have in mind: ",
  ];
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function mailHref(subject = "Project enquiry — REELCLICKS.IN") {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
