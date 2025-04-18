"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CarouselProps } from "@/types";

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlayInterval = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [items.length, autoPlayInterval, isPaused]);

  if (items.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        No items to display
      </div>
    );
  }

  const handleMouseEnter = () => {
    setIsPaused(true);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 5000);
  };

  const handleMouseLeave = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPaused(false);
  };

  return (
    <div
      className="w-full h-[60dvh] md:h-[50dvh] overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item) => {
          const sharedTextSection = (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-6 md:p-8 lg:p-10 mx-auto max-w-[90%]">
              <h2 className="text-2xl sm:text-3xl md:text-5xl md:leading-[3.5rem] uppercase font-cormorant font-bold mb-4">
                {item.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6">
                {item.description}
              </p>
              <Button className="mt-4 md:mt-6">
                <Link href="/shop" className="flex items-center">
                  <span>Shop Now</span>
                  <ArrowUpRight className="ml-2" />
                </Link>
              </Button>
            </div>
          );

          if (item.type === "On Sale") {
            return (
              <div
                key={item.id}
                className="min-w-full h-full flex flex-col md:flex-row"
              >
                <div className="w-full md:w-1/2 lg:w-1/3 h-64 md:h-full">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title || "Product Image"}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="bg-amber-100 md:w-1/2 lg:w-1/3">
                  {sharedTextSection}
                </div>
                <div className="hidden lg:block w-1/3 h-full">
                  <Image
                    src={item.imageUrl_2 ?? ""}
                    alt={item.title || "Secondary Product Image"}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            );
          }

          if (item.type === "Best Seller") {
            return (
              <div
                key={item.id}
                className="min-w-full h-full flex flex-col md:flex-row"
              >
                <div className="w-full md:w-1/2 lg:w-2/3 h-64 md:h-full">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title || "Best Seller Image"}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 h-full flex bg-primary text-white flex-col justify-center items-center p-6 md:p-8 lg:p-10 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase font-extrabold mb-4">
                    {item.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-2xl hidden md:block mb-6">
                    {item.description}
                  </p>

                  {/* if there is no promocode and promo */}

                  <div className="flex items-center justify-between w-full mt-8 rounded-lg p-6 shadow-lg border-2 border-dashed border-gray-300 relative overflow-hidden gap-4">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-100 rounded-full" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-100 rounded-full" />
                    <div className="text-center text-lg sm:text-xl md:text-2xl uppercase font-extrabold">
                      {item.additionalInfo}
                    </div>
                    <div className="text-center px-4 py-2 bg-chart-5 font-bold rounded-md tracking-wider transform hover:scale-105 transition-transform">
                      {item.promo_code}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === "New Arrival") {
            return (
              <div
                key={item.id}
                className="min-w-full h-full flex flex-col md:flex-row-reverse"
              >
                <div className="w-full md:w-2/3 h-64 md:h-full">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title || "New Arrival"}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="w-full md:w-1/3 h-full flex bg-orange-100 text-primary flex-col justify-center items-center text-center p-6 md:p-8 lg:p-10">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase font-extrabold mb-4">
                    {item.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-2xl mb-6">
                    {item.description}
                  </p>
                  <Button className="mt-4 md:mt-6">
                    <Link href="/shop" className="flex items-center">
                      <span>Shop Now</span>
                      <ArrowUpRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
