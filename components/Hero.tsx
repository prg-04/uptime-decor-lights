import Image from "next/image";
import React from "react";
import CarouselHero from "./CarouselHero";

const Hero = () => {
  return (
    <section className="min-w-full min-h-full ">
      <div className="h-[60vh] md:h-[50vh] min-w-full ">
        <CarouselHero />
      </div>
    </section>
  );
};

export default Hero;
