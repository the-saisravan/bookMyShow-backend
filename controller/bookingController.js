import Booking from '../models/booking.js';
import Show from '../models/show.js';
import SeatLock from '../models/seatLock.js';

export const lockSeats = async(req,res)=>{
  try{
    const {showId, seats} = req.body;
    const userId = req.user.id;
    //validate input
    if(!showId || !Array.isArray(seats) || seats.length ===0)
    {
      return res.status(400).json({message: " Invalid input. Please provide a valid showId and seats array."});
    }
    //check if show exists
    const show = await Show.findById(showId);
    if(!show){
      return res.status(404).json({message: "Show not found"});
    }
    //check if seats are already booked 
    const now = new Date();
    const conflict = await SeatLock.find({
      showId,
      expiresAt: { $gt: now},
      seats: {$in: seats}
    });
    if(conflict.length>0){
      return res.status(400).json({message: " Some seats are already booked or locked."});
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // lock expires in 5 minutes
    const lock = await SeatLock.create({userId, showId, seats, expiresAt})

    return res.status(201).json({
      message: " Seats locked Successfully",
    })

  }
  catch(err){
    console.error("Error creating booking:",err);
    res.status(500).json({message: "Failed to create booking",error: err.message});
  }
}

export const createBooking = async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user.id;

  // Validate Lock
  const lock = await SeatLock.findOne({
    userId,
    showId,
    seats: { $all: seats },
    expiresAt: { $gt: new Date() }
  });

  if (!lock) {
    return res.status(403).json({ message: "You don't have a valid lock" });
  }

  // Atomic Booking
  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      seatsBooked: { $not: { $elemMatch: { $in: seats } } }
    },
    {
      $push: { seatsBooked: { $each: seats } }
    },
    { new: true }
  );

  if (!updatedShow) {
    return res.status(409).json({ message: "Seats were just booked by someone else" });
  }

  // Create Booking
  const booking = await Booking.create({ userId, showId, seats });

  // Delete lock
  await SeatLock.deleteOne({ _id: lock._id });

  return res.status(201).json({ message: "Booking confirmed", booking });
};