import React, { useState } from 'react';
import { CheckCircle2, Clock, Copy, Check, MessageSquare, Truck, Package, MapPin, Phone, Mail, Sparkles, Coffee } from 'lucide-react';
import { INITIAL_ORDERS } from '../data/initialData';

export default function OrderTrackingPage({ order, onShowToast, onExploreCatalogue }) {
  const [copied, setCopied] = useState(false);
  const [waSubscribed, setWaSubscribed] = useState(false);

  // If no order is provided, use default order #C2E-89241
  const currentOrder = order || INITIAL_ORDERS[0];

  const handleCopyWaybill = () => {
    navigator.clipboard.writeText(currentOrder.trackingId);
    setCopied(true);
    onShowToast?.(`Tracking AWB "${currentOrder.trackingId}" copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    setWaSubscribed(!waSubscribed);
    onShowToast?.(
      waSubscribed
        ? "WhatsApp live dispatch alerts disabled."
        : "WhatsApp live dispatch alerts enabled for +91 98450 12894!"
    );
  };

  return (
    <main className="flex-1 pb-24 bg-[#FAF7F0]">
      {/* Hero Tracking Header */}
      <section className="bg-gradient-to-b from-[#F2EEDB] to-[#FAF7F0] border-b border-[#E8E1CE] pt-10 sm:pt-14 pb-10 px-4 sm:px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DFCA] text-[#3D451E] text-xs font-semibold mb-3 border border-[#D5CDAE]">
            <Sparkles className="w-3.5 h-3.5 text-[#845E18]" />
            <span>Atelier Kitchen Live Dispatch System</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="font-headline-lg text-2xl sm:text-4xl font-bold text-on-surface">
                Tasting Order Placed — Savor the Anticipation
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
                Order <strong className="text-primary font-bold">#{currentOrder.orderId}</strong> • Estimated Delivery:{' '}
                <strong className="text-on-surface font-semibold">{currentOrder.estimatedDelivery}</strong>
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center bg-white px-3 py-2 rounded-xl border border-[#DFD8BF] shadow-sm text-xs">
                <span className="text-on-surface-variant mr-2">AWB:</span>
                <span className="font-mono font-bold text-on-surface mr-2">{currentOrder.trackingId}</span>
                <button
                  onClick={handleCopyWaybill}
                  className="text-primary hover:text-[#344218] p-1 rounded transition-colors"
                  title="Copy Tracking ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={handleWhatsApp}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  waSubscribed
                    ? 'bg-[#566346] text-white'
                    : 'bg-[#25D366] hover:bg-[#1EBE5D] text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{waSubscribed ? 'Subscribed to WhatsApp' : 'Get WhatsApp Alerts'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Stepper & Manifest */}
      <section className="max-w-[1120px] mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Fulfillment Stepper (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD8BF] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#F2EEDB] mb-6">
                <div>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">
                    Real-Time Atelier Fulfillment
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Baking in small batches to preserve biscuit snap and aroma
                  </p>
                </div>
                <span className="text-xs font-bold bg-[#E8ECD9] text-[#42531F] px-3 py-1 rounded-full border border-[#D5DFC0]">
                  Live Status
                </span>
              </div>

              {/* Steps timeline */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE3D2]">
                {currentOrder.steps?.map((step) => {
                  const isCompleted = step.status === 'completed';
                  const isActive = step.status === 'active';

                  return (
                    <div key={step.step} className="relative group">
                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute -left-[30px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all ${
                          isCompleted
                            ? 'bg-primary text-white ring-4 ring-white'
                            : isActive
                            ? 'bg-[#D5A65A] text-white ring-4 ring-[#D5A65A]/20 animate-pulse'
                            : 'bg-[#F2EEDB] text-on-surface-variant border border-[#DFD8BF]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : isActive ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          step.step
                        )}
                      </div>

                      {/* Content */}
                      <div className="pl-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              isActive ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <span className="text-[11px] font-mono text-on-surface-variant">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                        {isActive && (
                          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-[#FAF6EC] border border-[#E5DFCA] text-[11px] text-[#684600] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            <span>
                              {step.step === 1
                                ? 'Baking & glazing at Atelier — your cup is being crafted now!'
                                : step.step === 2
                                ? `In transit — BlueDart temperature-monitored delivery`
                                : 'Out for doorstep delivery'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* The 3-Step Cup2Eat Ritual Section */}
            <div className="bg-[#FAF6EC] p-6 sm:p-8 rounded-3xl border border-[#E8E1CE] shadow-sm">
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#556633] block">
                  How To Enjoy
                </span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface mt-0.5">
                  The 3-Step Cup2Eat Ritual
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E5DFCA] space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold text-xs">
                    01
                  </div>
                  <h4 className="font-bold text-xs text-on-surface">Brew Direct • Up to 85°C</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Pour your favorite espresso, flat white, or hot brew directly into the cup. No pre-heating needed.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5DFCA] space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold text-xs">
                    02
                  </div>
                  <h4 className="font-bold text-xs text-on-surface">Sip Mindfully for 45 Mins</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    As the coffee warms the cocoa lining, subtle notes of Belgian chocolate melt softly into your crema.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E5DFCA] space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary font-bold text-xs">
                    03
                  </div>
                  <h4 className="font-bold text-xs text-on-surface">Bite, Crunch, Devour</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Finish your coffee and crunch the golden ancient grain biscuit vessel. Zero waste, total indulgence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Manifest & Delivery Summary (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Manifest Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DFD8BF] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EEDB]">
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Order Manifest
                </h3>
                <span className="text-xs text-on-surface-variant">
                  {currentOrder.items?.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {currentOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-xl bg-[#F2EEDB] border border-[#EAE3D2] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-on-surface truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        {item.variant} • Qty {item.quantity}
                      </p>
                      <span className="text-xs font-bold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-[#F2EEDB] space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-on-surface">
                    ₹{currentOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cold-Pack Insulation</span>
                  <span className="text-primary font-semibold">FREE (Atelier Standard)</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Transit ({currentOrder.courier})</span>
                  <span className="text-primary font-semibold">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#F2EEDB] flex justify-between items-baseline text-sm font-bold text-on-surface">
                  <span>Total Amount Paid</span>
                  <span className="font-headline-md text-lg text-primary">
                    ₹{currentOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#DFD8BF] shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-on-surface font-bold text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Delivery Address</span>
              </div>
              <div className="text-on-surface-variant space-y-0.5 pl-6">
                <p className="font-bold text-on-surface">{currentOrder.deliveryAddress?.recipient}</p>
                <p>{currentOrder.deliveryAddress?.street}</p>
                <p>{currentOrder.deliveryAddress?.locality}, {currentOrder.deliveryAddress?.city}</p>
                <p>{currentOrder.deliveryAddress?.state} - {currentOrder.deliveryAddress?.pincode}</p>
              </div>
            </div>

            {/* Concierge Assistance Card */}
            <div className="bg-[#FAF6EC] p-6 rounded-3xl border border-[#E8E1CE] shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-on-surface text-sm">Need Atelier Assistance?</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Have special dispatch instructions or questions about your baking batch? Our concierge is on standby.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="mailto:concierge@cup2eat.in"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>concierge@cup2eat.in</span>
                </a>
                <a
                  href="tel:+918029948201"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 80 2994 8201 (Mon–Sat, 9AM–7PM)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
