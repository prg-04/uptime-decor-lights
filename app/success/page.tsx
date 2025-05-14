/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext";
import { confirmPesapalOrderAndTriggerN8N } from "@/app/checkout/actions";
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
  const { clearCart } = useCart();
  const router = useRouter();

  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);
  const hasConfirmed = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const confirmOrderAndProcess = useCallback(async () => {
    if (!isClient || hasConfirmed.current) return;

    const merchantRef = searchParams.get("OrderMerchantReference");
    const trackingIdFromParams = searchParams.get("OrderTrackingId");

    setOrderId(merchantRef);
    setTrackingId(trackingIdFromParams);

    if (!merchantRef || !trackingIdFromParams) {
      setStatus("error");
      setConfirmationMessage(
        "Payment identifiers are missing from the URL. Unable to confirm order."
      );
      hasConfirmed.current = true;
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

    hasConfirmed.current = true;
    setStatus("loading");

    const customerDetailsJSON = localStorage.getItem("customerDetails");
    const cartSnapshotJSON = localStorage.getItem("cartSnapshot");

    if (!customerDetailsJSON || !cartSnapshotJSON) {
      console.error("[SuccessPage] Missing customer details or cart snapshot.");
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
    } catch (e) {
      console.error("[SuccessPage] Error parsing localStorage data:", e);
      setStatus("error");
      setConfirmationMessage(
        "There was an issue retrieving your order details. Please contact support."
      );
      return;
    }

    try {
      const result = await confirmPesapalOrderAndTriggerN8N(
        merchantRef,
        trackingIdFromParams,
        customerDetails,
        cartSnapshot
      );

      if (result.success) {
        if (result.paymentStatus === "COMPLETED") {
          setStatus("completed");
          setConfirmationMessage(
            "Your order has been successfully confirmed and payment received!"
          );
          clearCart();
          localStorage.setItem("orderConfirmed", "true");
          localStorage.removeItem("customerDetails");
          localStorage.removeItem("cartSnapshot");
        } else if (result.paymentStatus === "PENDING") {
          setStatus("pending");
          setConfirmationMessage(
            "Your payment is pending. We will notify you once it's confirmed."
          );
          clearCart();
          localStorage.setItem("orderConfirmed", "true");
          localStorage.removeItem("customerDetails");
          localStorage.removeItem("cartSnapshot");
        } else {
          setStatus("failed");
          setConfirmationMessage(
            result.error ||
              `Payment status: ${result.paymentStatus}. Please try again or contact support.`
          );
        }
      } else {
        setStatus("error");
        setConfirmationMessage(
          result.error ||
            "An unexpected error occurred while confirming your order."
        );
      }
    } catch (error: any) {
      console.error("[SuccessPage] Error confirming order:", error);
      setStatus("error");
      setConfirmationMessage(
        "A system error occurred. Please contact support with your order details."
      );
    }
  }, [isClient, searchParams, clearCart]);

  useEffect(() => {
    if (!isClient || hasConfirmed.current) return;

    const trackingId = searchParams.get("OrderTrackingId");
    const merchantRef = searchParams.get("OrderMerchantReference");

    if (trackingId) {
      confirmOrderAndProcess();
    } else if (merchantRef) {
      setStatus("failed");
      setConfirmationMessage(
        "The payment process was not completed. Your cart has not been cleared."
      );
      hasConfirmed.current = true;
    } else {
      setStatus("error");
      setConfirmationMessage(
        "No payment information received. If you made a payment, please contact support."
      );
      hasConfirmed.current = true;
    }
  }, [isClient, searchParams, confirmOrderAndProcess]);

  const renderContent = () => {
    const details = (
      <>
        {orderId && (
          <p className="text-sm text-muted-foreground">Order Ref: {orderId}</p>
        )}
        {trackingId && (
          <p className="text-sm text-muted-foreground">
            PesaPal Tracking ID: {trackingId}
          </p>
        )}
      </>
    );

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
            {details}
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
            {details}
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
            {details}
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
