import { sanityClient } from "@/lib/sanityClient";
import { groq } from "next-sanity";
import { cache } from "react";
import type { CarouselItem } from "@/types"; // Import CarouselItem type
import { homeContent as defaultRawSeoItems } from "@/constants/homeContent"; // Import default raw SEO content

/**
 * Represents a single image with optional alt text from Sanity.
 */
export interface ProductImage {
  _key?: string; // Sanity array item key
  url: string | null;
  alt?: string | null;
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string; // Added url here for direct access after projection
  };
}

/**
 * Represents a product category fetched from Sanity.
 */
export interface Category {
  _id: string;
  name: string;
  slug: { current: string }; // Add slug field
  description?: string;
}

/**
 * Represents a product fetched from Sanity. Includes category reference and image array.
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: ProductImage[]; // Array of images
  category?: {
    // Make category optional
    _id?: string; // Changed from _ref to _id, make optional
    name?: string;
    slug?: { current: string }; // Include category slug
  };
  slug: {
    current: string;
  };
  featured?: boolean; // Add featured flag
  isBestSeller?: boolean; // Add best seller flag
  isNewArrival?: boolean; // Add new arrival flag

  // Deprecated single image fields (keep for potential transition/fallback)
  imageUrl?: string | null; // Represents the first image URL after processing
  image?: { asset?: { _ref?: string; _type?: string } }; // Original single image structure (if needed)
}

/**
 * Represents the structure for Room Items in Shop by Room section.
 */
export interface RoomItem {
  _id?: string; // Sanity generates _key, _id assigned during processing
  _key?: string; // Sanity uses _key for items within arrays
  name: string;
  imageUrl?: string | null;
  image?: { asset?: { _ref?: string; _type?: string; url?: string } }; // Add url here for direct access if needed
  link: string;
}

/**
 * Represents the structure for SEO Content Items.
 */
export interface SeoContentItem {
  _id?: string; // Sanity generates _key, _id assigned during processing
  _key?: string; // Sanity uses _key for items within arrays
  title: string;
  description: string;
}

/**
 * Represents the settings for the homepage fetched from Sanity.
 */
export interface HomePageSettings {
  _id: string;
  _type: "homePageSettings";
  heroCarouselItems?: CarouselItem[]; // Uses CarouselItem type
  featuredProductsTitle?: string;
  featuredProductsLinkText?: string;
  featuredProductsLinkHref?: string;
  bestSellersTitle?: string;
  bestSellersLinkText?: string;
  bestSellersLinkHref?: string;
  newArrivalsTitle?: string;
  newArrivalsLinkText?: string;
  newArrivalsLinkHref?: string;
  bannerTitle?: string;
  bannerDescription1?: string;
  bannerDescription2?: string;
  bannerImage?: { asset?: { _ref?: string; _type?: string; url?: string } };
  bannerImageUrl?: string | null;
  featuredLooksTitle?: string;
  shopByRoomTitle?: string;
  roomItems?: RoomItem[];
  lightingTipsTitle?: string;
  lightingTipsDescription?: string;
  lightingTipsButtonText?: string;
  lightingTipsButtonLink?: string;
  seoContentItems?: SeoContentItem[];
}

// --- GROQ Queries ---

// Reusable fragment for product fields, now fetching 'images' array and dereferencing asset URL
const productFields = groq`
  _id,
  name,
  description,
  price,
  images[]{ // Fetch the array of images
    _key, // Include key for React lists
    alt, // Get the alt text if defined
    asset->{ // Dereference the asset to get URL directly
        _id,
        _type,
        url
    }
  },
  category->{ // Project category data including slug
    _id,
    name,
    slug
  },
  slug,
  featured,
  isBestSeller,
  isNewArrival
`;

