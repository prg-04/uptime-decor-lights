"use server";

import { initiateMpesaStkPush } from "@/lib/mpesa";
import { saveOrderToSanity } from "@/sanity/lib/order/saveOrder";
import { CartItem } from "@/store/store";

interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  clerkUserId: string;
}

interface GroupedCartItem {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  groupedItems: GroupedCartItem[],
  metadata: Metadata
): Promise<string | null> {
  try {
    const totalAmount = groupedItems.reduce((sum, item) => {
      return sum + (item.product.price ?? 0) * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      throw new Error("Invalid cart total");
    }

    // TODO: Step 1 — Initiate M-Pesa STK Push here via Daraja API
    // Use phone number from metadata or prompt user input in UI
    const mpesaResponse = await initiateMpesaStkPush({
      amount: totalAmount,
      phoneNumber: metadata.customerPhoneNumber,
      orderNumber: metadata.orderNumber,
      userId: metadata.clerkUserId,
    });

    // Optionally: Save initial order in Sanity (optional: wait for confirmation via webhook instead)
    await saveOrderToSanity({
      ...metadata,
      totalPrice: totalAmount,
      products: groupedItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      currency: "KES",
      status: "pending",
      orderDate: new Date().toISOString(),
      paymentMethod: "mpesa",
      mpesaTransactionId: mpesaResponse?.CheckoutRequestID ?? "",
    });

    return "/thank-you";
  } catch (error) {
    console.error("M-Pesa Checkout error:", error);
    return null;
  }
}
