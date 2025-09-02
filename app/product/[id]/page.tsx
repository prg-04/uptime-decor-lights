"use client";

import { useState, useEffect } from "react";
import type { Product, ProductImage } from "@/services/sanity"; // Updated type import
import { getProductById, getRelatedProducts } from "@/services/sanity"; // Updated imports
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import ProductImageCarousel from "@/components/product/ProductImageCarousel"; // Import the new carousel component
import { ProductCard } from "@/components/product/ProductCard"; // Import ProductCard for related items
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  // Access id directly from params. The useEffect hook will handle fetching when id is available.
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(0); // Local quantity state
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true); // Loading state for related products
  const [error, setError] = useState<string | null>(null); // Error state
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch product data
  useEffect(() => {
    if (!id) {
      console.warn("Product ID is missing from params.");
      setError("Product ID not found.");
      setLoading(false);
      // Cannot call notFound() in useEffect, manage with state
      // notFound();
      return;
    }

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the product data on the client side
        const fetchedProduct = await getProductById(id); // No need for use(Promise.resolve(params.id))
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // After fetching the product, fetch related products
          if (fetchedProduct.category?._id) {
            setRelatedLoading(true);
            getRelatedProducts(fetchedProduct.category._id, fetchedProduct._id)
              .then(setRelatedProducts)
              .catch((err) =>
                console.error("Failed to fetch related products:", err)
              )
              .finally(() => setRelatedLoading(false));
          } else {
            setRelatedLoading(false); // No category to fetch related products
          }
        } else {
          console.warn(`Product with ID ${id} not found.`);
          setError(`Product with ID ${id} not found.`);
          // Cannot call notFound() here either, use state
          // notFound();
        }
      } catch (err) {
        console.error("Error fetching product on client:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]); // Re-fetch if ID changes

  // Effect to update local quantity state based on cart changes
  useEffect(() => {
    if (product) {
      const cartItem = cart.find((item) => item._id === product._id);
      setQuantity(cartItem ? cartItem.quantity : 0);
    } else {
      setQuantity(0);
    }
  }, [cart, product]);

  const handleQuantityChange = (change: number) => {
    if (!product) return;

    const newQuantity = quantity + change;

    try {
      if (newQuantity > 0) {
        const cartItem = cart.find((item) => item._id === product._id);
        if (!cartItem) {
          addToCart(product, 1); // Only add 1 when clicking '+' initially
          toast({
            title: "Added to Cart",
            description: `${product.name} added.`,
          });
        } else {
          updateQuantity(product._id, newQuantity);
        }
      } else {
        // newQuantity is 0 or less
        removeFromCart(product._id);
        toast({
          title: "Item Removed",
          description: `${product.name} removed from cart.`,
        });
      }
    } catch (error) {
      console.error("Error updating cart quantity from detail page:", error);
      toast({
        title: "Error",
        description: "Could not update cart quantity.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    // If product not found based on error state, call notFound() here during render
    if (error?.includes("not found")) {
      notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">
          Error Loading Product
        </h2>
        <p className="text-muted-foreground">
          {error || "Could not find the requested product."}
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-6"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Prepare images for the carousel
  // Use the processed images array which includes asset URLs
  const carouselImages: ProductImage[] =
    product.images && product.images.length > 0
      ? product.images.map((img) => ({
          ...img,
          url:
            img.asset?.url ??
            `https://picsum.photos/seed/${img._key ?? product._id}/600/600`,
          alt: img.alt ?? product.name,
        }))
      : [
          {
            _key: "fallback",
            url: `https://picsum.photos/seed/${product._id}/600/600`,
            alt: product.name,
          },
        ]; // Fallback

  const isInCart = quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Product Image Carousel */}
        <ProductImageCarousel
          images={carouselImages}
          productName={product.name}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground text-lg">{product.description}</p>
          <div className="text-3xl font-bold text-primary">
            Ksh {product.price.toFixed(2)}
          </div>{" "}
          {/* Updated currency */}
          {/* Quantity Selector / Add to Cart */}
          <div className="space-y-4">
            {" "}
            {/* Wrap controls in a div for spacing */}
            <div className="flex items-center space-x-3">
              <span className="font-medium mr-2">Quantity:</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 0} // Disable minus if quantity is 0
                aria-label="Decrease quantity"
                className="h-9 w-9" // Consistent size
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                aria-label={isInCart ? "Increase quantity" : "Add to cart"}
                className="h-9 w-9" // Consistent size
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {/* Add to Cart button - Placed below quantity controls */}
            {/* Show "Add to Cart" only if quantity is 0 */}
            {!isInCart && (
              <Button
                onClick={() => handleQuantityChange(1)} // Clicking adds the first item
                className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90 w-full max-w-xs" // Added width constraints
                aria-label="Add to cart"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            )}
            {/* If in cart, maybe show a different button or nothing? Or "Update Cart"? For now, just hiding "Add to Cart" */}
          </div>
          {/* Category Info */}
          {product.category?.name && product.category?.slug?.current && (
            <p className="text-sm text-muted-foreground">
              Category:{" "}
              <Link
                href={`/products/${product.category.slug.current}`}
                className="hover:text-accent hover:underline"
              >
                {product.category.name}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedLoading ? (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        </div>
      ) : (
        relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="my-12" />
            <h2 className="text-2xl font-bold mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) =>
                // Ensure related product has an _id before rendering
                relatedProduct?._id ? (
                  <ProductCard
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ) : null
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Skeleton for Image Carousel */}
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex space-x-2">
            <Skeleton className="h-16 w-16 rounded-md" />
            <Skeleton className="h-16 w-16 rounded-md" />
            <Skeleton className="h-16 w-16 rounded-md" />
            <Skeleton className="h-16 w-16 rounded-md" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-1/4" />
          {/* Skeleton for quantity controls and button */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full max-w-xs" />
          </div>
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      {/* Skeleton for Related Products */}
      <div className="mt-16">
        <Skeleton className="h-8 w-1/3 mb-8 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
