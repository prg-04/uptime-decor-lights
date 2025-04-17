'use client'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { ProductCard as ProductCardProps } from 'types'

const ProductCard = ({ title, images, image, price }: ProductCardProps) => {
  return (
    <Card className="max-h-full min-w-52 max-w-64 shadow-none pt-0 border-0 rounded-xl">
      <CardContent className="h-full p-0 rounded-xl group relative aspect-square overflow-hidden">
        {/* Default Image */}
        <Image
          src={images?.[0] || image || '/placeholder.jpg'}
          alt="placeholder"
          className="absolute inset-0 object-cover w-full h-full rounded-xl transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
          width={500}
          height={500}
        />

        {/* Hover Image */}
        {images?.[1] && (
          <Image
            src={images[1]}
            alt="hover image"
            className="absolute inset-0 object-cover w-full h-full rounded-xl transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
            width={500}
            height={500}
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 pl-0">
        <p className="text-md font-semibold">{title}</p>
        <p className="text-sm">{price}</p>
      </CardFooter>
    </Card>
  )
}
export default ProductCard
