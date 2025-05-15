/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/sendOrdersToN8N.ts
import type { N8nPayload } from "@/app/checkout/actions";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function sendOrderToN8N(orderPayload: N8nPayload): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    console.warn(
      "[sendOrderToN8N] N8N_WEBHOOK_URL is not configured. Skipping n8n trigger."
    );
    return; // Don't throw, just return as N8N is now optional
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let responseBodyText: string;
    try {
      responseBodyText = await response.text();
    } catch {
      responseBodyText = "Could not read n8n response body";
    }

    if (!response.ok) {
      console.error(
        `[sendOrderToN8N] Failed to send order ${orderPayload.order_number} to n8n. Status: ${response.status} ${response.statusText}. Response: ${responseBodyText}`
      );
      throw new Error(
        `Failed to send order to n8n. Status: ${response.status}, Body: ${responseBodyText}`
      );
    }

    console.log(
      `[sendOrderToN8N] Successfully sent order ${orderPayload.order_number} to n8n`
    );
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(
        `[sendOrderToN8N] Timeout while sending order ${orderPayload.order_number} to n8n`
      );
      throw new Error("Timeout while sending order to n8n");
    }

    console.error(
      `[sendOrderToN8N] Exception while sending order ${orderPayload.order_number} to n8n:`,
      error
    );
    throw error;
  }
}
