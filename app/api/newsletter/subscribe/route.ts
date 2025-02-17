import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = subscribeSchema.parse(body);

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'UNSUBSCRIBED') {
        // Reactivate the subscription
        const updatedSubscriber = await prisma.subscriber.update({
          where: { email },
          data: {
            status: 'PENDING',
            unsubscribedAt: null,
          },
        });
        return NextResponse.json(updatedSubscriber);
      }
      return new NextResponse('Already subscribed', { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        firstName,
        lastName,
        status: 'PENDING',
      },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 422 });
    }

    console.error('[NEWSLETTER_SUBSCRIBE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 