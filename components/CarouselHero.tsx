"use client";
import Carousel from "./Carousel";
import { heroContent } from "@/constants";

const CarouselHero = () => {
  return (
    <div className="relative h-full w-full">
      <Carousel items={heroContent} />
    </div>
  );
};

export default CarouselHero;
