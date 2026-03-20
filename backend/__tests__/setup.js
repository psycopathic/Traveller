import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer;

export const setupTestDB = async () => {
  // Support both JWT_SECRET and jwt_secret from environment/.env.
  const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret;
  if (jwtSecret) {
    process.env.JWT_SECRET = jwtSecret;
  }

  // Keep tests aligned with app behavior: JWT secret must come from env/.env.
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required for tests. Set it via .env or CI env.');
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

export const teardownTestDB = async () => {
  if (mongoose.connection.isConnected) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearDB = async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
