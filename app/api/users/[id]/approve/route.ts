import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the current user is a super admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== 'SUPER_ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { id } = params;
    const { isApproved } = await request.json();

    if (typeof isApproved !== 'boolean') {
      return new NextResponse('Invalid approval status', { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        isApproved,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_APPROVE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 