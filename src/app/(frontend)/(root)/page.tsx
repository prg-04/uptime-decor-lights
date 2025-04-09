import React from 'react'
import {
  Hero,
  HomeBestSellers,
  HomeCategories,
  HomeNewArrivals,
  Banner,
  HomeChandelier,
  HomePendants,
  HomeWallLights,
  HomeSeoContent,
} from '@/components'

export default function HomePage() {
  return (
    <div className="home">
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
  )
}
