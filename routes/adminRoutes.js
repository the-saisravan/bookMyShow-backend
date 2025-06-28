import express from 'express';
import { addMovie, addVenue, createShow } from '../controller/adminController.js';
import userAuthenticate from '../middleware/auth.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

router.post('/movie', addMovie);
router.post('/venue', addVenue);
router.post('/show', createShow);

export default router;