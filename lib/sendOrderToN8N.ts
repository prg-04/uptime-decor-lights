/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/sendOrdersToN8N.ts
import type { N8nPayload } from "@/app/checkout/actions";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function sendOrderToN8N(orderPayload: N8nPayload): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    console.warn(
      "[sendOrderToN8N] N8N_WEBHOOK_URL is not configured. Skipping n8n trigger."
    );
    // Optionally throw an error or return a status to indicate failure
    // For a fire-and-forget, just returning might be okay, but for critical paths, throw.
    throw new Error("N8N_WEBHOOK_URL is not configured on the server.");
    // return;
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const responseBodyText = await response
      .text()
      .catch(() => "Could not read n8n response body");

    if (!response.ok) {
      console.error(
        `[sendOrderToN8N] Failed to send order to n8n. Status: ${response.status} ${response.statusText}. Response: ${responseBodyText}`
      );
      throw new Error(
        `Failed to send order to n8n. Status: ${response.status}, Body: ${responseBodyText}`
      );
    } 
    
    
  } catch (error: any) {
    console.error(
      "[sendOrderToN8N] Exception while sending order to n8n:",
      error
    );
    throw error; // Re-throw to be caught by the caller
  }
}
