// import express from 'express';
// import { addMovie, addVenue, createShow } from '../controller/adminController.js';
// import authMiddleware from '../middleware/auth.js';
// import checkAdmin from '../middleware/checkAdmin.js';

// const router = express.Router();

// router.use(authMiddleware, checkAdmin);

// router.post('/movie', addMovie);
// router.post('/venue', addVenue);
// router.post('/show', createShow);

// export default router;

import express from 'express';
import { addMovie, addVenue, createShow } from '../controller/adminController.js';
import userAuthenticate from '../middleware/auth.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

// router.use(userAuthenticate, checkAdmin);

router.post('/movie', addMovie);
router.post('/venue', addVenue);
router.post('/show', createShow);

export default router;