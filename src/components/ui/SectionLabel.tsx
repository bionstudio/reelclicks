import { cn } from "@/lib/utils/cn";

/**
 * Section tag, e.g.  [● The story]  02
 * The `data-section` attribute on the parent section feeds the desktop section indicator.
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
  /** "lime" = filled lime chip, "dark" = for use on a lime background */
  tone?: "default" | "lime" | "dark";
}) {
  const n = String(Number(index) || index).padStart(2, "0");
  return (
    <p className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "chip",
          tone === "lime" && "border-lime bg-lime text-ink",
          tone === "dark" && "border-ink/25 text-ink",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            tone === "default" ? "bg-lime" : "bg-ink",
          )}
        />
        {title}
      </span>
      <span aria-hidden className={cn("font-mono text-xs tabular-nums", tone === "dark" ? "text-ink/55" : "text-mute-2")}>
        /{n}
      </span>
    </p>
  );
}
