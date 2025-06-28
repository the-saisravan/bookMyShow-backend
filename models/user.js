import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const UserModel = model("User", userSchema);
export default UserModel;