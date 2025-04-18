import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

async function getHeroSectionContent() {
  const HERO_SECTION_QUERY = defineQuery(`
    *[_type == "heroSection"] | order(order asc) {
      _id,
      type,
      title,
      subtitle_1,
      description,
      "imageUrl_1": imageUrl_1.asset->url,
      "imageUrl_2": imageUrl_2.asset->url,
      additionalInfo,
      promo_code
    }
  `);

  try {
    const heroItems = await sanityFetch({ query: HERO_SECTION_QUERY });

    return (heroItems.data || []).map((item: any, index: number) => ({
      id: index + 1,
      type: item.type,
      title: item.title,
      subtitle_1: item.subtitle_1 || "",
      description: item.description || "",
      imageUrl_1: item.imageUrl_1,
      imageUrl_2: item.imageUrl_2 || "",
      additionalInfo: item.additionalInfo || "",
      promo_code: item.promo_code || "",
    }));
  } catch (error) {
    console.error("Error fetching hero section content:", error);
    return [];
  }
}

export default getHeroSectionContent;
