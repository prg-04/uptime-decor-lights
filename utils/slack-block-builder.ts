import { MessageType, N8nPayload, SlackBlock,  SlackMessage,  } from "@/types";

export class SlackBlockBuilder {
    private blocks: SlackBlock[] = [];
  
    // Header section with order status
    addOrderHeader(payload: N8nPayload): this {
      const statusEmoji = this.getPaymentStatusEmoji(payload.payment_status);
      const statusText = this.getPaymentStatusText(payload.payment_status);
      
      this.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${statusEmoji} *New Order Received!*\n\nOrder #*${payload.order_number}* has been successfully placed and is ready for processing.\n\n*Payment Status:* ${statusText}`
        }
      });
      return this;
    }
  
    // Add divider
    addDivider(): this {
      this.blocks.push({
        type: "divider"
      });
      return this;
    }
  
    // Order details section with fields
    addOrderDetails(payload: N8nPayload): this {
      this.blocks.push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Order Number:*\n${payload.order_number}`
          },
          {
            type: "mrkdwn",
            text: `*Tracking ID:*\n${payload.order_tracking_id}`
          },
          {
            type: "mrkdwn",
            text: `*Confirmation Code:*\n${payload.confirmation_code || 'Pending'}`
          },
          {
            type: "mrkdwn",
            text: `*Amount:*\nKES ${payload.amount.toFixed(2)}`
          },
          {
            type: "mrkdwn",
            text: `*Payment Method:*\n${payload.payment_method || 'Not specified'}`
          },
          {
            type: "mrkdwn",
            text: `*Created Date:*\n${this.formatDate(payload.created_date)}`
          }
        ]
      });
      return this;
    }
  
    // Customer information section
    addCustomerInfo(payload: N8nPayload): this {
      this.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Customer Information*\n:bust_in_silhouette: *${payload.customer_name}*\n:email: ${payload.customer_email}\n:phone: ${payload.customer_phone}`
        }
      });
      return this;
    }
  
    // Shipping details section
    addShippingDetails(payload: N8nPayload): this {
      this.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Shipping Details*\n:round_pushpin: ${payload.shipping_location}\n:cityscape: ${payload.city_town}\n:id: Clerk ID: ${payload.clerk_id}`
        }
      });
      return this;
    }
  
    // Products section
    addProductsList(payload: N8nPayload): this {
      if (!payload.products || payload.products.length === 0) {
        this.blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Products Ordered*\nNo products found in this order."
          }
        });
        return this;
      }
  
      const productListText = payload.products.map(product =>
        `• ${product.name} (x${product.quantity}) - KES ${(product.price * product.quantity).toFixed(2)}`
      ).join('\n');
  
      this.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Products Ordered*\n${productListText}`
        }
      });
  
      // Add image blocks for products with image URLs
      payload.products.forEach(product => {
        if (product.image_url) {
          this.addImageBlock(product.image_url, product.name, product.name);
        }
      });
  
      const totalItems = payload.products.reduce((sum, product) => sum + product.quantity, 0);
  
      this.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `\n*Total Items:* ${totalItems} product${totalItems !== 1 ? 's' : ''}`
        }
      });
      return this;
    }

    // Add image block
    addImageBlock(imageUrl: string, altText: string, title?: string): this {
      const imageBlock: SlackBlock = {
        type: "image",
        image_url: imageUrl,
        alt_text: altText
      };
      if (title) {
        imageBlock.title = {
          type: "plain_text",
          text: title,
          emoji: true
        };
      }
      this.blocks.push(imageBlock);
      return this;
    }
  
    // Action buttons
    // addActionButtons(payload: N8nPayload): this {
    //   const buttons = [];
  
    //   // View Order button (primary)
    //   buttons.push({
    //     type: "button",
    //     text: {
    //       type: "plain_text",
    //       text: "View Order",
    //       emoji: true
    //     },
    //     style: "primary",
    //     value: `view_order_${payload.order_number}`,
    //     url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/orders/${payload.order_number}`
    //   });
  
    //   // Process Order button (only for paid orders)
    //   if (payload.payment_status === 'paid') {
    //     buttons.push({
    //       type: "button",
    //       text: {
    //         type: "plain_text",
    //         text: "Process Order",
    //         emoji: true
    //       },
    //       value: `process_order_${payload.order_number}`
    //     });
    //   }
  
    //   // Contact Customer button
    //   buttons.push({
    //     type: "button",
    //     text: {
    //       type: "plain_text",
    //       text: "Contact Customer",
    //       emoji: true
    //     },
    //     value: `contact_customer_${payload.order_number}`,
    //     url: `mailto:${payload.customer_email}`
    //   });
  
    //   // Only add actions if we have buttons
    //   if (buttons.length > 0) {
    //     this.blocks.push({
    //       type: "actions",
    //       elements: buttons
    //     });
    //   }
      
    //   return this;
    // }
  
    // Payment status helpers
    private getPaymentStatusEmoji(status: string): string {
      switch (status) {
        case 'paid': return ':white_check_mark:';
        case 'pending': return ':hourglass_flowing_sand:';
        case 'failed': return ':x:';
        default: return ':question:';
      }
    }
  
    private getPaymentStatusText(status: string): string {
      switch (status) {
        case 'paid': return ':white_check_mark: Paid';
        case 'pending': return ':hourglass_flowing_sand: Pending';
        case 'failed': return ':x: Failed';
        default: return ':question: Unknown';
      }
    }
  
    // Date formatting helper
    private formatDate(isoString: string): string {
      try {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return isoString;
      }
    }
  
    // Build and return the complete message
    build(): SlackMessage {
      return {
        blocks: this.blocks
      };
    }
  
    // Reset builder for reuse
    reset(): this {
      this.blocks = [];
      return this;
    }
  }
  
  // Factory function to create different types of messages
  export function createSlackBlockMessage(
    payload: N8nPayload, 
    messageType: MessageType = 'order_notification'
  ): SlackMessage {
    const builder = new SlackBlockBuilder();
  
    switch (messageType) {
      case 'order_notification':
        return builder
          .addOrderHeader(payload)
          .addDivider()
          .addOrderDetails(payload)
          .addCustomerInfo(payload)
          .addShippingDetails(payload)
          .addProductsList(payload)
          .addDivider()
          // .addActionButtons(payload)
          .build();
  
      case 'payment_update':
        return builder
          .addOrderHeader(payload)
          .addDivider()
          .addOrderDetails(payload)
          .addCustomerInfo(payload)
          .addDivider()
          // .addActionButtons(payload)
          .build();
  
      case 'order_shipped':
        return builder
          .addOrderHeader(payload)
          .addDivider()
          .addCustomerInfo(payload)
          .addShippingDetails(payload)
          .addProductsList(payload)
          .build();
  
      default:
        return builder
          .addOrderHeader(payload)
          .addDivider()
          .addOrderDetails(payload)
          .addCustomerInfo(payload)
          .addShippingDetails(payload)
          .addProductsList(payload)
          .addDivider()
          // .addActionButtons(payload)
          .build();
    }
  }
  
  // Slack API integration
  export async function sendSlackMessage(
    message: SlackMessage,
    channel: string,
    token: string
  ): Promise<any> {
    if (!token) {
      throw new Error('Slack bot token is required');
    }
  
    if (!channel) {
      throw new Error('Slack channel is required');
    }
  
    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channel,
          blocks: message.blocks,
          unfurl_links: false,
          unfurl_media: false
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }
  
      return data;
    } catch (error) {
      console.error('Error sending Slack message:', error);
      throw error;
    }
  }
  
  // Utility function to send order notification directly
  export async function sendOrderNotification(
    payload: N8nPayload,
    messageType: MessageType = 'order_notification'
  ): Promise<any> {
    const token = process.env.SLACK_BOT_TOKEN;
    const channel = process.env.SLACK_CHANNEL || '#new-order';
  
    if (!token) {
      throw new Error('SLACK_BOT_TOKEN environment variable is not set');
    }
  
    const message = createSlackBlockMessage(payload, messageType);
    return await sendSlackMessage(message, channel, token);
  }