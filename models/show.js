import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const showSchema = new Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  startTime: { type: Date, required: true },
  seatsAvailable: [String], // ['A1', 'A2', 'B1'...]
  seatsBooked: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const ShowModel = model("Show", showSchema);
export default ShowModel;