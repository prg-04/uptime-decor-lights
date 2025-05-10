// schemas/category.ts
import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons"; // Example icon

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon, // Optional: Add an icon
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
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
    }),
  ],
});
