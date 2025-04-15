// lib/daraja.ts

/**
 * Complete Daraja API implementation with error handling,
 * transaction status checking, and validation
 */

// Environment variables - make sure these are in your .env.local file
const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
const shortcode = process.env.MPESA_SHORTCODE!;
const passkey = process.env.MPESA_PASSKEY!;
const callbackUrl = process.env.MPESA_CALLBACK_URL!;
const baseUrl =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

interface TokenResponse {
  access_token: string;
  expires_in: string;
}

interface StkPushParams {
  amount: number;
  phoneNumber: string;
  orderNumber: string;
  accountReference?: string;
  transactionDesc?: string;
}

interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface StkQueryParams {
  checkoutRequestId: string;
}

interface StkQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

/**
 * Validates and formats a Kenyan phone number to the required format
 * Accepts formats like: 07XXXXXXXX, 7XXXXXXXX, +254XXXXXXXX, 254XXXXXXXX
 * Returns: 254XXXXXXXXX (9-digit number with 254 prefix)
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, "");

  // Handle Kenyan phone number formats
  if (cleaned.startsWith("0")) {
    // Remove leading 0 and add 254 prefix
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    // If it's just 9 digits without prefix
    cleaned = "254" + cleaned;
  } else if (!cleaned.startsWith("254")) {
    throw new Error("Invalid phone number format");
  }

  // Validate final length (should be 12 digits for Kenya: 254XXXXXXXXX)
  if (cleaned.length !== 12) {
    throw new Error("Invalid phone number length");
  }

  return cleaned;
}

/**
 * Get OAuth access token from Safaricom
 * This token is required for all API calls
 */
export async function getAccessToken(): Promise<string> {
  try {
    const response = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64"),
        },
        cache: "no-store", // Prevent caching
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${errorText}`);
    }

    const data = (await response.json()) as TokenResponse;
    return data.access_token;
  } catch (error) {
    console.error("Error getting Daraja access token:", error);
    throw new Error(
      "Failed to authenticate with M-Pesa. Please try again later."
    );
  }
}

/**
 * Initiate STK Push request
 * This triggers the M-Pesa payment popup on the customer's phone
 */
export async function initiateStkPushDaraja({
  amount,
  phoneNumber,
  orderNumber,
  accountReference,
  transactionDesc,
}: StkPushParams): Promise<StkPushResponse> {
  try {
    // Format phone number to ensure it's in the correct format
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Generate timestamp in the format YYYYMMDDHHmmss
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    // Generate password (shortcode + passkey + timestamp)
    const password = Buffer.from(shortcode + passkey + timestamp).toString(
      "base64"
    );

    // Get access token
    const token = await getAccessToken();

    // Build request body
    const requestBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // Ensure it's a whole number
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || orderNumber,
      TransactionDesc: transactionDesc || `Order ${orderNumber}`,
    };

    // Make API request
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`STK Push failed: ${errorData}`);
    }

    const result = (await response.json()) as StkPushResponse;

    // Validate response
    if (result.ResponseCode !== "0") {
      throw new Error(`STK Push failed: ${result.ResponseDescription}`);
    }

    return result;
  } catch (error) {
    console.error("STK Push error:", error);
    throw error;
  }
}

/**
 * Check the status of an STK Push transaction
 * Useful to poll and confirm if a transaction was completed
 */
export async function checkStkPushStatus({
  checkoutRequestId,
}: StkQueryParams): Promise<StkQueryResponse> {
  try {
    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(shortcode + passkey + timestamp).toString(
      "base64"
    );

    // Get access token
    const token = await getAccessToken();

    // Make API request
    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`STK query failed: ${errorData}`);
    }

    return (await response.json()) as StkQueryResponse;
  } catch (error) {
    console.error("STK query error:", error);
    throw error;
  }
}
