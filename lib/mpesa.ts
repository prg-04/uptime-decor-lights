interface MpesaPayload {
  amount: number;
  phoneNumber: string;
  orderNumber: string;
  userId: string;
}

export async function initiateMpesaStkPush({
  amount,
  phoneNumber,
  orderNumber,
  userId,
}: MpesaPayload) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/mpesa/stk-push`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          phoneNumber,
          orderNumber,
          userId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`M-Pesa STK Push failed: ${error}`);
    }

    return await response.json(); // contains CheckoutRequestID, etc.
  } catch (error) {
    console.error("STK Push error:", error);
    throw error;
  }
}
