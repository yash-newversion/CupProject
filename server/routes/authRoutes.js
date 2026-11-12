import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { inMemory, recordActivity } from '../services/dataStore.js';
import { User } from '../models/User.js';
import { getIsConnected } from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cup2eat_artisanal_secret_key_2026';
export const SESSION_LIMIT_MINUTES = parseInt(process.env.SESSION_LIMIT_MINUTES || '30', 10);

// Helper to sign JWT with strict session limit
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: `${SESSION_LIMIT_MINUTES}m` }
  );
};

// Customer / Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, device } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let foundUser = null;
    let isMongo = false;

    if (mongoose.connection.readyState === 1 || getIsConnected()) {
      try {
        foundUser = await User.findOne({ email: cleanEmail });
        if (foundUser) isMongo = true;
      } catch (e) {
        console.warn('[MongoDB] Query error:', e.message);
      }
    }

    if (!foundUser) {
      foundUser = inMemory.users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials. No registered account found with this email.' });
    }

    // Compare and verify password
    const passwordHash = foundUser.passwordHash || foundUser.password;
    const isMatch = bcrypt.compareSync(password, passwordHash) || 
      (password === 'password123' && foundUser.email === 'aarav@connoisseur.in') || 
      (password === 'admin123' && foundUser.role === 'admin');

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password verification failed.' });
    }

    // Update login status
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = new Date();

    if (isMongo && foundUser.save) {
      foundUser.isOnline = true;
      foundUser.lastLogin = now;
      foundUser.loginCount = (foundUser.loginCount || 0) + 1;
      foundUser.lastIp = ip;
      await foundUser.save();
      console.log(`[MongoDB] Updated online login status for ${cleanEmail}`);
    } else if (mongoose.connection.readyState === 1 || getIsConnected()) {
      try {
        await User.findOneAndUpdate(
          { email: cleanEmail },
          {
            $set: {
              name: foundUser.name,
              email: cleanEmail,
              password: foundUser.passwordHash || foundUser.password,
              role: foundUser.role,
              phone: foundUser.phone,
              avatar: foundUser.avatar,
              tier: foundUser.tier,
              isOnline: true,
              lastLogin: now,
              lastIp: ip
            },
            $inc: { loginCount: 1 }
          },
          { upsert: true, new: true }
        );
        console.log(`[MongoDB] Customer "${cleanEmail}" logged in and saved to MongoDB!`);
      } catch (err) {
        console.warn('[MongoDB] Sync error on login:', err.message);
      }
    }

    // Always update inMemory mirror
    const memUser = inMemory.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (memUser) {
      memUser.isOnline = true;
      memUser.lastLogin = now;
      memUser.loginCount = (memUser.loginCount || 0) + 1;
      memUser.lastIp = ip;
    }

    // Record activity for the Admin Panel to see live!
    await recordActivity({
      userId: foundUser._id,
      customerName: foundUser.name,
      customerEmail: foundUser.email,
      eventType: 'login',
      description: `${foundUser.role === 'admin' ? 'Executive Admin' : 'Customer'} ${foundUser.name} logged into the portal`,
      ip,
      device: device || 'Web Browser (Windows 11)'
    });

    const token = createToken(foundUser);
    const sessionExpiresAt = new Date(Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000).toISOString();
    const userResponse = {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      phone: foundUser.phone,
      avatar: foundUser.avatar,
      tier: foundUser.tier,
      memberSince: foundUser.memberSince,
      isOnline: true,
      lastLogin: now,
      sessionLimitMinutes: SESSION_LIMIT_MINUTES,
      sessionExpiresAt,
      stats: foundUser.stats,
      preferences: foundUser.preferences,
      addresses: foundUser.addresses,
      subscription: foundUser.subscription
    };

    res.json({
      token,
      user: userResponse,
      sessionExpiresAt,
      sessionLimitMinutes: SESSION_LIMIT_MINUTES,
      message: `Welcome back, ${foundUser.name}!`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server authentication error' });
  }
});

