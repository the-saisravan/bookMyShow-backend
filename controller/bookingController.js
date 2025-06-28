import Booking from '../models/booking.js';
import Show from '../models/show.js';
import SeatLock from '../models/seatLock.js';

export const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all bookings by user and populate show/movie/venue
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', model: 'Movie' },
          { path: 'venueId', model: 'Venue' }
        ]
      })
      .sort({ createdAt: -1 });

    const formattedHistory = bookings.map(booking => {
      return {
        bookingId: booking._id,
        movie: booking.showId.movieId.title,
        venue: booking.showId.venueId.name,
        city: booking.showId.venueId.city,
        startTime: booking.showId.startTime,
        seats: booking.seats,
        bookedAt: booking.createdAt
      };
    });

    res.status(200).json({ history: formattedHistory });
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).json({ message: "Failed to fetch booking history", error: err.message });
  }
};


//crate a new booking
export const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    //check if input is valid or not
    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Invalid showId or seats" });
    }

    // 2. Confirm if Show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // 3. Check if any seats already booked
    const alreadyBooked = seats.filter(seat => show.seatsBooked.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(409).json({ message: `Seats already booked: ${alreadyBooked.join(", ")}` });
    }

    // 4. Validate user holds a valid seat lock
    const validLock = await SeatLock.findOne({
      userId,
      showId,
      expiresAt: { $gt: new Date() },
      seats: { $all: seats }
    });

    if (!validLock) {
      return res.status(403).json({ message: "You do not hold a valid seat lock for the selected seats" });
    }

    // 5. Book seats atomically (check again to avoid race condition)
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
      return res.status(409).json({ message: "Seat booking conflict. Some seats may have just been booked." });
    }

    // 6. Create booking
    const booking = await Booking.create({
      userId,
      showId,
      seats
    });

    // 7. Clear the seat lock
    await SeatLock.deleteOne({ _id: validLock._id });

    return res.status(201).json({
      message: "Booking confirmed",
      booking
    });

  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ message: "Booking failed", error: err.message });
  }
};


// Lock seats temporarily (say, for 5 mins)
export const lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Invalid showId or seats" });
    }

    // Check if any of the requested seats are already locked or booked
    const now = new Date();
    const existingLocks = await SeatLock.find({
      showId,
      expiresAt: { $gt: now },
      seats: { $in: seats }
    });

    if (existingLocks.length > 0) {
      return res.status(400).json({ message: "Some seats are already locked", conflict: existingLocks });
    }

    // Lock seats for 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    const seatLock = await SeatLock.create({ userId, showId, seats, expiresAt });

    return res.status(200).json({ message: "Seats locked successfully", lock: seatLock });

  } catch (err) {
    console.error("Seat Lock Error:", err);
    return res.status(500).json({ message: "Failed to lock seats", error: err.message });
  }
};