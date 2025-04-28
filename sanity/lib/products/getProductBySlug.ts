import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
        *[
            _type == "product" && slug.current == $slug
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
    } [0]
    `);

  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
    });
    return product.data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product by slug");
  }
};
