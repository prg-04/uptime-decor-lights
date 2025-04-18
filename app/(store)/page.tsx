import Banner from "@/components/Banner";
import Hero from "@/components/Hero";
import HeroSalesBanner from "@/components/HeroSalesBanner";
import HomeBestSellers from "@/components/HomeBestSellers";
import HomeCategories from "@/components/HomeCategories";
import HomeChandelier from "@/components/HomeChandelier";
import HomeNewArrivals from "@/components/HomeNewArrivals";
import HomePendants from "@/components/HomePendants";
import HomeSeoContent from "@/components/HomeSeoContent";
import HomeWallLights from "@/components/HomeWallLights";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  // console.log(
  //   crypto.randomUUID().slice(0, 5) +
  //     `>>> Re-rendered the home page cache with ${products.length} products and ${categories.length} categories`
  // );
  return (
    <div className="">
      <Hero />
      <HomeCategories />
      <HomeNewArrivals />
      <HomeBestSellers />
      <Banner />
      <HomeChandelier />
      <HomePendants />
      <HomeWallLights />
      <HomeSeoContent />

      {/* <HeroSalesBanner />
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-200 p-4">
        <ProductsView products={products} categories={categories} />
      </div> */}
    </div>
  );
}
