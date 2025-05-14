/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// --- Interfaces ---
interface AuthResponse {
  token: string;
  expiryDate: string;
  error: { code: string; message?: string; error_data?: any } | null;
  status: string;
  message: string;
}

interface SubmitOrderRequestPayload {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address?: string | null;
    phone_number?: string | null;
    country_code: string;
    first_name?: string | null;
    last_name?: string | null;
    line_1?: string | null;
    line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    zip_code?: string | null;
  };
}

interface SubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: { code: string; message: string; error_data?: any | null } | null;
  status: string;
}

interface TransactionStatusResponse {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code?: string;
  currency: string;
  status: string;
  error?: { code: string; message?: string; error_data?: any } | null;
  order_tracking_id: string;
}

export interface PaymentTransaction {
  transactionTrackingId: string;
  merchantReference: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentStatusCode?: string | number; // Keep as string | number
  paymentStatusDescription?: string;
  status?: "COMPLETED" | "PENDING" | "FAILED" | "INVALID" | "UNKNOWN";
  statusDate?: string;
  confirmationCode?: string;
  message?: string;
  paymentAccount?: string;
  error?: { code?: string | number; message?: string; details?: any } | null;
}

// --- Environment Variables ---
// These are accessed server-side only (e.g., in Server Actions)
const PESAPAL_CONSUMER_KEY = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_CODE;

// This is the URL PesaPal will POST IPN data to. Must be publicly accessible.
// Used in registerIpnUrl function.
const IPN_URL_TO_REGISTER = process.env.NEXT_PUBLIC_PESAPAL_IPN_URL;


let authToken: string | null = null;
let tokenExpiry: Date | null = null;

const apiUrl = process.env.NEXT_PUBLIC_PESAPAL_API_URL;
// Helper to ensure API URL is defined before use within functions

async function makeApiRequest<T>(
  url: string, // Full URL should be passed now
  method: "GET" | "POST",
  body?: any,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = { Accept: "application/json" };
  if (method === "POST" && body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const urlPath = new URL(url).pathname;
  if (body && method === "POST" && url.includes("/Auth/RequestToken")) {
    console.log(
      "  Body: { consumer_key: [Loaded], consumer_secret: [Loaded] }"
    );
  } else if (body && method === "POST") {
    console.log(
      "  Body (partial):",
      JSON.stringify(body).substring(0, 200) + "..."
    );
  }
  if (token)
    console.log(
      `  Authorization: Bearer ${token.substring(0, 10)}...[Censored]`
    );

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError: any) {
    console.error(
      `[PesaPal Error] Network error during ${method} ${urlPath}:`,
      networkError
    );
    throw new Error(
      `Network error connecting to PesaPal: ${networkError.message}`
    );
  }

  let responseBodyText: string = "";
  try {
    responseBodyText = await response.text();
    if (responseBodyText.length > 0)
      console.log(
        `Raw Response Body (${response.status}): ${responseBodyText.substring(0, 5)}...`
      );
    else if (response.ok && response.status !== 204)
      console.warn(
        `${method} ${urlPath}: Received ${response.status} OK but with empty body.`
      );
  } catch (textError: any) {
    console.warn(
      `[PesaPal Warning] Could not read response body text for ${method} ${urlPath}: ${textError.message}`
    );
  }

  if (!response.ok) {
    let errorDetails: any = {
      message: `PesaPal API request failed with status ${response.status} ${response.statusText}`,
    };
    try {
      if (responseBodyText) {
        const parsedError = JSON.parse(responseBodyText);
        errorDetails = {
          message:
            parsedError?.error?.message ||
            parsedError?.message ||
            errorDetails.message,
          code:
            parsedError?.error?.code ||
            parsedError?.status_code ||
            parsedError?.code ||
            response.status.toString(),
          data: parsedError?.error?.error_data || parsedError,
        };
        console.error(
          `[PesaPal Error] Parsed Error Details:`,
          JSON.stringify(errorDetails, null, 2)
        );
      }
    } catch (e) {
      if (responseBodyText)
        errorDetails.message += ` - Response: ${responseBodyText}`;
      console.error(
        `[PesaPal Error] Non-JSON error response: ${errorDetails.message}`
      );
    }
    const finalErrorMessage = `PesaPal API Error: ${errorDetails.message}${errorDetails.code ? ` (Code: ${errorDetails.code})` : ""}`;
    throw new Error(finalErrorMessage);
  }

  if (response.status === 204 || responseBodyText.length === 0) {
    console.log(
      `${method} ${urlPath}: ${response.status} Success (No Content or Empty Body)`
    );
    return {} as T;
  }

  try {
    const data: T = JSON.parse(responseBodyText);
    if (url.includes("/Auth/RequestToken") && "token" in data) {
      const tokenInfo = data as unknown as AuthResponse;
   
    }
    return data;
  } catch (parseError: any) {
    console.error(
      `[PesaPal Error] Failed to parse successful JSON response for ${method} ${urlPath}:`,
      parseError
    );
    throw new Error(
      `Failed to parse successful PesaPal response: ${parseError.message}`
    );
  }
}

