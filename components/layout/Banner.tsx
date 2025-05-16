import Image from "next/image";
import React from "react";

interface BannerProps {
  title?: string | null;
  description1?: string | null;
  description2?: string | null;
  imageUrl?: string | null;
}

const Banner: React.FC<BannerProps> = ({
  title = "Crafting Atmospheres, One Light at a Time",
  description1 = "Explore our curated collection...",
  description2 = "Find the perfect illumination...",
  imageUrl = "https://picsum.photos/seed/homebanner/1600/900",
}) => {
  const validImageUrl =
    imageUrl || "https://picsum.photos/seed/fallbackbanner/1600/900";

  return (
    // Reduced my-16 to my-10
    <section className="min-h-[50vh] w-full font-extralight relative overflow-hidden rounded-lg my-10 shadow-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={validImageUrl}
          alt={title || "Uptime Decor Lighs lighting collection banner"}
          fill
          className="object-cover w-full h-full"
          quality={80}
          priority
          unoptimized={validImageUrl.includes("picsum.photos")}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20 text-white">
        <div className="max-w-4xl flex flex-col gap-4 text-center">
          {title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl capitalize font-semibold leading-snug sm:leading-snug lg:leading-tight drop-shadow-md">
              {title}
            </h2>
          )}
          {description1 && (
            <p className="text-base sm:text-lg lg:text-xl drop-shadow-sm">
              {description1}
            </p>
          )}
          {description2 && (
            <p className="text-base sm:text-lg lg:text-xl drop-shadow-sm">
              {description2}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Banner;
