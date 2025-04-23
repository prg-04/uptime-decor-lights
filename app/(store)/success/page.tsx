"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/store";
import { saveOrderToSanity } from "@/sanity/lib/order/saveOrder";
import { useUser } from "@clerk/nextjs";
import { imageUrl } from "@/lib/imageUrl";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const items = useCartStore((state) => state.items);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useUser();

  const flattenedItems = items.map((item) => ({
    productId: item.product._id,
    name: item.product.name || "",
    quantity: item.quantity,
    price: item.product.price || 0,
    image:
      item.product.image && "asset" in item.product.image
        ? imageUrl(item.product.image).url()
        : "",
  }));

  useEffect(() => {
    const confirmOrder = async () => {
      if (!orderTrackingId || !items.length || confirmed || !user?.id) return;

      try {
        if (orderTrackingId) {
          await saveOrderToSanity({clerkUserId: user?.id , orderTrackingId, products: flattenedItems });

          clearCart();
          setConfirmed(true);
        }
      } catch (err) {
        console.error("Error confirming order:", err);
      }
    };

    confirmOrder();
  }, [orderTrackingId, items, clearCart, flattenedItems, confirmed, user?.id]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center gap-4 bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4 lg:mx-0">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          Thank you for your order!
        </h1>

        <p className="text-gray-600 text-lg mb-6 text-center">
          Your order has been successfully confirmed and will be shipped
          shortly.
        </p>

        <div className="flex flex-col w-full sm:flex-row justify-center gap-4">
          <Button
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/orders")}
          >
            View Order Details
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
