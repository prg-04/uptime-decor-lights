import React from "react";
import HeroBanner from "./HeroBanner";
// import FilterSection from "./FilterSection";
import getProductsByCategory from "@/sanity/lib/products/getProductsByCategory";
import ProductGrid from "./ProductGrid";
import { getCategoryBySlug } from "@/sanity/lib/category/getCategoryBySlug";

const ProductPageLayout = async ({ category }: { category: string }) => {
  const products = await getProductsByCategory(category); // <-- fixed here
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) return null;

  const { hero_image, title, description } = categoryData;

  const url = hero_image?.asset?.url || "";

  return (
    <section className="">
      <HeroBanner image={url!} title={title!} description={description!} />
      <section className="flex stick">
        {/*<FilterSection />*/}
        <div className="flex-1">
          <div className="p-6">
            <ProductGrid products={products} />
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProductPageLayout;
