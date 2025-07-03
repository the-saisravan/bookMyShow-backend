import express from 'express';
import authoriseRoles, { userAuthenticate } from '../middleware/auth.js';
import {createBooking, lockSeats} from '../controller/bookingController.js';

const router = express.Router();

router.post('/lock', userAuthenticate, lockSeats);
router.post('/booking', userAuthenticate, createBooking);

export default router;