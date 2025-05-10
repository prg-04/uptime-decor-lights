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
import { sendOrderToN8N } from "@/lib/sendOrderToN8N";
import { v4 as uuidv4 } from "uuid";

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

// Define structure for confirmPesapalOrderAndTriggerN8N result
interface ConfirmOrderResult {
  success: boolean;
  paymentStatus: "COMPLETED" | "PENDING" | "FAILED" | "INVALID" | "UNKNOWN";
  error?: string | null;
  confirmationCode?: string | null;
}

// N8N Payload types - ensure these match n8n webhook expectations
interface N8nProductDetail {
  product_id: string;
  name: string;
  quantity: number; // Ensure this is number for n8n
  price: number;
  image_url: string | null;
}

export interface N8nPayload {
  order_number: string; // Corresponds to PesaPal merchant_reference
  order_tracking_id: string;
  confirmation_code: string | null;
  payment_status: "paid" | "pending" | "failed"; // Standardized status for n8n
  amount: number;
  payment_method: string | null;
  created_date: string; // ISO string
  payment_account: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_location: string;
  clerk_id: string;
  city_town: string;
  products: N8nProductDetail[];
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
if (!N8N_WEBHOOK_URL) {
  console.warn(
    "[Action Init] CRITICAL: N8N_WEBHOOK_URL is not configured in environment variables. n8n integration will fail."
  );
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
  const orderId = `LH-${uuidv4().split("-")[0].toUpperCase()}`;
  const orderDescription = `Uptime Decor Lights Order #${orderId}`;
  const appBaseUrl = process.env.NEXT_PUBLIC_PESAPAL_CALLBACK_URL; // For constructing callback_url

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
    // token is logged inside getAuthToken

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

    // PesaPal expects the callback_url to be the page user lands on after payment attempt
    const pesapalCallbackUrl = `${appBaseUrl}/success`; // User lands on /success page
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
      pesapalCallbackUrl, // Pass the success page URL
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
 * Server action called from SuccessPage to confirm PesaPal transaction status and trigger n8n.
 */
export async function confirmPesapalOrderAndTriggerN8N(
  merchantReference: string | null,
  transactionTrackingId: string | null,
  customerDetails: CustomerDetails | null, // Passed from localStorage on SuccessPage
  cartSnapshot: CartItem[] | null // Passed from localStorage on SuccessPage
): Promise<ConfirmOrderResult> {
  console.log("[Action confirmAndTriggerN8N] Processing payment confirmation:");
  console.log(`  Merchant Reference: ${merchantReference}`);
  console.log(`  Transaction Tracking ID: ${transactionTrackingId}`);

  if (!merchantReference || !transactionTrackingId) {
    console.error(
      "[Action confirmAndTriggerN8N] Missing merchantReference or transactionTrackingId."
    );
    return {
      success: false,
      paymentStatus: "INVALID",
      error: "Missing payment identifiers for confirmation.",
    };
  }
  if (!customerDetails) {
    console.error("[Action confirmAndTriggerN8N] Missing customerDetails.");
    return {
      success: false,
      paymentStatus: "INVALID",
      error: "Missing customer details for order processing.",
    };
  }
  if (!cartSnapshot || cartSnapshot.length === 0) {
    console.warn(
      "[Action confirmAndTriggerN8N] Cart snapshot is empty. n8n will receive no products."
    );
    // Continue to check payment status, but n8n payload will have empty products.
  }

  let pesapalTransaction: PaymentTransaction;
  try {
    pesapalTransaction = await checkPaymentStatus(transactionTrackingId);
    console.log(
      `[Action confirmAndTriggerN8N] PesaPal status for ${transactionTrackingId}:`,
      pesapalTransaction
    );

    if (pesapalTransaction.merchantReference !== merchantReference) {
      console.error(
        `[Action confirmAndTriggerN8N] Mismatched merchant reference! URL Ref: ${merchantReference}, PesaPal API Ref: ${pesapalTransaction.merchantReference}`
      );
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

    if (currentPaymentStatusDesc === "completed") {
      console.log(
        `[Action confirmAndTriggerN8N] Payment COMPLETED for ${merchantReference}. Constructing n8n payload...`
      );

      const n8nProducts: N8nProductDetail[] = (cartSnapshot || []).map(
        (item) => ({
          product_id: item._id,
          name: item.name,
          quantity: item.quantity, // Ensure this is a number
          price: item.price,
          image_url: item.imageUrl ?? item.images?.[0]?.asset?.url ?? null,
        })
      );

      const n8nPayload: N8nPayload = {
        order_tracking_id: transactionTrackingId,
        order_number: merchantReference,
        confirmation_code: pesapalTransaction.confirmationCode || null,
        payment_status: "paid", // Hardcode to 'paid' for n8n as we've confirmed completion
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
        products: n8nProducts,
      };

      console.log(
        `[Action confirmAndTriggerN8N] Triggering n8n webhook for ${merchantReference}`
      );
      await sendOrderToN8N(n8nPayload); // Await the n8n call
      console.log(
        `[Action confirmAndTriggerN8N] n8n webhook successfully triggered for ${merchantReference}.`
      );

      return {
        success: true,
        paymentStatus: "COMPLETED",
        confirmationCode: pesapalTransaction.confirmationCode,
      };
    } else if (currentPaymentStatusDesc === "pending") {
      console.log(
        `[Action confirmAndTriggerN8N] Payment status for ${merchantReference} is PENDING. n8n not triggered.`
      );
      return {
        success: true, // Action succeeded, but payment is pending
        paymentStatus: "PENDING",
        confirmationCode: pesapalTransaction.confirmationCode,
      };
    } else {
      // FAILED, INVALID, UNKNOWN
      console.log(
        `[Action confirmAndTriggerN8N] Payment status for ${merchantReference} is ${currentPaymentStatusDesc}. n8n not triggered.`
      );
      return {
        success: true, // Action succeeded, but payment not completed
        paymentStatus: pesapalTransaction.status || "FAILED", // Use mapped status or default to FAILED
        error: `Payment status: ${pesapalTransaction.paymentStatusDescription}`,
      };
    }
  } catch (error: any) {
    console.error(
      `[Action confirmAndTriggerN8N] Error during PesaPal status check or n8n trigger for ${transactionTrackingId}:`,
      error
    );
    return {
      success: false,
      paymentStatus: "UNKNOWN",
      error: `Failed to confirm payment status or trigger order processing: ${error.message}`,
    };
  }
}
