import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB');
        return true;
    } catch (error) {
        console.error('✗ MongoDB Error:', error.message);
        return false;
    }
}

export default connectDB
