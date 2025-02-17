import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Check if this is the first user (super admin)
    const userCount = await prisma.user.count();
    const isSuperAdmin = email === 'mounir@clicksalesmedia.com';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: isSuperAdmin ? 'SUPER_ADMIN' : 'PENDING',
        isApproved: isSuperAdmin,
      },
    });

    return NextResponse.json(
      {
        message: isSuperAdmin 
          ? 'Super admin created successfully' 
          : 'Registration successful. Please wait for admin approval.',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 