import { NextRequest, NextResponse } from 'next/server';
import { createSlackBlockMessage, sendSlackMessage,  } from '@/utils/slack-block-builder';
import { MessageType, N8nPayload } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const payload: N8nPayload = await request.json();

        // Validate required payload fields
        if (!payload.order_number || !payload.customer_email || !payload.order_tracking_id) {
            return NextResponse.json(
                { message: 'Invalid payload - missing required fields: order_number, customer_email, or order_tracking_id' },
                { status: 400 }
            );
        }

        // Validate payment status
        if (!['paid', 'pending', 'failed'].includes(payload.payment_status)) {
            return NextResponse.json(
                { message: 'Invalid payment status. Must be: paid, pending, or failed' },
                { status: 400 }
            );
        }

        // Determine message type from query parameter
        const messageType: MessageType = (request.nextUrl.searchParams.get('type') as MessageType) || 'order_notification';

        // Validate message type
        if (!['order_notification', 'payment_update', 'order_shipped'].includes(messageType)) {
            return NextResponse.json(
                { message: 'Invalid message type. Must be: order_notification, payment_update, or order_shipped' },
                { status: 400 }
            );
        }

        // Create the Slack block message
        const orderNotification = createSlackBlockMessage(payload, messageType);

        // Get Slack configuration from environment variables
        const slackToken = process.env.SLACK_BOT_TOKEN;
        const channel = process.env.SLACK_CHANNEL || '#orders';

        if (!slackToken) {
            console.error('SLACK_BOT_TOKEN is not configured');
            return NextResponse.json(
                { message: 'Slack configuration is missing. Please contact administrator.' },
                { status: 500 }
            );
        }

        // Log the notification attempt
        console.log(`[Slack API] Sending ${messageType} for order ${payload.order_number} to channel ${channel}`);

        // Send to Slack
        const slackResponse = await sendSlackMessage(orderNotification, channel, slackToken);

        if (slackResponse.ok) {
            console.log(`[Slack API] Successfully sent notification for order ${payload.order_number}`);
            return NextResponse.json({
                message: 'Notification sent successfully',
                slack_ts: slackResponse.ts,
                channel: slackResponse.channel
            });
        } else {
            throw new Error(`Slack API returned error: ${slackResponse.error || 'Unknown error'}`);
        }

    } catch (error: any) {
        console.error('Error sending Slack notification:', error);
        
        // Return appropriate error response
        const statusCode = error.message?.includes('Slack API error') ? 502 : 500;
        return NextResponse.json(
            { 
                message: 'Failed to send notification',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            },
            { status: statusCode }
        );
    }
}