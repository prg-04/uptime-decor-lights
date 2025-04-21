// app/(store)/categories/[slug]/page.tsx

import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import getProductsByCategory from "@/sanity/lib/products/getProductsByCategory";

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const products = await getProductsByCategory(slug);
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h1>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
