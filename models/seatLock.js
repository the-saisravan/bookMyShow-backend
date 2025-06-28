import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const seatLockSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  showId: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [{ type: String, required: true }],
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

const SeatLock = model('SeatLock', seatLockSchema);
export default SeatLock;