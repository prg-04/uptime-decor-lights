// sanity/lib/order/updateOrder.ts

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface UpdateOrderPaymentParams {
  mpesaTransactionId: string;
  status: "pending" | "paid" | "failed" | "shipped" | "delivered" | "cancelled";
  mpesaReceiptNumber?: string;
  paymentDetails?: {
    resultCode?: number;
    resultDesc?: string;
    transactionDate?: string;
    phoneNumber?: string;
    amount?: number;
  };
}

export async function updateOrderPaymentStatus({
  mpesaTransactionId,
  status,
  mpesaReceiptNumber,
  paymentDetails,
}: UpdateOrderPaymentParams) {
  // First, find the order by mpesaTransactionId
  const query = `*[_type == "order" && mpesaTransactionId == $mpesaTransactionId][0]._id`;
  const orderId = await client.fetch(query, { mpesaTransactionId });

  if (!orderId) {
    throw new Error(
      `No order found with transaction ID: ${mpesaTransactionId}`
    );
  }

  // Prepare the update data
  // Prepare the update data
  const updateData: {
    status: string;
    mpesaReceiptNumber?: string;
    paymentDetails?: Record<string, unknown>;
    paymentDate?: string;
  } = {
    status,
  };

  // Add receipt number if available
  if (mpesaReceiptNumber) {
    updateData.mpesaReceiptNumber = mpesaReceiptNumber;
  }

  // Add payment details if available
  if (paymentDetails) {
    updateData.paymentDetails = paymentDetails;
  }

  // If payment is successful, update payment date
  if (status === "paid") {
    updateData.paymentDate = new Date().toISOString();
  }
  // Update the order in Sanity
  return await client.patch(orderId).set(updateData).commit();
}

export async function findOrderByTransactionId(mpesaTransactionId: string) {
  const query = `*[_type == "order" && mpesaTransactionId == $mpesaTransactionId][0]`;
  return await client.fetch(query, { mpesaTransactionId });
}
