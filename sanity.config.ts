"use client";

/**
 * Sanity Studio — mounted at /studio.
 * Access is protected by Sanity's own authentication: only users invited to the
 * Sanity project (sanity.io/manage → Members) can sign in and edit content.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/lib/sanity/env";
import { schemaTypes, SINGLETONS } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const singletonSet = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "reelclicks",
  title: "REELCLICKS.IN Studio",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "New document" menu
    templates: (templates) => templates.filter(({ schemaType }) => !singletonSet.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted
    actions: (input, context) =>
      singletonSet.has(context.schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
});
