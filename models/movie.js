import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  language: String,
  genre: String,
  duration: Number, // in minutes
  city: [String], // cities it's playing in
}, { timestamps: true });

const MovieModel = model("Movie", movieSchema);
export default MovieModel;