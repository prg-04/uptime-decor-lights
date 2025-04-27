import Banner from "@/components/Banner";
import Hero from "@/components/Hero";
import HomeBestSellers from "@/components/HomeBestSellers";
import HomeCategories from "@/components/HomeCategories";
import HomeChandelier from "@/components/HomeChandelier";
import HomeNewArrivals from "@/components/HomeNewArrivals";
import HomePendants from "@/components/HomePendants";
import HomeSeoContent from "@/components/HomeSeoContent";
import HomeWallLights from "@/components/HomeWallLights";

export default async function Home() {
  return (
    <div className="">
      <Hero />
      <HomeCategories />
      <HomeNewArrivals />
      <HomeBestSellers />
      <Banner />
      <HomeChandelier />
      <HomePendants />
      <HomeWallLights />
      <HomeSeoContent />
    </div>
  );
}
