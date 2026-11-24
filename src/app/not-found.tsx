import Link from "next/link";
import { Wordmark } from "@/components/ui/BrandIcons";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col justify-between bg-ink p-[var(--gutter)] text-paper">
      <Link href="/" className="text-2xl" aria-label="REELCLICKS.IN — home">
        <Wordmark />
      </Link>
      <div>
        <p className="label text-lime">Error 404 — Scene missing</p>
        <h1 className="display mt-6 text-mega">
          This frame <em>was cut.</em>
        </h1>
        <p className="mt-6 max-w-md text-mute">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-13 items-center rounded-full bg-lime px-7 text-[0.95rem] font-bold text-ink hover:bg-paper"
          >
            Back to the opening scene
          </Link>
          <Link
            href="/work"
            className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-[0.95rem] font-bold hover:border-lime"
          >
            See our work
          </Link>
        </div>
      </div>
      <p className="label">REELCLICKS.IN — Turning Moments Into Memories.</p>
    </main>
  );
}
