"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import { ProductImage } from "@/services/sanity"; // Import the type
import { cn } from "@/lib/utils";

interface ThumbProps {
  selected: boolean;
  imgSrc: string | null;
  altText: string;
  index: number;
  onClick: () => void;
}

const Thumb: React.FC<ThumbProps> = (props) => {
  const { selected, imgSrc, altText, index, onClick } = props;
  const validImgSrc =
    imgSrc || `https://picsum.photos/seed/thumb${index}/100/100`; // Fallback

  return (
    <div
      className={cn(
        "embla-thumbs__slide relative aspect-square h-full flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-opacity",
        selected
          ? "opacity-100 ring-2 ring-accent ring-offset-2"
          : "opacity-50 hover:opacity-75"
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__button w-full h-full block bg-transparent p-0 m-0 border-0"
        aria-label={`View image ${index + 1}`}
      >
        <Image
          className="embla-thumbs__slide__img w-full h-full object-cover"
          src={validImgSrc}
          alt={altText}
          width={100}
          height={100}
          unoptimized={validImgSrc.includes("picsum.photos")}
        />
      </button>
    </div>
  );
};

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
  options?: EmblaOptionsType;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  productName,
  options,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const newSelectedIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newSelectedIndex);
    // Ensure the selected thumb is scrolled into view
    if (emblaThumbsApi.scrollSnapList().length > 0) {
      emblaThumbsApi.scrollTo(newSelectedIndex, true); // Use jump=true for instant scroll
    }
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect(); // Initial sync

    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);

    // Cleanup listeners on unmount
    return () => {
      emblaMainApi.off("select", onSelect);
      emblaMainApi.off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  return (
    <div className="embla space-y-4">
      {/* Main Carousel Viewport */}
      <div
        className="embla__viewport overflow-hidden rounded-lg border shadow-md h-[400px] md:h-[500px] lg:h-[600px]"
        ref={emblaMainRef}
      >
        <div className="embla__container flex h-full">
          {images.map((image, index) => {
            const validUrl =
              image.url || `https://picsum.photos/seed/main${index}/600/600`;
            return (
              <div
                className="embla__slide relative flex-shrink-0 w-full aspect-square "
                key={image._key || index}
              >
                <Image
                  src={validUrl}
                  alt={image.alt || `${productName} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0} // Prioritize the first image
                  unoptimized={validUrl.includes("picsum.photos")}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Thumbnails Carousel Viewport */}
      {images.length > 1 && ( // Only show thumbs if more than one image
        <div className="embla-thumbs">
          <div
            className="embla-thumbs__viewport overflow-hidden"
            ref={emblaThumbsRef}
          >
            {/* Adjust height and gap */}
            <div className="embla-thumbs__container flex space-x-2 h-16 md:h-20">
              {images.map((image, index) => (
                <Thumb
                  key={image._key || index}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  imgSrc={image.url}
                  altText={image.alt || `Thumbnail ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
