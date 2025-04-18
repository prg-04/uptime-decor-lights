"use client";

import { shippingInfo } from "@/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ShippingInfo = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-scroll for mobile carousel
  const handleAutoScroll = () => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || window.innerWidth >= 1024) return;

    const itemWidth =
      scrollEl.querySelector(".carousel-item")?.clientWidth || 200;
    const scrollAmount = itemWidth + 24; // Add gap (24px = gap-6)

    const interval = setInterval(() => {
      if (scrollEl.scrollLeft + scrollEl.offsetWidth >= scrollEl.scrollWidth) {
        scrollEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 2500);

    return interval;
  };

  // Set up auto-scroll on initial load and reset on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize); // Listen to resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const interval = handleAutoScroll();
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section className="my-10 w-full">
      {/* Static layout for lg+ */}
      <div className="hidden md:flex items-center justify-between gap-6 px-6 max-w-7xl mx-auto">
        {shippingInfo.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-2 h-56 max-w-72 w-full text-center"
          >
            <div className="">
              <Image
                src={item.image}
                alt={item.title}
                width={150}
                height={150}
                className="object-cover w-32 h-32"
              />
            </div>
            <p className="text-md">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Carousel for small/medium screens */}
      <div
        ref={scrollRef}
        className="md:hidden flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-4 snap-x snap-mandatory"
      >
        {shippingInfo.map((item) => (
          <div
            key={item.title}
            className="carousel-item flex-shrink-0 snap-center flex flex-col items-center gap-2 h-56 w-60 text-center"
          >
            <div className="">
              <Image
                src={item.image}
                alt={item.title}
                width={130}
                height={130}
                className="object-cover w-28 h-28"
              />
            </div>
            <p className="text-sm sm:text-base">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShippingInfo;
