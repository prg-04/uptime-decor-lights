// sanity.cli.ts
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

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

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
});
