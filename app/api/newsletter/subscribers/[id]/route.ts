import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import { SubscriberStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!['ACTIVE', 'UNSUBSCRIBED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data: {
        status: status as SubscriberStatus,
        unsubscribedAt: status === 'UNSUBSCRIBED' ? new Date() : null,
      },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error('[SUBSCRIBER_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const subscriber = await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error('[SUBSCRIBER_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 