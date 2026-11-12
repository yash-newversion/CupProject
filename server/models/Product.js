import mongoose from 'mongoose';

const packOptionSchema = new mongoose.Schema({
  size: { type: String, required: true },
  count: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  isDefault: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    categories: { type: [String], default: ['all'] },
    badge: { type: String, default: 'Atelier Signature' },
    badgeType: { type: String, default: 'gold' },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 120 },
    capacity: { type: String, required: true },
    heatResistance: { type: String, default: '85°C for 45 Mins' },
    sustainability: { type: String, default: 'Zero Waste • 100% Edible' },
    shortDesc: { type: String, required: true },
    longDesc: { type: String },
    tastingNotes: { type: [String], default: [] },
    pairing: { type: String },
    packs: [packOptionSchema],
    defaultPrice: { type: Number, required: true },
    defaultOriginalPrice: { type: Number },
    image: { type: String, required: true },
    imageAlt: { type: String },
    inStock: { type: Boolean, default: true },
    inventoryCount: { type: Number, default: 250 }
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
