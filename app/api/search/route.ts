import { NextResponse } from "next/server";
import { searchProducts, getSearchSuggestions, Product } from "@/services/sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const sortBy = (searchParams.get("sortBy") as "relevance" | "price-asc" | "price-desc") || "relevance"; // Default sort by relevance

  let results: Product[] = [];
  let suggestions: { products: string[]; categories: string[] } = { products: [], categories: [] };

  try {
    if (query.length > 0) {
      // Fetch suggestions for type-ahead if query is short
      if (query.length < 5) { // Adjust threshold as needed
        suggestions = await getSearchSuggestions(query);
      }

      // Fetch actual search results
      results = await searchProducts(query, category, sortBy);
    }

    return NextResponse.json({
      query,
      category,
      sortBy,
      results,
      suggestions,
    });
  } catch (error) {
    console.error("Error in search API route:", error);
    return NextResponse.json(
      { error: "Failed to perform search", details: (error as Error).message },
      { status: 500 }
    );
  }
}