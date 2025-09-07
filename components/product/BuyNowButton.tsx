"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { SignInButton } from "@clerk/nextjs";
import type { Product } from "@/services/sanity";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCart } from "@/context/CartContext";

interface BuyNowButtonProps {
  product: Product;
  className?: string;
  variant?: "productCard" | "productDetail";
}

export function BuyNowButton({ product, className, variant = "productCard" }: BuyNowButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(product.stock !== undefined && (product.stock === 0 || !product.stock));

  // Check if product has variants that need to be selected
  const hasVariants = product.variants && product.variants.length > 0;

  const handleBuyNow = async () => {
    // Track analytics event for Buy Now button click
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("buy_now_button_click", {
        productId: product._id,
        productName: product.name,
      });
    }

    // Check if product is out of stock - only if stock property exists
    if (product.stock !== undefined && (product.stock === 0 || !product.stock)) {
      setIsOutOfStock(true);
      return;
    }

    // Check if product has variants that need to be selected
    if (hasVariants) {
      toast({
        title: "Select Options First",
        description: "Please select product options before using Buy It Now",
        variant: "default",
      });

      // Track analytics event for variant selection required
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("buy_now_variant_required", {
          productId: product._id,
          productName: product.name,
        });
      }

      return;
    }

    // Check if user is authenticated
    if (!isSignedIn) {
      // Track analytics event for login prompt
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("buy_now_login_prompt", {
          productId: product._id,
          productName: product.name,
        });
      }

      setShowAuthDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      // Track analytics event for Buy Now click
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("buy_now_click", {
          productId: product._id,
          productName: product.name,
        });
      }

      // Check if user already has items in their cart
      const cartItems = JSON.parse(localStorage.getItem("luminaire-haven-cart") || "[]");
      if (cartItems.length > 0) {
        toast({
          title: "Cart Has Items",
          description: "Your cart already has items. You'll be redirected to the cart page.",
          variant: "default",
        });

        // Redirect to cart page instead
        router.push("/cart");
        return;
      }

      // Add the product to cart
      addToCart(product, 1);

      // Create a temporary cart with just this product for express checkout
      const tempCart = [{
        ...product,
        quantity: 1,
        imageUrl: product.images?.[0]?.asset?.url || `https://picsum.photos/seed/${product._id}/100/100`
      }];

      // Store the temp cart in sessionStorage for the express checkout
      sessionStorage.setItem("expressCheckoutCart", JSON.stringify(tempCart));

      // Redirect to checkout with express flag
      router.push("/checkout?express=true");

      // Track analytics event for checkout initiation
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("buy_now_checkout_initiated", {
          productId: product._id,
          productName: product.name,
        });
      }
    } catch (error) {
      console.error("Error initiating Buy It Now:", error);
      toast({
        title: "Error",
        description: "Failed to initiate Buy It Now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get button styling based on variant
  const getButtonStyle = () => {
    if (variant === "productDetail") {
      return "w-full max-w-xs";
    }
    return "w-full";
  };

  // Get button text based on variant
  const getButtonText = () => {
    if (variant === "productDetail") {
      return (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Buy It Now
        </>
      );
    }
    return (
      <>
        <Zap className="mr-2 h-4 w-4" />
        Buy Now
      </>
    );
  };

  return (
    <>
      {isOutOfStock ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`${getButtonStyle()} ${className}`}
                disabled
                variant="secondary"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Out of Stock
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Buy It Now unavailable - add to cart for later</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          onClick={handleBuyNow}
          className={`${getButtonStyle()} ${className} bg-black text-white hover:text-gray-900`}
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            getButtonText()
          )}
        </Button>
      )}

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log in to complete your purchase quickly</DialogTitle>
            <DialogDescription>
              To use Buy It Now, please sign in or continue as a guest.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <SignInButton mode="modal">
              <Button className="w-full sm:w-auto">
                Sign In
              </Button>
            </SignInButton>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setShowAuthDialog(false);
                // Redirect to cart page
                router.push("/cart");
              }}
            >
              Go to Cart Instead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}