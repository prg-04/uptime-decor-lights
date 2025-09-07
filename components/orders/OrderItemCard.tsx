"use client";

import type { OrderWithProducts } from "@/app/orders/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"; // For date formatting

interface OrderItemCardProps {
  order: OrderWithProducts;
}

export function OrderItemCard({ order }: OrderItemCardProps) {
  const formattedDate = order.created_at
    ? format(new Date(order.created_at), "MMMM d, yyyy h:mm a")
    : "N/A";

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "paid" || lowerStatus === "completed") return "default"; // Consider 'default' as success (often green if customized)
    if (lowerStatus === "pending") return "secondary";
    if (lowerStatus === "failed" || lowerStatus === "cancelled")
      return "destructive";
    return "outline";
  };

  console.log(order.products);

  // Validate product data and provide fallbacks
  const validatedProducts = order.products?.map(product => ({
    ...product,
    // Ensure we have valid values for display
    name: product.name || 'Unknown Product',
    quantity: typeof product.quantity === 'number' ? product.quantity : 1,
    price: typeof product.price === 'number' ? product.price : 0,
    image_url: product.image_url || null
  })) || [];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl md:text-2xl">
              Order #{order.order_number}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Placed on: <strong>{formattedDate}</strong>
            </p>
          </div>
          <Badge
            variant={getStatusVariant(order.payment_status)}
            className="text-sm capitalize"
          >
            {order.payment_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {validatedProducts.length > 0 ? (
          validatedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-4 py-3 border-b last:border-b-0"
            >
              <Image
                src={
                  // Use product image if available, otherwise use a more relevant fallback
                  product.image_url ||
                  (product.product_id ? `https://via.placeholder.com/80?text=${encodeURIComponent(product.name.slice(0, 10))}` : 'https://via.placeholder.com/80')
                }
                alt={product.name || 'Product image'}
                width={80}
                height={80}
                className="rounded-md object-cover aspect-square"
                unoptimized={!product.image_url || product.image_url?.includes("placeholder.com")}
                data-ai-hint="product photo"
              />
              <div className="flex-grow">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {typeof product.quantity === 'number' ? product.quantity : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: Ksh {typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                </p>
              </div>
              <p className="font-semibold text-right">
                {typeof product.price === 'number' && typeof product.quantity === 'number'
                  ? `Ksh ${(product.price * product.quantity).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            No product details available for this order.
          </p>
        )}
        <Separator />
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Payment Method:</p>
          <p className="font-medium">{order.payment_method || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Confirmation Code:</p>
          <p className="font-medium">{order.confirmation_code || "N/A"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center pt-4">
        <div className="text-lg font-bold">
          Total: Ksh {order.amount.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}
