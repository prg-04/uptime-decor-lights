
import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN, // Make sure this is set
  useCdn: false,
});

type SaveOrderParams = {
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  totalPrice: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  orderDate: string;
  paymentMethod: "mpesa" | "card";
  mpesaTransactionId?: string;
  products: {
    product: string; // product _id reference
    quantity: number;
  }[];
};

export async function saveOrderToSanity(order: SaveOrderParams) {
  const orderId = uuidv4();

  const doc = {
    _id: `order-${orderId}`,
    _type: "order",
    ...order,
    products: order.products.map((p) => ({
      _type: "orderItem",
      product: {
        _type: "reference",
        _ref: p.product,
      },
      quantity: p.quantity,
    })),
  };

  return await client.createIfNotExists(doc);
}
