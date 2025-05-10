"use client";

import { shippingInfo } from "@/constants/shippingInfo";
import React, { useEffect, useRef, useState } from "react";
import { Truck, ShieldCheck, Undo2, LifeBuoy } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Truck,
  ShieldCheck,
  Undo2,
  LifeBuoy,
};

const ShippingInfo = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleAutoScroll = () => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || window.innerWidth >= 768) return;

    const itemWidth =
      scrollEl.querySelector(".carousel-item")?.clientWidth || 160;
    const gap = 16;
    const scrollAmount = itemWidth + gap;

    const interval = setInterval(() => {
      if (!scrollEl || window.innerWidth >= 768) {
        clearInterval(interval);
        return;
      }

      if (
        scrollEl.scrollLeft + scrollEl.clientWidth >=
        scrollEl.scrollWidth - itemWidth / 2
      ) {
        scrollEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);

    return interval;
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isMobile) intervalId = handleAutoScroll();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isMobile]);

  return (
    <section className="w-full max-w-screen-xl mx-auto px-4 pt-10 pb-6">
      {/* Desktop + Tablet */}
      <div className="hidden md:flex justify-center gap-6 lg:gap-8 xl:gap-10">
        {shippingInfo.map((item) => {
          const IconComponent = iconMap[item.iconName];
          return (
            <div
              key={item.title}
              className="flex flex-col items-center justify-center text-center w-[140px] sm:w-[160px] md:w-[180px] h-[160px] p-4 bg-white rounded-xl border border-gray-50 shadow-sm"
            >
              {IconComponent && (
                <IconComponent
                  className="w-8 h-8 text-muted-foreground mb-2"
                  strokeWidth={1.5}
                />
              )}
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Carousel */}
      <div
        ref={scrollRef}
        className="md:hidden flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory px-1 py-3"
      >
        {shippingInfo.map((item) => {
          const IconComponent = iconMap[item.iconName];
          return (
            <div
              key={item.title}
              className="carousel-item flex-shrink-0 snap-center flex flex-col items-center justify-center w-[140px] p-3 bg-secondary/30 rounded-lg text-center"
            >
              {IconComponent && (
                <IconComponent
                  className="w-7 h-7 text-muted-foreground mb-1"
                  strokeWidth={1.5}
                />
              )}
              <p className="text-xs font-medium text-foreground">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShippingInfo;
