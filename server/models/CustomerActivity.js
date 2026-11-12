import mongoose from 'mongoose';

const customerActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    eventType: {
      type: String,
      enum: ['login', 'signup', 'order_placed', 'logout', 'profile_update'],
      required: true
    },
    description: { type: String, required: true },
    ip: { type: String, default: '127.0.0.1' },
    device: { type: String, default: 'Desktop Browser (Chrome / Windows)' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const CustomerActivity =
  mongoose.models.CustomerActivity ||
  mongoose.model('CustomerActivity', customerActivitySchema);
