import { createClient, type ClientConfig } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";
const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN; // Added API token

if (!projectId) {
  throw new Error(
    "The environment variable NEXT_PUBLIC_SANITY_PROJECT_ID is missing."
  );
}
if (!dataset) {
  throw new Error(
    "The environment variable NEXT_PUBLIC_SANITY_DATASET is missing."
  );
}
// Warn if the write token is missing, as it's needed for mutations
if (!token && process.env.NODE_ENV !== "production") {
  // Only warn in dev if token is missing
  console.warn(
    "⚠️ NEXT_PUBLIC_SANITY_API_WRITE_TOKEN environment variable is missing. Mutations (like stock updates) will fail."
  );
}

export const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  ...(token && { token }),
};

export const sanityClient = createClient(config);
