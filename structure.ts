// structure.ts
import type {
  StructureResolver,
  DefaultDocumentNodeResolver,
} from "sanity/structure";
import { SchemaType } from "sanity";
import { HomeIcon } from "@sanity/icons"; // Import HomeIcon

// Define the structure for the sidebar navigation in the studio
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton Item for Homepage Settings
      S.listItem()
        .title("Homepage Settings")
        .id("homePageSettings")
        .icon(HomeIcon) // Add an icon
        .child(
          S.document()
            .schemaType("homePageSettings")
            .documentId("homePageSettings") // Use a fixed document ID
            .title("Homepage Settings")
        ),
      S.divider(), // Add a separator

      // List all other document types, excluding the singleton
      ...S.documentTypeListItems().filter(
        (listItem) => !["homePageSettings"].includes(listItem.getId() ?? "")
      ),
    ]);

// Optional: Define default document node views (e.g., for previews)
export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  // Customize view panes based on schema type if needed
  switch (schemaType) {
    // Example: Add a preview view for 'product' type
    // case 'product':
    //   return S.document().views([
    //     S.view.form(),
    //     // Add a custom preview component view here if you have one
    //   ])
    default:
      return S.document().views([S.view.form()]);
  }
};
