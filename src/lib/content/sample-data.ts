/**
 * SAMPLE CONTENT — used automatically while Sanity is not configured, and
 * exported to Sanity by `npm run seed:sanity` as a starting point.
 *
 * ⚠️  Portfolio entries below are DEMO PROJECTS built from licensed stock
 *     photography. They are flagged `isSample: true` and render with a visible
 *     "Sample" marker. They are not REELCLICKS client work and must be replaced
 *     with real projects before launch.
 *
 * ⚠️  Testimonials are intentionally empty: only verified client feedback
 *     supplied by the agency may be published.
 */
import type { HomeContent, MediaImage, Project, Service, Showreel, TeamMember, Testimonial } from "@/types/content";
import { site } from "@/lib/site";
import { sampleMedia, type SampleMediaKey } from "./sample-media";

export function img(key: SampleMediaKey, alt: string): MediaImage {
  const m = sampleMedia[key];
  return { src: m.src, width: m.width, height: m.height, blurDataURL: m.blurDataURL, alt };
}

const v = (name: string) => ({
  src: `/videos/demo/${name}.mp4`,
  kind: "file" as const,
});

/* ───────────────────────────── Home ───────────────────────────── */

export const sampleHome: HomeContent = {
  heroHeadingLines: ["We don't just", "capture moments."],
  heroAccentLine: "We make them timeless.",
  heroSupporting: "Crafting cinematic stories for people, brands and unforgettable moments.",
  primaryCtaLabel: "Explore our work",
  secondaryCtaLabel: "Let's create together",
  heroVideo: { ...v("hero"), mobileSrc: "/videos/demo/hero-mobile.mp4" },
  heroPoster: img("bride-bouquet", "A bride holding a bouquet in soft, low window light"),
  heroIsSample: true,
  storyHeading: "Every frame has a story.",
  storyBody:
    "We believe every moment deserves more than just documentation. Through creative vision, cinematic storytelling and thoughtful production, we transform ordinary moments into extraordinary visual experiences.",
  storyImages: [
    img("bride-saree", "A bride in a red and gold saree photographed in natural light"),
    img("hands-shadow", "A couple holding hands, their shadows stretched across the grass"),
  ],
};

export const sampleShowreel: Showreel = {
  title: "Showreel",
  year: "2026",
  duration: "00:30",
  video: v("showreel"),
  poster: img("projector", "A film projector casting a beam of light through haze"),
  isSample: true,
};

/* ─────────────────────────── Portfolio ─────────────────────────── */

const projectBase = { isSample: true, featured: false, gallery: [] as MediaImage[] };

