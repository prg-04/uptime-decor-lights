import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCategoryBySlug = async (slug: string) => {
  const CATEGORY_BY_SLUG_QUERY = defineQuery(`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      hero_image {
        asset->{
          _id,
          url
        },
        alt
      }
    }
  `);

  try {
    const category = await sanityFetch({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug },
    });

    return category.data || null;
  } catch (error) {
    console.error(`Error fetching category with slug "${slug}":`, error);
    throw new Error("Failed to fetch category by slug");
  }
};
