import { Product } from "@/sanity.types";

export function adaptProduct(sanityProduct: any): Product {
  // Ensure image transformation fits the expected type
  return {
    ...sanityProduct,
    image: sanityProduct.image
      ? sanityProduct.image.map((image: { assetRef: string | null }) => {
          if (!image.assetRef) return null; // Handle case where assetRef is null
          return {
            assetRef: image.assetRef, // Include the assetRef
            _ref: image.assetRef, // Use assetRef for _ref as well (ensure consistency)
            _type: "reference", // Assuming it's a reference type
            _key: image.assetRef, // You can generate a unique key based on assetRef
          };
        })
      : undefined,
  };
}
