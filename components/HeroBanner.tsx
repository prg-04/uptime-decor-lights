import Image from "next/image";

const HeroBanner = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string | null;
}) => (
  <div className="relative h-[40dvh] sm:h-[50dvh] lg:h-[60dvh] w-full">
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover object-center"
      priority
    />

    <div className="absolute inset-0 bg-black/50" />

    <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-10">
      <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-6xl">
        {title}
      </h1>
      <p className="text-white text-base sm:text-lg lg:text-xl mt-3 max-w-6xl">
        {description}
      </p>
    </div>
  </div>
);

export default HeroBanner;
