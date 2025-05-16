"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  IG_1,
  IG_2,
  IG_3,
  IG_4,
  IG_5,
  IG_6,
  IG_7,
  IG_8,
  IG_9,
  IG_10,
  IG_11,
  IG_12,
} from "@/public";

interface FeaturedItem {
  _id: string;
  imageUrl: string;
  alt: string;
  link?: string; // Optional link for each item
}

const featuredItems: FeaturedItem[] = [
  {
    _id: "1",
    imageUrl: IG_1.src,
    alt: "Featured item 1",
  },
  {
    _id: "2",
    imageUrl: IG_2.src,
    alt: "Featured item 2",
  },
  {
    _id: "3",
    imageUrl: IG_3.src,
    alt: "Featured item 3",
  },
  {
    _id: "4",
    imageUrl: IG_4.src,
    alt: "Featured item 4",
  },
  {
    _id: "5",
    imageUrl: IG_5.src,
    alt: "Featured item 5",
  },
  {
    _id: "6",
    imageUrl: IG_6.src,
    alt: "Featured item 6",
  },
  {
    _id: "7",
    imageUrl: IG_7.src,
    alt: "Featured item 7",
  },
  {
    _id: "8",
    imageUrl: IG_8.src,
    alt: "Featured item 8",
  },
  {
    _id: "9",
    imageUrl: IG_9.src,
    alt: "Featured item 9",
  },
  {
    _id: "10",
    imageUrl: IG_10.src,
    alt: "Featured item 10",
  },
  {
    _id: "11",
    imageUrl: IG_11.src,
    alt: "Featured item 11",
  },
  {
    _id: "12",
    imageUrl: IG_12.src,
    alt: "Featured item 12",
  },
];
// Placeholder data - replace with actual data fetching if needed
const placeholderItems: FeaturedItem[] = featuredItems

interface FeaturedCarouselProps {
  title?: string | null;
  items?: FeaturedItem[];
  autoPlayInterval?: number;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  title = "Featured on Instagram", // Default title
  items = placeholderItems,
  autoPlayInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const visibleItems = 5;
  const visibleItemsMobile = 2;
  const loopedItems =
    items.length > 0
      ? [
          ...items,
          ...items.slice(0, Math.max(visibleItems, visibleItemsMobile)),
        ]
      : [];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const calculateItemWidth = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        const numVisible =
          window.innerWidth < 768 ? visibleItemsMobile : visibleItems;
        const availableWidth = containerWidth; // No gap needed due to padding
        itemWidthRef.current = availableWidth / numVisible;
      }
    };

    calculateItemWidth();
    window.addEventListener("resize", calculateItemWidth);

    return () => {
      window.removeEventListener("resize", calculateItemWidth);
      resetTimeout();
    };
  }, [visibleItems, visibleItemsMobile]);

  useEffect(() => {
    if (!isMounted || itemWidthRef.current === 0 || items.length <= 1) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= items.length) {
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "none";
              setCurrentIndex(0);
              void carouselRef.current.offsetWidth;
              requestAnimationFrame(() => {
                if (carouselRef.current) {
                  carouselRef.current.style.transition =
                    "transform 0.5s ease-in-out";
                }
              });
            }
          }, 50);
          return items.length;
        }
        return nextIndex;
      });
    }, autoPlayInterval);

    return () => {
      resetTimeout();
    };
  }, [
    currentIndex,
    items.length,
    autoPlayInterval,
    isMounted,
    itemWidthRef.current,
  ]);

  if (!loopedItems || loopedItems.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <section className="py-12 my-10">
      {title && (
        <h2 className="text-3xl font-bold text-center md:text-left mb-8">
          {title}
        </h2>
      )}
      <div className="overflow-hidden relative w-full">
        <div
          ref={carouselRef}
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * itemWidthRef.current}px)`,
            // Apply transition only when moving forward, disable for instant jump
            transition:
              currentIndex === 0 && itemWidthRef.current > 0
                ? "none"
                : "transform 0.5s ease-in-out",
          }}
        >
          {loopedItems.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="flex-shrink-0 px-2"
              style={{ width: `${itemWidthRef.current}px` }}
            >
              <div className="aspect-square overflow-hidden rounded-md shadow-md group hover:shadow-lg transition-shadow duration-300">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={item.imageUrl}
                      alt={item.alt}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized={item.imageUrl.includes("picsum.photos")}
                      onError={(e) =>
                        console.error(
                          `Error loading image: ${item.imageUrl}`,
                          e
                        )
                      }
                    />
                  </a>
                ) : (
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={item.imageUrl.includes("picsum.photos")}
                    onError={(e) =>
                      console.error(`Error loading image: ${item.imageUrl}`, e)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
