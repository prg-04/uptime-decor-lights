import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { ProductCardProps } from 'types' 

const ProductCard = ({ title, image, price }: ProductCardProps) => {
  return (
    <Card className="max-h-full min-w-52 max-w-64 shadow-none pt-0 border-0  rounded-xl">
      <CardContent className="h-full p-0 rounded-xl group overflow-hidden">
        <Image
          src={image}
          alt="placeholder"
          className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition-all duration-300"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pl-0">
        <p className="text-md font-semibold">{title}</p>
        <p className="text-sm">{price}</p>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
