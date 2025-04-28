import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

async function getProductsByCategory(categorySlug: string) {
  const PRODUCT_BY_CATEGORY_QUERY = defineQuery(`
        *[
            _type == "product" 
            && references(*[_type == "category" && slug.current == $categorySlug]._id)
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
      query: PRODUCT_BY_CATEGORY_QUERY,
      params: {
        categorySlug,
      },
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    //   throw new Error("Failed to fetch products by category");
    return [];
  }
}

export default getProductsByCategory;
