import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "lime" | "dark" | "outline-dark";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-sans text-[0.95rem] font-bold tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-out-expo)] h-13 pl-6 pr-2 whitespace-nowrap select-none active:scale-[0.97]";

const variants: Record<Variant, string> = {
  solid: "bg-lime text-ink hover:bg-paper",
  outline: "border border-line-strong text-paper hover:border-paper hover:bg-paper hover:text-ink",
  lime: "bg-lime text-ink hover:bg-paper",
  dark: "bg-ink text-paper hover:bg-ink-3",
  /** for use on a lime background */
  "outline-dark": "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

/** Round icon well at the end of a button. */
const iconWell =
  "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:rotate-45";
const wellTone: Record<Variant, string> = {
  solid: "bg-ink text-lime",
  outline: "bg-paper/10 text-paper group-hover/btn:bg-ink group-hover/btn:text-lime",
  lime: "bg-ink text-lime",
  dark: "bg-lime text-ink",
  "outline-dark": "bg-ink/10 text-ink group-hover/btn:bg-lime group-hover/btn:text-ink",
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
      {icon !== false ? (
        <span className={cn(iconWell, wellTone[variant])}>{icon ?? <ArrowUpRight size={17} strokeWidth={2.25} />}</span>
      ) : (
        <span className="w-4" />
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
    <button
      className={cn(base, variants[variant], !icon && "pr-6", "disabled:pointer-events-none disabled:opacity-50", className)}
      {...rest}
    >
      <RollingLabel>{children}</RollingLabel>
      {icon ? <span className={cn(iconWell, wellTone[variant])}>{icon}</span> : null}
    </button>
  );
}
