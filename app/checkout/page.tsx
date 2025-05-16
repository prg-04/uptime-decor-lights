"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { initiatePaymentAction, CustomerDetails } from "./actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { SignInButton, useAuth } from "@clerk/nextjs";

const shippingOptions = [
  {
    label:
      "Pick up point: New Nyamakima Electrical Point Building shop no: 216, Duruma road Nairobi",
    cost: 0,
  },
  { label: "ZONE A: Within CBD", cost: 250 },
  { label: "Pick up Mtaani Agent Drop Off", cost: 320 },
  {
    label: "ZONE L: Thika, Kikuyu, Ruiru, Syokimau etc. via Super Metro",
    cost: 350,
  },
  { label: "ZONE B: Upperhill, Valley Road, etc.", cost: 400 },
  { label: "ZONE C: Riverside, Westlands, etc.", cost: 450 },
  { label: "ZONE E: South B/C, Mbagathi, etc.", cost: 450 },
  { label: "ZONE J: Roasters, Garden City, etc.", cost: 450 },
  { label: "ZONE D: Kangemi, Loresho, etc.", cost: 500 },
  { label: "ZONE F: Junction Mall, Kibra, etc.", cost: 500 },
  { label: "ZONE K: Outside Nairobi via courier", cost: 500 },
  { label: "ZONE N: Donholm, Buruburu, Umoja, etc.", cost: 500 },
  { label: "ZONE G: Ruaka, Runda, Ridgeways, etc.", cost: 550 },
  { label: "ZONE M: Mirema, Kahawa West, etc.", cost: 550 },
  { label: "ZONE H: Gateway Mall, Syokimau", cost: 650 },
  { label: "ZONE P: Rongai, Kikuyu, Kiambu Town", cost: 1000 },
];

export default function CheckoutPage() {
  const { isSignedIn, userId } = useAuth();


  const {
    cart,
    getTotalPrice,
    customerDetails: contextCustomerDetails,
    setCustomerDetails: setContextCustomerDetails,
  } = useCart();

  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [formDetails, setFormDetails] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "KE",
    clerkUserId: "",
    shippingLocation: "",
  });

  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerDetails, string>>
  >({});

  useEffect(() => {
    setIsClient(true);
    if (contextCustomerDetails) {
      setFormDetails(() => ({
        ...contextCustomerDetails,
        shippingLocation:
          contextCustomerDetails.shippingLocation || shippingOptions[0].label,
        clerkUserId:  userId || ""
      }));
      setShippingMethod(
        shippingOptions.find(
          (opt) => opt.label === contextCustomerDetails.shippingLocation
        ) || shippingOptions[0]
      );
    }
  }, [contextCustomerDetails, userId]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = shippingOptions[parseInt(e.target.value)];
    setShippingMethod(selected);
    setFormDetails((prev) => ({
      ...prev,
      shippingLocation: selected.label, // <-- Sync selected label
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!formDetails.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formDetails.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formDetails.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formDetails.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formDetails.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(formDetails.phone)) {
      newErrors.phone = "Phone number is invalid.";
    }
    if (!formDetails.address.trim()) newErrors.address = "Address is required.";
    if (!formDetails.city.trim()) newErrors.city = "City/Town is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerDetails]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description:
          "Your cart is empty. Please add items before proceeding to checkout.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    setIsLoading(true);
    setContextCustomerDetails(formDetails);

    try {
      const baseTotal = getTotalPrice();
      const grandTotal = baseTotal + shippingMethod.cost;

      const result = await initiatePaymentAction(
        {
          ...formDetails,
          address: `${formDetails.address} - ${shippingMethod.label}`,
          clerkUserId: userId || "",
        },
        cart,
        grandTotal
      );

      if (result.success && result.redirectUrl) {
        toast({
          title: "Redirecting to PesaPal",
          description: "You will be redirected to complete your payment.",
        });

        // Update formDetails with shipping location before saving
        const detailsWithShipping = {
          ...formDetails,
          shippingLocation: shippingMethod.label,
        };
        localStorage.setItem("customerDetails", JSON.stringify(detailsWithShipping));
        localStorage.setItem("cartSnapshot", JSON.stringify(cart));
        localStorage.setItem("shipping", JSON.stringify(shippingMethod));
        sessionStorage.setItem(
          "confirmedOrder",
          JSON.stringify({
            order_number: result.orderId,
            tracking_id: result.trackingId,
            confirmed: false, // Mark it initially false
          })
        );


        router.push(result.redirectUrl);
      } else {
        console.error("[Checkout] Server Action Error:", result.error);
        toast({
          title: "Payment Initialization Failed",
          description:
            result.error || "Could not initiate payment. Please try again.",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "[Checkout] Client-side error during payment initiation:",
        error
      );
      toast({
        title: "An Unexpected Error Occurred",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your cart is empty. Add some products to proceed.
        </p>
        <Button onClick={() => router.push("/")}>Shop Products</Button>
      </div>
    );
  }

  const cartTotal = getTotalPrice();
  const grandTotal = cartTotal + shippingMethod.cost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Shipping Details Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Shipping & Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formDetails.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
                {errors.firstName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formDetails.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
                {errors.lastName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formDetails.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (e.g., +2547XXXXXXXX)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formDetails.phone}
                onChange={handleInputChange}
                placeholder="+254712345678"
                required
              />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formDetails.address}
                onChange={handleInputChange}
                placeholder="123 Luminaire St"
                required
              />
              {errors.address && (
                <p className="text-destructive text-xs mt-1">
                  {errors.address}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Town/City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formDetails.city}
                  onChange={handleInputChange}
                  placeholder="Nairobi"
                  required
                />
                {errors.city && (
                  <p className="text-destructive text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formDetails.country}
                  onChange={handleInputChange}
                  placeholder="Kenya"
                  disabled
                />
                {/* Country is fixed to KE for now based on PesaPal context */}
              </div>
            </div>
            <div>
              <Label htmlFor="shippingLocation">Shipping Location</Label>
              <select
                id="shippingLocation"
                className="w-full border rounded p-2"
                onChange={handleShippingChange}
                value={shippingOptions.findIndex(
                  (option) => option.label === shippingMethod.label
                )}
              >
                {shippingOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option.label} - KES {option.cost}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item) => {
              const imageUrl =
                item.imageUrl ||
                item.images?.[0]?.asset?.url ||
                `https://picsum.photos/seed/${item._id}/40/40`;
              const imageAlt = item.images?.[0]?.alt || item.name;
              return (
                <div
                  key={item._id}
                  className="flex justify-between items-center text-sm py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                      unoptimized={imageUrl.includes("picsum.photos")}
                    />
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">
                    Ksh {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
            <Separator />
            <div className="flex flex-col gap-4 justify-between font-semibold text-lg">
              <div className="flex justify-between">
                <span>Cart Total</span>
                <span>Ksh {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingMethod.cost.toFixed(2) === "0.00"
                    ? "Free"
                    : "Ksh " + shippingMethod.cost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span>Ksh {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to PesaPal to complete your payment
              securely.
            </p>
          </CardContent>
          <CardFooter>
            {isSignedIn ? (
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full px-4 py-2  rounded-md text-center interactive-button bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isLoading ? (
                  <span className="flex items-center w-full justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Checkout"
                )}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2 rounded-md interactive-button bg-accent text-accent-foreground hover:bg-accent/90">
                  Sign In to Checkout
                </button>
              </SignInButton>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
