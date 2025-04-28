import React from "react";
import HeroBanner from "@/components/HeroBanner";
import { getOurCollectionBySlug } from "@/sanity/lib/category/getOurCollectionBySlug";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

const BestSellersPage = async () => {
  const categoryData = await getOurCollectionBySlug("bestSeller");
  const products = await getAllProducts();
  const categories = await getAllCategories();

  if (
    !categoryData ||
    !categoryData.hero_image?.asset?.url ||
    !categoryData.title
  ) {
    return null;
  }

  const {
    hero_image: {
      asset: { url },
    },
    title,
    description,
  } = categoryData;

  return (
    <section className="">
      {categoryData && (
        <HeroBanner image={url} title={title} description={description} />
      )}
      <section className="flex">
        jk
        {/* <FilterSection /> */}
        <div className="flex-1">
          <div className="gap-4 p-6">
            {products.map((product, idx) => (
              <ProductsView
                key={idx}
                products={product}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};
export default BestSellersPage;
