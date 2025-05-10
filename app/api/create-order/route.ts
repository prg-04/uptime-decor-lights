// apps/app/api/create-order/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const order = await req.json();
    if (!order?.customer?.email || !Array.isArray(order.items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      receivedAt: serverTimestamp(),
    });
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
