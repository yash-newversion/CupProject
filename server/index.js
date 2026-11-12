import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getIsConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Cup2Eat Atelier Backend API',
    mongoConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Cup2Eat Atelier API running on http://localhost:${PORT}`);
  console.log(`[Server] Auth: /api/auth | Admin: /api/admin | Orders: /api/orders`);
});
