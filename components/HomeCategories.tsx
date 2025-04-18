"use client";
import { categoriesHome } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

const HomeCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDragScroll = (e: React.WheelEvent) => {
    if (scrollRef.current && window.innerWidth < 1024) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="my-16 w-full px-4 lg:px-10 py-4 flex flex-col items-center gap-6">
      {/* Grid for large screens */}
      <div className="hidden lg:grid grid-cols-4 gap-6 w-full max-w-7xl">
        {categoriesHome.map((category) => (
          <Link key={category.title} href={category.href}>
            <div className="relative rounded-3xl group overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-shadow max-w-sm">
              <Image
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full rounded-3xl group-hover:scale-105 transition-transform duration-300"
                fill
                sizes="25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 flex items-center justify-center h-16 rounded-b-3xl">
                <h3 className="text-white text-xl font-semibold text-center px-2">
                  {category.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Draggable carousel for small and medium screens */}
      <div
        ref={scrollRef}
        onWheel={handleDragScroll}
        className="lg:hidden flex gap-4 overflow-x-auto scrollbar-hide w-full px-1"
      >
        {categoriesHome.map((category) => (
          <Link key={category.title} href={category.href}>
            <div className="relative min-w-[65vw] sm:min-w-[45vw] aspect-[3/4] rounded-3xl group overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Image
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full rounded-3xl group-hover:scale-105 transition-transform duration-300"
                fill
                sizes="80vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 flex items-center justify-center h-14 sm:h-16 rounded-b-3xl">
                <h3 className="text-white text-lg sm:text-xl font-semibold text-center px-2">
                  {category.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
