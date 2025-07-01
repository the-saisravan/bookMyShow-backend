import SeatLock from "../models/seatLock.js";

export const cleanUpExpiredLocks = async(req, res)=>{
  const now = new Date();
  await SeatLock.deleteMany({
    expiresAt: { $lt: now }
  });
}