export async function getAuthToken(): Promise<string> {
  if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
    console.error(
      "[PesaPal Auth Error] Configuration Error: PesaPal Consumer Key or Secret is not set server-side."
    );
    throw new Error(
      "PesaPal API credentials (key/secret) are not configured on the server."
    );
  }

  if (authToken && tokenExpiry && new Date() < tokenExpiry) {
    return authToken;
  }
  const pesapalAuthUrl = `${apiUrl}/Auth/RequestToken`;
  try {
    const authData = await makeApiRequest<AuthResponse>(
      pesapalAuthUrl,
      "POST",
      {
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      }
    );
    if (authData.status !== "200" || !authData.token) {
      const errorMessage =
        authData.error?.message ||
        authData.message ||
        "Failed to authenticate with PesaPal API. Response did not contain a valid token.";
      console.error("[PesaPal Auth Error] Authentication failed:", authData);
      throw new Error(errorMessage);
    }
    authToken = authData.token;
    tokenExpiry = new Date(new Date(authData.expiryDate).getTime() - 60 * 1000);
    console.log(
      `[PesaPal Service] New PesaPal token obtained. Partial: ${authToken.substring(0, 10)}...`
    );
    return authToken;
  } catch (error: any) {
    console.error(
      "[PesaPal Auth Error] Error during token fetch:",
      error.message || error
    );
    authToken = null;
    tokenExpiry = null;
    throw error;
  }
}

export async function registerIpnUrl(token: string): Promise<string> {
  if (!IPN_URL_TO_REGISTER) {
    console.error(
      "[PesaPal IPN Error] Configuration Error: NEXT_PUBLIC_PESAPAL_IPN_URL is not set for registration."
    );
    throw new Error(
      "PesaPal IPN registration URL is not configured on the server."
    );
  }
  interface RegisterIpnResponse {
    url: string;
    created_date: string;
    ipn_id: string;
    error?: any;
    status?: string;
    message?: string;
  }

  const pesapalIpnRegisterUrl = `${apiUrl}/URLSetup/RegisterIPN`;
  try {
    const response = await makeApiRequest<RegisterIpnResponse>(
      pesapalIpnRegisterUrl,
      "POST",
      { url: IPN_URL_TO_REGISTER, ipn_notification_type: "POST" },
      token
    );
    if (response.error || response.status !== "200" || !response.ipn_id) {
      const errorMessage =
        response.error?.message ||
        response.message ||
        `Failed to register IPN URL. Status: ${response.status ?? "unknown"}`;
      console.error(
        "[PesaPal IPN Error] Failed to register IPN URL:",
        response
      );
      throw new Error(errorMessage);
    }
    console.log(
      `[PesaPal IPN] Successfully registered/retrieved IPN ID: ${response.ipn_id}`
    );
    return response.ipn_id;
  } catch (error: any) {
    console.error(
      "[PesaPal IPN Error] Error during IPN registration:",
      error.message || error
    );
    throw error;
  }
}

