"use client";
import React from "react";
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

const Header = () => {
  const { user } = useUser();
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  // create passkey function that can be implemented later
  // const createClerkPasskey = async () => {
  //   try {
  //     const res = await user?.createPasskey();
  //     console.log(res);
  //   } catch (error) {
  //     console.error("Error:", JSON.stringify(error, null, 2));
  //   }
  // };
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="text-2xl text-black hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Uptime Decor Lights
        </Link>
        <Form
          action="/search"
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 border w-full max-w-4xl"
          />
        </Form>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <Link
            href="/cart"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 dark:bg-white dark:hover:bg-white/50 dark:text-black dark:hover:text-white  bg-black text-white hover:bg-white/50 hover:text-black hover:border-gray-400 hover:border font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            <TrolleyIcon className="w-6 h-6" />
            {/* item count */}
            <span className="absolute -top-3 -right-4 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
              {itemCount}
            </span>
            <span>Cart</span>
          </Link>
          {/* user area */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 dark:bg-white dark:hover:bg-white/50 dark:text-black dark:hover:text-white  bg-black text-white hover:bg-white/50 hover:text-black hover:border-gray-400 hover:border font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                <PackageIcon className="w-6 h-6" />
                {/* item count */}

                <span>Orders</span>
              </Link>
            </SignedIn>
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome back</p>
                  <p className="font-bold">{user?.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-white hover:bg-blue-500 hover:text-white animate-pulse text-blue-500 font-bold px-4 py-2 rounded border-blue-300 border transition duration-300 ease-in-out">
                  Sign In
                </button>
              </SignInButton>
            )}
            {/* {user?.passkeys.length === 0 && (
              <Button
                onClick={createClerkPasskey}
                className="bg-white hover:bg-blue-500 hover:text-white animate-pulse text-blue-500 font-bold px-4 py-2 rounded border-blue-300 border transition duration-300 ease-in-out"
              >
                Create passkey
              </Button>
            )} */}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

export default Header;