export const sampleProjects: Project[] = [
  {
    ...projectBase,
    id: "sample-mandap-hours",
    slug: "the-mandap-hours",
    title: "The Mandap Hours",
    category: "weddings",
    summary: "A wedding film shaped around the quiet minutes before the pheras.",
    description: [
      "Sample project. This entry demonstrates how a full wedding film is presented on the site: a long-form edit, a short teaser and a set of stills.",
      "Replace it with a real REELCLICKS wedding — add the film's video URL, a cover frame and a few lines about the couple's day from the Studio.",
    ],
    cover: img("mandap", "A decorated wedding mandap glowing under chandeliers"),
    video: v("mandap-hours"),
    gallery: [img("wedding-confetti", "Guests showering a couple with petals"), img("rings", "Close-up of a couple's hands and wedding rings")],
    date: "2026-02-14",
    featured: true,
    order: 1,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-veil-and-tide",
    slug: "veil-and-tide",
    title: "Veil & Tide",
    category: "wedding-reels",
    summary: "A vertical cinematic reel cut for Instagram, built around wind, water and a single veil.",
    description: [
      "Sample project. Demonstrates a vertical 9:16 wedding reel — the format most couples share first.",
      "Swap in a real reel from the Studio; the layout adapts automatically to portrait or landscape footage.",
    ],
    cover: img("bride-veil-shore", "A bride and groom on a pebble beach, her veil lifting in the wind"),
    video: v("veil-and-tide"),
    gallery: [img("couple-black-beach", "A couple embracing on a black sand beach under grey skies")],
    date: "2026-01-20",
    featured: true,
    order: 2,
    orientation: "portrait",
  },
  {
    ...projectBase,
    id: "sample-light-studies",
    slug: "light-studies",
    title: "Light Studies",
    category: "brand",
    summary: "A brand film concept exploring texture, glass and controlled studio light.",
    description: [
      "Sample project. Demonstrates a brand or product film presentation with a cinematic studio aesthetic.",
      "Replace it with a real brand film and, if the client agrees, credit them in the optional Client field.",
    ],
    cover: img("studio-lights", "A photography studio with softboxes and a seamless white backdrop"),
    video: v("light-studies"),
    gallery: [img("lenses", "Camera lenses on a dark surface"), img("camera-dark", "A cinema camera with a red-ringed lens in shadow")],
    date: "2025-11-08",
    featured: true,
    order: 3,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-golden-hour",
    slug: "golden-hour",
    title: "Golden Hour",
    category: "wedding-reels",
    summary: "A pre-wedding reel chasing the last twenty minutes of sunlight.",
    description: [
      "Sample project. Demonstrates a pre-wedding cinematic reel in vertical format.",
      "Replace it with a real pre-wedding or couple reel from the Studio.",
    ],
    cover: img("couple-walk", "A bride and groom walking hand in hand beneath palm trees"),
    video: v("golden-hour"),
    gallery: [img("couple-lake", "A couple embracing beside a lake in autumn light")],
    date: "2025-12-03",
    featured: true,
    order: 4,
    orientation: "portrait",
  },
  {
    ...projectBase,
    id: "sample-after-dark",
    slug: "after-dark",
    title: "After Dark",
    category: "events",
    summary: "Event coverage that keeps the energy of the room — light, crowd and confetti.",
    description: [
      "Sample project. Demonstrates event coverage: a fast highlight edit for social channels and a longer recap.",
      "Replace it with real event work — concerts, launches, celebrations or college festivals.",
    ],
    cover: img("concert", "Confetti falling over a crowd under stage lights"),
    video: v("after-dark"),
    gallery: [img("celebration", "A crowd celebrating as confetti cannons fire"), img("event-audience", "An audience seated in a dark auditorium")],
    date: "2025-10-18",
    featured: true,
    order: 5,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-boardroom",
    slug: "boardroom-unscripted",
    title: "Boardroom, Unscripted",
    category: "corporate",
    summary: "A corporate culture film built from real conversations rather than scripts.",
    description: [
      "Sample project. Demonstrates a corporate production: interviews, team moments and meeting coverage.",
      "Replace it with a real corporate or business-meeting shoot.",
    ],
    cover: img("boardroom", "A team gathered around a table in a creative workspace"),
    video: v("boardroom"),
    gallery: [img("meeting", "Colleagues collaborating around laptops and sticky notes"), img("conference", "A speaker presenting to a large audience")],
    date: "2025-09-05",
    featured: false,
    order: 6,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-saree-in-frame",
    slug: "saree-in-frame",
    title: "Saree in Frame",
    category: "social",
    summary: "Short-form fashion content designed for Reels: bold colour, clean cuts, fast hooks.",
    description: [
      "Sample project. Demonstrates social-first content for a fashion or retail brand.",
      "Replace it with a real Reels campaign — vertical video works best here.",
    ],
    cover: img("saree-portrait", "A woman in a silk saree posing against a red backdrop"),
    video: v("saree-in-frame"),
    gallery: [img("bride-saree", "A bride in a traditional red saree")],
    date: "2025-08-22",
    featured: false,
    order: 7,
    orientation: "portrait",
  },
  {
    ...projectBase,
    id: "sample-still-water",
    slug: "still-water",
    title: "Still Water",
    category: "travel-lifestyle",
    summary: "A slow travel film about mountains, water and unhurried mornings.",
    description: [
      "Sample project. Demonstrates a travel and lifestyle film with a calm, observational pace.",
      "Replace it with real travel or lifestyle work.",
    ],
    cover: img("lake-boat", "The bow of a wooden boat on a turquoise mountain lake"),
    video: v("still-water"),
    gallery: [img("mountains", "Mountain peaks rising above a sea of clouds"), img("valley", "A lone figure on a ridge above a misty green valley")],
    date: "2025-07-12",
    featured: false,
    order: 8,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-heritage-motion",
    slug: "heritage-in-motion",
    title: "Heritage in Motion",
    category: "travel-lifestyle",
    summary: "A vertical city reel tracing stone, sunsets and crowds at the Gateway of India.",
    description: [
      "Sample project. Demonstrates a vertical travel reel for tourism or hospitality clients.",
      "Replace it with real footage from shoots across Maharashtra.",
    ],
    cover: img("gateway-mumbai", "The Gateway of India in Mumbai under a pink and violet sunset"),
    video: v("heritage-motion"),
    gallery: [img("hawa-mahal", "A historic pink sandstone palace facade with horse carriages in front")],
    date: "2025-06-28",
    featured: false,
    order: 9,
    orientation: "portrait",
  },
  {
    ...projectBase,
    id: "sample-monochrome-vows",
    slug: "monochrome-vows",
    title: "Monochrome Vows",
    category: "weddings",
    summary: "A black-and-white wedding edit where texture and emotion carry the story.",
    description: [
      "Sample project. Demonstrates a stylised wedding film with a monochrome grade.",
      "Replace it with a real wedding film.",
    ],
    cover: img("bw-kiss", "A black and white photograph of a bride and groom kissing, her veil in the wind"),
    video: v("monochrome-vows"),
    gallery: [img("reception", "A long reception table dressed with flowers and glassware")],
    date: "2025-05-10",
    featured: false,
    order: 10,
    orientation: "landscape",
  },
  {
    ...projectBase,
    id: "sample-behind-the-lens",
    slug: "behind-the-lens",
    title: "Behind the Lens",
    category: "brand",
    summary: "A behind-the-scenes piece showing how a production day comes together.",
    description: [
      "Sample project. Demonstrates a behind-the-scenes / process film — useful for brand and agency storytelling.",
      "Replace it with real BTS footage from a REELCLICKS shoot.",
    ],
    cover: img("camera-operator", "A camera operator framing a shot under blue light"),
    video: v("behind-the-lens"),
    gallery: [img("clapper", "A clapperboard held up against a desert sky"), img("edit-timeline", "A video editing timeline on a monitor")],
    date: "2025-04-02",
    featured: false,
    order: 11,
    orientation: "landscape",
  },
];

