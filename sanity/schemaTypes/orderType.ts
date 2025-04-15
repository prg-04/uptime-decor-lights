// sanity/schema/order.ts

import { defineType, defineField, defineArrayMember } from "sanity";
import { BasketIcon, PackageIcon } from "@sanity/icons";

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
      name: "mpesaTransactionId",
      title: "M-Pesa Checkout Request ID",
      type: "string",
      description: "The STK Push checkout request ID from M-Pesa",
    }),
    defineField({
      name: "mpesaReceiptNumber",
      title: "M-Pesa Receipt Number",
      type: "string",
      description:
        "The receipt number provided by M-Pesa after successful payment",
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      initialValue: "mpesa",
      options: {
        list: [
          { title: "M-Pesa", value: "mpesa" },
          { title: "Card", value: "card" },
          { title: "Cash on Delivery", value: "cod" },
        ],
      },
    }),
    defineField({
      name: "paymentDetails",
      title: "Payment Details",
      type: "object",
      fields: [
        defineField({
          name: "resultCode",
          title: "Result Code",
          type: "number",
        }),
        defineField({
          name: "resultDesc",
          title: "Result Description",
          type: "string",
        }),
        defineField({
          name: "transactionDate",
          title: "Transaction Date",
          type: "string",
        }),
        defineField({
          name: "phoneNumber",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "amount",
          title: "Amount",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "paymentDate",
      title: "Payment Date",
      type: "datetime",
      description: "Date when payment was confirmed",
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "customerPhoneNumber",
      title: "Customer Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
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
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.quantity}x ${select.product}`,
                subtitle: `${select.price}*  ${select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
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
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "customerEmail",
      status: "status",
      date: "orderDate",
    },
    prepare(select) {
      const orderIdSnippet = select.orderId
        ? `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`
        : "No ID";
      return {
        title: `${select.name}  (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency}, ${select.status || "unknown status"}`,
        media: BasketIcon,
      };
    },
  },
});
