import { Product } from "@/sanity.types";

export function adaptProduct(sanityProduct: any): Product {
  // Transform the Sanity product into the expected Product type
  return {
    ...sanityProduct,
    // Transform specific fields as needed
    image: sanityProduct.image
      ? sanityProduct.image.map(/* transform logic */)
      : undefined,
  };
}
