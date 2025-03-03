import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { orderId, leadId } = paymentIntent.metadata;

      // Get lead data
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        throw new Error('Lead not found');
      }

      // Create customer from lead
      const customer = await prisma.customer.create({
        data: {
          email: lead.email,
          firstName: lead.firstName,
          lastName: lead.lastName,
          address: lead.address,
          city: lead.city,
          state: lead.state,
          zipCode: lead.zipCode,
          country: lead.country,
        },
      });

      // Update order with customer and payment info
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          paymentId: paymentIntent.id,
          customer: {
            connect: {
              id: customer.id,
            },
          },
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 