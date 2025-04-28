import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl:
      process.env.NODE === "production"
        ? `${process.env.VERCEL_URL}/studio`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/studio`,
  },
});
