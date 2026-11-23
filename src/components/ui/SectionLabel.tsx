import { cn } from "@/lib/utils/cn";

/**
 * Film-slate section marker, e.g.  ● FR.002 — THE STORY
 * The `data-section` attribute feeds the fixed desktop section indicator.
 */
export function SectionLabel({
  index,
  title,
  className,
  tone = "default",
}: {
  index: string;
  title: string;
  className?: string;
  tone?: "default" | "gold";
}) {
  return (
    <p className={cn("label flex items-center gap-3", className)}>
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
      <span className={tone === "gold" ? "text-gold" : "text-paper"}>FR.{index}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{title}</span>
    </p>
  );
}
