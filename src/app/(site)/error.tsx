"use client";

import { useEffect } from "react";
import { site, whatsappHref } from "@/lib/site";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label text-gold">Technical difficulties</p>
      <h1 className="display mt-6 text-giant uppercase">
        We lost the <em className="text-gold-soft">signal.</em>
      </h1>
      <p className="mt-6 max-w-md text-mute">Something went wrong while loading this page. Please try again — or reach us directly.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-13 items-center rounded-full bg-paper px-7 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink hover:bg-gold-soft"
        >
          Try again
        </button>
        <a
          href={whatsappHref(site.people.founder.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 font-mono text-[0.72rem] uppercase tracking-[0.18em] hover:border-gold"
        >
          WhatsApp us
        </a>
      </div>
    </section>
  );
}
