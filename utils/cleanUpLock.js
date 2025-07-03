import SeatLock from "../models/seatLock.js";
import cron from 'node-cron';

cron.schedule('* * * * *', async()=>{
  const now = new Date();
  try{
    await SeatLock.deleteMany({expiresAt: { $lt: now } });
  }
  catch(error){
    console.error("Error cleaning up expired locks:", error);
  }

});