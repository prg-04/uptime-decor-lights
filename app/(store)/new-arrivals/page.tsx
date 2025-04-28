import React from "react";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import Image from "next/image";
import { Product } from "@/sanity.types";

const NewArrivalsPage = async () => {
  const productsData = await getAllProducts();
  const categories = await getAllCategories();

  const products: Product[] = productsData as unknown as Product[];

  return (
    <section className="">
      <div className="relative h-[40dvh] sm:h-[50dvh] lg:h-[60dvh] w-full">
        <Image
          src="/new-arrival-banner.jpg"
          alt="New Arrivals"
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-10">
          <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-6xl">
            New Arrivals
          </h1>
          <p className="text-white text-base sm:text-lg lg:text-xl mt-3 max-w-6xl">
            Discover our latest arrivals, featuring the most innovative and
            stylish lighting options. From unique statement pieces to practical
            everyday essentials, our new arrivals are designed to add a touch of
            elegance and style to any space. Shop now and bring the latest
            trends into your home or office.
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
                products={products}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};
export default NewArrivalsPage;
