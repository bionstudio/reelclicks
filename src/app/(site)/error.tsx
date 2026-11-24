"use client";

import { useEffect } from "react";
import { site, whatsappHref } from "@/lib/site";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label text-lime">Technical difficulties</p>
      <h1 className="display mt-6 text-giant">
        We lost the <em>signal.</em>
      </h1>
      <p className="mt-6 max-w-md text-mute">Something went wrong while loading this page. Please try again — or reach us directly.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-13 items-center rounded-full bg-lime px-7 text-[0.95rem] font-bold text-ink hover:bg-paper"
        >
          Try again
        </button>
        <a
          href={whatsappHref(site.people.founder.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-[0.95rem] font-bold hover:border-lime"
        >
          WhatsApp us
        </a>
      </div>
    </section>
  );
}
