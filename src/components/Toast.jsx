import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function Toast({ message, visible, onAction, actionLabel }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="bg-[#2E3618] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#485626] flex items-center gap-3 max-w-md">
        <div className="w-8 h-8 rounded-full bg-[#3D4922] flex items-center justify-center text-[#D5EBA8] shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs font-medium leading-snug">
          {message}
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            className="text-xs font-bold text-[#D5EBA8] hover:underline shrink-0 ml-1"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
