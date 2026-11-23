"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

// The very first page load is already handled by the preloader and must be
// server-rendered fully visible; only client-side navigations get the cut.
let firstMount = true;

/**
 * Page transition: each new page fades up from black while a thin gold line
 * sweeps across — a quick "cut" between scenes rather than a long wipe.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstMount;
  useEffect(() => {
    firstMount = false;
  }, []);

  return (
    <>
      {animate && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-px origin-left bg-gold"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ scaleX: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }, opacity: { duration: 0.4, delay: 0.6 } }}
        />
      )}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
