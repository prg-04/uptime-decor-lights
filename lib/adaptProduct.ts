import { Product } from "@/sanity.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptProduct(sanityProduct: any): Product {
  // Transform the Sanity product into the expected Product type
  return {
    ...sanityProduct,
    image: sanityProduct.image
      ? sanityProduct.image.map((image: { assetRef: string }) => ({
          asset: {
            _ref: image.assetRef, // Directly using assetRef instead of _ref
          },
        }))
      : undefined,
  };
}
