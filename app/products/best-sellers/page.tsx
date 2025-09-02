import { getAllBestSellerProducts } from "@/services/sanity";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Best Sellers | Uptime Decor Lights",
  description: "Discover our most popular and best-selling lighting fixtures.",
};

export default async function BestSellersPage() {
  const bestSellers = await getAllBestSellerProducts();


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Best Sellers</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Explore our curated collection of customer favorites and top-rated
        lights.
      </p>
      {bestSellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {bestSellers.map((product) =>
            product && product._id ? (
              <ProductCard key={product._id} product={product} />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No best sellers found at the moment. Check back soon!
        </p>
      )}
    </div>
  );
}
