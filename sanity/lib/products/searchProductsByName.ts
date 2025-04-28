import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductsByName = async (searchParams: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
        *[
            _type == "product"
            && name match $searchParam
        ] | order(name asc){
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
      query: PRODUCT_SEARCH_QUERY,
      params: { searchParam: `${searchParams}*` },
    });
    return products.data || [];
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
    return [];
  }
};
