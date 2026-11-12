import React from 'react';
import { X, Printer, Download, CheckCircle2, FileText } from 'lucide-react';

export default function ReceiptModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white border border-[#DFD8BF] text-left shadow-2xl transition-all my-4 sm:my-8 w-full max-w-lg p-5 sm:p-8 max-h-[92vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6EC] hover:bg-[#F0EAD6] flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Invoice Header */}
          <div className="border-b border-[#EAE3D2] pb-5 mb-5 flex justify-between items-start">
            <div>
              <span className="font-headline-lg text-2xl font-bold text-primary">Cup2Eat</span>
              <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Artisanal Atelier Tax Invoice
              </p>
              <p className="text-[10px] text-on-surface-variant">GSTIN: 29AABCC1234F1Z8</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-on-surface block">Order #{order.orderId}</span>
              <span className="text-[11px] text-on-surface-variant block">{order.date}</span>
              <span className="inline-block mt-1 text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                PAID &amp; CONFIRMED
              </span>
            </div>
          </div>

          {/* Customer & Delivery */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-5 bg-[#FAF6EC] p-3.5 rounded-xl border border-[#EAE3D2]">
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Billed To</span>
              <p className="font-bold text-on-surface">Aarav Sharma</p>
              <p className="text-on-surface-variant">Villa 14, The Palms Sanctuary</p>
              <p className="text-on-surface-variant">Indiranagar, Bengaluru 560038</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Logistics Partner</span>
              <p className="font-bold text-on-surface">{order.courier || 'BlueDart Air Express'}</p>
              <p className="text-on-surface-variant">AWB: {order.trackingId || 'BD-99482014'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border-t border-b border-[#EAE3D2] py-3 my-4 space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-on-surface">{item.title}</p>
                  <p className="text-[11px] text-on-surface-variant">{item.variant} (Qty: {item.quantity})</p>
                </div>
                <span className="font-bold text-on-surface">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-1.5 text-xs text-on-surface-variant border-b border-[#EAE3D2] pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-on-surface font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Cold-Pack Artisanal Insulation</span>
              <span className="text-primary font-semibold">FREE (Patron Tier)</span>
            </div>
            <div className="flex justify-between">
              <span>Integrated GST (18% Included)</span>
              <span>₹{Math.round(order.totalAmount * 0.18).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-dashed border-[#DFD8BF]">
              <span>Total Paid</span>
              <span className="text-primary font-headline-md text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 border border-[#DFD8BF] hover:bg-[#FAF6EC] py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-[#344218] text-white py-2 rounded-full text-xs font-semibold flex items-center justify-center transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
