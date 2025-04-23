import { defineType, defineField, defineArrayMember } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const orderType = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
    }),
    defineField({
      name: "amount",
      title: "Amount Paid",
      type: "number",
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdDate",
      title: "Created Date",
      type: "datetime",
    }),
    defineField({
      name: "confirmationCode",
      title: "Confirmation Code",
      type: "string",
    }),
    defineField({
      name: "paymentStatusDescription",
      title: "Payment Status Description",
      type: "string",
    }),
    defineField({
      name: "paymentAccount",
      title: "Payment Account",
      type: "string",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "productId",
              title: "Product ID",
              type: "string",
            }),
            defineField({
              name: "name",
              title: "Product Name",
              type: "string",
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
            }),
            defineField({
              name: "image",
              title: "Product Image",
              type: "image",
            }),
            defineField({ name: "price", title: "Price", type: "number" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "pending",
    }),
  ],
});
