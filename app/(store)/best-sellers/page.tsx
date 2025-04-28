import React from "react";
import HeroBanner from "@/components/HeroBanner";
import { getOurCollectionBySlug } from "@/sanity/lib/category/getOurCollectionBySlug";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getCategoryBySlug } from "@/sanity/lib/category/getCategoryBySlug";
import Image from "next/image";

const BestSellersPage = async () => {
  // const categoryData = await getCategoryBySlug("bestSeller");
  const products = [await getAllProducts()];
  const categories = await getAllCategories();

  // if (
  //   !categoryData ||
  //   !categoryData.hero_image?.asset?.url ||
  //   !categoryData.title
  // ) {
  //   return null;
  // }

  // const {
  //   hero_image: {
  //     asset: { url },
  //   },
  //   title,
  //   description,
  // } = categoryData;

  return (
    <section className="">
      <div className="relative h-[40dvh] sm:h-[50dvh] lg:h-[60dvh] w-full">
        <Image
          src="/best-seller_banner.jpg"
          alt="Best Sellers"
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-10">
          <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-6xl">
            Best Sellers
          </h1>
          <p className="text-white text-base sm:text-lg lg:text-xl mt-3 max-w-6xl">
            Explore our best-selling lamps and lighting favorites, chosen by
            customers who value style, quality, and lasting beauty. From
            statement pieces to everyday essentials, these designs are loved for
            their ability to transform any space with the perfect balance of
            light and elegance.
          </p>
        </div>
      </div>
      <section className="flex">
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
