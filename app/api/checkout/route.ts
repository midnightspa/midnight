import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, items, isDigital, total } = body;

    console.log('Checkout items:', items);
    console.log('Is digital:', isDigital);
    console.log('Item types:', items.map((item: any) => item.type));

    // Create a lead first
    const lead = await prisma.lead.create({
      data: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.phoneNumber ? { phoneNumber: formData.phoneNumber } : {}),
        address: !isDigital ? formData.address : null,
        city: !isDigital ? formData.city : null,
        state: !isDigital ? formData.state : null,
        zipCode: !isDigital ? formData.zipCode : null,
        country: !isDigital ? formData.country : null,
      } as any,
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
        items: items,
        total: total,
        ...(isDigital !== undefined ? { isDigital } : {}),
        status: isDigital ? "digital_pending" : "pending",
        lead: {
          connect: {
            id: lead.id,
          },
        },
      } as any,
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects amounts in cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        leadId: lead.id,
        isDigital: isDigital.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 