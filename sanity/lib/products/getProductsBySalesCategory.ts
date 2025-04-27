import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

/**
 * Fetch products that match at least one of the given sales categories.
 * @param categories array of sales categories, e.g. ["onSale", "newArrival"]
 */
export async function getProductsBySalesCategory(categories: string[]) {
  if (!categories.length) return [];

  const query = groq`
    *[_type == "product" && count(salesCategories[@ in $categories]) > 0]{
      _id,
      name,
      slug,
      image[]->{
        _id,
        image
      },
      description,
      price,
      categories[]->{
        _id,
        title,
        slug
      },
      stock,
      salesCategories
    }
  `;

  const products = await client.fetch(query, {
    categories,
  });

  return products;
}
