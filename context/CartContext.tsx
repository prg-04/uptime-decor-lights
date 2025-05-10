"use client";

import type { Product } from "@/services/sanity";
import type { CustomerDetails } from "@/app/checkout/actions";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the structure of a cart item
export interface CartItem extends Product {
  quantity: number;
  // Add imageUrl directly to CartItem for easier access in cart display
  // This will be populated from product.images[0].asset.url or a fallback
  imageUrl?: string | null;
}

// Define the context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  customerDetails: CustomerDetails | null;
  setCustomerDetails: (details: CustomerDetails | null) => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key
const CART_STORAGE_KEY = "luminaire-haven-cart";
const CUSTOMER_DETAILS_STORAGE_KEY = "luminaire-haven-customer-details";

// CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetailsState] =
    useState<CustomerDetails | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // To prevent hydration issues

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error parsing stored cart:", e);
        localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted data
      }
    }
    const storedCustomerDetails = localStorage.getItem(
      CUSTOMER_DETAILS_STORAGE_KEY
    );
    if (storedCustomerDetails) {
      try {
        setCustomerDetailsState(JSON.parse(storedCustomerDetails));
      } catch (e) {
        console.error("Error parsing stored customer details:", e);
        localStorage.removeItem(CUSTOMER_DETAILS_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      // Only save after initial load
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save customer details to localStorage
  useEffect(() => {
    if (isLoaded) {
      if (customerDetails) {
        localStorage.setItem(
          CUSTOMER_DETAILS_STORAGE_KEY,
          JSON.stringify(customerDetails)
        );
      } else {
        localStorage.removeItem(CUSTOMER_DETAILS_STORAGE_KEY);
      }
    }
  }, [customerDetails, isLoaded]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      const productImageUrl =
        product.images?.[0]?.asset?.url ??
        `https://picsum.photos/seed/${product._id}/100/100`;

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                imageUrl: productImageUrl,
              }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, imageUrl: productImageUrl }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = () => {
    if (!isLoaded) return 0; // Return 0 if not loaded to prevent hydration mismatch
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!isLoaded) return 0;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const setCustomerDetails = (details: CustomerDetails | null) => {
    setCustomerDetailsState(details);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
        customerDetails,
        setCustomerDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
