"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";

/** Keeps Lenis + ScrollTrigger in sync with client-side navigation. */
export function RouteEffects() {
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  useEffect(() => {
    // Recalculate trigger positions once late media (fonts / images) settle
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
