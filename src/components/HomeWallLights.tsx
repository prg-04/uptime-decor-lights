import React from 'react'
import CatSecLayout from './CatSecLayout'
import { bestSellers as wallLights } from '@/constants'

const HomeWallLights = () => {
  return (
    <div className="">
      <CatSecLayout title="Wall Lights" items={wallLights} />
    </div>
  )
}

export default HomeWallLights
