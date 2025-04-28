import React from "react";
import { Product } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

const ProductThumbnail = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock != null && product.stock <= 0;


  return (
    <Link
      href={`/products/${product.slug?.current}`}
      className={`group flex flex-col bg-white rounded-lg w-64 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="relative aspect-square w-full sm:h-64 md:h-72 rounded-lg overflow-hidden">
        {product.image?.[0]?.image?.asset?._ref ? (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={imageUrl(product.image?.[0]?.image?.asset?._ref).url()}
            alt={product.name || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Fallback image or blank state if no image is available
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-md sm:text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p className="text-gray-600 line-clamp-2 mt-2 text-sm">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join("") || "No description available"}
        </p>
        <p className="mt-2 text-sm sm:text-lg font-bold text-gray-900">
          Ksh. {product.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductThumbnail;
