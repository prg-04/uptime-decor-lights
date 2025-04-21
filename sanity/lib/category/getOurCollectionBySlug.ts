import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getOurCollectionBySlug = async (slug: string) => {
  // Handle the special case
  if (slug === "our-collection") {
    const OUR_COLLECTION_QUERY = defineQuery(`
      *[_type == "ourCollection"][0] {
        "title": title,
        "slug": { "current": "our-collection" },
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
      const ourCollection = await sanityFetch({
        query: OUR_COLLECTION_QUERY,
      });

      return ourCollection.data || null;
    } catch (error) {
      console.error("Error fetching our-collection:", error);
      throw new Error("Failed to fetch our-collection data");
    }
  }

  // Default category fetch
  // const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  //   *[_type == "category" && slug.current == $slug][0] {
  //     _id,
  //     title,
  //     slug,
  //     description,
  //     hero_image {
  //       asset->{
  //         _id,
  //         url
  //       },
  //       alt
  //     }
  //   }
  // `);
  //
  // try {
  //   const category = await sanityFetch({
  //     query: CATEGORY_BY_SLUG_QUERY,
  //     params: { slug },
  //   });
  //
  //   return category.data || null;
  // } catch (error) {
  //   console.error(`Error fetching category with slug "${slug}":`, error);
  //   throw new Error("Failed to fetch category by slug");
  // }
};
