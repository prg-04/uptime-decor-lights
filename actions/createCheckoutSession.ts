"use server";

import { Metadata } from "@/types";
import { initiatePesapalPayment } from "./pesapal";
import { CartItem } from "@/store/store";

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  try {
    const itemWithoutPrice = items.filter((item) => !item.product.price);

    if (itemWithoutPrice.length > 0) {
      throw new Error("Some Items do not have a price");
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );

    const description = items
      .map((item) => `${item.product.name} - ${item.quantity}pcs`)
      .join(", ");

    const orderData = {
      id: `order-${Date.now()}`,
      amount: totalAmount,
      description,
      email: metadata.customerEmail || "noemail@example.com",
      firstName: metadata.customerName,
      city: "Nairobi",
    };

    const pesapalResponse = await initiatePesapalPayment(orderData);

    return {
      redirectUrl: pesapalResponse.redirect_url,
      orderTrackingId: pesapalResponse.order_tracking_id,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
