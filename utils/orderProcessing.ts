import { supabaseAdmin } from "@/utils/supabaseAdminClient";
import { sendSlackNotification } from "@/utils/slack";
import { v4 as uuidv4 } from "uuid";
import type { N8nPayload } from "@/types";

export async function processOrder(orderData: N8nPayload): Promise<void> {
  try {
    // Step 1: Save order to Supabase
    const orderId = uuidv4();
    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        id: orderId,
        order_number: orderData.order_number,
        confirmation_code: orderData.confirmation_code,
        payment_status: orderData.payment_status,
        amount: orderData.amount,
        payment_method: orderData.payment_method,
        created_at: orderData.created_date,
        payment_account: orderData.payment_account,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        shipping_location: orderData.shipping_location,
        clerk_id: orderData.clerk_id,
        city_town: orderData.city_town,
      },
    ]);

    if (orderError) {
      console.error("[processOrder] Failed to save order:", orderError);
      throw new Error(`Failed to save order: ${orderError.message}`);
    }

    // Step 2: Save order products
    const productRecords = orderData.products.map((product) => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: product.id,  // Use id as product_id
      product_name: product.name,
      quantity: product.quantity,
      price: product.price,
      image_url: product.image_url,
    }));

    const { error: productError } = await supabaseAdmin
      .from("order_products")
      .insert(productRecords);

    if (productError) {
      console.error(
        "[processOrder] Failed to save order products:",
        productError
      );
      throw new Error(`Failed to save order products: ${productError.message}`);
    }

    // Step 3: Send Slack notification
    await sendSlackNotification({
      order: {
        order_number: orderData.order_number,
        payment_status: orderData.payment_status,
        amount: orderData.amount,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        shipping_location: orderData.shipping_location,
        city_town: orderData.city_town,
      },
      products: productRecords.map((p) => ({
        product_name: p.product_name,
        quantity: p.quantity,
        price: p.price,
        image_url: p.image_url || "https://via.placeholder.com/150",
      })),
    });

    console.log(
      "[processOrder] Successfully processed order:",
      orderData.order_number
    );
  } catch (error) {
    console.error("[processOrder] Error processing order:", error);
    throw error;
  }
}
