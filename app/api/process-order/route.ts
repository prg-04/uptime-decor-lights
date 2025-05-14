/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdminClient"; 
import { sendSlackNotification } from "@/lib/slack";
import { v4 as uuidv4 } from "uuid";

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

    // Step 1: Save order
   const orderId = uuidv4(); // always generate a valid UUID
   const businessOrderNumber =
     order_number ||
     `LH-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;


    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        id: orderId,
        order_number: businessOrderNumber,
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
    ]);

    if (orderError)
      throw new Error("Failed to save order: " + orderError.message);

    // Step 2: Save order products
    const productRecords = products.map((product: any) => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: product.product_id,
      product_name: product.name,
      quantity: parseInt(product.quantity, 10),
      price: parseFloat(product.price),
      image_url: product.image_url,
    }));

    const { error: productError } = await supabaseAdmin
      .from("order_products")
      .insert(productRecords);

    if (productError)
      throw new Error("Failed to save order products: " + productError.message);

    // Step 3: Send Slack message
    await sendSlackNotification({
      order: body,
      products: productRecords,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
