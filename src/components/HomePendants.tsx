import React from 'react'
import CatSecLayout from './CatSecLayout'
import { new_arrivals as pendants } from '@/constants'

const HomePendants = () => {
  return (
    <div className="">
      <CatSecLayout title="Pendants" items={pendants} />
    </div>
  )
}

export default HomePendants
