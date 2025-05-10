import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Product = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderDetails = {
  order_number: string;
  confirmation_code: string;
  payment_status: "pending" | "paid" | "failed";
  amount: number;
  payment_method: string;
  created_date: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  products: Product[];
};

export async function saveOrderToFirestore(orderDetails: OrderDetails) {
  const orderDoc = {
    ...orderDetails,
    timestamp: serverTimestamp(), // Useful for ordering by time later
  };

  const docRef = await addDoc(collection(db, "orders"), orderDoc);
  return docRef.id; // You can return it if needed
}
