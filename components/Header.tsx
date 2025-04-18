"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useCartStore } from "@/store/store";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Image, { StaticImageData } from "next/image";
import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import lowceilImage from "@/public/hero_cha_2.jpeg";
import pendantImage from "@/public/hero_3.webp";
import chandelierImage from "@/public/chandelier_1.jpeg";
import wallLight from "@/public/hero_wl_1.jpeg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubLink {
  title: string;
  href: string;
  image: string | StaticImageData;
}

interface Link {
  title: string;
  href: string;
  subLinks?: SubLink[];
}

const links: Link[] = [
  {
    title: "Chandeliers",
    href: "/chandeliers",
    subLinks: [
      { title: "Low ceiling", href: "/low-ceiling", image: lowceilImage },
      {
        title: "Pendant Lights(3 in 1)",
        href: "/pendant-lights-3-in-1",
        image: pendantImage,
      },
    ],
  },
  {
    title: "Wall Lights",
    href: "/wall-lights",
    subLinks: [
      {
        title: "Indoor Lights",
        href: "/indoor-lights",
        image: chandelierImage,
      },
      { title: "Outdoor Lights", href: "/outdoor-lights", image: wallLight },
    ],
  },
  {
    title: "Switches & Sockets",
    href: "/switches-sockets",
  },
];

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const { user } = useUser();
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <NavigationMenu className="flex min-w-full justify-between items-center px-4 py-2 sticky top-0 z-50 bg-white/50 backdrop-blur-md border-b border-b-gray-600/20">
      <div className="flex flex-wrap w-full justify-between items-center">
        <Link
          href="/"
          className="text-2xl text-black hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Uptime Decor Lights
        </Link>

        <NavigationMenuList className="hidden md:flex items-center flex-wrap">
          {links.map((link) => (
            <NavigationMenuItem key={link.title}>
              {link.subLinks ? (
                <>
                  <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {link.subLinks.map((subLink) => (
                        <li key={subLink.title} className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              href={subLink.href}
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            >
                              <Image
                                src={subLink.image}
                                alt={subLink.title}
                                className="hidden md:block"
                                width={100}
                                height={100}
                              />
                              {subLink.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="flex h-full w-full select-none flex-col no-underline"
                >
                  <Button
                    className={`text-primary shadow-none ${navigationMenuTriggerStyle()}`}
                  >
                    {link.title}
                  </Button>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>

        <div className="flex  items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none justify-end">
          {/* SEARCH */}
          <div className="flex  items-center flex-1 sm:flex-none justify-end">
            {/* Mobile: always show search input */}
            <Form
              action="/search"
              className="flex w-full md:hidden max-w-sm mt-2 mb-2"
            >
              <input
                type="text"
                name="query"
                placeholder="Search for products"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 border w-full"
              />
            </Form>

            {/* Tablet+ (≥768px): show icon or input */}
            <div className="hidden md:flex items-center">
              {showSearch ? (
                <Form
                  ref={searchRef}
                  action="/search"
                  className="w-full max-w-sm mx-4 mt-0"
                >
                  <input
                    type="text"
                    name="query"
                    autoFocus
                    placeholder="Search for products"
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 border w-full"
                  />
                </Form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-gray-700 hover:text-black p-2 transition-all"
                >
                  <Search className="w-6 h-6" />
                </button>
              )}
            </div>
            {/* …rest of your icons/buttons… */}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="/cart"
                  className="relative flex items-center hover:bg-white/50 hover:text-black font-bold rounded transition duration-300 ease-in-out"
                >
                  <TrolleyIcon className="w-8 h-8" />
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                    {itemCount}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ClerkLoaded>
            <SignedIn>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/orders"
                      className="relative hidden md:flex items-center hover:bg-white/50 hover:text-black font-bold rounded transition duration-300 ease-in-out"
                    >
                      <PackageIcon className="w-8 h-8" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Orders</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SignedIn>
            {user ? (
              <div className="hidden md:flex items-center space-x-2 group">
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-white hover:bg-blue-500 hover:text-white animate-pulse text-blue-500 font-bold px-4 py-2 rounded border-blue-300 border transition duration-300 ease-in-out">
                  Sign In
                </button>
              </SignInButton>
            )}
          </ClerkLoaded>

          {/* MOBILE MENU */}
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <PopoverTrigger asChild>
              <button
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-8 h-8" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              className="w-64 p-4 space-y-4"
            >
              {links.map((link) => (
                <div key={link.title}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium"
                  >
                    {link.title}
                  </Link>
                  {link.subLinks && (
                    <div className="ml-3 mt-2 space-y-1">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.title}
                          href={subLink.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-muted-foreground hover:underline"
                        >
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 border-t">
                {user ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </NavigationMenu>
  );
};

export default Header;