// Query to get all products
const getAllProductsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  ${productFields}
}`;

// Query to get featured products (limit 4)
const getFeaturedProductsQuery = groq`*[_type == "product" && featured == true] | order(_createdAt desc) [0...4] {
  ${productFields}
}`;

// Query to get best seller products (limit 4)
const getBestSellerProductsQuery = groq`*[_type == "product" && isBestSeller == true] | order(_createdAt desc) [0...4] {
    ${productFields}
}`;

// Query to get new arrival products (limit 4)
const getNewArrivalProductsQuery = groq`*[_type == "product" && isNewArrival == true] | order(_createdAt desc) [0...4] {
    ${productFields}
}`;

// Query to get product by ID
const getProductByIdQuery = groq`*[_type == "product" && _id == $id][0] {
  ${productFields}
}`;

// Query to get product by slug
const getProductBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] {
  ${productFields}
}`;

// Query to get related products (same category, excluding current product, limit 4)
const getRelatedProductsQuery = groq`*[_type == "product" && category._ref == $categoryId && _id != $currentProductId] | order(_createdAt desc) [0...4] {
  ${productFields}
}`;

// Query to get all categories including slug
const getAllCategoriesQuery = groq`*[_type == "category"] | order(name asc) {
  _id,
  name,
  slug,
  description
}`;

// Query to get homepage settings
const getHomePageSettingsQuery = groq`*[_type == "homePageSettings" && _id == "homePageSettings"][0] {
  _id,
  _type,
  heroCarouselItems[]{
    _key, // Include Sanity key for React lists
    title,
    description,
    image{ // Fetch the image asset directly
        asset->{
            _id,
            _type,
            url
        }
    },
    ctaText,
    ctaLink
  },
  featuredProductsTitle,
  featuredProductsLinkText,
  featuredProductsLinkHref,
  bestSellersTitle,
  bestSellersLinkText,
  bestSellersLinkHref,
  newArrivalsTitle,
  newArrivalsLinkText,
  newArrivalsLinkHref,
  bannerTitle,
  bannerDescription1,
  bannerDescription2,
  bannerImage{ // Fetch the image asset directly
      asset->{
          _id,
          _type,
          url
      }
  },
  featuredLooksTitle,
  shopByRoomTitle,
  roomItems[]{
    _key, // Include Sanity key
    name,
    image{ // Fetch the image asset directly
        asset->{
            _id,
            _type,
            url
        }
    },
    link
  },
  lightingTipsTitle,
  lightingTipsDescription,
  lightingTipsButtonText,
  lightingTipsButtonLink,
  seoContentItems[]{
    _key, // Include Sanity key
    title,
    description
  }
}`;

// --- Data Fetching Functions ---

const defaultPicsumUrl = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

// Helper to ensure product images have a valid URL and alt text
const ensureProductImages = (product: Product | null): Product | null => {
  if (!product) return null;

  const defaultImage: ProductImage = {
    _key: `${product._id}_default_img`,
    url: defaultPicsumUrl(
      product._id ?? product.slug?.current ?? "product",
      400,
      300
    ),
    alt: product.name ?? "Product image",
  };

  // Process images fetched from Sanity using the projected 'url'
  const processedImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => ({
          _key: img._key, // Keep the original key
          url:
            img.asset?.url ??
            defaultPicsumUrl(img._key ?? product._id ?? "variant", 400, 300),
          alt: img.alt ?? product.name ?? "Product image",
          asset: img.asset, // Keep original asset ref if needed later
        }))
      : [defaultImage]; // Use default if no images array or it's empty

  // Ensure there's always at least one image (the default if needed)
  const finalImages =
    processedImages.length > 0 ? processedImages : [defaultImage];

  return {
    ...product,
    images: finalImages,
    // Set the deprecated imageUrl to the first image for compatibility if needed
    imageUrl: finalImages[0].url,
  };
};

// Helper to ensure room item has an image URL
const ensureRoomItemImageUrl = (item: RoomItem): RoomItem => ({
  ...item,
  // Use the URL from the dereferenced asset if available
  imageUrl:
    item.image?.asset?.url ?? defaultPicsumUrl(item.name ?? "room", 400, 300), // Use name as seed if no _key/id
});

