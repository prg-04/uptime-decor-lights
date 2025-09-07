/* eslint-disable @typescript-eslint/no-explicit-any */
// app/checkout/actions.ts
"use server";

import type { CartItem } from "@/context/CartContext";
import {
  getAuthToken,
  registerIpnUrl,
  submitOrderRequest,
  checkPaymentStatus,
  PaymentTransaction,
} from "@/services/pesapal";
import { sendOrderNotification } from "@/utils/slack-block-builder";
import type { N8nPayload, N8nProductDetail } from "@/types";
import { sendOrderForProcessing } from "@/utils/sendOrderForProcessing";

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UDL-${timestamp}-${randomPart}`;
};

// Define the structure for customer details
export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  clerkUserId: string;
  shippingLocation: string;
}

// Define the structure for the result of initiatePaymentAction
interface InitiatePaymentActionResult {
  success: boolean;
  error?: string | null;
  redirectUrl?: string;
  orderId?: string;
  trackingId?: string;
}

// Define structure for confirmPesapalOrderAndTriggerSlack result
interface ConfirmOrderResult {
  success: boolean;
  paymentStatus: "COMPLETED" | "PENDING" | "FAILED" | "INVALID" | "UNKNOWN";
  error?: string | null;
  confirmationCode?: string | null;
}


let cachedIpnId: string | null = null;

/**
 * Initiates the PesaPal payment process.
 */
export async function initiatePaymentAction(
  customerDetails: CustomerDetails,
  cart: CartItem[],
  totalPrice: number
): Promise<InitiatePaymentActionResult> {
  const orderId = generateOrderNumber();
  const orderDescription = `Uptime Decor Lights Order #${orderId}`;
  const appBaseUrl = process.env.NEXT_PUBLIC_PESAPAL_CALLBACK_URL;

  if (!appBaseUrl) {
    console.error(
      "[Action initiatePayment] CRITICAL: NEXT_PUBLIC_APP_BASE_URL is not configured."
    );
    return {
      success: false,
      error: "Application base URL is not configured. Cannot proceed.",
    };
  }

  try {
    const token = await getAuthToken();

    let ipnIdToUse: string | null = cachedIpnId;
    if (!ipnIdToUse) {
      try {
        ipnIdToUse = await registerIpnUrl(token);
        cachedIpnId = ipnIdToUse;
      } catch (ipnError: any) {
        console.error(
          "[Action initiatePayment] Failed to register IPN URL:",
          ipnError.message
        );
        return {
          success: false,
          error: `IPN Registration Failed: ${ipnError.message}`,
        };
      }
    }
    if (!ipnIdToUse) {
      return {
        success: false,
        error: "Failed to obtain a valid IPN ID for payment processing.",
      };
    }

    const cleanedPhone = customerDetails.phone.replace(/\s+/g, "");
    const pesapalBillingAddress = {
      email_address: customerDetails.email,
      phone_number: cleanedPhone,
      first_name: customerDetails.firstName,
      last_name: customerDetails.lastName,
      country_code: customerDetails.country,
      line_1: customerDetails.address,
      city: customerDetails.city,
    };

    const pesapalCallbackUrl = `${appBaseUrl}/success`;
    console.log(
      `[Action initiatePayment] PesaPal callback_url set to: ${pesapalCallbackUrl}`
    );

    const response = await submitOrderRequest(
      token,
      ipnIdToUse,
      totalPrice,
      "KES",
      orderId,
      orderDescription,
      pesapalCallbackUrl,
      pesapalBillingAddress
    );

    if (response && response.redirect_url) {
      console.log(
        `[Action initiatePayment] Success: PesaPal redirect URL received for ${orderId}. Tracking ID: ${response.order_tracking_id}`
      );
      return {
        success: true,
        redirectUrl: response.redirect_url,
        orderId: response.merchant_reference,
        trackingId: response.order_tracking_id,
      };
    } else {
      console.error(
        `[Action initiatePayment] PesaPal SubmitOrderRequest failed: `,
        response.error || "No redirect URL received."
      );
      return {
        success: false,
        error: response.error?.message || "Failed to submit order to PesaPal.",
      };
    }
  } catch (error: any) {
    console.error("[Action initiatePayment] Overall error:", error);
    return {
      success: false,
      error:
        error.message ||
        "An unexpected error occurred during payment initiation.",
    };
  }
}

/**
 * Server action called from SuccessPage to confirm PesaPal transaction status and trigger Slack notification.
 */
