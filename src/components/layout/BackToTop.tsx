"use client";

import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      className="group label flex items-center gap-3 text-paper transition-colors hover:text-lime"
    >
      Back to the opening scene
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line-strong transition-colors group-hover:border-lime">
        <ArrowUp size={15} strokeWidth={1.5} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
      </span>
    </button>
  );
}
