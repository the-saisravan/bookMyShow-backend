import express from 'express';
import authoriseRoles, { userAuthenticate } from '../middleware/auth.js';
import {createBooking} from '../controller/bookingController.js';

const router = express.Router();

// router.get('/history', userAuthenticate, getBookingHistory);
router.post('/', userAuthenticate, createBooking);
// router.post('/lock', userAuthenticate, lockSeats);

export default router;