"use client";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
// import { createCheckoutSession } from "@/actions/createCheckoutSession";
import AddToCartButton from "@/components/AddToCartButton";
import { imageUrl } from "@/lib/imageUrl";
import { useCartStore } from "@/store/store";
import { Metadata } from "@/types";
// import { Metadata } from "@/types";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function CartPage() {
  const groupedItems = useCartStore((state) => state.getGroupedCartItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  // const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          Your cart is empty
        </h1>
        <p className="text-gray-600 text-lg">
          Add some items to your cart to get started.
        </p>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const { redirectUrl } = await createCheckoutSession(
        groupedItems,
        metadata
      );

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image?.[0]?.assetRef).url()}
                    alt={item.product.name ?? "Product Image"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold truncate">
                  {item.product.name}
                </h2>
                <p className=" text-sm sm:text-base">
                  Price: Ksh{" "}
                  {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center ml-4 flex-shrink-0">
                <AddToCartButton product={item.product} disabled={isLoading} />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full z-20 lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold ">Order Summary</h3>

          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                Ksh {useCartStore.getState().getCartTotal().toFixed(2)}
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-black/80 disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-black/80 disabled:bg-gray-400">
                Sign In to Checkout
              </button>
            </SignInButton>
          )}
        </div>
        <div className="h-64 lg:h-0" />
      </div>
    </div>
  );
}

export default CartPage;
