"use client";

import { useCart } from "@/context/CartContext";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { useEffect } from "react"; // Import useEffect

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const { toast } = useToast(); // Initialize toast

  // Check for payment cancelled status on load
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    if (paymentStatus === "cancelled") {
      toast({
        title: "Payment Cancelled",
        description:
          "Your payment process was cancelled. Your cart remains unchanged.",
        variant: "default", // Or 'destructive' if preferred
      });
      // Optional: Clean the URL by removing the query parameter
      router.replace("/cart", { scroll: false });
    }
  }, [searchParams, toast, router]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleProceedToCheckout = () => {
    // Navigate to the checkout page
    router.push("/checkout");
  };

  return (
    // Add container and padding here
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10 bg-secondary/30 rounded-lg shadow">
          {" "}
          {/* Updated background */}
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-6">
            Your cart is empty.
          </p>
          <Link href="/">
            <Button className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              // Ensure image URL is valid
              const imageUrl =
                item.imageUrl ??
                item.images?.[0]?.asset?.url ??
                `https://picsum.photos/seed/${item._id}/100/100`;
              const imageAlt = item.images?.[0]?.alt ?? item.name;

              return (
                <Card
                  key={item._id}
                  className="flex items-center p-4 shadow-sm"
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={80}
                    height={80}
                    className="rounded-md mr-4 object-cover"
                    unoptimized={imageUrl.includes("picsum.photos")}
                  />
                  <div className="flex-grow">
                    <Link href={`/product/${item._id}`}>
                      <p className="font-semibold hover:text-accent transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Price: Ksh {item.price.toFixed(2)}
                    </p>{" "}
                    {/* Updated currency */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1} // Cannot go below 1 here, remove handles 0 case
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">
                      Ksh {(item.price * item.quantity).toFixed(2)}
                    </p>{" "}
                    {/* Updated currency */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive mt-1"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
            <Button
              variant="outline"
              onClick={clearCart}
              className="mt-4 text-destructive border-destructive hover:bg-destructive/10"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Ksh {getTotalPrice().toFixed(2)}</span>{" "}
                  {/* Updated currency */}
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Included</span> {/* Assuming tax included */}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Ksh {getTotalPrice().toFixed(2)}</span>{" "}
                  {/* Updated currency */}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full interactive-button bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
