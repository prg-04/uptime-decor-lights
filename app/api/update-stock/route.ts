// apps/app/api/update-stock/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const productRef = doc(collection(db, "products"), productId);
    const snapshot = await getDoc(productRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const currentStock = snapshot.data()?.stock || 0;
    await updateDoc(productRef, { stock: currentStock - quantity });
    return NextResponse.json({
      success: true,
      newStock: currentStock - quantity,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
