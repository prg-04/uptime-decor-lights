"use server";

import { GroupedCartItem } from "@/types";



export async function createCheckoutSession(
  items: GroupedCartItem[],
  // metadata: Metadata
) {
  try {
    const itemWithoutPrice = items.filter((item) => !item.product.price);

    if (itemWithoutPrice.length > 0) {
      throw new Error("Some Items do not have a price");
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
