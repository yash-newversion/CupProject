import React, { useState } from 'react';
import { X, Star, Flame, Shield, CheckCircle2, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [selectedPack, setSelectedPack] = useState(
    product.packs.find((p) => p.isDefault) || product.packs[0]
  );
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, selectedPack, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#FAF7F0] border border-[#DFD8BF] text-left shadow-2xl transition-all my-4 sm:my-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-on-surface-variant flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Stage */}
            <div className="relative bg-[#F2EEDB] p-6 flex items-center justify-center min-h-[260px] md:min-h-[400px]">
              <img
                src={product.image}
                alt={product.imageAlt}
                className="w-full h-full max-h-[340px] object-cover rounded-xl shadow-md"
              />
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-[#596B35] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.badge}
              </div>
            </div>

            {/* Narrative & Options */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold mb-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-on-surface-variant font-normal">
                    ({product.reviewCount} connoisseur reviews)
                  </span>
                </div>

                <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface leading-snug">
                  {product.title}
                </h3>

                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {product.longDesc || product.shortDesc}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#EAE3D2]">
                  <div className="bg-white p-2.5 rounded-lg border border-[#E5DFCA]">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Capacity</span>
                    <span className="text-xs font-semibold text-primary">{product.capacity}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#E5DFCA]">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Heat Proof</span>
                    <span className="text-xs font-semibold text-primary">{product.heatResistance}</span>
                  </div>
                </div>

                {/* Tasting Notes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">Tasting Notes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tastingNotes?.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-[#EFEAD7] text-[#42531F] px-2.5 py-0.5 rounded-full"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pack Selection */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant">Select Batch Size</span>
                  <div className="grid grid-cols-3 gap-2">
                    {product.packs?.map((pack) => {
                      const isSelected = selectedPack.size === pack.size;
                      return (
                        <button
                          key={pack.size}
                          onClick={() => setSelectedPack(pack)}
                          className={`p-2 rounded-lg text-center border text-xs transition-all ${
                            isSelected
                              ? 'border-primary bg-primary text-white font-bold shadow-sm'
                              : 'border-[#DFD8BF] bg-white text-on-surface hover:border-primary/50'
                          }`}
                        >
                          <div className="font-semibold">{pack.size}</div>
                          <div className={isSelected ? 'text-[#D5EBA8]' : 'text-primary font-bold'}>
                            ₹{pack.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-4 border-t border-[#EAE3D2] flex items-center justify-between gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#DFD8BF] rounded-full bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-on-surface">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-primary hover:bg-[#344218] text-white py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add • ₹{(selectedPack.price * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
