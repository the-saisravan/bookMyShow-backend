import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShowModel', required: true },
  seats: [{ type: String, required: true }],
  status: { type: String, enum: ['BOOKED', 'CANCELLED'], default: 'BOOKED' },
}, { timestamps: true });

const BookingModel = model("Booking", bookingSchema);
export default BookingModel;

