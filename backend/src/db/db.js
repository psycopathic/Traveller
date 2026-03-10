import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';


const connectDB =async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        throw new ApiError(500, 'Error connecting to MongoDB', [error.message]);
    }
}

export default connectDB