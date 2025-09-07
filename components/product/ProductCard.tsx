"use client";

import type { Product } from "@/services/sanity";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { BuyNowButton } from "./BuyNowButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product || !product._id || typeof product.price !== "number") {
      console.error("Attempted to add invalid product to cart:", product);
      toast({
        title: "Error",
        description: "Could not add item to cart. Invalid product data.",
        variant: "destructive",
      });
      return;
    }
    try {
      addToCart(product, 1); // Add quantity 1
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong while adding the item to the cart.",
        variant: "destructive",
      });
    }
  };

  // Use Sanity document _id for the link
  const productLink = `/product/${product._id}`;

  // Get the first image from the images array, or use a fallback
  // Ensure product.images is treated as an array even if potentially undefined
  const imagesArray = product.images || [];
  const firstImage = imagesArray.length > 0 ? imagesArray[0] : null;
  const imageUrl =
    firstImage?.asset?.url ??
    `https://picsum.photos/seed/${product._id ?? "default"}/400/300`; // Use asset URL
  const imageAlt = firstImage?.alt ?? product.name ?? "Product image"; // Fallback alt text

  return (
    <Card className="product-card overflow-hidden flex flex-col h-full shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="p-0">
        {/* Link using product._id w-full */}
        <Link
          href={productLink}
          className="block overflow-hidden aspect-[4/3] relative rounded-t-2xl"
        >
          <Image
            src={imageUrl} // Use the first image URL
            alt={imageAlt} // Use alt text from image or product name
            fill // Use fill for responsive aspect ratio
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Example sizes
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={imageUrl.includes("picsum.photos")} // Disable optimization for Picsum
            onError={(e) =>
              console.error(
                `Error loading image for ${product.name}: ${imageUrl}`,
                e
              )
            } // Add error logging for images
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {/* Link using product._id */}
        <Link href={productLink}>
          <CardTitle className="text-lg font-semibold mb-2 hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-bold text-primary">
          Ksh {product.price.toFixed(2)}
        </p>{" "}
        {/* Updated currency */}
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto flex flex-col gap-2">
        <Button
          onClick={handleAddToCart}
          className="w-full interactive-button bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <BuyNowButton product={product} variant="productCard" />
      </CardFooter>
    </Card>
  );
}
