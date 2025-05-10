import { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button if used
import Link from "next/link"; // Import Link if used

export const metadata: Metadata = {
  title: "Inspiration | Uptime Decor Lights",
  description:
    "Get inspired with lighting tips, trends, and ideas from Uptime Decor Lights.",
};

export default function InspirationPage() {
  return (
    // Add container and padding here
    <div className="container mx-auto px-4 py-16 text-center">
      <Lightbulb className="h-16 w-16 mx-auto text-accent mb-6" />
      <h1 className="text-4xl font-bold mb-4">Inspiration Coming Soon!</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        We're busy curating the best lighting ideas, tips, and trends to help
        you illuminate your space perfectly. Check back soon for inspiring
        content!
      </p>
      {/* Optional: Add links back to shopping */}
      <Link href="/" passHref>
        <Button variant="outline" className="mt-8 interactive-button">
          Shop All Products
        </Button>
      </Link>
    </div>
  );
}
