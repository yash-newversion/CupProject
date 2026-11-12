import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  tag: { type: String, default: 'Home' },
  recipient: { type: String, required: true },
  phone: { type: String },
  street: { type: String, required: true },
  locality: { type: String },
  city: { type: String, default: 'Bengaluru' },
  state: { type: String, default: 'Karnataka' },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, default: '+91 98450 12894' },
    avatar: {
      type: String,
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_OW0Qdryn4-7Vt-FfvKj6YyXrvhyHefM69V1uT1ti1quyvataQH7Y46bzMA0RbRNocwcLXuyxv62T0FpKMR7queJ7lMi3vc8NgUwctv7ey-nKnAxaqrIlLN4U-zli7C95dvY15Vf4SnlC-2zlmbUlqGvPIhkMQztISKr5tGWBbJlvI23_F8m4dVZGAX7B5IChi63-IWzfV5KRWyMG7zq4VraTYBTOlgziEapBqpU'
    },
    tier: { type: String, default: 'Patron Member • Tier I' },
    memberSince: { type: String, default: 'November 2026' },
    isOnline: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    loginCount: { type: Number, default: 1 },
    lastIp: { type: String, default: '127.0.0.1' },
    stats: {
      cupsSaved: { type: Number, default: 0 },
      co2OffsetKg: { type: Number, default: 0 },
      rewardPoints: { type: Number, default: 100 },
      activeBatches: { type: Number, default: 0 }
    },
    preferences: {
      roastProfile: { type: String, default: 'Medium-Dark Roast (Chikmagalur / Coorg)' },
      rimThickness: { type: String, default: 'Double-Thick 70% Dark Ganache' },
      dietary: { type: [String], default: ['100% Plant-Based', 'Eggless Certified'] },
      flavorPriority: { type: String, default: 'Belgian Dark & Salted Caramel' }
    },
    addresses: [addressSchema],
    subscription: {
      title: { type: String, default: 'Artisanal Assortment Luxury Gifting Box' },
      subtitle: { type: String, default: 'Curated 16-Compartment Reserve Selection' },
      frequency: { type: String, default: 'Every 30 Days' },
      nextDispatch: { type: String, default: '28 November 2026' },
      status: { type: String, default: 'Active & Secured' },
      price: { type: Number, default: 1899 },
      image: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSrhENVZR6p4I2B9_iizu0wgJTwaLwtmygcvU2qwERkcn52YX-Gf2Ur02doTFoeeCGGDmwGGQZqQ8J2bOiUXEO_CaFzFrULwxcMKlX9xAxl8vQRuh-cmDF7i_aLA7wKH-c8sksWZKhuQHkK4L2eAkraCYN_3HcRVT0dapyQcUdD4yoMyjZ3HoyWVmfEe-BAsc-ayAbRF80XDKFxRGvrGeZVEjQxA1fVPqlcADQKZs' }
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
