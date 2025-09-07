"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * OrderProduct interface - represents a product in an order
 * This must match the structure of the 'order_products' table in Supabase
 *
 * @property id - UUID primary key
 * @property order_id - Foreign key to orders table
 * @property product_id - Sanity product _id
 * @property name - Product name
 * @property quantity - Number of items (must be a valid number)
 * @property price - Unit price (must be a valid number)
 * @property image_url - URL to product image (can be null)
 */
export interface OrderProduct {
  id: string; // UUID primary key from order_products table
  order_id: string; // Foreign key to orders table
  product_id: string; // Sanity product _id
  name: string;
  quantity: number; // Must be a valid number
  price: number; // Must be a valid number
  image_url: string | null; // Can be null if no image available
}

export interface Order {
  id: string; // Corresponds to orders.id (UUID)
  order_number: string;
  confirmation_code: string | null;
  payment_status: string; // e.g., 'paid', 'pending', 'failed'
  amount: number;
  payment_method: string | null;
  created_at: string; // ISO string or Date object
  payment_account: string | null;
  customer_email: string; // Keep for reference, but primary link is clerk_user_id
  customer_name: string | null;
  customer_phone: string | null;
  clerk_user_id?: string | null; // Added Clerk User ID
  // Add other fields from your 'orders' table as needed
  // e.g., shipping_address, fulfillment_status
}

export interface OrderWithProducts extends Order {
  products: OrderProduct[];
}

interface ActionResult {
  success: boolean;
  data?: OrderWithProducts[];
  error?: string | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error(
    "CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not defined for server actions."
  );
}
if (!supabaseServiceRoleKey) {
  console.error(
    "CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not defined for server actions."
  );
}

// Updated to accept clerkUserId
export async function getOrdersForUserAction(
  clerkUserId: string
): Promise<ActionResult> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      success: false,
      error: "Supabase configuration is missing on the server.",
    };
  }
  if (!clerkUserId) {
    return {
      success: false,
      error: "Clerk User ID is required to fetch orders.",
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  console.log(
    `[Action getOrdersForUser] Fetching orders for Clerk User ID: ${clerkUserId}`
  );

  try {
    // 1. Fetch orders for the customer using clerk_user_id
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkUserId) // Filter by clerk_user_id
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error(
        "[Action getOrdersForUser] Error fetching orders:",
        ordersError
      );
      return {
        success: false,
        error: `Failed to fetch orders: ${ordersError.message}`,
      };
    }

    if (!ordersData || ordersData.length === 0) {
      console.log(
        `[Action getOrdersForUser] No orders found for Clerk User ID: ${clerkUserId}`
      );
      return { success: true, data: [] };
    }

    // 2. For each order, fetch its products from the correct table
    const ordersWithProducts: OrderWithProducts[] = [];

    for (const order of ordersData as Order[]) {
      // Query the correct table: order_products instead of orders
      const { data: productsData, error: productsError } = await supabaseAdmin
        .from("order_products")
        .select("*")
        .eq("order_id", order.id);

      let products: OrderProduct[] = [];
      if (productsError) {
        console.error(
          `[Action getOrdersForUser] Error fetching products for order ${order.id}:`,
          productsError
        );
      } else {
        // Explicitly convert price and quantity to numbers with validation
        products =
          productsData?.map((p: any) => ({
            id: p.id,
            order_id: p.order_id,
            product_id: p.product_id,
            name: p.name,
            // Ensure price is a valid number, default to 0 if invalid
            price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
            // Ensure quantity is a valid number, default to 1 if invalid
            quantity: typeof p.quantity === 'number' ? p.quantity : parseInt(p.quantity) || 1,
            image_url: p.image_url || null,
          })) || [];
      }

      ordersWithProducts.push({
        ...order,
        products,
      });
    }

    return { success: true, data: ordersWithProducts };
  } catch (error: Error | unknown) {
    console.error("[Action getOrdersForUser] Unexpected error:", error);
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
