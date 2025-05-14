/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/slack.ts
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

interface SlackNotificationInput {
  order: {
    order_number: string;
    payment_status: string;
    amount: number;
    customer_name: string;
    customer_phone: string;
    shipping_location?: string;
    city_town?: string;
  };
  products: {
    product_name: string;
    quantity: number;
    price: number;
    image_url: string;
  }[];
}

export async function sendSlackNotification({
  order,
  products,
}: SlackNotificationInput) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("[Slack] SLACK_WEBHOOK_URL not defined");
    return;
  }

  const blocks: any[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `🛒 New Order: ${order.order_number}` },
    },
    { type: "divider" },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Payment Status:*\n${order.payment_status}` },
        { type: "mrkdwn", text: `*Total Amount:*\nKES ${order.amount}` },
      ],
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Customer:*\n${order.customer_name}` },
        { type: "mrkdwn", text: `*Phone:*\n${order.customer_phone}` },
        {
          type: "mrkdwn",
          text: `*Shipping Location:*\n${order.shipping_location || "Not provided"}`,
        },
        {
          type: "mrkdwn",
          text: `*City/Town:*\n${order.city_town || "Not provided"}`,
        },
      ],
    },
    { type: "divider" },
  ];

  products.forEach((product) => {
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*${product.quantity}x ${product.product_name}*\nKES ${product.price * product.quantity}`,
        },
      ],
      accessory: {
        type: "image",
        image_url: product.image_url,
        alt_text: product.product_name,
      },
    });
  });

  blocks.push({ type: "divider" });

  const payload = {
    text: `New order from ${order.customer_name}`,
    blocks,
  };

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
