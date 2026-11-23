import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

const token = process.env.SANITY_API_READ_TOKEN || undefined;

export const sanityClient = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: !token, token, perspective: "published" })
  : null;

/** Content is cached and revalidated on-demand by the Sanity webhook (/api/revalidate). */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T> {
  if (!sanityClient) throw new Error("Sanity is not configured");
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: 3600, tags: ["sanity", ...tags] },
  });
}
