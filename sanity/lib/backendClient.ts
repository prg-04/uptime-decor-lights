// sanity/lib/backendClient.ts
import { createClient } from "next-sanity";
import { apiToken, apiVersion, dataset, projectId } from "../env";

const token = apiToken;
export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
});
