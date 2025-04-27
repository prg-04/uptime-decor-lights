import getHeroSectionContent from "@/sanity/lib/hero/getHeroSectionContent";
import { Carousel } from "./ui/Carousel";
// import Carousel from "./Carousel";

const CarouselHero = async () => {
  const heroContent = await getHeroSectionContent();
  return (
    <div className="relative w-full">
      <Carousel items={heroContent} />
    </div>
  );
};

export default CarouselHero;
