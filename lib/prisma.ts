import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
    errorFormat: 'minimal',
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ensure connection is properly closed on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma; 