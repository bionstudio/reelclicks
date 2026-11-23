import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("REELCLICKS.IN")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage").title("Homepage")),
      S.listItem()
        .title("Showreel")
        .id("showreel")
        .child(S.document().schemaType("showreel").documentId("showreel").title("Showreel")),
      S.divider(),
      S.listItem()
        .title("Portfolio")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("Portfolio")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Featured on homepage")
        .schemaType("project")
        .child(
          S.documentList()
            .title("Featured projects")
            .schemaType("project")
            .filter('_type == "project" && featured == true')
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
