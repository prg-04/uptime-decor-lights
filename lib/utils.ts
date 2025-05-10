import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a category name for display (e.g., "pendant-lights" -> "Pendant Lights").
 * Handles simple cases, might need refinement for more complex names.
 * Gracefully handles undefined or empty input.
 * @param name The category name or slug.
 * @returns A formatted string, or an empty string if input is invalid.
 */
export function formatCategoryName(name?: string | null): string {
  if (!name) {
    return ""; // Return empty string for null, undefined, or empty input
  }
  return name
    .split(/[-_]/) // Split by hyphen or underscore
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : "")) // Capitalize each word, handle empty parts
    .join(" "); // Join with space
}
