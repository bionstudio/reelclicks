# REELCLICKS.IN — Website

Cinematic website for **REELCLICKS.IN** (*Turning Moments Into Memories.*), built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger + SplitText, Lenis, Motion, Sanity Studio, React Hook Form + Zod and Resend.

Creative concept: **"Every frame has a story."** Each section is a numbered *frame* (FR.001, FR.002 …). The site reads like a film: the preloader opens like a shutter, the hero runs a live timecode, the letterbox bars retract as you scroll, and the footer arrives as the end credits.

---

## Quick start

```bash
npm install
cp .env.example .env.local      # optional — the site runs without any keys
npm run dev                     # http://localhost:3000
```

With no environment variables the site runs entirely on the **bundled sample content** (`src/lib/content/sample-data.ts`). Every primary interaction works, apart from e-mail delivery (see *Enquiries*).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | TypeScript check |
| `npm run seed:build` | Generate `seed/reelclicks.ndjson` from the sample content |
| `npm run seed:import` | Import that seed into the Sanity `production` dataset |
| `npm run media:registry` | Regenerate image sizes + blur placeholders after changing `public/images/demo` (needs Python + Pillow) |

---

## Connect the CMS (Sanity)

1. Create a free project at <https://www.sanity.io/manage> and note the **Project ID**. Create a dataset called `production` (public).
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET=production` in `.env.local` and in Vercel.
3. In **Manage → API → CORS origins**, add `http://localhost:3000` and `https://reelclicks.in` (tick *Allow credentials*).
4. *(Optional)* Start with the sample structure: `npx sanity login`, `npm run seed:build`, `npm run seed:import`.
5. Open **`/studio`** (or `/admin`) and sign in.

**Access control:** the Studio uses Sanity's own authentication. Only people invited under **Manage → Members** can sign in, and roles (Administrator / Editor / Viewer) control who can publish. There are no credentials in this codebase.

**Instant updates:** in **Manage → API → Webhooks**, add a webhook:
- URL `https://reelclicks.in/api/revalidate`, triggers *Create / Update / Delete*, projection `{_type}`
- Secret: a random string, also set as `SANITY_REVALIDATE_SECRET` in Vercel

Without the webhook, content still refreshes within an hour.

### What the agency can manage in the Studio

| Area | Abilities |
| --- | --- |
| **Portfolio** | Add / edit / delete projects, cover image, video URL, category, client (optional), location, date, gallery, **Featured** (homepage), **Display order**, portrait/landscape, *Hide from website*. Publish / unpublish from the document menu. |
| **Services** | Title, tagline, description, what's included, suitable for, images, related portfolio category, order |
| **Team** | Name, role, intro, optional bio, phone, WhatsApp, e-mail, portrait |
| **Testimonials** | Quote, name, context. Only shown when **Verified** is switched on. The section is hidden while there are none. |
| **Showreel** | Video URL, poster, title, year, runtime |
| **Homepage** | Hero heading lines, accent line, supporting text, CTA labels, hero video (+ mobile cut), poster, brand story text + images |

### Video (Cloudinary)

Upload films to Cloudinary and paste the video URL into the Studio. URLs are rewritten automatically to `f_auto,q_auto,vc_auto` adaptive renditions (`src/lib/cloudinary/video.ts`), and a poster frame is generated when no poster is uploaded. YouTube and Vimeo links also work in the lightbox player (embedded privacy-friendly).

Hero video guidance: 10–25 s, silent, loopable, about 1600×900, under ~4 MB, plus an optional lighter vertical cut for phones. The hero never autoplays video for reduced-motion, Save-Data or 2G visitors; they get the poster instead.

---

## Enquiries (Resend)

The form (`/contact`) validates on the client and on the server with the same Zod schema. It has a honeypot field, a time trap and per-IP rate limiting.

1. Create a Resend account, **verify the `reelclicks.in` domain**, create an API key.
2. Set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` (e.g. `REELCLICKS <enquiries@reelclicks.in>`) and `ENQUIRY_TO_EMAIL`.

Until those are set, the form shows a clear "temporarily unavailable" message with a one-tap **"Send these details on WhatsApp"** fallback. It never pretends an enquiry was sent. Replies to the notification e-mail go straight to the visitor (`replyTo`).

WhatsApp links throughout the site pre-fill a structured enquiry (name, date, location, brief), and mention the specific service or film the visitor was looking at.

---

## Deploy (Vercel)

Import the repository in Vercel (framework auto-detected), add the environment variables from `.env.example`, set `NEXT_PUBLIC_SITE_URL=https://reelclicks.in`, then deploy. After the first deploy, add the production URL to Sanity CORS and create the webhook.

