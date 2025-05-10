// schemas/homePageSettings.ts
import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export default defineType({
  name: "homePageSettings",
  title: "Homepage Settings",
  type: "document",
  icon: HomeIcon,
  fields: [
    // Hero Carousel
    defineField({
      name: "heroCarouselItems",
      title: "Hero Carousel Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "ctaText",
              title: "Button Text",
              type: "string",
            }),
            defineField({
              name: "ctaLink",
              title: "Button Link",
              type: "string",
              description: "e.g., /products/category-slug",
            }),
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Carousel Item", media };
            },
          },
        },
      ],
      group: "hero",
    }),

    // Featured Products Section
    defineField({
      name: "featuredProductsTitle",
      title: "Featured Products Section Title",
      type: "string",
      initialValue: "Featured Products",
      group: "productSections",
    }),
    defineField({
      name: "featuredProductsLinkText",
      title: 'Featured Products "View All" Text',
      type: "string",
      initialValue: "View All Featured",
      group: "productSections",
    }),
    defineField({
      name: "featuredProductsLinkHref",
      title: 'Featured Products "View All" Link',
      description: "Relative path (e.g., /products/featured) or full URL.",
      type: "string",
      initialValue: "/products/featured",
      group: "productSections",
    }),

    // Best Sellers Section
    defineField({
      name: "bestSellersTitle",
      title: "Best Sellers Section Title",
      type: "string",
      initialValue: "Best Sellers",
      group: "productSections",
    }),
    defineField({
      name: "bestSellersLinkText",
      title: 'Best Sellers "Shop" Text',
      type: "string",
      initialValue: "Shop Best Sellers",
      group: "productSections",
    }),
    defineField({
      name: "bestSellersLinkHref",
      title: 'Best Sellers "Shop" Link',
      description: "Relative path (e.g., /products/best-sellers) or full URL.",
      type: "string",
      initialValue: "/products/best-sellers",
      group: "productSections",
    }),

    // New Arrivals Section
    defineField({
      name: "newArrivalsTitle",
      title: "New Arrivals Section Title",
      type: "string",
      initialValue: "New Arrivals",
      group: "productSections",
    }),
    defineField({
      name: "newArrivalsLinkText",
      title: 'New Arrivals "Explore" Text',
      type: "string",
      initialValue: "Explore New Arrivals",
      group: "productSections",
    }),
    defineField({
      name: "newArrivalsLinkHref",
      title: 'New Arrivals "Explore" Link',
      description: "Relative path (e.g., /products/new-arrivals) or full URL.",
      type: "string",
      initialValue: "/products/new-arrivals",
      group: "productSections",
    }),

    // Banner Section
    defineField({
      name: "bannerTitle",
      title: "Banner Title",
      type: "string",
      group: "banner",
    }),
    defineField({
      name: "bannerDescription1",
      title: "Banner Description (Line 1)",
      type: "text",
      group: "banner",
    }),
    defineField({
      name: "bannerDescription2",
      title: "Banner Description (Line 2)",
      type: "text",
      group: "banner",
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Background Image",
      type: "image",
      options: { hotspot: true },
      group: "banner",
    }),

    // Featured Looks Section
    defineField({
      name: "featuredLooksTitle",
      title: "Featured Looks Section Title",
      type: "string",
      initialValue: "Featured Looks",
      group: "featuredLooks",
    }),
    // Future: Add array for featured looks items if needed
    // defineField({
    //   name: 'featuredLooksItems',
    //   title: 'Featured Looks Items',
    //   type: 'array',
    //   group: 'featuredLooks',
    //   of: [{ type: 'image', options: { hotspot: true }, fields: [ defineField({ name: 'alt', type: 'string', title: 'Alt Text' }) ] }],
    // }),

    // Shop By Room Section
    defineField({
      name: "shopByRoomTitle",
      title: "Shop By Room Section Title",
      type: "string",
      initialValue: "Shop by Room",
      group: "shopByRoom",
    }),
    defineField({
      name: "roomItems",
      title: "Room Items",
      type: "array",
      group: "shopByRoom",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Room Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Room Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
              description:
                "Relative path (e.g., /products/living-room) or full URL.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Room Item", media };
            },
          },
        },
      ],
    }),

    // Lighting Tips Section
    defineField({
      name: "lightingTipsTitle",
      title: "Lighting Tips Section Title",
      type: "string",
      initialValue: "Lighting Tips & Inspiration",
      group: "lightingTips",
    }),
    defineField({
      name: "lightingTipsDescription",
      title: "Lighting Tips Description",
      type: "text",
      group: "lightingTips",
    }),
    defineField({
      name: "lightingTipsButtonText",
      title: "Lighting Tips Button Text",
      type: "string",
      initialValue: "Get Inspired",
      group: "lightingTips",
    }),
    defineField({
      name: "lightingTipsButtonLink",
      title: "Lighting Tips Button Link",
      type: "string",
      description: "Relative path (e.g., /inspiration) or full URL.",
      initialValue: "/inspiration",
      group: "lightingTips",
    }),

    // SEO Content Section
    defineField({
      name: "seoContentItems",
      title: "Home SEO Content Items",
      description:
        "Add sections of text content for the bottom of the homepage.",
      type: "array",
      group: "seoContent",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
            prepare({ title, subtitle }) {
              return {
                title: title || "SEO Item",
                subtitle:
                  subtitle?.substring(0, 50) + "..." || "No description",
              };
            },
          },
        },
      ],
    }),
  ],
  // Define groups for better organization in the Studio
  groups: [
    { name: "hero", title: "Hero Carousel", default: true },
    { name: "productSections", title: "Product Sections" },
    { name: "banner", title: "Banner" },
    { name: "featuredLooks", title: "Featured Looks" },
    { name: "shopByRoom", title: "Shop By Room" },
    { name: "lightingTips", title: "Lighting Tips" },
    { name: "seoContent", title: "SEO Content" },
  ],
});
