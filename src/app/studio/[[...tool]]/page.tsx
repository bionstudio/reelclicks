/**
 * Sanity Studio (content admin) at /studio.
 * Authentication is handled by Sanity: only members invited to the Sanity
 * project can sign in. The route is excluded from search indexing.
 */
import { isSanityConfigured } from "@/lib/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-ink p-8 text-paper">
        <div className="max-w-xl">
          <p className="label text-lime">REELCLICKS.IN Studio</p>
          <h1 className="display mt-4 text-5xl">The CMS isn&apos;t connected yet.</h1>
          <p className="mt-6 text-mute">
            Create a free Sanity project, then set <code className="text-paper">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code className="text-paper">NEXT_PUBLIC_SANITY_DATASET</code> in your environment variables and redeploy. Full steps are in
            the README (&ldquo;Connect the CMS&rdquo;). Until then the website shows its bundled sample content.
          </p>
        </div>
      </main>
    );
  }
  return <Studio />;
}