---

## ⚠️ Content that must be replaced before launch

Nothing on the site invents clients, testimonials, ratings or statistics. These are clearly-marked placeholders:

| Item | Where | Status |
| --- | --- | --- |
| **Portfolio projects (11)** | Studio → Portfolio (or `sample-data.ts`) | Demo projects built from licensed stock photography. They show a **"Sample"** badge and say so in their text. Replace with real films, then delete. |
| **Hero video, showreel, project clips** | `public/videos/demo/*` → Studio | Placeholder clips rendered from the stock stills (slow camera moves + grade). Labelled "Placeholder footage" / "Placeholder reel". Replace with real REELCLICKS footage via Cloudinary. |
| **Photography** | `public/images/demo/*` | Unsplash-licensed stand-ins (free for commercial use). Replace with stills from real shoots. |
| **Team portraits** | Studio → Team | Monogram frames ("Photograph coming soon") until portraits are uploaded. |
| **Team bios** | Studio → Team | Intentionally minimal (role + how to reach them). Add verified bios if wanted. |
| **Testimonials** | Studio → Testimonials | None published. Add only verified client words with permission. |
| **Service "what's included" lists, About mission/vision/process copy** | Studio / `about/page.tsx` | Draft copy written from the brief. Please review and confirm it matches the actual offering. |
| **Studio address** | `src/lib/seo/schema.ts` | Not published (only service areas are). Add it if the agency wants a street address in search results. |
| **Logo** | `src/components/ui/BrandIcons.tsx`, `src/app/icon.svg` | Typographic wordmark + RC monogram. Swap for an official logo file if one exists. |

### Please provide
Real wedding / brand / event films and stills · a 30–90 s showreel · a short silent hero loop · portraits of Huzef Shaikh and Adil Shaikh · verified testimonials · confirmation of service inclusions · a Resend-verified sending domain · Sanity and Cloudinary accounts (owned by the agency).

---

## Architecture

```
src/
  app/
    (site)/            # public site: layout (preloader, nav, smooth scroll, footer), template (page cuts)
      page.tsx         # home
      about/ work/ work/[slug]/ services/ services/[slug]/ team/ contact/
    studio/[[...tool]] # Sanity Studio (noindex)
    api/enquiry        # form → Resend
    api/revalidate     # Sanity webhook → cache tags
    sitemap.ts robots.ts opengraph-image.tsx icon.svg not-found.tsx
  components/
    animations/  RevealText (SplitText masks), RevealMask, Parallax, ScrubWords, FadeIn
    hero/        Hero (adaptive video, letterbox, timecode)
    portfolio/   WorkGrid (filters), WorkCard (hover preview), VideoLightbox, VideoPlayer (custom controls)
    services/    ServicesIndex (cursor-follow frames), ServiceChapter (3 rotating compositions)
    sections/    BrandStory, ShowreelSection, SelectedWorks, Coverage, TeamSection, Testimonials, ContactCTA, PageIntro
    layout/      Preloader, SmoothScroll (Lenis ↔ ScrollTrigger), SiteFooter, SectionIndicator, WhatsAppFloat …
    navigation/  SiteHeader, MobileMenu
    forms/       EnquiryForm
  lib/
    content/     single content API — Sanity when configured, sample content otherwise
    sanity/      env, client (cached + tagged fetch), GROQ queries, image adapter
    cloudinary/  video URL optimisation + poster frames
    seo/         metadata builder, JSON-LD (Organization/ProfessionalService, Service, VideoObject, Breadcrumbs)
    validation/  shared Zod enquiry schema
  types/content.ts     # typed content models used by every component
sanity/
  schemas/   project, service, teamMember, testimonial, homePage (singleton), showreel (singleton)
  structure/ desk structure (singletons, featured list)
```

**Motion principles:** every animation respects `prefers-reduced-motion` (Lenis is disabled and reveals render statically). Nothing pins or hijacks scrolling. Cursor effects only run on fine pointers. Hidden-until-revealed states only apply when JavaScript and motion are available, with a 5-second fail-safe. The preloader shows once per session, tracks real loading (fonts, hero poster, window load), and is capped at 3.2 s.

**Performance:** pages are statically generated and revalidated by tag. Images go through `next/image` (AVIF/WebP, responsive `sizes`, blur placeholders). Hero and portfolio videos use `preload="none"` and only load on autoplay eligibility or hover. Videos pause off-screen. Fonts are self-hosted via `next/font`.
