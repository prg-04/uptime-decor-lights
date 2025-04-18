import { defineType, defineField } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Banner Type",
      type: "string",
      options: {
        list: ["On Sale", "Best Seller", "New Arrival"],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageUrl_1",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageUrl_2",
      title: "Secondary Image (Optional)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle_1",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional Info (e.g. discount)",
      type: "string",
    }),
    defineField({
      name: "promo_code",
      title: "Promo Code",
      type: "string",
      description: "Only for banners with a promo code",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Set display order in the carousel",
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
