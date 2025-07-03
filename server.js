import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import './utils/cleanUpLock.js';


const app = express();
dotenv.config();
app.use(express.json());

const connectDB = await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        const db= mongoose.connection;
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        console.log(`MongoDB connection error: ${err}`)
    })


app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', searchRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
