import type { Metadata } from "next";
// Correct import for Geist fonts
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { FloatingBackButton } from "@/components/layout/FloatingBackButton"; // Import the floating back button
import ShippingInfo from "@/components/layout/ShippingInfo"; // Import the new ShippingInfo component
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Uptime Decor Lights",
  description: "Your source for exquisite lighting solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        {/* Apply the font variables to the body */}
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            GeistSans.variable, // Use the variable directly
            GeistMono.variable // Use the variable directly
          )}
        >
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              {/* Apply container and padding directly to main */}
              <main className="flex-grow container mx-auto px-2 md:px-8 min-w-full ">
                {children}
              </main>
              {/* Add ShippingInfo section before the footer */}
              <ShippingInfo />
              <Footer />
              <Toaster />
              <FloatingBackButton /> {/* Add the floating back button */}
            </div>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
