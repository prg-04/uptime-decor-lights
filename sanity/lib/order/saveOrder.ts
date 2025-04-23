import { getTransactionStatus } from "@/actions/pesapal";
import { backendClient } from "@/sanity/lib/backendClient";

type OrderDetails = {
  orderTrackingId: string;
  paymentMethod?: string;
  amount?: number;
  createdDate?: string;
  confirmationCode?: string;
  paymentStatusDescription?: string;
  quantity?: number;
  paymentAccount?: string;
  clerkUserId: string;
  statusCode?: number;
  merchantReference?: string;
  currency?: string;
  status?: "pending" | "paid" | "failed";
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
};

export async function saveOrderToSanity(orderDetails: OrderDetails) {
  const transaction = await getTransactionStatus(orderDetails.orderTrackingId);

  const products = orderDetails.products ?? [];

  const doc = {
    _type: "order",
    orderNumber: orderDetails.orderTrackingId,
    paymentMethod: transaction.payment_method,
    amount: transaction.amount,
    createdDate: transaction.created_date,
    clerkUserId: orderDetails.clerkUserId,
    quantity: orderDetails.quantity,
    confirmationCode: transaction.confirmation_code,
    paymentStatusDescription: transaction.payment_status_description,
    paymentAccount: transaction.payment_account,
    products: products.map((p) => ({
      _key: `${p.productId}-${p.name}`,
      productId: p.productId,
      price: p.price,
      quantity: p.quantity,
      name: p.name,
      image: p.image,
    })),
    status:
      transaction.payment_status_description?.toLowerCase() === "completed"
        ? "paid"
        : "failed",
  };

  return backendClient.create(doc);
}
