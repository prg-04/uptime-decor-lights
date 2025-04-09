import { categoriesHome } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HomeCategories = () => {
  return (
    <section className="my-10 min-w-full sm:px-4 py-4 flex flex-col items-center gap-6">
      {/* <div className="mb-8">
        <h2 className="text-4xl uppercase font-bold">Our Categories</h2>
      </div> */}
      <div className=" grid grid-cols-4 gap-4 h-96 lg:px-10 ">
        {categoriesHome.map((category) => (
          <Link key={category.title} href={category.href}>
            <div className="h-full relative rounded-2xl group overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full rounded-2xl group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/50 items-center justify-center h-14 w-full rounded-b-2xl flex">
                <h3 className="text-white text-2xl font-semibold">{category.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HomeCategories