// Helper to ensure carousel item has an image URL
const ensureCarouselItemImageUrl = (item: CarouselItem): CarouselItem => ({
  ...item,
  // Use the URL from the dereferenced asset if available
  imageUrl:
    item.image?.asset?.url ??
    defaultPicsumUrl(item.title || "carousel", 1600, 800), // Use title as seed
});

// Helper to ensure SEO item has an ID (using _key)
const ensureSeoItemId = (item: SeoContentItem): SeoContentItem => ({
  ...item,
  // Use _key as _id if _id is missing. Use title as fallback key if _key is also missing.
  _id:
    item._id ??
    item._key ??
    `seo_${item.title?.replace(/\s+/g, "_") ?? Math.random()}`,
});

// Helper to ensure Room item has an ID (using _key)
const ensureRoomItemId = (item: RoomItem): RoomItem => ({
  ...item,
  // Use _key as _id if _id is missing. Use name as fallback key if _key is also missing.
  _id:
    item._id ??
    item._key ??
    `room_${item.name?.replace(/\s+/g, "_") ?? Math.random()}`,
});

// Helper to ensure Carousel item has an ID (using _key)
const ensureCarouselItemId = (item: CarouselItem): CarouselItem => ({
  ...item,
  // Use _key as _id if _id is missing. Use title as fallback key if _key is also missing.
  _id:
    item._id ??
    item._key ??
    `hero_${item.title?.replace(/\s+/g, "_") ?? Math.random()}`,
});

// --- Default Settings Generator ---
// Map imported default content to match SeoContentItem structure with _id and _key
const defaultSeoItems: SeoContentItem[] = defaultRawSeoItems.map(
  (item, index) => ({
    _key: `default_seo_key_${index + 1}`, // Create a simple default key
    _id: `default_seo_id_${index + 1}`, // Create a simple default ID
    title: item.title,
    description: item.description,
  })
);

const generateDefaultHomePageSettings = (): HomePageSettings => {
  const defaults: HomePageSettings = {
    _id: "homePageSettings_default", // Distinguish default ID
    _type: "homePageSettings",
    heroCarouselItems: [
      {
        _key: "default_hero_1",
        title: "Illuminate Your World",
        description:
          "Discover our curated collection of exquisite lighting fixtures.",
        imageUrl: defaultPicsumUrl("lightshero1", 1600, 800),
        ctaText: "Explore Chandeliers",
        ctaLink: "/products/chandeliers",
      },
      {
        _key: "default_hero_2",
        title: "Modern Wall Sconces",
        description: "Add a touch of elegance and warmth to any room.",
        imageUrl: defaultPicsumUrl("lightshero2", 1600, 800),
        ctaText: "Shop Wall Lights",
        ctaLink: "/products/wall-lights",
      },
      {
        _key: "default_hero_3",
        title: "Statement Pendant Lights",
        description: "Create a focal point with our unique pendant designs.",
        imageUrl: defaultPicsumUrl("lightshero3", 1600, 800),
        ctaText: "View Pendants",
        ctaLink: "/products/pendant-lights",
      },
    ].map(ensureCarouselItemId), // Ensure IDs for default items
    featuredProductsTitle: "Featured Products",
    featuredProductsLinkText: "View All Featured",
    featuredProductsLinkHref: "/products/featured",
    bestSellersTitle: "Best Sellers",
    bestSellersLinkText: "Shop Best Sellers",
    bestSellersLinkHref: "/products/best-sellers",
    newArrivalsTitle: "New Arrivals",
    newArrivalsLinkText: "Explore New Arrivals",
    newArrivalsLinkHref: "/products/new-arrivals",
    bannerTitle: "Crafting Atmospheres, One Light at a Time",
    bannerDescription1:
      "Explore our curated collection designed to transform your spaces.",
    bannerDescription2: "Find the perfect illumination.",
    bannerImageUrl: defaultPicsumUrl("homebanner", 1600, 900),
    featuredLooksTitle: "Featured Looks",
    shopByRoomTitle: "Shop by Room",
    roomItems: [
      {
        _key: "default_room_1",
        name: "Living Room",
        imageUrl: defaultPicsumUrl("livingroom", 400, 300),
        link: "/products/living-room",
      },
      {
        _key: "default_room_2",
        name: "Bedroom",
        imageUrl: defaultPicsumUrl("bedroom", 400, 300),
        link: "/products/bedroom",
      },
      {
        _key: "default_room_3",
        name: "Kitchen",
        imageUrl: defaultPicsumUrl("kitchen", 400, 300),
        link: "/products/kitchen",
      },
      {
        _key: "default_room_4",
        name: "Dining Room",
        imageUrl: defaultPicsumUrl("diningroom", 400, 300),
        link: "/products/dining-room",
      },
    ]
      .map(ensureRoomItemImageUrl)
      .map(ensureRoomItemId), // Ensure URLs and IDs
    lightingTipsTitle: "Lighting Tips & Inspiration",
    lightingTipsDescription:
      "Discover expert tips on choosing the right lighting, creating ambiance, and making the most of your space with Uptime Decor Lights.",
    lightingTipsButtonText: "Get Inspired",
    lightingTipsButtonLink: "/inspiration",
    seoContentItems: defaultSeoItems, // Use processed default SEO items with IDs
  };
  return defaults;
};

