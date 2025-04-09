import React from 'react'
import CatSecLayout from './CatSecLayout'
import { onSale as chandeliers } from '@/constants'

const HomeChandelier = () => {
  return (
    <CatSecLayout title="Chandelier" items={chandeliers} />
  )
}

export default HomeChandelier