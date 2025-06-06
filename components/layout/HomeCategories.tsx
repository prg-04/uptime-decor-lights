"use client";

import { categoriesHome } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HomeCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
  });

  const handleDragScroll = (e: React.WheelEvent) => {
    if (scrollRef.current && window.innerWidth < 1024) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-10 py-8 flex flex-col items-center gap-8">
      {/* Grid for large screens */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="hidden lg:grid grid-cols-4 gap-8 w-full max-w-7xl"
      >
        {categoriesHome.map((category) => (
          <motion.div key={category.title} variants={itemVariants}>
            <Link href={category.href}>
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
          </motion.div>
        ))}
      </motion.div>

      {/* Draggable carousel for small and medium screens */}
      <div
        ref={scrollRef}
        onWheel={handleDragScroll}
        className="lg:hidden flex gap-5 overflow-x-auto scrollbar-hide w-full px-2"
      >
        {categoriesHome.map((category) => (
          <Link key={category.title} href={category.href}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative min-w-[55vw] sm:min-w-[35vw] aspect-[3/4] rounded-2xl group overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Image
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-300"
                fill
                sizes="70vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center h-12 sm:h-14 rounded-b-2xl">
                <h3 className="text-white text-base sm:text-lg font-semibold text-center px-2">
                  {category.title}
                </h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
