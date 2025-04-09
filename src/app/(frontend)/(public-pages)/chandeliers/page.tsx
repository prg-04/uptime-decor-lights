import { ProductPageLayout } from '@/components'
import { ChandelierProducts } from '@/constants'
import React from 'react'

const page = () => {
  return <ProductPageLayout {...ChandelierProducts} />
}

export default page
