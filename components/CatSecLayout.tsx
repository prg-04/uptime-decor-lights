import React from "react";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import { getProductsBySalesCategory } from "@/sanity/lib/products/getProductsBySalesCategory";

type Props = {
  title: string;
  salesCategory: string;
  category?: string;
};

const CatSecLayout = async ({ title, salesCategory }: Props) => {
  const products = await getProductsBySalesCategory([salesCategory]);
  const productsSlice = products.slice(0, 4);
  return (
    <div className="px-2 sm:px-10 my-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-semibold font-cormorant">{title}</h2>

        <Link href={salesCategory === "newArrival" ? "/new-arrivals" : "/best-sellers"} className="flex items-center gap-2">
          <span className="hidden sm:block">View All</span>{" "}
          <span className="text-primary bg-gray-400 rounded-full p-1.5 px-3.5 ml-1">
            &gt;
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <ProductGrid products={productsSlice} />
      </div>
    </div>
  );
};

export default CatSecLayout;
