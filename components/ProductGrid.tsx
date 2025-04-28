"use client";
import { Product } from "@/sanity.types";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductThumbnail from "./ProductThumbnail";

const ProductGrid = ({ products }: { products: Product[] }) => {

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products?.map((product) => (
        <AnimatePresence key={product._id}>
          <motion.div
            layout
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <ProductThumbnail product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};

export default ProductGrid;
