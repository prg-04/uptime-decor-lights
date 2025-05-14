"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Package } from "lucide-react"; // Added Menu icon
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Added Sheet components
import { useEffect, useState } from "react";
import type { Category } from "@/services/sanity"; // Import type explicitly
import { getAllCategories } from "@/services/sanity";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator"; // Added Separator
import { cn } from "@/lib/utils"; // Import cn utility
import Image from "next/image";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function Header() {
  // Use getItemCount for the badge display
  const { getItemCount } = useCart();
  const itemCount = getItemCount(); // Get total item quantity
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  const [isLoggedIn] = useState(true); // Assuming a default logged-in state for demonstration

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts on the client

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories for header:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Re-render header when itemCount changes (after cart updates)
  useEffect(() => {
    // This effect just triggers a re-render implicitly when itemCount changes
  }, [itemCount]);

  const renderNavLinks = (isMobile = false) =>
    loading
      ? // Skeletons for loading state
        Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-8 w-20 rounded-md ${isMobile ? "mb-2" : "mx-1"}`}
          />
        ))
      : // Actual category links
        categories.map((category) =>
          isMobile ? (
            <SheetClose key={category._id} asChild>
              <Link
                href={`/products/${category.slug.current}`}
                className="block px-4 py-2 text-md hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setIsMobileMenuOpen(false)} // Close sheet on link click
              >
                {category.name}
              </Link>
            </SheetClose>
          ) : (
            <NavigationMenuItem key={category._id}>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "px-2 md:px-3")}
                href={`/products/${category.slug.current}`}
              >
                {category.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        );

  return (
    <header className="bg-white shadow-xs sticky top-0 z-50">
      {/* Increased max-width for the container */}
      <div className="container mx-auto px-3 py-2 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary hover:text-accent transition-colors flex-shrink-0 mr-4"
        >
          <Image
            src="/uptime_logo.png"
            alt="Uptime Decor Lights"
            width={100}
            height={50}
            className={`
      transition-all duration-300 dark:invert-80
    `}
          />
        </Link>

        {/* Desktop Navigation - Allow wrapping */}
        <NavigationMenu className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 mx-auto">
          {/* Apply flex-wrap to allow wrapping on smaller large screens, adjust gap */}
          <NavigationMenuList className="flex-wrap justify-center gap-x-0">
            {renderNavLinks()}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Cart Icon & Mobile Menu Trigger */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0 ml-4">
          {/* Cart Icon - Visible on all screens */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "relative px-2 py-1 md:px-3",
                  !isLoggedIn && "hidden"
                )}
              >
                <Package className="h-6 w-6" />
                <span className="sr-only">Orders</span>
              </Link>
            </SignedIn>
          </ClerkLoaded>

          {/* Cart Icon - Visible on all screens */}
          <Link
            href="/cart"
            className={cn(
              navigationMenuTriggerStyle(),
              "relative px-2 py-1 md:px-3"
            )}
          >
            <ShoppingCart className="h-6 w-6" />
            {/* Display badge only if itemCount > 0 AND component is mounted on client */}
            {isClient && itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs text-white"
              >
                {/* Display the actual count or 9+ */}
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center space-x-2 group">
              <UserButton />
            </div>
          ) : (
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm border bg-black border-gray-300 py-2 px-4 rounded-lg font-medium text-gray-700 hover:text-gray-900">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          )}

          {/* Mobile Menu Button - Visible below lg breakpoint */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-2xl border border-gray-200 p-2"
              >
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[340px] pt-10 px-0"
            >
              {" "}
              {/* Added padding top */}
              <div className="flex flex-col space-y-3 p-4">
                <SheetClose asChild>
                  <SheetHeader>
                    <SheetTitle>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-lg font-semibold hover:bg-accent hover:text-accent-foreground rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                </SheetClose>
                <Separator />
                {renderNavLinks(true)}
                <Separator />
                <SheetClose asChild>
                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-4 text-lg hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {/* Render mobile badge only on client */}
                    {isClient && itemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 flex items-center text-white justify-center p-0 text-xs"
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </Badge>
                    )}
                  </Link>
                </SheetClose>
                {/* <SheetClose asChild> */}

                <SignedIn>
                  <SignOutButton>
                    <button className="text-sm border bg-black border-gray-300 py-2 px-4 rounded-lg font-medium text-white hover:text-gray-900">
                      Sign out
                    </button>
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <button className="text-sm border bg-black border-gray-300 py-2 px-4 rounded-lg font-medium text-white hover:text-gray-900">
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>

                {/* </SheetClose> */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
