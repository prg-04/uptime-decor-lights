import { shippingInfo } from '@/constants'
import Image from 'next/image'
import React from 'react'

const ShippingInfo = () => {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between gap-4 lg:px-6">
        {shippingInfo.map((item) => (
          <div
            className="flex flex-col items-center gap-2 h-56 max-w-72 w-full"
            key={item.title}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={150}
              height={150}
              className="object-cover"
            />
            <p className="text-md">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShippingInfo
