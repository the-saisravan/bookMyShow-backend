import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const venueSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: String,
  totalSeats: Number,
  seatLayout: [String],
}, { timestamps: true });

const VenueModel = model("Venue", venueSchema);
export default VenueModel;