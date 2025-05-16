// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas"; // Import combined schemas
import { defaultDocumentNode, structure } from "./structure"; // Import custom structure

// Environment variables for Sanity project ID and dataset
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

if (!projectId) {
  throw new Error(
    "The environment variable NEXT_PUBLIC_SANITY_PROJECT_ID is missing or is still set to the placeholder value. Please update it in your .env file."
  );
}
if (!dataset) {
  throw new Error(
    "The environment variable NEXT_PUBLIC_SANITY_DATASET is missing. Please add it to your .env file (e.g., 'production')."
  );
}

export default defineConfig({
  basePath: "/studio", // URL path for the studio
  name: "uptime_decor_lights_content_studio",
  title: "Uptime Decor Lights Studio",

  projectId,
  dataset,

  plugins: [
    // Use the custom structure
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    visionTool(), // Enable Vision tool for querying data
    // Add other plugins as needed
  ],

  schema: {
    // Pass the imported schema types
    types: schemaTypes,
  },
});
