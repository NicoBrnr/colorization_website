import { prisma } from './prisma';

const DAILY_LIMIT = 3;

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  total: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Count colorizations today
  const count = await prisma.imageColorization.count({
    where: {
      userId,
      colorizedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const remaining = Math.max(0, DAILY_LIMIT - count);
  const allowed = count < DAILY_LIMIT;

  return {
    allowed,
    remaining,
    total: DAILY_LIMIT,
  };
}

export async function recordColorization(userId: string, imageUrl?: string): Promise<void> {
  await prisma.imageColorization.create({
    data: {
      userId,
      imageUrl,
    },
  });
}

export async function getUserUsageToday(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await prisma.imageColorization.count({
    where: {
      userId,
      colorizedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
}
