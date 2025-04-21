import React from "react";
import HeroBanner from "./HeroBanner";
import FilterSection from "./FilterSection";
import getProductsByCategory from "@/sanity/lib/products/getProductsByCategory";
import ProductGrid from "./ProductGrid";
import { getCategoryBySlug } from "@/sanity/lib/category/getCategoryBySlug";

const ProductPageLayout = async ({ category }: { category: string }) => {
  const products = [await getProductsByCategory(category)];
  const categoryData = await getCategoryBySlug(category);
  const {
    hero_image: {
      asset: { url },
    },
    title,
    description,
  } = categoryData;


  return (
    <section className="">
      <HeroBanner image={url} title={title} description={description} />
      <section className="flex stick">
         {/*<FilterSection />*/}
        <div className="flex-1">
          <div className="gap-4 p-6">
            { products.map((product) => (
              <ProductGrid key={product._id} products={product} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProductPageLayout;
