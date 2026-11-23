import Image from "next/image";
import { Phone } from "lucide-react";
import type { TeamMember } from "@/types/content";
import { formatPhone, telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { RevealMask, FadeIn } from "@/components/animations/Motion";
import { cn } from "@/lib/utils/cn";

/** Portrait frame — shows a refined monogram until a real photograph is uploaded. */
function Portrait({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  if (member.portrait) {
    return (
      <Image
        src={member.portrait.src}
        alt={member.portrait.alt}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover grayscale-[30%]"
        placeholder={member.portrait.blurDataURL ? "blur" : "empty"}
        blurDataURL={member.portrait.blurDataURL}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(90%_70%_at_50%_35%,#1f1d1a_0%,#0d0d0d_70%)] p-6">
      <div className="label flex justify-between">
        <span>Portrait</span>
        <span>{member.role}</span>
      </div>
      <span aria-hidden className="display self-center text-[clamp(6rem,14vw,12rem)] italic text-gold/70">
        {initials}
      </span>
      <div className="label flex justify-between text-mute-2">
        <span>Photograph coming soon</span>
        <span>REELCLICKS.IN</span>
      </div>
      {/* viewfinder corners */}
      <span aria-hidden className="absolute left-3 top-3 h-5 w-5 border-l border-t border-paper/30" />
      <span aria-hidden className="absolute right-3 top-3 h-5 w-5 border-r border-t border-paper/30" />
      <span aria-hidden className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-paper/30" />
      <span aria-hidden className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-paper/30" />
    </div>
  );
}

export function TeamGrid({ team, headingLevel = "h3" }: { team: TeamMember[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid gap-x-[var(--gutter)] gap-y-20 md:grid-cols-12">
      {team.map((m, i) => (
        <article
          key={m.id}
          className={cn("md:col-span-5", i % 2 === 0 ? "md:col-start-1" : "md:col-start-8 md:mt-[16vh]")}
          aria-labelledby={`member-${m.id}`}
        >
          <RevealMask className="aspect-[4/5] w-full" direction={i % 2 ? "down" : "up"}>
            <Portrait member={m} />
          </RevealMask>
          <FadeIn className="mt-7">
            <p className="label text-gold">{m.role}</p>
            <H id={`member-${m.id}`} className="display mt-3 text-[clamp(2.25rem,4vw,3.75rem)] uppercase leading-none">
              {m.name}
            </H>
            {m.intro && <p className="mt-5 max-w-md text-mute">{m.intro}</p>}
            {m.bio?.map((para, k) => (
              <p key={k} className="mt-4 max-w-md text-mute">
                {para}
              </p>
            ))}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={telHref(m.phone)}
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors hover:border-gold hover:text-gold-soft"
              >
                <Phone size={14} strokeWidth={1.5} /> {formatPhone(m.phone)}
              </a>
              <a
                href={whatsappHref(m.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors hover:border-gold hover:text-gold-soft"
                aria-label={`WhatsApp ${m.name}`}
              >
                <WhatsAppIcon size={15} /> WhatsApp
              </a>
            </div>
          </FadeIn>
        </article>
      ))}
    </div>
  );
}
