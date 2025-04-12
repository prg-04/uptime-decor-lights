"use client";
import { Product } from "@/sanity.types";
import { useCartStore } from "@/store/store";
import React, { useEffect, useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem, removeItem, getCartCount } = useCartStore();
  const itemCount = getCartCount(product._id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        disabled={itemCount === 0 || disabled}
        onClick={() => removeItem(product._id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ease-in-out ${itemCount === 0 ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}  
      >
        <span
          className={`text-xl font-bold ${itemCount === 0 ? "text-gray-400" : "text-gray-600"}`}
        >
          -
        </span>
      </button>
      <span className="w-8 text-center font-semibold">{itemCount}</span>
      <button
        disabled={disabled}
        onClick={() => addItem(product)}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-300 ease-in-out"
      >
        <span className="text-xl font-bold text-gray-600">+</span>
      </button>
    </div>
  );
}

export default AddToCartButton;
