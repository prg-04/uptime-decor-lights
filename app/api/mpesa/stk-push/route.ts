// app/api/mpesa/stk-push/route.ts

import { NextRequest, NextResponse } from "next/server";
import { initiateStkPushDaraja } from "@/lib/daraja";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, phoneNumber, orderNumber, userId } = body;

    // Validate inputs
    if (!amount || !phoneNumber || !orderNumber) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate amount is numeric and greater than 0
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Store userId in a metadata field if provided
    const accountReference = userId ? `${orderNumber}-${userId}` : orderNumber;

    // Initiate STK Push through Daraja
    const result = await initiateStkPushDaraja({
      amount: Number(amount),
      phoneNumber,
      orderNumber,
      accountReference,
      transactionDesc: `Payment for order ${orderNumber}`,
    });

    // Return response to client
    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    console.error("STK Push API error:", error);

    // Format and return error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
