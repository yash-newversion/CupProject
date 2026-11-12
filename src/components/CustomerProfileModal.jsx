import React from 'react';
import {
  X, User, Mail, Phone, MapPin, ShoppingBag, Clock, Wifi, WifiOff,
  Star, Leaf, Shield, CreditCard, Package, Activity, Calendar
} from 'lucide-react';

export default function CustomerProfileModal({ customer, isOpen, onClose }) {
  if (!isOpen || !customer) return null;

  const c = customer;
  const joinDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
  const lastLogin = c.lastLogin ? new Date(c.lastLogin).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

  const statCard = (icon, label, value, color = 'text-primary') => (
    <div className="bg-[#FAF6EC] border border-[#EAE3D2] rounded-xl p-3 text-center">
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <p className={`font-bold text-lg ${color}`}>{value}</p>
      <p className="text-[10px] text-on-surface-variant">{label}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#DFD8BF] overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#262E15] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                alt={c.name}
                className="w-12 h-12 rounded-full border-2 border-[#55692E] object-cover"
              />
              {c.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#262E15]" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-base">{c.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${c.isOnline ? 'text-green-400' : 'text-[#A6B688]'}`}>
                  {c.isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {c.isOnline ? 'Online Now' : 'Offline'}
                </span>
                <span className="text-[#55692E]">•</span>
                <span className="text-[11px] text-[#A6B688]">{c.tier || 'Connoisseur'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-5">
          {/* Contact Info */}
          <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-primary" />Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-medium text-on-surface break-all">{c.email}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-medium text-on-surface">{c.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-medium text-on-surface capitalize">{c.role || 'customer'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-medium text-on-surface">Joined {joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCard(<ShoppingBag className="w-4 h-4" />, 'Orders', c.orderCount || 0)}
            {statCard(<CreditCard className="w-4 h-4" />, 'Total Spend', `₹${(c.totalSpend || 0).toLocaleString('en-IN')}`, 'text-amber-700')}
            {statCard(<Leaf className="w-4 h-4" />, 'Cups Saved', c.stats?.cupsSaved || 0, 'text-[#42531F]')}
            {statCard(<Star className="w-4 h-4" />, 'Points', c.stats?.tastingPoints || 200, 'text-orange-600')}
          </div>

          {/* Session & Login Info */}
          <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" />Session & Activity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-on-surface-variant">Last Login</p>
                <p className="font-semibold text-on-surface mt-0.5">{lastLogin}</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Last IP Address</p>
                <p className="font-mono font-semibold text-on-surface mt-0.5">{c.lastIp || 'N/A'}</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Total Logins</p>
                <p className="font-semibold text-on-surface mt-0.5">{c.loginCount || 0} sessions</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Device</p>
                <p className="font-semibold text-on-surface mt-0.5">{c.device || 'Web Browser'}</p>
              </div>
            </div>
          </div>

          {/* Delivery Addresses */}
          {c.addresses && c.addresses.length > 0 ? (
            <div className="bg-white border border-[#EAE3D2] rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />Saved Addresses ({c.addresses.length})
              </h3>
              <div className="space-y-2">
                {c.addresses.map((addr, i) => (
                  <div key={i} className={`text-xs p-3 rounded-xl border ${addr.isDefault ? 'border-primary/40 bg-primary/5' : 'border-[#EAE3D2] bg-[#FAF6EC]'}`}>
                    {addr.isDefault && <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Default • </span>}
                    <span className="text-on-surface">{addr.street}{addr.city ? `, ${addr.city}` : ''}{addr.pincode ? ` - ${addr.pincode}` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF6EC] border border-[#EAE3D2] rounded-2xl p-4 text-xs text-on-surface-variant text-center">
              <MapPin className="w-4 h-4 mx-auto mb-1 text-on-surface-variant/50" />
              No saved addresses yet
            </div>
          )}

          {/* Eco Impact */}
          <div className="bg-[#EDF0E5] border border-[#C5D5A0] rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#42531F] flex items-center gap-2 mb-3">
              <Leaf className="w-3.5 h-3.5" />Eco Impact
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <p className="font-bold text-lg text-[#42531F]">{c.stats?.cupsSaved || 0}</p>
                <p className="text-[#5E7039]">Cups Saved</p>
              </div>
              <div>
                <p className="font-bold text-lg text-[#42531F]">{c.stats?.co2OffsetGrams ? `${(c.stats.co2OffsetGrams / 1000).toFixed(1)}kg` : '0kg'}</p>
                <p className="text-[#5E7039]">CO₂ Offset</p>
              </div>
              <div>
                <p className="font-bold text-lg text-[#42531F]">{c.stats?.tastingPoints || 200}</p>
                <p className="text-[#5E7039]">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#EAE3D2] p-4 flex items-center justify-between gap-3">
          <span className="text-[11px] text-on-surface-variant">ID: <span className="font-mono">{c._id || 'N/A'}</span></span>
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#344218] transition-colors">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
