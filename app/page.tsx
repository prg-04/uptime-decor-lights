import {
  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
  getHomePageSettings,
  Product,
} from "@/services/sanity";
import { ProductCard } from "@/components/product/ProductCard";
import  Carousel  from "@/components/layout/Carousel";
import FeaturedCarousel from "@/components/layout/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeBannerSec from "@/components/layout/HomeBannerSec";
import HomeCategories from "@/components/layout/HomeCategories";

export const revalidate = 60;

// Helper to ensure item has an ID for mapping
const ensureId = <T extends { _id?: string; _key?: string }>(
  item: T,
  prefix: string,
  index: number
): T & { _id: string } => ({
  ...item,
  _id:
    item._id ??
    item._key ??
    `${prefix}_${index}_${Math.random().toString(36).substring(2, 9)}`,
});


export default async function Home() {
  const [
    featuredProducts,
    bestSellerProducts,
    newArrivalProducts,
    homeSettings,
  ] = await Promise.all([
    getFeaturedProducts(),
    getBestSellerProducts(),
    getNewArrivalProducts(),
    getHomePageSettings(),
  ]);



  const anyProductsAvailable =
    featuredProducts.length > 0 ||
    bestSellerProducts.length > 0 ||
    newArrivalProducts.length > 0;

   const heroItems = (homeSettings?.heroCarouselItems || []).map(
     (item, index) => ensureId(item, "hero", index)
   );
   
 

  return (
    <div className="space-y-8 ">
      {" "}
      {heroItems.length > 0 ? (
        <Carousel items={heroItems} />
      ) : (
        <p className="text-center py-10 text-muted-foreground">
          Loading Carousel or no items defined in Sanity...
        </p>
      )}
      <HomeCategories />
      <ProductSection
        title={homeSettings?.featuredProductsTitle || "Featured Products"}
        products={featuredProducts}
        linkHref={
          homeSettings?.featuredProductsLinkHref || "/products/featured"
        }
        linkText={homeSettings?.featuredProductsLinkText || "View All Featured"}
      />
      <ProductSection
        title={homeSettings?.bestSellersTitle || "Best Sellers"}
        products={bestSellerProducts}
        linkHref={homeSettings?.bestSellersLinkHref || "/products/best-sellers"}
        linkText={homeSettings?.bestSellersLinkText || "Shop Best Sellers"}
      />
      <ProductSection
        title={homeSettings?.newArrivalsTitle || "New Arrivals"}
        products={newArrivalProducts}
        linkHref={homeSettings?.newArrivalsLinkHref || "/products/new-arrivals"}
        linkText={homeSettings?.newArrivalsLinkText || "Explore New Arrivals"}
      />
      <HomeBannerSec />
      <FeaturedCarousel title={homeSettings?.featuredLooksTitle} />
      {!anyProductsAvailable && (
        <p className="text-center text-muted-foreground py-12">
          No products found. Please check back later or ensure products are
          published in Sanity.
        </p>
      )}
    </div>
  );
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  linkHref?: string | null;
  linkText?: string | null;
}

function ProductSection({
  title,
  products,
  linkHref,
  linkText,
}: ProductSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }


  return (
    <section>
      <div className="flex justify-between items-center mb-6 md:my-14 px-3">
        <h2 className="text-3xl font-bold">{title}</h2>
        {linkHref && linkText && (
          <Button
            variant="outline"
            asChild
            className="rounded-full md:rounded-lg px-3"
          >
            <Link
              href={linkHref}
              className="flex items-center group interactive-button"
            >
              <span className="hidden md:block">{linkText}</span>
              <ArrowRight className="md:ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          // Add a check for product existence and ID before rendering Card
          if (!product || !product._id) {
            console.warn(
              "Attempted to render ProductCard with invalid product data:",
              product
            );
            return null;
          }
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </section>
  );
}
