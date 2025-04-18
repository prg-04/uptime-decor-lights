"use client";

import { homeContent } from "@/constants";
import React, { useState } from "react";
import { Button } from "./ui/button";

const HomeSeoContent = () => {
  const [showAll, setShowAll] = useState(false);

  const toggleContent = () => setShowAll((prev) => !prev);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Always show the first item */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold leading-snug text-gray-900">
            {homeContent[0].title}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {homeContent[0].description}
          </p>
        </div>

        {/* Show remaining items only when showAll is true */}
        {showAll && (
          <div className="space-y-10 mt-10 border-t border-gray-300 pt-10">
            {homeContent.slice(1).map((content) => (
              <div key={content.title} className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {content.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {content.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Toggle button */}
        <div className="text-center hidden md:block">
          <Button onClick={toggleContent} className="px-6 text-sm sm:text-base">
            {showAll ? "Read Less" : "Read More"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeSeoContent;
