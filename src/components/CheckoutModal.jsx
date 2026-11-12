import React, { useState } from 'react';
import {
  X, ChevronRight, ChevronLeft, MapPin, CreditCard, CheckCircle2,
  ShieldCheck, Package, Truck, Tag, AlertCircle, Home, Building2
} from 'lucide-react';

const STEPS = ['Delivery Address', 'Payment', 'Review & Place Order'];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱', desc: 'Pay instantly via any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay accepted' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major Indian banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: '+₹49 COD handling fee applies' },
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry','Ladakh','J&K'
];

export default function CheckoutModal({ isOpen, onClose, cart, pricing, user, onPlaceOrder }) {
  const [step, setStep] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [address, setAddress] = useState({
    type: 'home',
    recipient: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const subtotal = pricing?.subtotal || 0;
  const discount = pricing?.discount || 0;
  const shipping = pricing?.shipping || 0;
  const giftWrap = pricing?.giftWrap || 0;
  const codFee = paymentMethod === 'cod' ? 49 : 0;
  const grandTotal = subtotal - discount + shipping + giftWrap + codFee;

  // --- Validation ---
  const validateAddress = () => {
    const e = {};
    if (!address.recipient.trim()) e.recipient = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(address.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!address.street.trim()) e.street = 'Address line is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter a valid 6-digit PIN code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (paymentMethod === 'upi' && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
      e.upi = 'Enter a valid UPI ID (e.g. name@upi)';
    }
    if (paymentMethod === 'card') {
      if (cardData.number.replace(/\s/g, '').length !== 16) e.cardNumber = 'Enter a valid 16-digit card number';
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) e.expiry = 'Enter expiry as MM/YY';
      if (cardData.cvv.length < 3) e.cvv = 'Enter a valid CVV';
      if (!cardData.name.trim()) e.cardName = 'Enter name as on card';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateAddress()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => Math.min(s + 1, 2));
    setErrors({});
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      await onPlaceOrder({
        items: cart,
        subtotal,
        discount,
        shipping,
        giftWrap,
        total: grandTotal,
        deliveryAddress: address,
        paymentMethod,
      });
      onClose();
    } finally {
      setIsPlacing(false);
    }
  };

  const fmtCard = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const fmtExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const Field = ({ label, name, value, onChange, type = 'text', placeholder, error, maxLength, children, required }) => (
    <div>
      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`mt-1 w-full border ${error ? 'border-red-400 bg-red-50' : 'border-[#DFD8BF] bg-white'} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors`}
        />
      )}
      {error && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#DFD8BF] overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#262E15] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base tracking-tight">Secure Checkout</h2>
            <p className="text-[11px] text-[#A6B688] mt-0.5">Cup2Eat Atelier — Safe & Encrypted</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="bg-white border-b border-[#EAE3D2] px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    i < step ? 'bg-primary border-primary text-white' :
                    i === step ? 'bg-primary/10 border-primary text-primary' :
                    'bg-[#F2EEDB] border-[#DFD8BF] text-on-surface-variant'
                  }`}>
                    {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold hidden sm:block ${i === step ? 'text-primary' : i < step ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-primary' : 'bg-[#DFD8BF]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* ── STEP 0: DELIVERY ADDRESS ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-on-surface">Delivery Address</h3>
              </div>

              {/* Address Type */}
              <div className="flex gap-3">
                {[{ id: 'home', icon: Home, label: 'Home' }, { id: 'work', icon: Building2, label: 'Work' }].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAddress(a => ({ ...a, type: id }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                      address.type === id ? 'bg-primary text-white border-primary' : 'bg-white text-on-surface-variant border-[#DFD8BF] hover:border-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" name="recipient" value={address.recipient}
                  onChange={v => setAddress(a => ({ ...a, recipient: v }))}
                  placeholder="Aarav Sharma" error={errors.recipient} required />
                <Field label="Mobile Number" name="phone" value={address.phone}
                  onChange={v => setAddress(a => ({ ...a, phone: v.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="10-digit mobile" error={errors.phone} required />
              </div>

              <Field label="Address Line (Flat, Building, Street)" name="street" value={address.street}
                onChange={v => setAddress(a => ({ ...a, street: v }))}
                placeholder="e.g. Villa 14, The Palms, 100 Ft Road" error={errors.street} required />

              <Field label="Landmark (Optional)" name="landmark" value={address.landmark}
                onChange={v => setAddress(a => ({ ...a, landmark: v }))}
                placeholder="Near Indiranagar Metro" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="City" name="city" value={address.city}
                  onChange={v => setAddress(a => ({ ...a, city: v }))}
                  placeholder="Bengaluru" error={errors.city} required />

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                  <select
                    value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                    className="mt-1 w-full border border-[#DFD8BF] bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <Field label="PIN Code" name="pincode" value={address.pincode}
                  onChange={v => setAddress(a => ({ ...a, pincode: v.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="560038" error={errors.pincode} required />
              </div>

              {/* Delivery estimate */}
              <div className="bg-[#EDF0E5] border border-[#C5D5A0] rounded-xl p-3 flex items-center gap-3">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Expected Delivery: Saturday, 16 Nov • By 2:00 PM</p>
                  <p className="text-on-surface-variant mt-0.5">BlueDart Temperature-Monitored Air Delivery</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: PAYMENT ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-on-surface">Choose Payment Method</h3>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-[#DFD8BF] bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === pm.id ? 'border-primary' : 'border-[#DFD8BF]'
                      }`}>
                        {paymentMethod === pm.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-lg">{pm.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{pm.label}</p>
                        <p className="text-[11px] text-on-surface-variant">{pm.desc}</p>
                      </div>
                    </div>

                    {/* UPI inline field */}
                    {paymentMethod === 'upi' && pm.id === 'upi' && (
                      <div className="mt-3 pl-7">
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@upi / yourname@okaxis"
                          className={`w-full border ${errors.upi ? 'border-red-400 bg-red-50' : 'border-[#DFD8BF] bg-white'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                          onClick={e => e.stopPropagation()}
                        />
                        {errors.upi && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.upi}</p>}
                      </div>
                    )}

                    {/* Card fields */}
                    {paymentMethod === 'card' && pm.id === 'card' && (
                      <div className="mt-3 pl-7 space-y-3" onClick={e => e.stopPropagation()}>
                        <div>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={e => setCardData(d => ({ ...d, number: fmtCard(e.target.value) }))}
                            placeholder="Card number (16 digits)"
                            className={`w-full border ${errors.cardNumber ? 'border-red-400' : 'border-[#DFD8BF]'} rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary`}
                          />
                          {errors.cardNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={e => setCardData(d => ({ ...d, expiry: fmtExpiry(e.target.value) }))}
                              placeholder="MM/YY"
                              className={`w-full border ${errors.expiry ? 'border-red-400' : 'border-[#DFD8BF]'} rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary`}
                            />
                            {errors.expiry && <p className="text-[11px] text-red-500 mt-0.5">{errors.expiry}</p>}
                          </div>
                          <div>
                            <input
                              type="password"
                              value={cardData.cvv}
                              onChange={e => setCardData(d => ({ ...d, cvv: e.target.value.slice(0, 4) }))}
                              placeholder="CVV"
                              className={`w-full border ${errors.cvv ? 'border-red-400' : 'border-[#DFD8BF]'} rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary`}
                            />
                            {errors.cvv && <p className="text-[11px] text-red-500 mt-0.5">{errors.cvv}</p>}
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={e => setCardData(d => ({ ...d, name: e.target.value }))}
                            placeholder="Name on card"
                            className={`w-full border ${errors.cardName ? 'border-red-400' : 'border-[#DFD8BF]'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                          />
                          {errors.cardName && <p className="text-[11px] text-red-500 mt-0.5">{errors.cardName}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant bg-[#F2EEDB] p-3 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>All transactions are 256-bit SSL encrypted. We never store card details.</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: REVIEW & CONFIRM ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-on-surface">Review Your Order</h3>
              </div>

              {/* Items */}
              <div className="bg-white border border-[#EAE3D2] rounded-2xl divide-y divide-[#F2EEDB]">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{item.title}</p>
                      <p className="text-[11px] text-on-surface-variant">{item.variant} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-on-surface">Delivering to</span>
                </div>
                <p className="text-xs font-semibold text-on-surface">{address.recipient} · {address.phone}</p>
                <p className="text-xs text-on-surface-variant">{address.street}{address.landmark ? `, ${address.landmark}` : ''}</p>
                <p className="text-xs text-on-surface-variant">{address.city}, {address.state} – {address.pincode}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-on-surface">Payment</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.icon}{' '}
                  {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}
                  {paymentMethod === 'upi' && upiId && ` · ${upiId}`}
                  {paymentMethod === 'card' && cardData.number && ` · •••• ${cardData.number.slice(-4)}`}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span className="font-medium text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex justify-between text-primary font-medium"><span>Promo Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-on-surface-variant"><span>Delivery</span><span className="font-medium">{shipping === 0 ? <strong className="text-primary">FREE</strong> : `₹${shipping}`}</span></div>
                {giftWrap > 0 && <div className="flex justify-between text-on-surface-variant"><span>Gift Packaging</span><span className="font-medium">₹{giftWrap}</span></div>}
                {codFee > 0 && <div className="flex justify-between text-on-surface-variant"><span>COD Handling</span><span className="font-medium">₹{codFee}</span></div>}
                <div className="pt-2 border-t border-[#EAE3D2] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-on-surface">Total Amount</span>
                  <span className="font-bold text-lg text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant bg-[#EDF0E5] p-3 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>By placing your order you agree to Cup2Eat's Terms & Conditions and Artisanal Quality Guarantee.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-white border-t border-[#EAE3D2] p-5 flex items-center justify-between gap-3">
          <button
            onClick={step === 0 ? onClose : handleBack}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#DFD8BF] text-xs font-semibold text-on-surface hover:bg-[#F2EEDB] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < 2 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#344218] transition-colors shadow-sm"
            >
              Continue
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#344218] transition-colors shadow-md disabled:opacity-70"
            >
              {isPlacing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Place Order · ₹{grandTotal.toLocaleString('en-IN')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
