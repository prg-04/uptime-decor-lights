'use client'
import { Settings2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { ProductsPageProps } from 'types'
import ProductCard from './ProductCard'

const ProductPageLayout = (props: ProductsPageProps) => {
  const { hero_image, title, products: categoryProducts, description } = props
  const [openCategories, setOpenCategories] = React.useState(false)
  const [openSize, setOpenSize] = React.useState(false)
  const [openPrice, setOpenPrice] = React.useState(false)
  return (
    <section className="mt-20">
      <div className="max-h-[50dvh] h-[50dvh] relative ">
        <Image src={hero_image} alt={title} fill className="w-full h-full object-cover " />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start justify-center lg:px-10">
          <h1 className="text-white text-start text-5xl font-semibold">{title}</h1>
          <p className="text-white text-start text-lg mt-2 max-w-5xl">{description}</p>
        </div>
      </div>
      <section className="flex">
        <div className="w-[25%] p-6 border-r min-h-screen">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <span>
              <Settings2 />
            </span>
            Filters
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Categories</h3>
                <button
                  onClick={() => setOpenCategories(!openCategories)}
                  className="text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={openCategories ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
                  </svg>
                </button>
              </div>
              {openCategories && (
                <div className="space-y-2">
                  <label className="flex items-center text-sm  gap-2">
                    <input type="checkbox" /> Glass Globe Linear Chandeliers
                  </label>
                  <label className="flex items-center text-sm gap-2">
                    <input type="checkbox" /> Spiral Raindrop Chandeliers
                  </label>
                  <label className="flex items-center text-sm gap-2">
                    <input type="checkbox" /> Crystal Ring Chandeliers
                  </label>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Size</h3>
                <button onClick={() => setOpenSize(!openSize)} className="text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={openSize ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
                  </svg>
                </button>
              </div>
              {openSize && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> small
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> medium
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> large
                  </label>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Price Range</h3>
                <button onClick={() => setOpenPrice(!openPrice)} className="text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={openPrice ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
                  </svg>
                </button>
              </div>
              {openPrice && (
                <>
                  <input type="range" min="0" max="1000" className="w-full" />
                  <div className="flex justify-between text-sm mt-2">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </>
              )}
            </div>{' '}
          </div>{' '}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 p-6">
            {
              categoryProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            }
          </div>
        </div>
      </section>
    </section>
  )
}

export default ProductPageLayout
