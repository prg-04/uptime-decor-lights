import Image from 'next/image'
import React from 'react'
import heroImg from '@/public/hero-img.webp'
import CarouselHero from './CarouselHero'

const Hero = () => {
  return (
    <section className="min-w-full min-h-full mt-20">
      <div className="h-[50vh] min-w-full ">
        {/* <Image src={heroImg} alt="hero" className="w-full min-h-full object-cover" /> */}
        <CarouselHero />
      </div>
    </section>
  )
}

export default Hero
