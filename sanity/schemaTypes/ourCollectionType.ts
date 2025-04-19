// ourCollection.ts
import { StackCompactIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const ourCollection = defineType({
  name: "ourCollection",
  title: "Our Collection (Hero)",
  type: "document",
  icon: StackCompactIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "hero_image",
      title: "Hero Image",
      type: "image",
      description: "Please upload a large landscape image for best results.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
  ],
});