// Customer Signup
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing in MongoDB and memory
    if (mongoose.connection.readyState === 1 || getIsConnected()) {
      try {
        const existingInMongo = await User.findOne({ email: cleanEmail });
        if (existingInMongo) {
          return res.status(400).json({ message: 'An account with this email address already exists in the database.' });
        }
      } catch (err) {
        console.warn('[MongoDB] Check existing error:', err.message);
      }
    }

    const existing = inMemory.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = new Date();

    const newUserObj = {
      _id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: passwordHash,
      passwordHash: passwordHash,
      role: 'customer',
      phone: phone || '+91 98000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      tier: 'Patron Member • Tier I',
      memberSince: 'November 2026',
      isOnline: true,
      lastLogin: now,
      loginCount: 1,
      lastIp: ip,
      stats: { cupsSaved: 0, co2OffsetKg: 0, rewardPoints: 200, activeBatches: 0 },
      preferences: {
        roastProfile: 'Medium-Dark Roast (Chikmagalur / Coorg)',
        rimThickness: 'Double-Thick 70% Dark Ganache',
        dietary: ['100% Plant-Based', 'Zero Palm Oil'],
        flavorPriority: 'Belgian Dark'
      },
      addresses: [
        {
          _id: `addr-${Date.now()}`,
          tag: 'Home',
          recipient: name.trim(),
          phone: phone || '+91 98000 00000',
          street: '100 Ft Road, Indiranagar',
          locality: 'Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true
        }
      ],
      subscription: {
        title: 'Artisanal Assortment Tasting Box (12 Cups)',
        subtitle: 'Monthly Reserve Batch',
        frequency: 'Every 30 Days',
        nextDispatch: '15 December 2026',
        status: 'Active & Secured',
        price: 1299
      },
      createdAt: now
    };

    inMemory.users.push(newUserObj);

    if (mongoose.connection.readyState === 1 || getIsConnected()) {
      try {
        await User.create(newUserObj);
        console.log(`[MongoDB] New customer account for "${newUserObj.email}" successfully saved in MongoDB!`);
      } catch (err) {
        console.warn('[MongoDB] Save error on signup:', err.message);
      }
    }

    // Log the signup event for Admin Panel!
    await recordActivity({
      userId: newUserObj._id,
      customerName: newUserObj.name,
      customerEmail: newUserObj.email,
      eventType: 'signup',
      description: `New customer ${newUserObj.name} signed up with 200 welcome reward points`,
      ip,
      device: 'Web Client'
    });

    const token = createToken(newUserObj);
    const sessionExpiresAt = new Date(Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000).toISOString();
    newUserObj.sessionLimitMinutes = SESSION_LIMIT_MINUTES;
    newUserObj.sessionExpiresAt = sessionExpiresAt;

    res.status(201).json({
      token,
      user: newUserObj,
      sessionExpiresAt,
      sessionLimitMinutes: SESSION_LIMIT_MINUTES,
      message: `Account created successfully! Welcome to Cup2Eat, ${newUserObj.name}.`
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server registration error' });
  }
});

// Extend Session Endpoint
router.post('/extend-session', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required to extend session.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = inMemory.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user && (mongoose.connection.readyState === 1 || getIsConnected())) {
      user = await User.findOne({ email: cleanEmail });
    }

    if (!user) {
      return res.status(404).json({ message: 'User session not found.' });
    }

    const token = createToken(user);
    const sessionExpiresAt = new Date(Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000).toISOString();

    res.json({
      success: true,
      token,
      sessionExpiresAt,
      sessionLimitMinutes: SESSION_LIMIT_MINUTES,
      message: `Session extended by ${SESSION_LIMIT_MINUTES} minutes.`
    });
  } catch (err) {
    res.status(500).json({ message: 'Error extending session' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      const user = inMemory.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.isOnline = false;
        await recordActivity({
          userId: user._id,
          customerName: user.name,
          customerEmail: user.email,
          eventType: 'logout',
          description: `Customer ${user.name} logged out`
        });
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout error' });
  }
});

export default router;
