import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  variant: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const trackingStepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  label: { type: String, required: true },
  desc: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['completed', 'active', 'pending'], default: 'pending' }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, default: 'Baking in Atelier' },
    statusCode: {
      type: String,
      enum: ['processing', 'baking', 'in_transit', 'delivered', 'cancelled'],
      default: 'processing'
    },
    trackingId: { type: String, default: 'BD-99482014' },
    courier: { type: String, default: 'BlueDart Express Air' },
    estimatedDelivery: { type: String, default: 'Thursday, 14 Nov • By 2:00 PM' },
    totalAmount: { type: Number, required: true },
    itemsSummary: { type: String },
    items: [orderItemSchema],
    deliveryAddress: {
      recipient: String,
      street: String,
      locality: String,
      city: String,
      state: String,
      pincode: String,
      phone: String
    },
    pricing: {
      subtotal: Number,
      discount: Number,
      shipping: Number,
      packaging: Number,
      tax: Number,
      total: Number
    },
    steps: [trackingStepSchema]
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema);
