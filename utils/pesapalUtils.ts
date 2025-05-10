import { checkPaymentStatus, PaymentTransaction } from "@/services/pesapal";

/**
 * Helper function to delay execution.
 * @param ms Time to wait in milliseconds.
 * @returns A promise that resolves after the specified time.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls the PesaPal transaction status with exponential backoff.
 *
 * @param orderTrackingId The PesaPal Order Tracking ID.
 * @param maxRetries Maximum number of retry attempts.
 * @param initialDelay Initial delay in milliseconds before the first retry.
 * @returns A promise that resolves with the final PaymentTransaction status, or rejects if max retries are exceeded.
 */
export async function pollTransactionStatusWithBackoff(
  orderTrackingId: string,
  maxRetries: number = 5,
  initialDelay: number = 1000 // 1 second
): Promise<PaymentTransaction> {
  let attempt = 0;
  let currentDelay = initialDelay;


  while (attempt < maxRetries) {
    try {
      const statusResponse = await checkPaymentStatus(orderTrackingId);

      console.log(
        `[Polling Attempt ${attempt + 1}] Status for ${orderTrackingId}: ${
          statusResponse.status
        }`
      );

      // If status is final (COMPLETED or FAILED or INVALID), return immediately
      if (
        statusResponse.status === "COMPLETED" ||
        statusResponse.status === "FAILED" ||
        statusResponse.status === "INVALID"
      ) {
        console.log(
          `[Polling] Final status received for ${orderTrackingId}: ${statusResponse.status}`
        );
        return statusResponse;
      }

      // If status is PENDING or UNKNOWN, wait and retry
      attempt++;
      if (attempt < maxRetries) {
        console.log(
          `[Polling] Status is ${statusResponse.status}. Retrying in ${
            currentDelay / 1000
          }s...`
        );
        await delay(currentDelay);
        // Exponential backoff: double the delay for the next attempt
        currentDelay *= 2;
      } else {
        console.warn(
          `[Polling] Max retries reached for ${orderTrackingId}. Returning last known status: ${statusResponse.status}`
        );
        return statusResponse; // Return the last known status after max retries
      }
    } catch (error) {
      // Handle errors during the checkPaymentStatus call itself
      console.error(
        `[Polling Attempt ${
          attempt + 1
        }] Error checking status for ${orderTrackingId}:`,
        error
      );
      attempt++;
      if (attempt < maxRetries) {
        console.log(
          `[Polling] Error occurred. Retrying in ${currentDelay / 1000}s...`
        );
        await delay(currentDelay);
        currentDelay *= 2;
      } else {
        console.error(
          `[Polling] Max retries reached after error for ${orderTrackingId}. Giving up.`
        );
        // Rethrow the last error or return a specific error status
        if (error instanceof Error) throw error;
        throw new Error(
          "Failed to get transaction status after multiple retries."
        );
      }
    }
  }

  // Should theoretically not be reached if maxRetries > 0, but needed for TS
  console.error(
    `[Polling] Exited loop unexpectedly for ${orderTrackingId}. Max retries likely 0.`
  );
  throw new Error("Polling failed to determine transaction status.");
}

// --- Example Usage (Not part of the utility file itself) ---
/*
async function example() {
    try {
        const finalStatus = await pollTransactionStatusWithBackoff('YOUR_ORDER_TRACKING_ID');
        console.log('Final Polled Status:', finalStatus);
        // Process the final status (e.g., update order in database)
    } catch (error) {
        console.error('Polling ultimately failed:', error);
        // Handle the failure (e.g., mark order as requiring manual check)
    }
}
*/
