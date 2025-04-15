// app/api/mpesa/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { checkStkPushStatus } from "@/lib/daraja";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { checkoutRequestId } = body;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "Missing checkoutRequestId parameter" },
        { status: 400 }
      );
    }

    // Query transaction status
    const result = await checkStkPushStatus({ checkoutRequestId });

    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    console.error("Transaction status check error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
