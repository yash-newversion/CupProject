import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Gift } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromItem,
  onCheckout,
  onExploreCatalogue,
  user
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const giftWrapFee = giftWrap ? 99 : 0;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 99;

  let discount = 0;
  if (appliedPromo) {
    discount = Math.round(subtotal * appliedPromo.percent);
  }

  const grandTotal = Math.max(0, subtotal - discount + giftWrapFee + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ARTISAN10' || clean === 'CUP10') {
      setAppliedPromo({ code: clean, percent: 0.1 });
      setPromoError('');
    } else if (clean === 'EARTH20') {
      setAppliedPromo({ code: clean, percent: 0.2 });
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "ARTISAN10" for 10% off.');
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async (checkoutData) => {
    await onCheckout(checkoutData);
    setShowCheckoutModal(false);
    setAppliedPromo(null);
    setGiftWrap(false);
  };

  return (
    <>
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={cart}
        pricing={{ subtotal, discount, shipping: shippingFee, giftWrap: giftWrapFee, total: grandTotal }}
        user={user}
        onPlaceOrder={handlePlaceOrder}
      />

      {!isOpen ? null : (
      <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#FAF7F0] border-l border-[#DFD8BF] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#EAE3D2] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Your Atelier Basket
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {cart.reduce((s, i) => s + i.quantity, 0)} handcrafted items
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F2EEDB] hover:bg-[#E5DFCA] flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#EDF0E5] px-5 py-3 border-b border-[#D8DFCE]">
            <div className="flex justify-between items-center text-xs font-medium text-[#3E4B30] mb-1.5">
              <span>
                {isFreeShipping ? (
                  <strong className="text-primary font-bold">🎉 Free Express Shipping Unlocked!</strong>
                ) : (
                  <span>
                    Add <strong className="text-primary font-bold">₹{freeShippingThreshold - subtotal}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#D5E0C8] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAE3D2] mx-auto flex items-center justify-center text-on-surface-variant">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline-md text-base font-bold text-on-surface">
                    Your basket is empty
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                    Choose your artisanal cookie vessels baked fresh to order in our Bengaluru atelier.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreCatalogue();
                  }}
                  className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#344218] transition-colors"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-3 bg-white p-3.5 rounded-xl border border-[#EAE3D2] shadow-sm relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-[#F2EEDB] shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-on-surface leading-tight line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromItem(item.id, item.variant)}
                          className="text-on-surface-variant hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {item.variant}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#DFD8BF] rounded-full bg-[#FAF6EC] px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, -1)}
                          className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.variant, 1)}
                          className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-primary">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && (
              <>
                {/* Gift Wrap Option */}
                <div className="bg-[#F8F4E0] border border-[#E5DFCA] p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-tertiary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        Artisan Gifting Packaging (+₹99)
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        Sage green silk ribbon & handwritten wax-sealed note
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-[#42531F]"
                  />
                </div>

                {/* Promo Code Box */}
                <div className="pt-2">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#E8EEDC] border border-[#CCD8B5] px-3 py-2 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-primary font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code &quot;{appliedPromo.code}&quot; Applied (-{appliedPromo.percent * 100}%)</span>
                      </div>
                      <button
                        onClick={() => setAppliedPromo(null)}
                        className="text-on-surface-variant hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon code (try ARTISAN10)"
                        className="flex-1 bg-white border border-[#DFD8BF] px-3 py-1.5 rounded-lg text-xs uppercase placeholder:normal-case focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="bg-[#566346] hover:bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{promoError}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EAE3D2] bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Artisan Gift Packaging</span>
                    <span className="font-medium text-on-surface">₹{giftWrapFee}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Climate-Controlled Delivery</span>
                  <span className="font-medium text-on-surface">
                    {shippingFee === 0 ? (
                      <strong className="text-primary font-semibold">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE3D2] flex justify-between items-baseline text-sm font-bold text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-lg font-headline-md text-primary">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-primary hover:bg-[#344218] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>100% Edible Guarantee • Breakage-Free Cold Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      )}
    </>
  );
}
