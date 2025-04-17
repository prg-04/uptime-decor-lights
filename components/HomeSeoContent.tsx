'use client'
import { homeContent } from '@/constants'
import React, { useState } from 'react'
import { Button } from './ui/button'

const HomeSeoContent = () => {
  const [showAll, setShowAll] = useState(false)

  const toggleContent = () => {
    setShowAll(!showAll)
  }

  return (
    <section className="px-10 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Always show the first item */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">{homeContent[0].title}</h2>
          <p className="text-gray-700 leading-relaxed">{homeContent[0].description}</p>
        </div>

        {/* Show remaining items only when showAll is true */}
        {showAll && (
          <div className="space-y-8 mt-8 border-t pt-8">
            {homeContent.slice(1).map((content) => (
              <div key={content.title} className="space-y-4">
                <h2 className="text-3xl font-semibold">{content.title}</h2>
                <p className="text-gray-700 leading-relaxed">{content.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toggle button */}
        <div className="mt-6 text-center">
          <Button onClick={toggleContent} className="px-6">
            {showAll ? 'Read Less' : 'Read More'}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HomeSeoContent
