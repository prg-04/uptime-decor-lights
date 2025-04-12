import HeroSalesBanner from "@/components/HeroSalesBanner";
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
      <HeroSalesBanner />
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-200 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
