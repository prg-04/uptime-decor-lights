"use server";
import { CartItem } from "@/store/store";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedCartItem = {
  product: CartItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  groupedItems: GroupedCartItem[],
  metadata: Metadata
): Promise<string | null> {
  try {

      const itemsWithoutPrice = groupedItems.filter((item) => !item.product.price);

      if(itemsWithoutPrice.length > 0) {
        throw new Error("All items must have a price");
      }

      


      
  } catch (error) {
    console.error("Error creating checkout session: ", error);
    throw error;
  }
}
