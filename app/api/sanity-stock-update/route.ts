// app/api/sanity-stock-update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityClient } from "@/lib/sanityClient"; // Use the configured client
import { SanityClient } from "@sanity/client"; // Import SanityClient type for patching

// Define the expected structure for each item in the request body
const StockUpdateItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Define the expected structure for the overall request body (an array of items)
const StockUpdateRequestSchema = z.array(StockUpdateItemSchema);

// Ensure the client has the token configured for write operations
const sanityWriteClient: SanityClient = sanityClient;

/**
 * POST handler for the stock update webhook.
 * Expects a JSON body with an array of { productId: string, quantity: number }.
 */
export async function POST(request: NextRequest) {

  // 1. Authentication/Authorization (Optional but Recommended)
  // Implement a check here if your webhook requires authentication (e.g., check a secret header)
  // const secret = request.headers.get('X-Webhook-Secret');
  // if (secret !== process.env.N8N_WEBHOOK_SECRET) {
  //   console.error('Unauthorized webhook call');
  //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  // }

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 2. Validate the request body shape
  const validationResult = StockUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    console.error(
      "Invalid request body format:",
      validationResult.error.errors
    );
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body format",
        errors: validationResult.error.errors,
      },
      { status: 400 }
    );
  }

  const updates = validationResult.data;

  if (updates.length === 0) {
    return NextResponse.json(
      { success: true, message: "No stock updates provided." },
      { status: 200 }
    );
  }

  // 3. Prepare Sanity mutations
  const transaction = sanityWriteClient.transaction();
  updates.forEach((item) => {
    transaction.patch(
      item.productId,
      (patch) =>
        // Decrement the stock field by the purchased quantity
        // Use inc() with a negative value for decrementing
        // Add bounds check to prevent negative stock if business logic requires it
        patch.dec({ stock: item.quantity })
      // Example with negative stock prevention:
      // patch
      //   .setIfMissing({ stock: 0 }) // Ensure stock exists, default to 0
      //   .dec({ stock: item.quantity })
      //   // Optionally, clamp to 0 if it goes negative (depends on business rules)
      //   // .set('stock', Math.max(0, currentStock - item.quantity)) // This requires fetching current stock first, making it more complex. inc/dec is simpler if negative is allowed temporarily or handled elsewhere.
    );
  });

  // 4. Execute the transaction
  try {
    const result = await transaction.commit({
      autoGenerateArrayKeys: true, // Usually needed for array operations, safe here
      // Set returnDocuments to false if you don't need the updated docs back
      // returnDocuments: false,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Stock updated successfully",
        results: result.results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error committing Sanity transaction:", error);

    // Log more details from Sanity client errors
    if (error.response && error.response.body) {
      console.error(
        "Sanity API Error Body:",
        JSON.stringify(error.response.body, null, 2)
      );
    } else {
      console.error("Raw error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update stock in Sanity",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests if needed (e.g., for health checks)
export async function GET() {
  return NextResponse.json({
    message:
      "Sanity Stock Update webhook endpoint is active. Use POST to update stock.",
  });
}
