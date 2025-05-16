// schemas/index.ts
import category from "./category";
import product from "./product";
import homePageSettings from "./homePageSettings"; // Import the new schema

export const schemaTypes = [
  product,
  category,
  homePageSettings, // Add the new schema type
  // Add other schema types here
];
