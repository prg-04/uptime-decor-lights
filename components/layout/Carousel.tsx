"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button"; // Corrected path
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CarouselProps, CarouselItem } from "@/types";
import { cn } from "@/lib/utils";

// Default items with required fields and unique _id/_key
const defaultItems: CarouselItem[] = [
  {
    _id: "default_hero_1_id",
    _key: "default_hero_1_key",
    title: "Illuminate Your World",
    description:
      "Discover our curated collection of exquisite lighting fixtures.",
    imageUrl: "https://picsum.photos/seed/lightshero1/1600/800",
    ctaText: "Explore Chandeliers",
    ctaLink: "/products/chandeliers",
    textColor: "#FFFFFF",
  },
  {
    _id: "default_hero_2_id",
    _key: "default_hero_2_key",
    title: "Modern Wall Sconces",
    description: "Add a touch of elegance and warmth to any room.",
    imageUrl: "https://picsum.photos/seed/lightshero2/1600/800",
    ctaText: "Shop Wall Lights",
    ctaLink: "/products/wall-lights",
    textColor: "#FFFFFF",
  },
  {
    _id: "default_hero_3_id",
    _key: "default_hero_3_key",
    title: "Statement Pendant Lights",
    description: "Create a focal point with our unique pendant designs.",
    imageUrl: "https://picsum.photos/seed/lightshero3/1600/800",
    ctaText: "View Pendants",
    ctaLink: "/products/pendant-lights",
    textColor: "#FFFFFF",
  },
];

const Carousel: React.FC<CarouselProps> = ({
  items = defaultItems, // Use default items if none provided
  autoPlayInterval = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use the items provided or the default if items array is empty
  // Ensure items have valid IDs before using them
  const displayItems = (items && items.length > 0 ? items : defaultItems).map(
    (item, index) => ({
      ...item,
      _id:
        item._id ||
        item._key ||
        `carousel_item_${index}_${Math.random().toString(36).substring(2, 9)}`,
    })
  );

  useEffect(() => {
    if (displayItems.length <= 1 || isPaused) return;
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % displayItems.length);
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [displayItems.length, autoPlayInterval, isPaused]);

  if (displayItems.length === 0) {
    console.log("Carousel: No items to display, rendering fallback.");
    return (
      <div className="w-full h-[50dvh] bg-secondary flex items-center justify-center text-muted-foreground">
        Loading carousel or no items to display...
      </div>
    );
  }

  console.log(
    "Rendering Carousel component with items:",
    displayItems.map((i) => ({
      title: i.title,
      id: i._id,
      textColor: i.textColor,
    }))
  );

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      className="w-full h-[60dvh] md:h-[70dvh] overflow-hidden relative group" // Added group for hover effects on children
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Items Container */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out" // Increased duration
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {displayItems.map((item, index) => {
          // Ensure item has a valid ID for the key
          const key = item._id; // Use the guaranteed unique _id
          // Ensure image URL is valid
          const validImageUrl =
            item.imageUrl || `https://picsum.photos/seed/${key}/1600/800`;
          // Ensure link is valid
          const validCtaLink = item.ctaLink || "#"; // Fallback link

          const textStyles = item.textColor ? { color: item.textColor } : {};

          // Shared Text Section Styling
          const sharedTextSection = (
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 md:p-8 text-primary-foreground bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-none md:static md:text-inherit md:items-start md:text-left md:w-1/2">
              {/* Title */}
              <h2
                className={cn(
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-bold mb-3 md:mb-5 drop-shadow-md",
                  !item.textColor && "text-white md:text-primary" // Default colors if no custom color
                )}
                style={textStyles}
              >
                {item.title || "Untitled Slide"}
              </h2>
              {/* Description */}
              <p
                className={cn(
                  "text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-md drop-shadow-sm",
                  !item.textColor && "text-white/90 md:text-foreground/80" // Default colors if no custom color
                )}
                style={textStyles}
              >
                {item.description || "No description available."}
              </p>
              {/* CTA Button */}
              {item.ctaText && ( // Only show button if text exists
                <Button
                  size="lg"
                  className="interactive-button bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                  asChild
                >
                  <Link href={validCtaLink} className="flex items-center">
                    <span>{item.ctaText}</span>
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          );

          return (
            <div
              key={key} // Use guaranteed unique key
              className="min-w-full h-full relative flex items-center justify-start" // Use relative positioning for absolute children
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={validImageUrl} // Use valid imageUrl
                  alt={item.title || "Carousel background"}
                  fill
                  className="object-cover"
                  quality={80}
                  priority={index === 0} // Prioritize first image
                  unoptimized={validImageUrl.includes("picsum.photos")}
                />
                {/* Optional Overlay for better text contrast on some images */}
                <div className="absolute inset-0 bg-black/30 md:hidden"></div>{" "}
                {/* Overlay for mobile contrast */}
              </div>
              {/* Text Content (using shared styling) */}
              {sharedTextSection}
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {displayItems.map((_, index) => (
          <button
            key={`dot_${index}`}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-white scale-125 shadow-md"
                : "bg-white/60 hover:bg-white/80"
            )}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Optional: Navigation Arrows (Example) */}
      {displayItems.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity md:left-4"
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + displayItems.length) % displayItems.length
              )
            }
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity md:right-4"
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % displayItems.length)
            }
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </>
      )}
    </div>
  );
};

export default Carousel;