export async function submitOrderRequest(
  token: string,
  ipn_id: string,
  amount: number,
  currency: string,
  orderId: string,
  description: string,
  callbackUrl: string, // Added callbackUrl parameter
  billingAddress: SubmitOrderRequestPayload["billing_address"]
): Promise<SubmitOrderResponse> {
  const requestBody: SubmitOrderRequestPayload = {
    id: orderId,
    currency: currency,
    amount: amount,
    description: description,
    callback_url: callbackUrl,
    notification_id: ipn_id,
    billing_address: billingAddress,
  };

  const pesapalSubmitOrderUrl = `${apiUrl}/Transactions/SubmitOrderRequest`;
  try {
    console.log(
      `[PesaPal Submit] Sending SubmitOrderRequest API call for ${orderId}...`
    );
    const response = await makeApiRequest<SubmitOrderResponse>(
      pesapalSubmitOrderUrl,
      "POST",
      requestBody,
      token
    );
    if (response.error || !response.redirect_url) {
      const errorMessage =
        response.error?.message ||
        `PesaPal SubmitOrderRequest failed or missing redirect_url.`;
      console.error(
        `[PesaPal Submit Error] API error: ${errorMessage}`,
        response
      );
      throw new Error(
        `${errorMessage}${response.error?.code ? ` (Code: ${response.error.code})` : ""}`
      );
    }
    return response;
  } catch (error: any) {
    console.error(
      `[PesaPal Submit Error] Failed during submit order for ${orderId}:`,
      error.message || error
    );
    throw error;
  }
}

function mapPesapalStatus(
  pesapalDescription?: string
): PaymentTransaction["status"] {
  if (!pesapalDescription) return "UNKNOWN";
  const lowerCaseStatus = pesapalDescription.toLowerCase();
  switch (lowerCaseStatus) {
    case "completed":
      return "COMPLETED";
    case "pending":
      return "PENDING";
    case "failed":
      return "FAILED";
    case "invalid":
      return "INVALID";
    default:
      console.warn(
        `[PesaPal Status Map] Unknown PesaPal status: ${pesapalDescription}`
      );
      return "UNKNOWN";
  }
}

export async function checkPaymentStatus(
  orderTrackingId: string
): Promise<PaymentTransaction> {
  if (!orderTrackingId) {
    console.error(
      "[PesaPal Status Check Error] Order Tracking ID is required."
    );
    return {
      transactionTrackingId: "N/A",
      merchantReference: "N/A",
      amount: 0,
      currency: "N/A",
      status: "INVALID",
      paymentStatusDescription: "Missing Order Tracking ID",
      statusDate: new Date().toISOString(),
      message: "Missing Order Tracking ID.",
      error: {
        code: "MISSING_PARAM",
        message: "Order Tracking ID is required.",
      },
    };
  }
  const token = await getAuthToken();
  const urlWithParams = `${apiUrl}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;

  try {
    const response = await makeApiRequest<TransactionStatusResponse>(
      urlWithParams,
      "GET",
      undefined,
      token
    );

    if (response.error?.message || response.error?.code) {
      const errorMessage =
        response.error.message || `Failed to get transaction status.`;
      console.error(
        `[PesaPal Status Check Error] API error for ${orderTrackingId}: ${errorMessage}`,
        response.error
      );
      return {
        transactionTrackingId: orderTrackingId,
        merchantReference: response.merchant_reference || "N/A",
        amount: response.amount || 0,
        currency: response.currency || "N/A",
        status: "INVALID",
        paymentStatusDescription:
          response.payment_status_description || "Error retrieving status",
        statusDate: response.created_date || new Date().toISOString(),
        message: errorMessage,
        error: {
          code: response.error.code || "API_ERROR",
          message: errorMessage,
          details: response.error.error_data || response,
        },
      };
    }
    const internalStatus = mapPesapalStatus(
      response.payment_status_description
    );

    return {
      transactionTrackingId: response.order_tracking_id,
      merchantReference: response.merchant_reference,
      amount: response.amount,
      currency: response.currency,
      paymentMethod: response.payment_method ?? null,
      paymentStatusCode: response.status_code, // This is PesaPal's internal code
      paymentStatusDescription: response.payment_status_description, // Raw PesaPal status
      status: internalStatus, // Mapped internal status
      statusDate: response.created_date,
      confirmationCode: response.confirmation_code ?? null,
      paymentAccount: response.payment_account ?? null,
      message: response.message,
      error: null,
    };
  } catch (error: any) {
    console.error(
      `[PesaPal Status Check Error] Network/Parsing error for ${orderTrackingId}:`,
      error.message || error
    );
    const errorMessage = error.message || "Unknown error during status check.";
    return {
      transactionTrackingId: orderTrackingId,
      merchantReference: "N/A",
      amount: 0,
      currency: "N/A",
      status: "UNKNOWN",
      paymentStatusDescription: "Error during status check",
      statusDate: new Date().toISOString(),
      message: `Status Check Failed: ${errorMessage}`,
      error: { code: "FETCH_ERROR", message: errorMessage },
    };
  }
}
