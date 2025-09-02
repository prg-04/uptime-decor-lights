import { getAllNewArrivalProducts } from "@/services/sanity";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "New Arrivals | Uptime Decor Lights",
  description: "Check out the latest additions to our lighting collection.",
};

export default async function NewArrivalsPage() {
  const newArrivals = await getAllNewArrivalProducts();


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Discover the newest trends and designs in lighting.
      </p>
      {newArrivals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {newArrivals.map((product) =>
            product && product._id ? (
              <ProductCard key={product._id} product={product} />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No new arrivals to show right now. Check back soon!
        </p>
      )}
    </div>
  );
}
