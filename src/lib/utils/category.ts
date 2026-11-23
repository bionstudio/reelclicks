import { PROJECT_CATEGORIES, type ProjectCategory } from "@/types/content";

export function categoryLabel(value: ProjectCategory) {
  return PROJECT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
