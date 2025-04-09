import React from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { CatSecLayoutProps } from 'types'

const CatSecLayout = ({ title, items }: CatSecLayoutProps) => {
  return (
    <div className="px-10 my-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl uppercase font-semibold">{title}</h2>

        <Link href="/new-arrivals" className="">
          View All{' '}
          <span className="text-primary bg-gray-300 rounded-full p-1.5 px-2.5 ml-1">&gt;</span>{' '}
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <ProductCard key={item.title} title={item.title} image={item.image} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default CatSecLayout
