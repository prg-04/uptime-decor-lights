import { ImImages } from "react-icons/im";
import { defineField, defineType } from "sanity";

export const productImageType = defineType({
  name: "ProductImage",
  title: "Product Image",
  description: "A list of product images",
  type: "document",
  icon: ImImages,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().error("A Name is required"),
    }),
    defineField({
      name: "image",
      title: "Images",
      description: "Please upload one or more product image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error("Please upload an image"),
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
    },
    prepare(select) {
      return {
        title: select.title,
        media: select.media,
      };
    },
  },
});
