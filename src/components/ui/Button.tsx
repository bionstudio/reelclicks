import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "gold";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-mono text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-500 ease-[var(--ease-out-expo)] h-13 px-7 whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  solid: "bg-paper text-ink hover:bg-gold-soft",
  outline: "border border-line-strong text-paper hover:border-gold hover:text-gold-soft",
  gold: "bg-gold text-ink hover:bg-gold-soft",
};

/** Label that rolls up to reveal a copy of itself on hover. */
export function RollingLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-cine)] group-hover/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-cine)] group-hover/btn:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

type CommonProps = {
  variant?: Variant;
  icon?: ReactNode | false;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "solid",
  icon,
  magnetic = true,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const external = typeof href === "string" && /^(https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      <RollingLabel>{children}</RollingLabel>
      {icon !== false && (
        <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:rotate-45">
          {icon ?? <ArrowUpRight size={15} strokeWidth={1.5} />}
        </span>
      )}
    </>
  );
  const cls = cn(base, variants[variant], className);
  const el = external ? (
    <a
      href={href as string}
      className={cls}
      {...(String(href).startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(rest as ComponentProps<"a">)}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Button({
  variant = "solid",
  icon,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], "disabled:pointer-events-none disabled:opacity-50", className)} {...rest}>
      <RollingLabel>{children}</RollingLabel>
      {icon !== false && icon}
    </button>
  );
}
