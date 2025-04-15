// components/checkout/CheckoutForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/store";
import MpesaPayment from "./MpesaPayment";

// Form validation schema
const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .refine(
      (val) => /^(?:\+254|0)?[17][0-9]{8}$/.test(val),
      "Please enter a valid Kenyan phone number"
    ),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const { user } = useUser();
  const { getGroupedCartItems, clearCart } = useCartStore();
  const groupedItems = getGroupedCartItems();
  const [showPayment, setShowPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber: string;
    phoneNumber: string;
    amount: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phoneNumber: "",
    },
  });

  // Calculate total amount
  const totalAmount = groupedItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      // Generate a unique order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 6)}`;

      // Format phone number for M-Pesa (ensure it has the country code)
      let formattedPhone = data.phoneNumber;
      if (formattedPhone.startsWith("0")) {
        formattedPhone = `254${formattedPhone.slice(1)}`;
      } else if (
        !formattedPhone.startsWith("254") &&
        !formattedPhone.startsWith("+254")
      ) {
        formattedPhone = `254${formattedPhone}`;
      }

      // Store details needed for payment
      setOrderDetails({
        orderNumber,
        phoneNumber: formattedPhone.replace("+", ""),
        amount: totalAmount,
      });

      // Show payment component
      setShowPayment(true);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    // Clear the cart
    clearCart();

    // Redirect to thank you page
    router.push("/thank-you");
  };

  const handlePaymentError = (errorMessage: string) => {
    toast.error(`Payment failed: ${errorMessage}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!showPayment ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold">Checkout</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                M-Pesa Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="e.g. 0712345678 or 254712345678"
                {...register("phoneNumber")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter the phone number you want to use for M-Pesa payment
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>KES {totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      ) : (
        orderDetails && (
          <MpesaPayment
            amount={orderDetails.amount}
            phoneNumber={orderDetails.phoneNumber}
            orderNumber={orderDetails.orderNumber}
            userId={user?.id || "guest"}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )
      )}
    </div>
  );
}
