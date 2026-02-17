import { prisma } from './prisma';

const DAILY_LIMIT = parseInt(process.env.DAILY_COLORIZE_LIMIT || '10', 10);

const MAX_RETRIES = 3;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  total: number;
  reservationId?: string;
}

/**
 * Read-only rate limit check (safe for UI display, not for gating writes).
 */
export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const { today, tomorrow } = getTodayRange();

  const count = await prisma.imageColorization.count({
    where: {
      userId,
      colorizedAt: { gte: today, lt: tomorrow },
    },
  });

  return {
    allowed: count < DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - count),
    total: DAILY_LIMIT,
  };
}

/**
 * Atomically check the daily limit and insert a reservation row in a single
 * Serializable transaction.  If two concurrent requests race, PostgreSQL will
 * abort one with a serialization error; we retry automatically.
 */
export async function reserveColorization(
  userId: string,
): Promise<RateLimitResult> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const { today, tomorrow } = getTodayRange();

          const count = await tx.imageColorization.count({
            where: {
              userId,
              colorizedAt: { gte: today, lt: tomorrow },
            },
          });

          if (count >= DAILY_LIMIT) {
            return { allowed: false, remaining: 0, total: DAILY_LIMIT };
          }

          const reservation = await tx.imageColorization.create({
            data: { userId },
          });

          const remaining = Math.max(0, DAILY_LIMIT - count - 1);
          return {
            allowed: true,
            remaining,
            total: DAILY_LIMIT,
            reservationId: reservation.id,
          };
        },
        { isolationLevel: 'Serializable' },
      );
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      // P2034 = transaction serialization failure — safe to retry
      if (prismaError.code === 'P2034' && attempt < MAX_RETRIES - 1) {
        continue;
      }
      throw error;
    }
  }

  // Unreachable, but satisfies the compiler
  return { allowed: false, remaining: 0, total: DAILY_LIMIT };
}

/**
 * Delete a reservation (e.g. when the downstream API call fails so the user
 * doesn't lose a slot).
 */
export async function releaseColorization(reservationId: string): Promise<void> {
  await prisma.imageColorization.delete({
    where: { id: reservationId },
  }).catch(() => {
    // Best-effort: row may already have been cleaned up
  });
}

export async function getUserUsageToday(userId: string): Promise<number> {
  const { today, tomorrow } = getTodayRange();

  return await prisma.imageColorization.count({
    where: {
      userId,
      colorizedAt: { gte: today, lt: tomorrow },
    },
  });
}

function getTodayRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { today, tomorrow };
}
