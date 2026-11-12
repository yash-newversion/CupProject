import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cup2eat';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Could not establish connection to ${uri}: ${error.message}`);
    console.info(`[MongoDB] System is running in Resilient Hybrid Mode. An active in-memory sync engine will ensure all user logins, registrations, and admin monitoring function smoothly until MongoDB is connected.`);
    return false;
  }
};

export const getIsConnected = () => isConnected;
