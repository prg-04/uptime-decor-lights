"use client";
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Button } from "./button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Marquee } from "../magicui/marquee";
import * as motion from "motion/react-client";
import { useInView } from "motion/react";
import type { Variants } from "motion/react";
import {
  FirstOrSecondHeroSection,
  HeroSection,
  ThirdHeroSection,
} from "@/types";
import { heroSections } from "@/constants";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < breakpoint);

    checkIsMobile(); // set on mount
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}



export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 5000 }),
    Fade(),
  ]);

  useEffect(() => {
    if (emblaApi) {
      // console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  const renderLayout = (item: HeroSection) => {
    if (item.type === "third") {
      return <ThirdLayout item={item as ThirdHeroSection} />;
    } else if (item.type === "first") {
      return <FirstLayout item={item as FirstOrSecondHeroSection} />;
    } else {
      return <SecondLayout item={item as FirstOrSecondHeroSection} />;
    }
  };

  return (
    <div
      ref={emblaRef}
      className="embla w-full h-fit overflow-hidden relative min-w-full"
    >
      <div className="embla__container">
        {heroSections.map((item, index) => (
          <section
            key={index}
            className="embla__slide w-full h-fit flex-shrink-0"
          >
            {renderLayout(item)}
          </section>
        ))}
      </div>
    </div>
  );
}

const FirstLayout = ({ item }: { item: FirstOrSecondHeroSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div
      ref={ref}
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 mt-10 max-h-[700px]"
    >
      <div className="flex flex-col justify-center gap-4 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-cormorant">
          {item.title}
        </h1>
        <p className="text-lg md:text-2xl">{item.subtitle}</p>
        <div className="flex justify-center lg:justify-start">
          <Button className="mt-4 md:mt-6">
            <Link href={item.cta.href} className="flex items-center">
              <span>{item.cta.label}</span>
              <ArrowUpRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <motion.div
        ref={ref}
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={imageVariants} className="hidden sm:block">
          <Image
            src={item.image_2}
            alt=""
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-xl"
          />
        </motion.div>

        <motion.div variants={imageVariants} className="hidden sm:block">
          <Image
            src={item.image_3}
            alt=""
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-xl"
          />
        </motion.div>

        <motion.div variants={imageVariants} className="col-span-2">
          <Image
            src={item.image}
            alt=""
            width={500}
            height={500}
            className="w-full h-auto max-h-72 object-cover rounded-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const SecondLayout = ({ item }: { item: FirstOrSecondHeroSection }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div
      ref={ref}
      className="w-full h-[70vh] sm:h-[80vh] md:max-h-[700px] flex flex-col items-center px-2 sm:px-6 md:px-12 mt-6"
    >
      <div className="flex flex-col items-center mt-12 md:mt-16 w-full gap-4 md:gap-6">
        <div className="w-full text-left md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-cormorant">
            {item.title}
          </h1>
        </div>
        <div className="w-full text-left md:text-right">
          <p className="text-lg md:text-2xl">{item.subtitle}</p>
        </div>
      </div>

      <motion.div
        ref={ref}
        className="relative w-full h-full overflow-hidden mt-6 aspect-video "
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          variants={imageVariants}
          className="absolute left-4 lg:left-28 top-0 h-40 md:h-56 w-40 md:w-56 hidden sm:block"
        >
          <Image
            src={item.image}
            alt=""
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>

        <motion.div
          variants={imageVariants}
          className="h-64 md:h-96 w-full  sm:max-w-sm  md:max-w-[600px] absolute z-20 top-0 sm:top-10 lg:top-10 left-0 sm:left-1/2 transform sm:-translate-x-1/2"
        >
          <Image
            src={item.image_2}
            alt=""
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>

        <motion.div
          variants={imageVariants}
          className="absolute right-0 lg:right-28 top-1/2 h-40 md:h-56 w-40 md:w-56 lg:bottom-0 z-30 sm:z-10"
        >
          <Image
            src={item.image_3}
            alt=""
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ThirdLayout = ({ item }: { item: ThirdHeroSection }) => {
  return (
    <div className="flex flex-col md:flex-row md:h-dvh h-full max-h-[700px] px-4 md:px-8 pb-4 mt-14 ">
      <div className="flex flex-col justify-center items-start p-4 w-full md:w-1/2">
        <h1 className="text-3xl md:text-6xl font-bold font-cormorant">
          {item.title}
        </h1>
        <p className="mt-4 text-lg md:text-2xl">{item.subtitle}</p>
        <Button className="mt-6">
          <Link href={item.cta.href} className="flex items-center">
            <span>{item.cta.label}</span>
            <ArrowUpRight className="ml-2" />
          </Link>
        </Button>
      </div>

      {/* Hide Marquee on small screens */}
      <div className="relative flex h-full md:max-h-[700px] md:w-1/2 flex-col gap-4 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <Marquee reverse pauseOnHover className="[--duration:20s] py-1">
          {item.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              width={500}
              height={500}
              className="w-52 md:w-64 h-52 md:h-full object-cover rounded-xl"
            />
          ))}
        </Marquee>

        <Marquee pauseOnHover className="[--duration:20s] hidden md:flex">
          {item.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              width={500}
              height={500}
              className="w-48 md:w-64 h-48 md:h-full object-cover rounded-xl"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};
