import { homeBannerContent } from "@/constants";
import Image from "next/image";
import React from "react";

const Banner = () => {
  const { title, description, description_2, image } = homeBannerContent;

  return (
    <section className="min-h-[50vh] w-full font-extralight relative">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt="banner"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20 text-white">
        <div className="max-w-6xl flex flex-col gap-4 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-source-serif capitalize font-semibold leading-snug">
            {title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl">{description}</p>
          <p className="text-base sm:text-lg lg:text-xl">{description_2}</p>
        </div>
      </div>
    </section>
  )
};

export default Banner;
