/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdminClient";
import { sendSlackNotification } from "@/utils/slack";

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

    // Step 2: Save order products with the generated order_id
    const orderProducts = products.map((product: any) => ({
      product_id: product.product_id,
      product_name: product.name,
      quantity: parseInt(product.quantity, 10),
      price: parseFloat(product.price),
      image_url: product.image_url,
      order_id: orderData.id,
    }));

    const { error: productsError } = await supabaseAdmin
      .from("order_products")
      .insert(orderProducts);

    if (productsError)
      throw new Error(
        "Failed to save order products: " + productsError.message
      );

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
