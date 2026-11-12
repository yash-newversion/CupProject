import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { CustomerActivity } from '../models/CustomerActivity.js';
import { getIsConnected } from '../config/db.js';
import { INITIAL_USER, INITIAL_ORDERS } from '../../src/data/initialData.js';

// In-Memory Fallback State (automatically synced with MongoDB when connected)
export const inMemory = {
  users: [
    {
      _id: 'usr-admin-1',
      name: 'Chef Meera Rao (Executive Admin)',
      email: 'admin@cup2eat.in',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      phone: '+91 98450 00001',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      tier: 'Head Chef & Atelier Founder',
      isOnline: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      loginCount: 42,
      lastIp: '127.0.0.1 (Localhost Atelier)',
      stats: { cupsSaved: 1240, co2OffsetKg: 98.4, rewardPoints: 8500, activeBatches: 6 },
      preferences: {
        roastProfile: 'Dark French Roast',
        rimThickness: 'Double 70% Dark Ganache',
        dietary: ['100% Plant-Based', 'Zero Palm Oil'],
        flavorPriority: 'Belgian Dark 70%'
      },
      addresses: [],
      createdAt: new Date()
    },
    {
      ...INITIAL_USER,
      _id: 'usr-aarav-1',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: 'customer',
      isOnline: true,
      lastLogin: new Date(),
      loginCount: 18,
      lastIp: '106.51.72.19 (Bengaluru, Karnataka)'
    },
    {
      _id: 'usr-priya-2',
      name: 'Priya Patel',
      email: 'priya.patel@designstudio.in',
      passwordHash: bcrypt.hashSync('priya123', 10),
      role: 'customer',
      phone: '+91 97123 45678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      tier: 'Patron Member • Tier II',
      memberSince: 'January 2025',
      isOnline: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 120),
      loginCount: 9,
      lastIp: '49.37.112.44 (Mumbai, Maharashtra)',
      stats: { cupsSaved: 28, co2OffsetKg: 2.1, rewardPoints: 890, activeBatches: 1 },
      preferences: {
        roastProfile: 'Light Floral (Ethiopian Yirgacheffe)',
        rimThickness: 'Ruby Raspberry Cocoa Rim',
        dietary: ['100% Plant-Based', 'Eggless Certified'],
        flavorPriority: 'Ruby Raspberry'
      },
      addresses: [
        {
          _id: 'addr-3',
          tag: 'Studio',
          recipient: 'Priya Patel',
          phone: '+91 97123 45678',
          street: 'Bandra West, 14th Road',
          locality: 'Bandra',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true
        }
      ],
      createdAt: new Date('2025-01-10')
    }
  ],

  activities: [
    {
      _id: 'act-1',
      userId: 'usr-aarav-1',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@connoisseur.in',
      eventType: 'login',
      description: 'Customer Aarav Sharma logged into Patron Account Dashboard',
      ip: '106.51.72.19 (Bengaluru)',
      device: 'Chrome on Windows 11',
      createdAt: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      _id: 'act-2',
      userId: 'usr-aarav-1',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@connoisseur.in',
      eventType: 'order_placed',
      description: 'Placed Order #C2E-89241 for Artisanal Assortment (12 Cups) • ₹1,897',
      ip: '106.51.72.19 (Bengaluru)',
      device: 'Chrome on Windows 11',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
      _id: 'act-3',
      userId: 'usr-priya-2',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@designstudio.in',
      eventType: 'login',
      description: 'Customer Priya Patel authenticated from Mumbai',
      ip: '49.37.112.44 (Mumbai)',
      device: 'Safari on macOS',
      createdAt: new Date(Date.now() - 1000 * 60 * 120)
    }
  ],

  orders: INITIAL_ORDERS.map((ord, idx) => ({
    _id: `ord-${idx + 1}`,
    userId: 'usr-aarav-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@connoisseur.in',
    ...ord
  }))
};

// Log customer activity helper
export const recordActivity = async ({ userId, customerName, customerEmail, eventType, description, ip, device }) => {
  const newActivity = {
    _id: `act-${Date.now()}`,
    userId: String(userId),
    customerName,
    customerEmail,
    eventType,
    description,
    ip: ip || '127.0.0.1 (Localhost)',
    device: device || 'Web Browser',
    createdAt: new Date()
  };

  inMemory.activities.unshift(newActivity);

  if (mongoose.connection.readyState === 1 || getIsConnected()) {
    try {
      await CustomerActivity.create(newActivity);
      console.log(`[MongoDB] Customer activity "${eventType}" logged to MongoDB!`);
    } catch (err) {
      console.error('[Activity] Error writing to MongoDB:', err.message);
    }
  }

  return newActivity;
};
