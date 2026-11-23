import type { Project } from "@/types/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/animations/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { WorkGrid } from "@/components/portfolio/WorkGrid";

export function SelectedWorks({ projects, total }: { projects: Project[]; total: number }) {
  return (
    <section data-section="Selected works" aria-labelledby="works-title" className="relative py-24 md:py-36">
      <div className="shell">
        <div className="mb-16 grid items-end gap-10 md:mb-24 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionLabel index="004" title="Selected works" />
            <RevealText as="h2" id="works-title" split="lines" className="display mt-10 text-giant uppercase">
              Films that
              <br />
              <em className="text-gold-soft">feel</em> like memory.
            </RevealText>
          </div>
          <div className="md:col-span-4 md:justify-self-end md:text-right">
            <p className="max-w-xs text-mute md:ml-auto">
              Weddings, reels, brand films and more — each one crafted frame by frame.
            </p>
            <p className="label mt-4">
              <span className="text-gold">{String(projects.length).padStart(2, "0")}</span> of {String(total).padStart(2, "0")} films
            </p>
          </div>
        </div>

        <WorkGrid projects={projects} showFilters={false} />

        <div className="mt-24 flex justify-center md:mt-32">
          <ButtonLink href="/work" variant="outline">
            View all work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
