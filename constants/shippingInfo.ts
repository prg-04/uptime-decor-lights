// constants/shippingInfo.ts

interface ShippingItem {
  title: string;
  iconName: string; // Use icon name (string) instead of path/component
}

// Use placeholder image paths for now, replace with actual paths or URLs
export const shippingInfo: ShippingItem[] = [
  {
    title: "Quick Delivery",
    iconName: "Truck", // Lucide icon name for shipping
  },
  {
    title: "Secure Payments",
    iconName: "ShieldCheck", // Lucide icon name for security
  },
  {
    title: "Easy Returns",
    iconName: "Undo2", // Lucide icon name for returns
  },
  {
    title: "Expert Support",
    iconName: "LifeBuoy", // Lucide icon name for support
  },
];
