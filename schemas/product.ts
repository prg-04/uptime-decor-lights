// schemas/product.ts
import { defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons"; // Example icon

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon, // Optional: Add an icon
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "images", // Changed from 'image' to 'images'
      title: "Product Images",
      type: "array", // Changed to array
      of: [
        {
          type: "image",
          options: {
            hotspot: true, // Enables image cropping/hotspot functionality
          },
          fields: [
            // Optional: Add alt text field to each image
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Important for SEO and accessibility.",
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("At least one image is required."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }], // Reference the 'category' type
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      description: "Mark this product to feature it on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "isBestSeller",
      title: "Best Seller",
      type: "boolean",
      description: "Mark this product as a best seller.",
      initialValue: false,
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      description: "Mark this product as a new arrival.",
      initialValue: false,
    }),
    // Add more fields as needed (e.g., stock, dimensions, materials)
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0.asset", // Use the first image in the array for preview
      categoryName: "category.name", // Show category name in preview
      isBestSeller: "isBestSeller",
      isNewArrival: "isNewArrival",
      featured: "featured",
    },
    prepare(selection) {
      const {
        title,
        media,
        categoryName,
        isBestSeller,
        isNewArrival,
        featured,
      } = selection;
      const statuses = [
        featured && "Featured",
        isBestSeller && "Best Seller",
        isNewArrival && "New Arrival",
      ]
        .filter(Boolean)
        .join(", ");
      const subtitle = `${
        categoryName ? `Category: ${categoryName}` : "No category"
      } ${statuses ? `| ${statuses}` : ""}`;
      return {
        title: title,
        media: media,
        subtitle: subtitle || "No category set",
      };
    },
  },
});
