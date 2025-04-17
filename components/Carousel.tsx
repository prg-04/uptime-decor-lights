import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CarouselProps } from "@/types";

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlayInterval = 5000, // Default to 5 seconds
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (items.length <= 1) return;
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [items.length, autoPlayInterval, isPaused]);

  // Handle case when there are no items
  if (items.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        No items to display
      </div>
    );
  }

  const handleMouseEnter = () => {
    setIsPaused(true);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const handleMouseLeave = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    setIsPaused(false);
  };

  return (
    <div
      className="w-full h-[50dvh] overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-full w-full justify-between items-center transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item) => {
          if (item.type === "On Sale") {
            return (
              <div key={item.id} className="min-w-full h-full relative flex">
                <div className="w-1/3 h-full onsale">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="w-1/3 h-full flex bg-amber-100 flex-col justify-center items-center p-4 ">
                  <h2 className="text-5xl text-center uppercase font-bold mb-2">
                    {item.title}
                  </h2>
                  <p className="text-xl text-center">{item.description}</p>
                  <Button className="mt-6">
                    <Link href={"/shop"} className="flex items-center">
                      <span>Shop Now</span>
                      <ArrowUpRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
                <div className="w-1/3 h-full">
                  <Image
                    src={item.imageUrl_2 ?? ""}
                    alt={item.title}
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
              <div key={item.id} className="min-w-full h-full relative flex">
                <div className="w-2/3 h-full">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="w-1/3 h-full flex bg-primary text-white flex-col justify-center items-center p-4 ">
                  <h2 className="text-5xl uppercase text-center font-extrabold mb-2">
                    {item.title}
                  </h2>
                  <p className="text-2xl text-center">{item.description}</p>
                  <div className="flex items-center justify-between w-full mt-8 text-white rounded-lg p-6 shadow-lg border-2 border-dashed border-gray-300 relative overflow-hidden gap-4">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-100 rounded-full"></div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-100 rounded-full"></div>
                    <div className="text-center text-2xl uppercase font-extrabold text-white">
                      {item.additionalInfo}
                    </div>
                    <div className="text-center px-4 py-4 bg-chart-5 text-white font-bold rounded-md tracking-wider transform hover:scale-105 transition-transform">
                      {item.promo_code}
                    </div>
                  </div>{" "}
                </div>
              </div>
            );
          }

          if (item.type === "New Arrival") {
            return (
              <div
                key={item.id}
                className="min-w-full h-full relative flex flex-row-reverse"
              >
                <div className="w-2/3 h-full">
                  <Image
                    src={item.imageUrl_1}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="w-1/3 h-full flex bg-orange-100 text-primary flex-col justify-center items-center p-4 ">
                  <h2 className="text-5xl uppercase text-center font-extrabold mb-2">
                    {item.title}
                  </h2>
                  <p className="text-2xl text-center">{item.description}</p>
                  <Button className="mt-6 ">
                    <Link href={"/shop"} className="flex items-center">
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

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};
export default Carousel;
