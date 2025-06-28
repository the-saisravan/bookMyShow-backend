import SeatLock from '../models/seatLock.js';

export const cleanupExpiredLocks = async () => {
  try {
    const now = new Date();
    const result = await SeatLock.deleteMany({ expiresAt: { $lt: now } });
    if (result.deletedCount > 0) {
      console.log(`[CRON] Cleared ${result.deletedCount} expired seat locks.`);
    }
  } catch (err) {
    console.error('[CRON] Cleanup failed:', err.message);
  }
};