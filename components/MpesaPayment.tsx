// components/checkout/MpesaPayment.tsx

"use client";

import { useState } from "react";
import { toast } from "sonner";

interface MpesaPaymentProps {
  amount: number;
  phoneNumber: string;
  orderNumber: string;
  userId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function MpesaPayment({
  amount,
  phoneNumber,
  orderNumber,
  userId,
  onSuccess,
  onError,
}: MpesaPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(
    null
  );
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusChecks, setStatusChecks] = useState(0);

  // Maximum number of status checks before timing out
  const MAX_STATUS_CHECKS = 10;

  // Handle the initial payment request
  const initiatePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/mpesa/stk-push", {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Store the checkout request ID for status checking
      setCheckoutRequestId(data.CheckoutRequestID);

      toast.success(
        "Payment request sent to your phone. Please check your phone and enter your M-Pesa PIN to complete the payment."
      );

      // Start checking status after a delay
      setTimeout(() => {
        checkTransactionStatus(data.CheckoutRequestID);
      }, 5000);
    } catch (error: Error | unknown) {
      console.error("Payment initiation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate payment";
      toast.error(errorMessage);
      onError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Check transaction status
  const checkTransactionStatus = async (requestId: string) => {
    if (statusChecks >= MAX_STATUS_CHECKS) {
      toast.error(
        "Payment verification timed out. Please check your M-Pesa messages to confirm payment status."
      );
      setIsProcessing(false);
      setIsCheckingStatus(false);
      return;
    }

    setIsCheckingStatus(true);

    try {
      const response = await fetch("/api/mpesa/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutRequestId: requestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check payment status");
      }

      // Check if payment was successful (ResultCode 0 means success)
      if (data.ResultCode === "0") {
        toast.success("Payment successful! Redirecting to thank you page...");
        setIsProcessing(false);
        setIsCheckingStatus(false);
        onSuccess();
        return;
      }

      // If payment failed with a specific error
      if (data.ResultCode !== "" && data.ResultCode !== "1") {
        toast.error(`Payment failed: ${data.ResultDesc}`);
        setIsProcessing(false);
        setIsCheckingStatus(false);
        onError(data.ResultDesc);
        return;
      }

      // If still processing, check again after a delay
      setStatusChecks((prev) => prev + 1);
      setTimeout(() => {
        checkTransactionStatus(requestId);
      }, 5000);
    } catch (error: Error | unknown) {
      console.error("Status check error:", error);

      // If there's an error checking status, we'll try again
      setStatusChecks((prev) => prev + 1);
      setTimeout(() => {
        checkTransactionStatus(requestId);
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">M-Pesa Payment</h2>

        <div className="mb-4">
          <p className="text-gray-700">Amount: KES {amount.toFixed(2)}</p>
          <p className="text-gray-700">Phone: {phoneNumber}</p>
          <p className="text-gray-700">Order: #{orderNumber}</p>
        </div>

        {!isProcessing ? (
          <button
            onClick={initiatePayment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            disabled={isProcessing}
          >
            Pay with M-Pesa
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>

            <p className="text-center text-gray-700">
              {isCheckingStatus
                ? `Checking payment status (${statusChecks}/${MAX_STATUS_CHECKS})...`
                : "Sending payment request to your phone..."}
            </p>

            <p className="text-sm text-center text-gray-500">
              Please check your phone and enter your M-Pesa PIN when prompted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
