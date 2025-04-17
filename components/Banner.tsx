import { homeBannerContent } from '@/constants'
import Image from 'next/image'
import React from 'react'
const Banner = () => {
  const { title, description, description_2, image } = homeBannerContent
  return (
    <section className="min-h-[50vh] font-extralight">
      <div className="min-h-full h-full relative">
        <Image src={image} alt="banner" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 bg-black/60 w-full h-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full flex flex-col items-start justify-center text-white px-10 gap-4">
          <h2 className="text-5xl capitalize font-source-serif">{title}</h2>
          <p className="text-lg">{description}</p>
          <p className="text-lg">{description_2}</p>
        </div>
      </div>
    </section>
  )
}

export default Banner