/**
 * Retrieves all products from Sanity. Uses React cache for deduplication.
 * Ensures all products have processed image data.
 * @returns A promise that resolves to an array of Product objects.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await sanityClient.fetch<Product[]>(getAllProductsQuery);
    if (!products || products.length === 0) {
      return [];
    }
    const processedProducts = products
      .map(ensureProductImages)
      .filter((p): p is Product => p !== null);
    return processedProducts;
  } catch (error: any) {
    console.error("❌ Failed to fetch products from Sanity:", error.message);
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    return []; // Return empty array on error
  }
});

/**
 * Retrieves featured products from Sanity (max 4). Uses React cache.
 * @returns A promise that resolves to an array of featured Product objects.
 */
export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await sanityClient.fetch<Product[]>(
      getFeaturedProductsQuery
    );
    if (!products || products.length === 0) return [];
    const processed = products
      .map(ensureProductImages)
      .filter((p): p is Product => p !== null);
    return processed;
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch featured products from Sanity:",
      error.message
    );
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    return []; // Return empty array on error
  }
});

/**
 * Retrieves best seller products from Sanity (max 4). Uses React cache.
 * @returns A promise that resolves to an array of best seller Product objects.
 */
export const getBestSellerProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await sanityClient.fetch<Product[]>(
      getBestSellerProductsQuery
    );
    if (!products || products.length === 0) return [];
    const processed = products
      .map(ensureProductImages)
      .filter((p): p is Product => p !== null);
    return processed;
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch best seller products from Sanity:",
      error.message
    );
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    return []; // Return empty array on error
  }
});

/**
 * Retrieves new arrival products from Sanity (max 4). Uses React cache.
 * @returns A promise that resolves to an array of new arrival Product objects.
 */
export const getNewArrivalProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await sanityClient.fetch<Product[]>(
      getNewArrivalProductsQuery
    );
    if (!products || products.length === 0) return [];
    const processed = products
      .map(ensureProductImages)
      .filter((p): p is Product => p !== null);
    return processed;
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch new arrival products from Sanity:",
      error.message
    );
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    return []; // Return empty array on error
  }
});

/**
 * Retrieves a product by its ID from Sanity. Uses React cache.
 * @param id The ID (_id) of the product to retrieve.
 * @returns A promise that resolves to a Product object or undefined if not found.
 */
export const getProductById = cache(
  async (id: string): Promise<Product | undefined> => {
    if (!id) {
      return undefined;
    }
    try {
      const product = await sanityClient.fetch<Product | null>(
        getProductByIdQuery,
        { id }
      );
      if (!product) return undefined;
      const processedProduct = ensureProductImages(product);
      return processedProduct ?? undefined;
    } catch (error: any) {
      console.error(
        `❌ Failed to fetch product ID ${id} from Sanity:`,
        error.message
      );
      if (error.response?.body)
        console.error("Sanity Error Body:", error.response.body);
      return undefined; // Return undefined on error
    }
  }
);