/* ──────────────────────────── Services ──────────────────────────── */
/* Draft copy — the agency should confirm "what's included" in the Studio. */

export const sampleServices: Service[] = [
  {
    id: "svc-wedding-shoots",
    slug: "wedding-shoots",
    number: "01",
    title: "Professional Wedding Shoots",
    shortTitle: "Wedding Shoots",
    tagline: "The whole day, told honestly and beautifully.",
    description: [
      "From haldi to vidaai, we document your wedding the way it actually felt — the rituals, the people and the in-between moments nobody planned.",
      "Our crew works quietly and respectfully around your families and ceremonies, so you can stay present while we take care of the story.",
    ],
    included: [
      "Pre-wedding consultation and shot planning",
      "Candid and traditional photography",
      "Cinematic coverage of key ceremonies",
      "Professionally colour-graded edits",
      "Online delivery of final films and photographs",
    ],
    audience: ["Couples planning their wedding", "Families organising ceremonies", "Wedding planners and decorators"],
    image: img("mandap", "A decorated wedding mandap glowing under chandeliers"),
    secondaryImage: img("rings", "Close-up of a couple's hands and wedding rings"),
    relatedCategory: "weddings",
    order: 1,
  },
  {
    id: "svc-wedding-reels",
    slug: "wedding-cinematic-reels",
    number: "02",
    title: "Wedding Cinematic Reels",
    shortTitle: "Cinematic Reels",
    tagline: "Your day, cut for the feed — with the feeling of a film.",
    description: [
      "Short, emotive wedding reels designed for Instagram and WhatsApp: vertical framing, music-led editing and a cinematic grade.",
      "Perfect on their own for intimate celebrations, or alongside a full wedding film.",
    ],
    included: [
      "Vertical 9:16 reels made for Instagram",
      "Music-led, story-driven editing",
      "Cinematic colour grading",
      "Quick-turnaround teaser option",
    ],
    audience: ["Couples who want shareable highlights", "Pre-wedding and engagement shoots", "Intimate ceremonies"],
    image: img("bride-veil-shore", "A bride and groom on a pebble beach, her veil lifting in the wind"),
    secondaryImage: img("couple-walk", "A bride and groom walking hand in hand"),
    relatedCategory: "wedding-reels",
    order: 2,
  },
  {
    id: "svc-brand",
    slug: "brand-promotional-shoots",
    number: "03",
    title: "Brand & Promotional Shoots",
    shortTitle: "Brand Films",
    tagline: "Content that makes people stop, look and remember.",
    description: [
      "Brand films, product videos and promotional campaigns that translate what makes your business different into pictures people remember.",
      "We help shape the idea, plan the shoot and deliver edits sized for every platform you use.",
    ],
    included: [
      "Creative concept and shot list",
      "On-location or studio production",
      "Product and lifestyle footage",
      "Edits for web, Reels and ads",
    ],
    audience: ["Local businesses and retailers", "Restaurants, cafés and hospitality", "Product launches and new brands"],
    image: img("studio-lights", "A studio set with softboxes and a seamless backdrop"),
    secondaryImage: img("lenses", "Camera lenses on a dark surface"),
    relatedCategory: "brand",
    order: 3,
  },
  {
    id: "svc-corporate",
    slug: "corporate-business-shoots",
    number: "04",
    title: "Corporate & Business Shoots",
    shortTitle: "Corporate",
    tagline: "Professional films that build trust.",
    description: [
      "Company profiles, founder stories, team culture and facility films — produced with the polish your organisation deserves.",
      "We keep the process efficient and unobtrusive, so production fits around the working day.",
    ],
    included: [
      "Company profile and culture films",
      "Interview and testimonial filming",
      "Office, factory and facility coverage",
      "Edits for websites, presentations and social",
    ],
    audience: ["Companies and institutions", "Manufacturers and industrial units", "Schools, colleges and hospitals"],
    image: img("boardroom", "A team gathered in a creative workspace"),
    secondaryImage: img("conference", "A speaker presenting to a large audience"),
    relatedCategory: "corporate",
    order: 4,
  },
  {
    id: "svc-meetings",
    slug: "business-meeting-shoots",
    number: "05",
    title: "Business Meeting Shoots",
    shortTitle: "Meetings",
    tagline: "Every handshake and keynote, on record.",
    description: [
      "Discreet, professional coverage of business meetings, conferences, seminars and dealer meets.",
      "We capture the key moments, the speakers and the atmosphere — ready for internal records or public highlights.",
    ],
    included: [
      "Multi-angle coverage of talks and sessions",
      "Clean audio for presenters",
      "Highlight edit for social or internal use",
      "Event photography on request",
    ],
    audience: ["Corporate meetings and AGMs", "Dealer and distributor meets", "Seminars and conferences"],
    image: img("meeting", "Colleagues collaborating in a bright meeting room"),
    secondaryImage: img("event-audience", "An audience seated in a dark auditorium"),
    relatedCategory: "corporate",
    order: 5,
  },
  {
    id: "svc-events",
    slug: "event-shoots-coverage",
    number: "06",
    title: "Event Shoots & Coverage",
    shortTitle: "Events",
    tagline: "The energy of the room, kept forever.",
    description: [
      "Birthdays, anniversaries, launches, concerts and cultural celebrations — covered with the same cinematic care as a wedding.",
      "Fast highlight reels keep the excitement going online while the event is still fresh.",
    ],
    included: [
      "Full event videography and photography",
      "Same-week highlight reel option",
      "Stage, crowd and candid coverage",
      "Edits for social sharing",
    ],
    audience: ["Private celebrations", "Concerts and cultural events", "Launches and promotional events"],
    image: img("concert", "Confetti falling over a crowd under stage lights"),
    secondaryImage: img("celebration", "A crowd celebrating as confetti cannons fire"),
    relatedCategory: "events",
    order: 6,
  },
  {
    id: "svc-travel",
    slug: "travel-lifestyle-reels",
    number: "07",
    title: "Travel & Lifestyle Reels",
    shortTitle: "Travel & Lifestyle",
    tagline: "Places and people, told with a sense of wonder.",
    description: [
      "Travel films, destination reels and lifestyle content for creators, resorts, homestays and tourism brands.",
      "We look for the light, the texture and the human moments that make a place worth visiting.",
    ],
    included: ["Destination and property films", "Lifestyle and creator content", "Vertical reels for social", "Cinematic colour grading"],
    audience: ["Resorts, hotels and homestays", "Content creators and influencers", "Tourism and travel businesses"],
    image: img("lake-boat", "The bow of a wooden boat on a turquoise mountain lake"),
    secondaryImage: img("gateway-mumbai", "The Gateway of India under a pink sunset"),
    relatedCategory: "travel-lifestyle",
    order: 7,
  },
  {
    id: "svc-social",
    slug: "creative-social-media-content",
    number: "08",
    title: "Creative Social Media Content",
    shortTitle: "Social Content",
    tagline: "Thumb-stopping content, made consistently.",
    description: [
      "Reels, short-form ads and content batches built for the algorithm without losing your brand's voice.",
      "We plan, shoot and edit in batches so your feed stays fresh and consistent.",
    ],
    included: ["Content planning and hooks", "Batch shoots for multiple reels", "Trend-aware editing", "Captions-ready vertical exports"],
    audience: ["Brands growing on Instagram", "Shops, salons and studios", "Personal brands and creators"],
    image: img("saree-portrait", "A woman in a silk saree posing against a red backdrop"),
    secondaryImage: img("hands-camera", "Hands holding a camera ready to shoot"),
    relatedCategory: "social",
    order: 8,
  },
];

/* ─────────────────────────────── Team ─────────────────────────────── */
/* No biographies are invented: intros only state each person's role. */

export const sampleTeam: TeamMember[] = [
  {
    id: "team-huzef",
    name: site.people.founder.name,
    role: "Founder",
    intro: "Founder of REELCLICKS.IN. Reach Huzef directly for shoot enquiries, availability and bookings.",
    phone: site.people.founder.phone,
    whatsapp: site.people.founder.whatsapp,
    email: site.email,
    order: 1,
  },
  {
    id: "team-adil",
    name: site.people.ceo.name,
    role: "CEO",
    intro: "Chief Executive Officer of REELCLICKS.IN. Reach Adil directly for projects, partnerships and business enquiries.",
    phone: site.people.ceo.phone,
    whatsapp: site.people.ceo.whatsapp,
    order: 2,
  },
];

/* Only verified client feedback supplied by REELCLICKS.IN belongs here. */
export const sampleTestimonials: Testimonial[] = [];
