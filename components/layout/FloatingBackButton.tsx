"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button on the homepage or studio
  const hideButton = pathname === "/" || pathname.startsWith("/studio");

  if (hideButton) {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "fixed bottom-6 left-6 z-50 rounded-full shadow-lg",
        "h-12 w-12", // Make it slightly larger
        "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        "transition-opacity duration-300"
        // Add animation if needed, e.g., fade in/out
      )}
      onClick={handleBack}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  );
}
