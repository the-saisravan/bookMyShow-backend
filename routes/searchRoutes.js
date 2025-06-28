import express from 'express';
import { searchMoviesByCity } from '../controller/searchController.js';

const router = express.Router();

router.get('/search', searchMoviesByCity);

export default router;