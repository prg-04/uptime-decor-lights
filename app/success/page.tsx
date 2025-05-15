// app/success/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext"; // Use current project's CartContext
import { confirmPesapalOrderAndTriggerN8N } from "@/app/checkout/actions"; // New server action
import type { CustomerDetails } from "@/app/checkout/actions";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

type ConfirmationStatus =
  | "loading"
  | "completed"
  | "pending"
  | "failed"
  | "error";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCart(); // Use cart from context to get items
  const router = useRouter();

  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);
  const hasConfirmed = useRef(false); // To prevent multiple processing attempts

  useEffect(() => {
    setIsClient(true);
  }, []);

  const confirmOrderAndProcess = useCallback(async () => {
    if (!isClient || hasConfirmed.current) return;

    const merchantRefFromParams = searchParams.get("OrderMerchantReference");
    const trackingIdFromParams = searchParams.get("OrderTrackingId");

    setOrderId(merchantRefFromParams);
    setTrackingId(trackingIdFromParams);

    if (!merchantRefFromParams || !trackingIdFromParams) {
      setStatus("error");
      setConfirmationMessage(
        "Payment identifiers are missing from the URL. Unable to confirm order."
      );
      hasConfirmed.current = true; // Mark as processed to avoid retries
      return;
    }

    const alreadyConfirmed = localStorage.getItem("orderConfirmed") === "true";
    if (alreadyConfirmed) {
      setStatus("completed");
      setConfirmationMessage(
        "Your order has already been confirmed and payment was successful."
      );
      hasConfirmed.current = true;
      return;
    }

    hasConfirmed.current = true; // Mark as processing started
    setStatus("loading");

    // Clear any previous order confirmation
    localStorage.removeItem("orderConfirmed");

    // Retrieve customer details and cart snapshot from localStorage
    const customerDetailsJSON = localStorage.getItem("customerDetails");
    const cartSnapshotJSON = localStorage.getItem("cartSnapshot");

    if (!customerDetailsJSON || !cartSnapshotJSON) {
      console.error(
        "[SuccessPage] CRITICAL: Missing customer details or cart snapshot from localStorage. Cannot process order."
      );
      setStatus("error");
      setConfirmationMessage(
        "Failed to retrieve necessary order details for confirmation. Please contact support."
      );
      return;
    }

    let customerDetails: CustomerDetails;
    let cartSnapshot: CartItem[];

    try {
      customerDetails = JSON.parse(customerDetailsJSON);
      cartSnapshot = JSON.parse(cartSnapshotJSON);

      console.log("success customerDetails:", customerDetails);
    } catch (e) {
      console.error("[SuccessPage] Error parsing localStorage data:", e);
      setStatus("error");
      setConfirmationMessage(
        "There was an issue retrieving your order details. Please contact support."
      );
      return;
    }

    if (!cartSnapshot || cartSnapshot.length === 0) {
      console.warn(
        "[SuccessPage] Cart snapshot is empty. No items to process for n8n."
      );
      // Proceed to check payment status but n8n won't have products.
      // Or, consider this an error state depending on business logic.
    }

    try {
      const actionResult = await confirmPesapalOrderAndTriggerN8N(
        merchantRefFromParams,
        trackingIdFromParams,
        customerDetails,
        cartSnapshot
      );

      if (actionResult.success) {
        if (actionResult.paymentStatus === "COMPLETED") {
          setStatus("completed");
          setConfirmationMessage(
            "Your order has been successfully confirmed and payment received!"
          );
          clearCart(); // Clear cart from context
          localStorage.removeItem("customerDetails");
          localStorage.removeItem("cartSnapshot");
          localStorage.setItem("orderConfirmed", "true"); // Set the confirmation flag
        } else if (actionResult.paymentStatus === "PENDING") {
          setStatus("pending");
          setConfirmationMessage(
            "Your payment is pending. We will notify you once it's confirmed."
          );
          // Optionally clear cart for pending as well, depending on business rules
          clearCart();
          localStorage.removeItem("customerDetails");
          localStorage.removeItem("cartSnapshot");
          localStorage.setItem("orderConfirmed", "true"); // Set the confirmation flag for pending too
        } else {
          // FAILED, INVALID, UNKNOWN
          setStatus("failed");
          setConfirmationMessage(
            actionResult.error ||
              `Payment status: ${actionResult.paymentStatus}. Please try again or contact support.`
          );
        }
      } else {
        setStatus("error");
        setConfirmationMessage(
          actionResult.error ||
            "An unexpected error occurred while confirming your order. Please contact support."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[SuccessPage] Error calling server action:", error);
      setStatus("error");
      setConfirmationMessage(
        "A system error occurred. Please contact support with your order details."
      );
    }
  }, [isClient, searchParams, clearCart]); // Added toast to dependencies

  useEffect(() => {
    if (isClient && !hasConfirmed.current) {
      // Only run if client and not already confirmed/processing
      const trackingIdFromParams = searchParams.get("OrderTrackingId");
      if (trackingIdFromParams) {
        // Only proceed if OrderTrackingId is present
        confirmOrderAndProcess();
      } else if (searchParams.get("OrderMerchantReference")) {
        // If only merchant ref is present, it might be a cancelled order or incomplete redirect
        setStatus("failed"); // Or a specific "cancelled" status
        setConfirmationMessage(
          "The payment process was not completed. Your cart has not been cleared."
        );
        hasConfirmed.current = true; // Prevent further processing
      } else {
        setStatus("error");
        setConfirmationMessage(
          "No payment information received. If you made a payment, please contact support."
        );
        hasConfirmed.current = true;
      }
    }
  }, [isClient, searchParams, confirmOrderAndProcess, router]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-accent animate-spin" />
            <h1 className="text-2xl font-semibold mt-6">
              Confirming Your Payment...
            </h1>
            <p className="mt-2 text-muted-foreground">
              Please wait while we confirm your transaction with PesaPal.
            </p>
          </>
        );
      case "completed":
        return (
          <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />
            <h1 className="text-3xl font-bold mt-6">
              Thank You For Your Order!
            </h1>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
              {confirmationMessage}
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order Ref: {orderId}
              </p>
            )}
            {trackingId && (
              <p className="text-sm text-muted-foreground">
                PesaPal Tracking ID: {trackingId}
              </p>
            )}
          </>
        );
      case "pending":
        return (
          <>
            <AlertTriangle className="text-yellow-500 w-16 h-16 mx-auto" />
            <h1 className="text-2xl font-semibold mt-6">Payment Pending</h1>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
              {confirmationMessage}
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order Ref: {orderId}
              </p>
            )}
            {trackingId && (
              <p className="text-sm text-muted-foreground">
                PesaPal Tracking ID: {trackingId}
              </p>
            )}
          </>
        );
      case "failed":
      case "error":
        return (
          <>
            <AlertTriangle className="text-destructive w-16 h-16 mx-auto" />
            <h1 className="text-2xl font-semibold mt-6">Payment Issue</h1>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
              {confirmationMessage}
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Order Ref: {orderId}
              </p>
            )}
            {trackingId && (
              <p className="text-sm text-muted-foreground">
                PesaPal Tracking ID: {trackingId}
              </p>
            )}
            {status === "error" && (
              <p className="text-xs text-muted-foreground mt-4">
                If you believe this is an error, please contact support with
                your Order Ref and Tracking ID.
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center min-h-[70vh] justify-center">
      <div className="bg-card p-8 rounded-lg shadow-xl max-w-lg w-full">
        {renderContent()}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="interactive-button"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => router.push("/orders")}
            className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90"
          >
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
