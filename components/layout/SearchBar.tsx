"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product, Category } from "@/services/sanity"; // Assuming these types are available

interface SearchResult {
  query: string;
  category: string;
  sortBy: "relevance" | "price-asc" | "price-desc";
  results: Product[];
  suggestions: { products: string[]; categories: string[] };
}

interface SearchBarProps {
  isMobile: boolean;
  isInitiallyOpen?: boolean;
}

export function SearchBar({ isMobile, isInitiallyOpen = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(isInitiallyOpen);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc">("relevance");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsOverlayOpen(isInitiallyOpen);
  }, [isInitiallyOpen]);

  const fetchSearchResults = useCallback(async (query: string, category: string, sort: string) => {
    if (!query) {
      setSearchResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&sortBy=${encodeURIComponent(sort)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SearchResult = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery.length > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSearchResults(searchQuery, activeCategory, sortBy);
      }, 300); // Debounce search input
    } else {
      setSearchResults(null);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, activeCategory, sortBy, fetchSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        if (!isInitiallyOpen && searchQuery.length === 0) {
          setIsOverlayOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOverlayOpen(true);
  };

  const handleClearInput = () => {
    setSearchQuery("");
    setSearchResults(null);
    setIsOverlayOpen(false);
  };

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    // Re-fetch results with new category
    fetchSearchResults(searchQuery, categorySlug, sortBy);
  };

  const handleSortChange = (newSortBy: "relevance" | "price-asc" | "price-desc") => {
    setSortBy(newSortBy);
    // Re-fetch results with new sort order
    fetchSearchResults(searchQuery, activeCategory, newSortBy);
  };

  return (
    <div className="relative flex-1 max-w-lg mx-4" ref={searchBarRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOverlayOpen(true)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 h-7 w-7 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={handleClearInput}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search input</span>
          </Button>
        )}
      </div>

      {isOverlayOpen && (searchQuery.length > 0 || loading || searchResults) && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-full">
          {loading && (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          )}

          {!loading && searchQuery.length > 0 && searchResults && (
            <>
              {/* Suggestions Section */}
              {(searchResults.suggestions.products.length > 0 || searchResults.suggestions.categories.length > 0) && (
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.suggestions.products.map((suggestion, index) => (
                      <Button
                        key={`prod-sugg-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                    {searchResults.suggestions.categories.map((suggestion, index) => (
                      <Button
                        key={`cat-sugg-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleCategoryClick(suggestion.toLowerCase().replace(/\s+/g, "-")); // Assuming slug format
                        }}
                      >
                        {suggestion} (Category)
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters and Sort */}
              <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium">Filter by:</span>
                <Button
                  variant={activeCategory === "" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryClick("")}
                >
                  All
                </Button>
                {/* Dynamically render categories from searchResults or a predefined list */}
                {/* For now, using a placeholder, ideally fetch all categories or categories relevant to current results */}
                {searchResults.results.map(p => p.category?.slug?.current).filter((value, index, self) => value && self.indexOf(value) === index).map((catSlug) => (
                  <Button
                    key={catSlug}
                    variant={activeCategory === catSlug ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleCategoryClick(catSlug!)}
                  >
                    {catSlug?.replace(/-/g, " ")}
                  </Button>
                ))}

                <span className="font-medium ml-auto">Sort by:</span>
                <Button
                  variant={sortBy === "relevance" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleSortChange("relevance")}
                >
                  Relevance
                </Button>
                <Button
                  variant={sortBy === "price-asc" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleSortChange("price-asc")}
                >
                  Price: Low to High
                </Button>
                <Button
                  variant={sortBy === "price-desc" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleSortChange("price-desc")}
                >
                  Price: High to Low
                </Button>
              </div>

              {/* Search Results */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {searchResults.results.length > 0 ? (
                  searchResults.results.map((product) => (
                    <Link
                      href={`/product/${product._id}`}
                      key={product._id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOverlayOpen(false)} // Close overlay on result click
                    >
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="object-cover rounded-sm mr-3"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.category?.name} - ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No results found for "{searchQuery}".</p>
                )}
              </div>
            </>
          )}

          {!loading && searchQuery.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Start typing to see suggestions and search results.
            </div>
          )}
        </div>
      )}
    </div>
  );
}