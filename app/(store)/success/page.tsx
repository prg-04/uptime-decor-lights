"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/store";
import { saveOrderToSanity } from "@/sanity/lib/order/saveOrder";
import { useUser } from "@clerk/nextjs";
import { imageUrl } from "@/lib/imageUrl";
import { getTransactionStatus } from "@/actions/pesapal";
import { sendOrderToN8N } from "@/lib/sendOrderToN8N";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderTrackingId = searchParams.get("OrderTrackingId");

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const { user } = useUser();

  const hasConfirmed = useRef(false);

  const internalProducts = items.map((item) => ({
    productId: item.product._id,
    name: item.product.name || "",
    quantity: item.quantity,
    price: item.product.price || 0,
    image:
      item.product.image && "asset" in item.product.image
        ? imageUrl(item.product.image[0].assetRef).url()
        : "",
  }));

  const n8nProducts = items.map((item) => ({
    product_id: item.product._id,
    name: item.product.name || "",
    quantity: String(item.quantity),
    price: item.product.price || 0,
    image_url:
      item.product.image && "asset" in item.product.image
        ? imageUrl(item.product.image[0].assetRef).url()
        : "",
  }));

  const confirmOrder = useCallback(async () => {
    if (!orderTrackingId || !items.length || hasConfirmed.current || !user?.id)
      return;

    hasConfirmed.current = true;

    try {
      // Save to Sanity
      await saveOrderToSanity({
        clerkUserId: user.id,
        orderTrackingId,
        products: internalProducts,
      });

      // Confirm with Pesapal
      const transaction = await getTransactionStatus(orderTrackingId);
      console.log("Transaction result:", transaction);

      if (transaction.payment_status_description === "Completed") {
        const n8nOrder = {
          order_number: orderTrackingId,
          confirmation_code: transaction.confirmation_code,
          payment_status: "paid",
          amount: parseFloat(transaction.amount),
          payment_method: transaction.payment_method || "M-Pesa",
          created_date: transaction.created_date,
          payment_account: transaction.payment_account ?? "",
          customer_email: user.emailAddresses?.[0]?.emailAddress ?? "",
          customer_name: user.fullName ?? "",
          customer_phone: user.phoneNumbers?.[0]?.phoneNumber ?? "",
          products: n8nProducts,
        };

        console.log("Sending order to n8n:", n8nOrder);
        await sendOrderToN8N(n8nOrder);
        console.log("Successfully sent order to n8n");
      }

      clearCart();
    } catch (err) {
      console.error("Error confirming order:", err);
    }
  }, [
    orderTrackingId,
    items,
    user?.id,
    user?.emailAddresses,
    user?.fullName,
    user?.phoneNumbers,
    internalProducts,
    clearCart,
    n8nProducts,
  ]);

  useEffect(() => {
    confirmOrder();
  }, [orderTrackingId, confirmOrder]);

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
