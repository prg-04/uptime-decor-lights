import React from 'react'
import CatSecLayout from './CatSecLayout'
import { bestSellers } from '@/constants'

const HomeBestSellers = () => {
  return (
    <div className="w-full mt-10">
      <CatSecLayout title="Best Sellers" items={bestSellers} />
    </div>
  )
}

export default HomeBestSellers
