"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getOrdersForUserAction } from "./actions";
import type { OrderWithProducts } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ShoppingBag, Loader2 } from "lucide-react";
import { OrderItemCard } from "@/components/orders/OrderItemCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUserLoaded && user && user.id) {
      // Check for user.id (Clerk User ID)
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Pass user.id to the action
          const result = await getOrdersForUserAction(user.id);
          if (result.success && result.data) {
            setOrders(result.data);
          } else {
            setError(result.error || "Failed to fetch orders.");
            setOrders([]);
          }
        } catch (e: Error | unknown) {
          console.error("Error fetching orders:", e);
          setError("An unexpected error occurred while fetching your orders.");
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else if (isUserLoaded && !user) {
      setIsLoading(false);
      setError("Please log in to view your orders.");
    }
  }, [user, isUserLoaded]);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-16 w-16 mx-auto text-accent animate-spin mb-6" />
        <h1 className="text-3xl font-bold mb-4">Loading Your Orders...</h1>
        <p className="text-muted-foreground">Please wait a moment.</p>
        <div className="space-y-4 mt-8 max-w-3xl mx-auto">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-destructive">
          Error Loading Orders
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{error}</p>
        {!user && (
          <Link href="/sign-in" passHref>
            <Button variant="outline" className="interactive-button">
              Log In
            </Button>
          </Link>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-accent mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Please log in to view your orders.
        </p>
        <Link href="/sign-in" passHref>
          <Button variant="outline" className="interactive-button">
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-secondary/30 rounded-lg shadow">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-6">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/" passHref>
            <Button className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderItemCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
