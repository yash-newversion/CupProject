import React, { useState } from 'react';
import { User, Users, ShieldCheck, Leaf, Award, Package, Clock, MapPin, Plus, Check, Download, RefreshCw, ChevronRight, Settings, LogOut } from 'lucide-react';

export default function AccountPage({
  user,
  orders,
  onTrackOrder,
  onReorder,
  onViewReceipt,
  onShowToast,
  onLogout,
  onSwitchUser,
  sessionInfo
}) {
  const sub = user?.subscription || {
    title: 'Artisanal Assortment Tasting Box (12 Cups)',
    subtitle: 'Monthly Reserve Batch',
    frequency: 'Every 30 Days',
    nextDispatch: '15 December 2026',
    status: 'Active & Secured',
    price: 1299,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSrhENVZR6p4I2B9_iizu0wgJTwaLwtmygcvU2qwERkcn52YX-Gf2Ur02doTFoeeCGGDmwGGQZqQ8J2bOiUXEO_CaFzFrULwxcMKlX9xAxl8vQRuh-cmDF7i_aLA7wKH-c8sksWZKhuQHkK4L2eAkraCYN_3HcRVT0dapyQcUdD4yoMyjZ3HoyWVmfEe-BAsc-ayAbRF80XDKFxRGvrGeZVEjQxA1fVPqlcADQKZs'
  };
  const [subStatus, setSubStatus] = useState(sub.status);
  const [addresses, setAddresses] = useState(user?.addresses?.length ? user.addresses : [
    {
      id: 'addr-default',
      tag: 'Home',
      recipient: user?.name || 'Patron',
      phone: user?.phone || '+91 98450 12894',
      street: '100 Ft Road, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true
    }
  ]);
  const stats = user?.stats || { cupsSaved: 142, co2OffsetKg: 8.6, rewardPoints: 200, activeBatches: 2 };
  const preferences = user?.preferences || {
    roastProfile: 'Medium-Dark Roast (Chikmagalur / Coorg)',
    rimThickness: 'Double-Thick 70% Dark Ganache',
    dietary: ['100% Plant-Based', 'Eggless Certified'],
    flavorPriority: 'Belgian Dark & Salted Caramel'
  };
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    tag: 'Office',
    recipient: user?.name || 'Patron',
    phone: user?.phone || '+91 98450 12894',
    street: '',
    locality: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: ''
  });

  const handlePauseSub = () => {
    const next = subStatus === 'Active & Secured' ? 'Paused (Next delivery on hold)' : 'Active & Secured';
    setSubStatus(next);
    onShowToast?.(`Subscription status updated: ${next}`);
  };

  const handleSkipDelivery = () => {
    onShowToast?.("Next dispatch skipped. Your delivery schedule moved to 28 December 2026.");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) return;
    const added = {
      ...newAddress,
      id: `addr-${Date.now()}`,
      isDefault: false
    };
    setAddresses([...addresses, added]);
    setShowAddressForm(false);
    setNewAddress({
      tag: 'Office',
      recipient: user.name,
      phone: user.phone,
      street: '',
      locality: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: ''
    });
    onShowToast?.("New delivery address saved to your profile.");
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
    onShowToast?.("Default delivery address updated.");
  };

  return (
    <main className="flex-1 pb-24 bg-[#FAF7F0]">
      {/* Account Hero Banner */}
      <section className="bg-gradient-to-b from-[#F2EEDB] to-[#FAF7F0] border-b border-[#E8E1CE] pt-10 sm:pt-14 pb-12 px-4 sm:px-8">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-sm" title="Verified Connoisseur">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                    Welcome back, {user.name}
                  </h1>
                  <span className="text-[10px] font-bold bg-[#D5EBA8] text-[#141F00] px-2.5 py-0.5 rounded-full border border-[#BACE8E]">
                    {user.tier}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {user.email} • Member since {user.memberSince}
                </p>
              </div>
            </div>

            {/* Eco Impact Badges */}
            <div className="grid grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-[#DFD8BF] shadow-sm">
              <div className="text-center px-2">
                <div className="flex items-center justify-center text-primary mb-1">
                  <Leaf className="w-4 h-4 text-green-700" />
                </div>
                <span className="font-headline-md text-lg font-bold text-primary block leading-none">
                  {stats.cupsSaved}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Cups Saved</span>
              </div>

              <div className="text-center px-2 border-x border-[#F2EEDB]">
                <div className="flex items-center justify-center text-primary mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#845E18]" />
                </div>
                <span className="font-headline-md text-lg font-bold text-primary block leading-none">
                  {stats.co2OffsetKg}kg
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">CO₂ Offset</span>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center text-primary mb-1">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-headline-md text-lg font-bold text-primary block leading-none">
                  {stats.rewardPoints}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Points</span>
              </div>
            </div>

            {/* Quick Profile Actions: Switch User & Logout */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:self-center">
              <button
                type="button"
                onClick={onSwitchUser}
                className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DFD8BF] bg-white hover:bg-[#FAF6EC] text-xs font-semibold text-primary transition-all shadow-xs"
                title="Switch to another user account"
              >
                <Users className="w-3.5 h-3.5 text-[#556633]" />
                <span>Switch User</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-all shadow-xs"
                title="Sign Out of Atelier"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Dashboard Content */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Subscriptions & Orders */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Subscription Box */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] p-6 sm:p-7 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#F2EEDB] mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                    Active Atelier Subscription
                  </span>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">
                    {sub.title}
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8ECD9] text-[#42531F] border border-[#D5DFC0]">
                  {subStatus}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={sub.image}
                  alt={sub.title}
                  className="w-full sm:w-44 h-36 object-cover rounded-2xl bg-[#F2EEDB] border border-[#EAE3D2] shrink-0"
                />

                <div className="space-y-3 flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {sub.subtitle}. Freshly baked every 30 days and packed in insulated kraft trays with biodegradable nitrogen sealing.
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF6EC] p-3 rounded-xl border border-[#EAE3D2]">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Frequency</span>
                      <span className="font-semibold text-on-surface">{sub.frequency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Next Dispatch</span>
                      <span className="font-semibold text-primary">{sub.nextDispatch}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      onClick={handlePauseSub}
                      className="px-3.5 py-1.5 rounded-full border border-[#DFD8BF] text-xs font-semibold text-on-surface hover:bg-[#FAF6EC] transition-colors"
                    >
                      {subStatus === 'Active & Secured' ? 'Pause Subscription' : 'Resume Subscription'}
                    </button>
                    <button
                      onClick={handleSkipDelivery}
                      className="px-3.5 py-1.5 rounded-full border border-[#DFD8BF] text-xs font-semibold text-on-surface hover:bg-[#FAF6EC] transition-colors"
                    >
                      Skip Next Delivery
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasting Archives & Order History */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#F2EEDB] mb-4">
                <div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    Tasting Archives &amp; Order History
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Track dispatches, inspect recipes, and download official tax invoices
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#F2EEDB]">
                {orders.map((ord) => {
                  const isProcessing = ord.statusCode === 'processing';

                  return (
                    <div key={ord.orderId} className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-on-surface">
                            #{ord.orderId}
                          </span>
                          <span className="text-xs text-on-surface-variant">• {ord.date}</span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              isProcessing
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-green-100 text-green-800 border border-green-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-on-surface">
                          {ord.itemsSummary}
                        </p>
                        <p className="text-xs font-bold text-primary">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {isProcessing ? (
                          <button
                            onClick={() => onTrackOrder(ord)}
                            className="bg-primary hover:bg-[#344218] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Track Live</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onReorder(ord)}
                            className="bg-[#566346] hover:bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>
                        )}

                        <button
                          onClick={() => onViewReceipt(ord)}
                          className="border border-[#DFD8BF] hover:bg-[#FAF6EC] text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Tax Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Addresses & Preferences */}
          <div className="lg:col-span-4 space-y-8">
            {/* Saved Delivery Addresses */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EEDB]">
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Saved Addresses
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Add Address Form Modal / Inline */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-[#FAF6EC] p-3.5 rounded-2xl border border-[#EAE3D2] space-y-2 text-xs">
                  <div className="font-bold text-on-surface">New Delivery Address</div>
                  <input
                    type="text"
                    placeholder="Tag (e.g. Work, Studio, Home)"
                    value={newAddress.tag}
                    onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                    className="w-full bg-white border border-[#DFD8BF] px-3 py-1.5 rounded-lg text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street Address & Villa / Unit #"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-white border border-[#DFD8BF] px-3 py-1.5 rounded-lg text-xs"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Locality"
                      value={newAddress.locality}
                      onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                      className="bg-white border border-[#DFD8BF] px-3 py-1.5 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="bg-white border border-[#DFD8BF] px-3 py-1.5 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-1.5 rounded-lg font-semibold hover:bg-[#344218]"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#DFD8BF] text-on-surface-variant hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address list */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'border-primary/40 bg-[#FAF6EC]'
                        : 'border-[#DFD8BF] bg-white hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-on-surface">{addr.tag}</span>
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold text-primary bg-[#E5DFCA] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[10px] text-on-surface-variant hover:text-primary font-medium underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-on-surface-variant space-y-0.5">
                      <p className="font-semibold text-on-surface">{addr.recipient}</p>
                      <p>{addr.street}</p>
                      <p>{addr.locality}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cupping & Taste Preferences */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EEDB]">
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Taste Preferences
                </h3>
                <Settings className="w-4 h-4 text-on-surface-variant" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Preferred Roast Match</span>
                  <p className="font-semibold text-on-surface mt-0.5">{preferences.roastProfile}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Cocoa Rim Coating</span>
                  <p className="font-semibold text-on-surface mt-0.5">{preferences.rimThickness}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Dietary Standards</span>
                  <div className="flex flex-wrap gap-1">
                    {preferences.dietary?.map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-[#FAF6EC] border border-[#EAE3D2] px-2 py-0.5 rounded-full text-primary"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onShowToast?.("Taste preferences saved to your master atelier baking profile.")}
                  className="w-full mt-2 border border-[#DFD8BF] hover:bg-[#FAF6EC] text-on-surface font-semibold py-2 rounded-full text-xs transition-colors"
                >
                  Save Taste Profile
                </button>
              </div>
            </div>

            {/* Active Session & Security Limit Widget */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EEDB]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8ECD9] flex items-center justify-center text-primary">
                    <Clock className="w-4 h-4 text-[#42531F]" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                      Session Security Limit
                    </h3>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      MongoDB Verified Session
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-[11px]">Session Timeout Limit:</span>
                  <span className="font-bold text-on-surface">{sessionInfo?.sessionLimitMinutes || 30} Minutes</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-[11px]">Time Remaining:</span>
                  <span className="font-mono font-bold text-primary text-sm">
                    {sessionInfo?.remainingSeconds != null
                      ? `${Math.floor(sessionInfo.remainingSeconds / 60)}m ${String(sessionInfo.remainingSeconds % 60).padStart(2, '0')}s`
                      : '30m 00s'}
                  </span>
                </div>

                {/* Session countdown progress bar */}
                <div className="w-full bg-[#FAF6EC] h-2 rounded-full overflow-hidden border border-[#EAE3D2]">
                  <div
                    className="bg-primary h-full transition-all duration-1000 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((sessionInfo?.remainingSeconds ?? 1800) / (sessionInfo?.totalSeconds || 1800)) * 100
                        )
                      )}%`
                    }}
                  />
                </div>

                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  For patron security, sessions auto-expire after {sessionInfo?.sessionLimitMinutes || 30} minutes of continuous browsing.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    sessionInfo?.onExtendSession?.();
                  }}
                  className="w-full bg-[#FAF6EC] hover:bg-[#EFEAD7] border border-[#DFD8BF] text-primary font-bold py-2 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Extend Session (+30 Mins)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
