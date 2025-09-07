/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdminClient";
import { sendSlackNotification } from "@/utils/slack";
import type { N8nProductDetail } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Destructure order info from body
    const {
      order_number,
      confirmation_code,
      payment_status,
      amount,
      payment_method,
      created_date,
      payment_account,
      customer_email,
      customer_name,
      customer_phone,
      shipping_location,
      clerk_id,
      city_town,
      products,
    } = body;

    // Step 1: Save order and get the generated UUID
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          order_number,
          confirmation_code,
          payment_status,
          amount,
          payment_method,
          created_at: created_date,
          payment_account,
          customer_email,
          customer_name,
          customer_phone,
          shipping_location,
          clerk_id,
          city_town,
        },
      ])
      .select("id")
      .single();

    if (orderError)
      throw new Error("Failed to save order: " + orderError.message);

    if (!orderData?.id)
      throw new Error("Failed to get order ID after insertion");

    /**
     * Step 2: Save order products with the generated order_id
     *
     * This is where the critical mapping happens:
     * - The N8nProductDetail type uses 'id' (from the cart)
     * - The database table uses 'product_id'
     *
     * We map id → product_id here to ensure the database receives the correct field name.
     */
    console.log("[API Route] Received products:", products);

    // Map products to order_products format, using id as product_id
    const orderProducts = products.map((product: N8nProductDetail) => ({
      product_id: product.id,  // Map id to product_id for database
      product_name: product.name,
      quantity: parseInt(product.quantity.toString(), 10),
      price: parseFloat(product.price.toString()),
      image_url: product.image_url,
      order_id: orderData.id,
    }));

    // Validate all products have required fields
    if (orderProducts.some((p: { product_id: string }) => !p.product_id)) {
      console.error("[API Route] Invalid product data: product_id is missing in some products");
      console.error("[API Route] Problematic products:", orderProducts.filter((p: { product_id: string }) => !p.product_id));

      // Rollback the order creation since products are invalid
      const { error: rollbackError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", orderData.id);

      if (rollbackError) {
        console.error("[API Route] Failed to rollback order creation:", rollbackError);
      } else {
        console.log("[API Route] Successfully rolled back order creation due to invalid product data");
      }

      throw new Error("Invalid product data: product_id cannot be null or undefined");
    }

    console.log("[API Route] Mapped order products:", orderProducts);

    // Use transaction to ensure data integrity
    const { error: productsError } = await supabaseAdmin
      .from("order_products")
      .insert(orderProducts);

    if (productsError) {
      console.error("[API Route] Product data that failed:", orderProducts);
      console.error("[API Route] Supabase error details:", productsError);

      // Rollback the order creation since products failed to save
      const { error: rollbackError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", orderData.id);

      if (rollbackError) {
        console.error("[API Route] Failed to rollback order creation:", rollbackError);
        throw new Error(
          `Failed to save order products: ${productsError.message}. ` +
          `Product data: ${JSON.stringify(orderProducts)}. ` +
          `Also failed to rollback order creation. Manual cleanup may be required.`
        );
      } else {
        console.log("[API Route] Successfully rolled back order creation due to product save failure");
        throw new Error(
          `Failed to save order products: ${productsError.message}. ` +
          `Product data: ${JSON.stringify(orderProducts)}. ` +
          `Order creation was rolled back.`
        );
      }
    }

    // Step 3: Send Slack notification
    await sendSlackNotification({
      order: {
        order_number,
        payment_status,
        amount,
        customer_name,
        customer_phone,
        shipping_location,
        city_town,
      },
      products: products.map((p: any) => ({
        product_name: p.name,
        quantity: parseInt(p.quantity, 10),
        price: parseFloat(p.price),
        image_url: p.image_url,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      orderId: orderData.id,
    });
  } catch (err: any) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
