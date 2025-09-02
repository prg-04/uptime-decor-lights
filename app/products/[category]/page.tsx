import {
  getProductsByCategorySlug,
  getAllCategories,
  getCategoryBySlug,
} from "@/services/sanity";
import { ProductCard } from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import { formatCategoryName } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.slug.current, 
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const categoryData = await getCategoryBySlug(params.category);

  if (!categoryData) {
    return {
      title: "Category Not Found | Uptime Decor Lights",
      description: "The category you are looking for does not exist.",
    };
  }

  const formattedName = formatCategoryName(categoryData.name);
  return {
    title: `${formattedName} | Uptime Decor Lights`,
    description: `Browse our collection of ${categoryData.description || formattedName.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categorySlug = params.category;

  const [categoryData, products] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductsByCategorySlug(categorySlug), 
  ]);

  if (!categoryData) {
    console.warn(`Category not found for slug: ${categorySlug}`);
    notFound(); 
  }

  const categoryName = categoryData.name;



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {formatCategoryName(categoryName)}
      </h1>
      {categoryData.description && (
        <p className="text-lg text-muted-foreground mb-8">
          {categoryData.description}
        </p>
      )}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4
        ">
          {products.map((product) =>
            product && product._id ? (
              <ProductCard key={product._id} product={product} />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No products found in the &quot;{formatCategoryName(categoryName)}&quot; category
          yet. Check back soon!
        </p>
      )}
    </div>
  );
}