/**
 * Retrieves a product by its slug from Sanity. Uses React cache.
 * @param slug The slug (slug.current) of the product to retrieve.
 * @returns A promise that resolves to a Product object or undefined if not found.
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    if (!slug) {
      return undefined;
    }
    try {
      const product = await sanityClient.fetch<Product | null>(
        getProductBySlugQuery,
        { slug }
      );
      if (!product) return undefined;
      const processedProduct = ensureProductImages(product);
      return processedProduct ?? undefined;
    } catch (error: any) {
      console.error(
        `❌ Failed to fetch product slug ${slug} from Sanity:`,
        error.message
      );
      if (error.response?.body)
        console.error("Sanity Error Body:", error.response.body);
      return undefined; // Return undefined on error
    }
  }
);

/**
 * Retrieves related products based on category. Uses React cache.
 * @param categoryId The ID of the category to find related products for.
 * @param currentProductId The ID of the product being viewed (to exclude it).
 * @param limit The maximum number of related products to return.
 * @returns A promise that resolves to an array of related Product objects.
 */
export const getRelatedProducts = cache(
  async (
    categoryId: string,
    currentProductId: string,
    limit: number = 4
  ): Promise<Product[]> => {
    if (!categoryId || !currentProductId) {
      return [];
    }

    try {
      const products = await sanityClient.fetch<Product[]>(
        getRelatedProductsQuery,
        { categoryId, currentProductId } // Pass parameters to the query
      );
      if (!products || products.length === 0) return [];
      const processed = products
        .map(ensureProductImages)
        .filter((p): p is Product => p !== null);
      return processed;
    } catch (error: any) {
      console.error(
        `❌ Failed to fetch related products for category ${categoryId}:`,
        error.message
      );
      if (error.response?.body)
        console.error("Sanity Error Body:", error.response.body);
      return []; // Return empty array on error
    }
  }
);

/**
 * Retrieves all categories from Sanity. Uses React cache.
 * @returns A promise that resolves to an array of Category objects.
 */
export const getAllCategories = cache(async (): Promise<Category[]> => {
  try {
    const categories = await sanityClient.fetch<Category[]>(
      getAllCategoriesQuery
    );
    return categories ?? [];
  } catch (error: any) {
    console.error("❌ Failed to fetch categories from Sanity:", error.message);
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    return []; // Return empty array on error
  }
});

// Helper to get Category by slug (used in category page)
export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | undefined> => {
    if (!slug) {
      return undefined;
    }
    const categories = await getAllCategories();
    const category = categories.find((cat) => cat.slug?.current === slug);
    return category;
  }
);

// Helper to get Products by Category Slug
export const getProductsByCategorySlug = cache(
  async (categorySlug: string): Promise<Product[]> => {
    if (!categorySlug) {
      return [];
    }
    const allProducts = await getAllProducts();
    const filteredProducts = allProducts.filter(
      (product) => product.category?.slug?.current === categorySlug
    );
    return filteredProducts;
  }
);

// Helper to get all Best Seller products (not just limited 4)
export const getAllBestSellerProducts = cache(async (): Promise<Product[]> => {
  const allProducts = await getAllProducts();
  const bestSellers = allProducts.filter(
    (product) => product.isBestSeller === true
  );
  return bestSellers;
});

// Helper to get all New Arrival products (not just limited 4)
export const getAllNewArrivalProducts = cache(async (): Promise<Product[]> => {
  const allProducts = await getAllProducts();
  const newArrivals = allProducts.filter(
    (product) => product.isNewArrival === true
  );
  return newArrivals;
});

/**
 * Retrieves homepage settings from Sanity. Uses React cache.
 * Provides default values if settings are not found or fields are missing.
 * @returns A promise that resolves to a HomePageSettings object.
 */
