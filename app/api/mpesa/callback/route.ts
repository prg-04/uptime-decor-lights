// app/api/mpesa/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateOrderPaymentStatus } from "@/sanity/lib/order/updateOrder";
import { z } from "zod";

interface MpesaTransactionDetails {
  MpesaReceiptNumber: string;
  TransactionDate: string;
  PhoneNumber: string;
  Amount: number;
}

// Define the expected schema for the M-Pesa callback payload
const MpesaCallbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(
            z.object({
              Name: z.string(),
              Value: z.union([z.string(), z.number()]).optional(),
            })
          ),
        })
        .optional(),
    }),
  }),
});


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const rawBody = await req.json();

    // Log the callback for debugging
    console.log("M-Pesa callback received:", JSON.stringify(rawBody));

    // Validate the callback data against our schema
    const validationResult = MpesaCallbackSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.error("Invalid M-Pesa callback format:", validationResult.error);
      return NextResponse.json(
        { error: "Invalid callback format" },
        { status: 400 }
      );
    }

    const callbackData = validationResult.data;
    const { stkCallback } = callbackData.Body;
    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Extract transaction details from callback metadata
    const transactionDetails: MpesaTransactionDetails = {
      MpesaReceiptNumber: "",
      TransactionDate: "",
      PhoneNumber: "",
      Amount: 0,
    };

    // Extract metadata items if available
    if (CallbackMetadata && CallbackMetadata.Item) {
      CallbackMetadata.Item.forEach((item) => {
        if (item.Name && item.Value !== undefined) {
          transactionDetails[item.Name] = item.Value;
        }
      });
    }

    // Determine if payment was successful
    const isSuccess = ResultCode === 0;

    // Update order status in Sanity
    await updateOrderPaymentStatus({
      mpesaTransactionId: CheckoutRequestID,
      status: isSuccess ? "paid" : "failed",
      mpesaReceiptNumber: transactionDetails.MpesaReceiptNumber || "",
      paymentDetails: {
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        transactionDate: transactionDetails.TransactionDate || "",
        phoneNumber: transactionDetails.PhoneNumber || "",
        amount: transactionDetails.Amount || 0,
      },
    });

    // Return success response to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: Error | unknown) {
    console.error("M-Pesa callback error:", error);

    // Always return success to Safaricom (even on our internal errors)
    // We'll handle errors internally through logs and monitoring
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}