export async function confirmPesapalOrderAndTriggerSlack(
  merchantReference: string | null,
  transactionTrackingId: string | null,
  customerDetails: CustomerDetails | null,
  cartSnapshot: CartItem[] | null
): Promise<ConfirmOrderResult> {
  if (!merchantReference || !transactionTrackingId) {
    return {
      success: false,
      paymentStatus: "INVALID",
      error: "Missing payment identifiers for confirmation.",
    };
  }
  if (!customerDetails) {
    return {
      success: false,
      paymentStatus: "INVALID",
      error: "Missing customer details for order processing.",
    };
  }
  if (!cartSnapshot || cartSnapshot.length === 0) {
    console.warn(
      "[checkout Action] Cart snapshot is empty. No items to process."
    );
  }

  let pesapalTransaction: PaymentTransaction;
  try {
    pesapalTransaction = await checkPaymentStatus(transactionTrackingId);

    if (pesapalTransaction.merchantReference !== merchantReference) {
      return {
        success: false,
        paymentStatus: "INVALID",
        error:
          "Payment verification failed (Reference Mismatch). Please contact support.",
      };
    }

    // Use the raw payment_status_description and convert to lowercase for comparison
    const currentPaymentStatusDesc =
      pesapalTransaction.paymentStatusDescription?.toLowerCase();

    // Map PesaPal status to our internal status
    let internalPaymentStatus: "paid" | "pending" | "failed";
    if (currentPaymentStatusDesc === "completed") {
      internalPaymentStatus = "paid";
    } else if (currentPaymentStatusDesc === "pending") {
      internalPaymentStatus = "pending";
    } else {
      internalPaymentStatus = "failed";
    }

    /**
     * Prepare product data for order processing
     *
     * NOTE: This is a critical mapping step. The cart items use '_id' but the order processing
     * expects 'id' in the N8nProductDetail type. This mapping ensures the product identifier
     * is correctly passed through the entire order processing pipeline.
     *
     * The 'id' field will later be mapped to 'product_id' in the database insertion.
     */
    const products: N8nProductDetail[] = (cartSnapshot || []).map((item) => ({
      id: item._id,  // Map cart item _id to N8nProductDetail id
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image_url: item.imageUrl ?? item.images?.[0]?.asset?.url ?? null,
      total: item.price * item.quantity,
    }));

    /**
     * Validate product data before proceeding
     *
     * This validation prevents NULL constraint violations in the database
     * by ensuring all products have the required identifier before being
     * sent to the order processing API.
     */
    if (products.some(p => !p.id)) {
      console.error("[checkout Action] Invalid product data: id is missing in some products");
      console.error("[checkout Action] Problematic products:", products.filter(p => !p.id));
      throw new Error("Invalid product data: id is required for all products");
    }

    console.log("[checkout Action] Products payload:", products);

    // Prepare order data for Slack notification
    const orderData: N8nPayload = {
      order_tracking_id: transactionTrackingId,
      order_number: merchantReference,
      confirmation_code: pesapalTransaction.confirmationCode || null,
      payment_status: internalPaymentStatus,
      amount: pesapalTransaction.amount,
      payment_method: pesapalTransaction.paymentMethod || null,
      created_date: pesapalTransaction.statusDate || new Date().toISOString(),
      payment_account: pesapalTransaction.paymentAccount || null,
      customer_email: customerDetails.email,
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      customer_phone: customerDetails.phone.replace(/\s+/g, ""),
      city_town: customerDetails.city,
      clerk_id: customerDetails.clerkUserId,
      shipping_location: customerDetails.shippingLocation,
      products: products,
    };

    // Send to Slack directly (but don't fail the order if it fails)
    try {
      console.log(`[checkout Action] Sending Slack notification for order ${merchantReference}`);
      await sendOrderNotification(orderData, 'order_notification');
      console.log(`[checkout Action] Successfully sent Slack notification for order ${merchantReference}`);
    } catch (slackError: any) {
      console.error(
        `[checkout Action] Failed to send Slack notification for order ${merchantReference}:`,
        slackError.message || slackError
      );
      // Don't fail the order processing if Slack fails - this is non-critical
      console.warn("[checkout Action] Order was processed successfully despite Slack notification failure");
    }

    // Send order for processing to n8n (which then saves to Supabase)
    try {
      console.log(`[checkout Action] Sending order ${merchantReference} for processing.`);
      await sendOrderForProcessing(orderData);
      console.log(`[checkout Action] Successfully sent order ${merchantReference} for processing.`);
    } catch (processingError: any) {
      console.error(
        `[checkout Action] Failed to send order ${merchantReference} for processing:`,
        processingError.message || processingError
      );
      // This is critical, so we might want to handle it more robustly,
      // but for now, we'll just log and proceed with payment status.
      console.error("[checkout Action] CRITICAL: Order was NOT fully processed (Supabase save failed) despite payment confirmation.");
    }

    // Return based on payment status
    if (internalPaymentStatus === "paid") {
      return {
        success: true,
        paymentStatus: "COMPLETED",
        confirmationCode: pesapalTransaction.confirmationCode,
      };
    } else if (internalPaymentStatus === "pending") {
      return {
        success: true,
        paymentStatus: "PENDING",
        confirmationCode: pesapalTransaction.confirmationCode,
      };
    } else {
      return {
        success: true,
        paymentStatus: "FAILED",
        error: `Payment status: ${pesapalTransaction.paymentStatusDescription}`,
      };
    }
  } catch (error: any) {
    console.error("[checkout Action] Error processing order:", error);
    return {
      success: false,
      paymentStatus: "UNKNOWN",
      error: `Failed to confirm payment status or process order: ${error.message}`,
    };
  }
}

/**
 * Alternative function to send Slack notification via API route (if you prefer this approach)
 */
export async function sendSlackNotificationViaAPI(orderData: N8nPayload): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/slack-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API call failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log(`[checkout Action] Slack notification sent successfully:`, result);
    return true;
  } catch (error: any) {
    console.error(`[checkout Action] Failed to send Slack notification via API:`, error.message);
    return false;
  }
}