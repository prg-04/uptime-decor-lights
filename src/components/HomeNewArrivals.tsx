import React from 'react'
import { new_arrivals } from '@/constants'
import CatSecLayout from './CatSecLayout'

const HomeNewArrivals = () => {
  return (
    <div className="">
      <CatSecLayout title="New Arrivals" items={new_arrivals} />
    </div>
  )
}

export default HomeNewArrivals
