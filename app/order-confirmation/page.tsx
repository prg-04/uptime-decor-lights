"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const trackingId = searchParams.get("trackingId");
  // Status from our callback redirect (e.g., 'pending', 'failed', 'cancelled', 'completed')
  // This is just an initial hint, not the final confirmed status.
  const statusHint = searchParams.get("status") as
    | "pending"
    | "failed"
    | "cancelled"
    | "completed"
    | "unknown"
    | null;
  const checkError = searchParams.get("checkError"); // Potential error during status check on callback
  const { clearCart } = useCart();

  // Clear the cart ONLY if the redirect status indicates a payment was attempted ('pending' or 'completed').
  // Do NOT clear if status is 'failed' or 'cancelled'.
  useEffect(() => {
    // We clear the cart optimistically when the user is redirected back
    // with a 'pending' or 'completed' status, assuming the payment process was entered.
    // The IPN (if enabled and working correctly) and n8n workflow are the source of truth for final completion/failure.
    const shouldClear = statusHint === "pending" || statusHint === "completed";

    if (shouldClear) {
      console.log(
        `[Confirmation] Clearing cart on page load (status hint is ${statusHint}).`
      );
      clearCart();
    } else {
      console.log(
        `[Confirmation] Cart NOT cleared. Status Hint: ${statusHint}, OrderID: ${orderId}, TrackingID: ${trackingId}`
      );
    }
    // Intentionally run only once on mount based on initial params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusHint]); // Depend only on statusHint

  let title = "Processing Your Order...";
  let message =
    "Your payment is being processed by PesaPal. You will receive an email confirmation once the payment is verified and the order is confirmed. Please check your inbox (and spam folder) shortly.";
  let icon = <Clock className="h-16 w-16 text-blue-500 mb-4 animate-pulse" />;

  // Adjust message based on the status *hint* from the redirect URL.
  if (statusHint === "completed") {
    title = "Payment Received!";
    message =
      "Thank you! Your payment has been received. We are now processing your order. You will receive a confirmation email with details shortly.";
    icon = <CheckCircle className="h-16 w-16 text-green-500 mb-4" />;
  } else if (statusHint === "failed" || statusHint === "cancelled") {
    title = "Payment Issue";
    message =
      "There seems to be an issue with your payment, or it might have been cancelled. If you believe you completed the payment, please wait a few moments for the confirmation email or contact support. Otherwise, you can return to your cart.";
    icon = <AlertTriangle className="h-16 w-16 text-destructive mb-4" />;
  } else if (statusHint === "unknown") {
    title = "Processing Your Order...";
    message = `We couldn't immediately confirm the final payment status (${checkError ? `Error: ${checkError}` : "Callback check inconclusive"}). However, the process is underway. Please wait for the confirmation email, which will reflect the final status once PesaPal notifies us.`;
    icon = <Clock className="h-16 w-16 text-blue-500 mb-4 animate-pulse" />;
  }
  // Default ('pending' or no statusHint) uses the initial "Processing..." values above.

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center">
          {icon}
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{message}</p>
          {orderId && (
            <p className="text-lg font-medium">
              Order Ref: <span className="text-primary">{orderId}</span>
            </p>
          )}
          {trackingId && (
            <p className="text-sm text-muted-foreground">
              PesaPal Tracking ID: {trackingId}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            If you have any questions, please contact our support team.
          </p>
          {/* Button Group */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button
              asChild
              className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/orders">View Orders</Link>
            </Button>
            {/* Show "Return to Cart" only if the status hint was failed/cancelled */}
            {(statusHint === "failed" || statusHint === "cancelled") && (
              <Button
                variant="outline"
                asChild
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Link href="/cart">Return to Cart</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
