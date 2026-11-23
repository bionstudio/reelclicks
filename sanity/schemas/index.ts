import { project } from "./project";
import { schemaTypes as documentTypes } from "./documents";

export const schemaTypes = [project, ...documentTypes];

/** Singleton documents: exactly one instance, cannot be created or deleted. */
export const SINGLETONS = ["homePage", "showreel"] as const;
