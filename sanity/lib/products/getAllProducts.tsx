import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product"] | order(name asc){
      ...,
    
 image[]{
    _type == "image" => {
      "assetRef": asset._ref
    },
    _type == "reference" => @->{
      "assetRef": image.asset._ref
    }
  }
    } 
  `);
  try {
    const products = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error("Failed to fetch all products");
    return [];
  }
};