// Temporarily removing cache for debugging
// export const getHomePageSettings = cache(async (): Promise<HomePageSettings> => {
export const getHomePageSettings = async (): Promise<HomePageSettings> => {
  let settings: HomePageSettings | null = null;
  const defaultSettings = generateDefaultHomePageSettings();

  try {
    settings = await sanityClient.fetch<HomePageSettings | null>(
      getHomePageSettingsQuery
    );
   

    // If fetch returned null, use defaults
    if (!settings) {
      console.warn(
        "⚠️ Using default homepage settings because fetch returned null."
      );
      return defaultSettings;
    }

    // Merge fetched settings with defaults, ensuring arrays have IDs/Keys and image URLs
    const mergedSettings: HomePageSettings = {
      _id: settings._id ?? defaultSettings._id,
      _type: "homePageSettings",
      heroCarouselItems: (settings.heroCarouselItems &&
      settings.heroCarouselItems.length > 0
        ? settings.heroCarouselItems
        : defaultSettings.heroCarouselItems!
      )
        .map(ensureCarouselItemImageUrl)
        .map(ensureCarouselItemId),
      featuredProductsTitle:
        settings.featuredProductsTitle ??
        defaultSettings.featuredProductsTitle!,
      featuredProductsLinkText:
        settings.featuredProductsLinkText ??
        defaultSettings.featuredProductsLinkText!,
      featuredProductsLinkHref:
        settings.featuredProductsLinkHref ??
        defaultSettings.featuredProductsLinkHref!,
      bestSellersTitle:
        settings.bestSellersTitle ?? defaultSettings.bestSellersTitle!,
      bestSellersLinkText:
        settings.bestSellersLinkText ?? defaultSettings.bestSellersLinkText!,
      bestSellersLinkHref:
        settings.bestSellersLinkHref ?? defaultSettings.bestSellersLinkHref!,
      newArrivalsTitle:
        settings.newArrivalsTitle ?? defaultSettings.newArrivalsTitle!,
      newArrivalsLinkText:
        settings.newArrivalsLinkText ?? defaultSettings.newArrivalsLinkText!,
      newArrivalsLinkHref:
        settings.newArrivalsLinkHref ?? defaultSettings.newArrivalsLinkHref!,
      bannerTitle: settings.bannerTitle ?? defaultSettings.bannerTitle!,
      bannerDescription1:
        settings.bannerDescription1 ?? defaultSettings.bannerDescription1!,
      bannerDescription2:
        settings.bannerDescription2 ?? defaultSettings.bannerDescription2!,
      bannerImage: settings.bannerImage,
      // Use dereferenced URL if available from fetch
      bannerImageUrl:
        settings.bannerImage?.asset?.url ?? defaultSettings.bannerImageUrl!,
      featuredLooksTitle:
        settings.featuredLooksTitle ?? defaultSettings.featuredLooksTitle!,
      shopByRoomTitle:
        settings.shopByRoomTitle ?? defaultSettings.shopByRoomTitle!,
      roomItems: (settings.roomItems && settings.roomItems.length > 0
        ? settings.roomItems
        : defaultSettings.roomItems!
      )
        .map(ensureRoomItemImageUrl)
        .map(ensureRoomItemId),
      lightingTipsTitle:
        settings.lightingTipsTitle ?? defaultSettings.lightingTipsTitle!,
      lightingTipsDescription:
        settings.lightingTipsDescription ??
        defaultSettings.lightingTipsDescription!,
      lightingTipsButtonText:
        settings.lightingTipsButtonText ??
        defaultSettings.lightingTipsButtonText!,
      lightingTipsButtonLink:
        settings.lightingTipsButtonLink ??
        defaultSettings.lightingTipsButtonLink!,
      seoContentItems: (settings.seoContentItems &&
      settings.seoContentItems.length > 0
        ? settings.seoContentItems
        : defaultSettings.seoContentItems!
      ).map(ensureSeoItemId),
    };
    return mergedSettings;
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch homepage settings from Sanity:",
      error.message
    );
    if (error.response?.body)
      console.error("Sanity Error Body:", error.response.body);
    console.warn("⚠️ Returning default homepage settings due to fetch error.");
    // Return a complete default object on error
    return defaultSettings;
  }
  // });
};
