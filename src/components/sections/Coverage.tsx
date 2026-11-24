import { site } from "@/lib/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";

/** Maharashtra-wide coverage told as a slow, endless credit roll. */
export function Coverage({ index = "006" }: { index?: string }) {
  const places = [...site.locations, "All over Maharashtra"];
  const row = (
    <span className="flex shrink-0 items-center">
      {places.map((p, i) => (
        <span key={i} className="flex items-center">
          <span className={i === places.length - 1 ? "text-lime" : i % 2 ? "text-outline" : ""}>{p}</span>
          <span aria-hidden className="mx-[0.4em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-lime align-middle" />
        </span>
      ))}
    </span>
  );

  return (
    <section data-section="Coverage" aria-labelledby="coverage-title" className="relative overflow-hidden border-y border-line py-20 md:py-28">
      <div className="shell mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div>
          <SectionLabel index={index} title="On location" />
          <RevealText as="h2" id="coverage-title" className="display mt-8 text-big">
            Wherever the story is.
          </RevealText>
        </div>
        <p className="max-w-sm text-mute">
          Based around Nandgaon, Manmad, Nashik and Malegaon — and travelling for shoots all over Maharashtra.
        </p>
      </div>
      <div aria-hidden className="flex whitespace-nowrap">
        <div className="marquee-track display flex text-[clamp(3rem,9vw,9rem)] leading-none">
          {row}
          {row}
        </div>
      </div>
      <p className="sr-only">Service areas: {places.join(", ")}.</p>
    </section>
  );
}
