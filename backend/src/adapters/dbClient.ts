import { PrismaClient } from '@prisma/client';


declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = (global.__prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;

export async function runInTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => fn(tx as PrismaClient));
}
