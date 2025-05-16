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
import { processOrder } from "@/utils/orderProcessing";
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

const CALLBACK_URL = process.env.CALLBACK_URL;
if (!CALLBACK_URL) {
  console.warn(
    "[Action Init] CRITICAL: CALLBACK_URL is not configured in environment variables. n8n integration will fail."
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
  const orderId = generateOrderNumber();
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

    // Prepare order data
    const n8nProducts = (cartSnapshot || []).map((item) => ({
      product_id: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image_url: item.imageUrl ?? item.images?.[0]?.asset?.url ?? null,
    }));

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
      products: n8nProducts,
    };

    // Send to N8N if configured (but don't fail if it fails)
    try {
      if (CALLBACK_URL) {
        await sendOrderForProcessing(orderData);
      }
    } catch (n8nError) {
      console.warn(
        "[checkout Action] Failed to send to n8n, but order was processed:",
        n8nError
      );
    }

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
