import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, TrendingUp, ShieldCheck, RefreshCw, Eye, ExternalLink,
  Flame, CheckCircle2, Clock, MapPin, Search, ChevronRight, Activity, Smartphone,
  Laptop, Database, ArrowUpRight, DollarSign, Package, LogOut, Tag, Plus, Trash2,
  ToggleLeft, ToggleRight, Calendar, Percent, X, Edit3, ImageIcon, Star, Box,
  ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { api } from '../services/api';
import { PRODUCTS } from '../data/products';
import CustomerProfileModal from '../components/CustomerProfileModal';

export default function AdminPage({
  user,
  onSwitchToCustomerView,
  onShowToast,
  adminData,
  onUpdateOrderStatus,
  onLogout,
  onSwitchUser
}) {
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'orders' | 'preview' | 'activity' | 'coupons'
  const [customers, setCustomers] = useState(adminData?.customers || []);
  const [activities, setActivities] = useState(adminData?.activities || []);
  const [orders, setOrders] = useState(adminData?.orders || []);
  const [stats, setStats] = useState(adminData?.stats || null);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewPage, setPreviewPage] = useState('catalogue');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Customer profile modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Coupon manager state
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('cup2eat_admin_coupons');
      return saved ? JSON.parse(saved) : [
        { id: 'c1', code: 'ARTISAN10', type: 'percent', value: 10, minOrder: 500, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), isActive: true, usageCount: 14, usageLimit: 100 },
        { id: 'c2', code: 'EARTH20', type: 'percent', value: 20, minOrder: 999, expiresAt: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), isActive: true, usageCount: 7, usageLimit: 50 },
        { id: 'c3', code: 'FLAT150', type: 'flat', value: 150, minOrder: 1200, expiresAt: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10), isActive: false, usageCount: 23, usageLimit: 30 },
      ];
    } catch { return []; }
  });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', expiresAt: '', usageLimit: '', isActive: true });
  const [couponFormError, setCouponFormError] = useState('');
  const [showCouponForm, setShowCouponForm] = useState(false);

  const saveCoupons = (updated) => {
    setCoupons(updated);
    try { localStorage.setItem('cup2eat_admin_coupons', JSON.stringify(updated)); } catch {}
  };

  // Fetch updated data from API
  const refreshAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [fetchedStats, fetchedCusts, fetchedActs, fetchedOrds] = await Promise.all([
        api.getAdminStats(),
        api.getAdminCustomers(),
        api.getAdminActivities(),
        api.getAdminOrders()
      ]);

      if (fetchedStats) setStats(fetchedStats);
      if (fetchedCusts && fetchedCusts.length > 0) setCustomers(fetchedCusts);
      if (fetchedActs && fetchedActs.length > 0) setActivities(fetchedActs);
      if (fetchedOrds && fetchedOrds.length > 0) setOrders(fetchedOrds);
    } catch (err) {
      console.warn('Refresh admin data error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
    // Poll every 8 seconds for live customer logins!
    const interval = setInterval(refreshAdminData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceOrderStatus = async (orderId, currentStatus, currentStatusCode) => {
    const now = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });

    let nextStatus = '';
    let nextStatusCode = '';
    let updatedSteps = null;

    const isProcessing = currentStatusCode === 'processing' || currentStatusCode === 'baking' || currentStatus === 'Baking in Atelier';
    const isInTransit = currentStatusCode === 'in_transit' || currentStatus === 'BlueDart Temperature-Monitored Transit';

    if (isProcessing) {
      nextStatus = 'BlueDart Temperature-Monitored Transit';
      nextStatusCode = 'in_transit';
      updatedSteps = [
        { step: 1, label: 'Order Placed & Secured', desc: 'Payment confirmed. Baking, glazing & nitrogen sealing completed at Atelier.', time: '', status: 'completed' },
        { step: 2, label: 'Dispatched via BlueDart', desc: `Handed over to BlueDart Express Air at ${now}. Temperature-monitored climate-controlled transit from Bengaluru Atelier Hub.`, time: now, status: 'active' },
        { step: 3, label: 'Delivered & Ready to Savor', desc: 'Contactless doorstep delivery with tasting instruction booklet.', time: 'Est. Tomorrow, By 2:00 PM', status: 'pending' },
      ];
    } else if (isInTransit) {
      nextStatus = 'Delivered & Savored';
      nextStatusCode = 'delivered';
      updatedSteps = [
        { step: 1, label: 'Order Placed & Secured', desc: 'Payment confirmed. Baking, glazing & nitrogen sealing completed at Atelier.', time: '', status: 'completed' },
        { step: 2, label: 'Dispatched via BlueDart', desc: 'Dispatched via BlueDart Express Air temperature-monitored transit.', time: '', status: 'completed' },
        { step: 3, label: 'Delivered & Ready to Savor', desc: `Your order was delivered on ${now}. Enjoy your artisanal Cup2Eat experience! 🎉`, time: now, status: 'completed' },
      ];
    } else {
      return;
    }

    onUpdateOrderStatus(orderId, nextStatus, nextStatusCode, updatedSteps);
    await api.updateOrderStatus(orderId, nextStatus, nextStatusCode);
    onShowToast?.(`✅ Order #${orderId} → "${nextStatus}"`);
    refreshAdminData();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  const onlineCustomersCount = customers.filter((c) => c.isOnline).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Coupon helpers
  const handleAddCoupon = () => {
    const { code, type, value, minOrder, expiresAt, usageLimit } = couponForm;
    if (!code.trim()) return setCouponFormError('Coupon code is required');
    if (!value || isNaN(value) || Number(value) <= 0) return setCouponFormError('Enter a valid discount value');
    if (!expiresAt) return setCouponFormError('Expiry date is required');
    if (coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase())) return setCouponFormError('A coupon with this code already exists');
    const newCoupon = {
      id: `c${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      expiresAt,
      usageLimit: Number(usageLimit) || 0,
      usageCount: 0,
      isActive: couponForm.isActive,
    };
    saveCoupons([newCoupon, ...coupons]);
    setCouponForm({ code: '', type: 'percent', value: '', minOrder: '', expiresAt: '', usageLimit: '', isActive: true });
    setCouponFormError('');
    setShowCouponForm(false);
    onShowToast?.(`✅ Coupon "${newCoupon.code}" created successfully!`);
  };

  const handleToggleCoupon = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    saveCoupons(updated);
    const coupon = updated.find(c => c.id === id);
    onShowToast?.(`Coupon "${coupon.code}" ${coupon.isActive ? 'activated' : 'deactivated'}.`);
  };

  const handleDeleteCoupon = (id) => {
    const coupon = coupons.find(c => c.id === id);
    saveCoupons(coupons.filter(c => c.id !== id));
    onShowToast?.(`Coupon "${coupon.code}" deleted.`);
  };

  const isCouponExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();
  const daysUntilExpiry = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    return Math.ceil(diff / 86400000);
  };

  // ── Product Manager state ──────────────────────────────────────────
  const BLANK_PRODUCT = {
    id: '', title: '', category: 'espresso', badge: '', badgeType: 'olive',
    rating: 4.8, reviewCount: 0, capacity: '', heatResistance: '85°C for 45 Mins',
    sustainability: 'Zero Waste • 100% Edible', shortDesc: '', longDesc: '',
    tastingNotes: ['', '', '', ''], pairing: '', image: '', imageAlt: '',
    isActive: true,
    packs: [{ size: '6 Cups', count: 6, price: '', originalPrice: '', isDefault: true }],
    defaultPrice: 0, defaultOriginalPrice: 0, categories: ['all'],
  };

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('cup2eat_admin_products');
      return saved ? JSON.parse(saved) : PRODUCTS.map(p => ({ ...p, isActive: true }));
    } catch { return PRODUCTS.map(p => ({ ...p, isActive: true })); }
  });
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormError, setProductFormError] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);

  const saveProducts = (updated) => {
    setProducts(updated);
    try { localStorage.setItem('cup2eat_admin_products', JSON.stringify(updated)); } catch {}
  };

  const slugify = (str) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSaveProduct = () => {
    if (!editingProduct.title.trim()) return setProductFormError('Product title is required');
    if (!editingProduct.id.trim()) return setProductFormError('Product ID (slug) is required');
    if (!editingProduct.shortDesc.trim()) return setProductFormError('Short description is required');
    if (!editingProduct.packs[0]?.price) return setProductFormError('At least one pack with a price is required');
    const isNew = !products.find(p => p.id === editingProduct.id);
    const defPack = editingProduct.packs.find(p => p.isDefault) || editingProduct.packs[0];
    const cleanProduct = {
      ...editingProduct,
      tastingNotes: editingProduct.tastingNotes.filter(n => n.trim()),
      defaultPrice: Number(defPack?.price || 0),
      defaultOriginalPrice: Number(defPack?.originalPrice || 0),
      packs: editingProduct.packs.map(pk => ({
        ...pk,
        price: Number(pk.price),
        originalPrice: Number(pk.originalPrice),
        count: Number(pk.count),
      })),
      categories: ['all', editingProduct.category],
    };
    if (isNew) {
      saveProducts([cleanProduct, ...products]);
    } else {
      saveProducts(products.map(p => p.id === cleanProduct.id ? cleanProduct : p));
    }
    setEditingProduct(null);
    setProductFormError('');
    onShowToast?.(`✅ Product "${cleanProduct.title}" ${isNew ? 'added' : 'updated'} successfully!`);
  };

  const handleDeleteProduct = (id) => {
    const p = products.find(p => p.id === id);
    if (!window.confirm(`Delete "${p?.title}"? This cannot be undone.`)) return;
    saveProducts(products.filter(p => p.id !== id));
    onShowToast?.(`Product "${p?.title}" deleted.`);
  };

  const handleToggleProduct = (id) => {
    const updated = products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    saveProducts(updated);
    const p = updated.find(p => p.id === id);
    onShowToast?.(`Product "${p.title}" ${p.isActive ? 'activated' : 'deactivated'}.`);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.badge || '').toLowerCase().includes(productSearch.toLowerCase())
  );
  // ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#1D1C10] flex flex-col font-body-md">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#262E15] text-white border-b border-[#384420] px-4 sm:px-8 py-3.5 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3D4B21] border border-[#55692E] flex items-center justify-center text-[#D5EBA8] shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#D5A65A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-lg text-lg font-bold tracking-tight text-white">
                  Cup2Eat Atelier
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#3B4820] text-[#D5EBA8] border border-[#52642C]">
                  Executive Control
                </span>
              </div>
              <p className="text-[10px] text-[#A6B688]">
                MongoDB Connected &bull; Real-Time Customer &amp; Atelier Oven Monitoring
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={refreshAdminData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#343F1D] hover:bg-[#435125] text-xs font-semibold text-[#D5EBA8] border border-[#485728] transition-colors"
              title="Refresh live customer & order data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Live Refresh'}</span>
            </button>

            <button
              onClick={onSwitchUser}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3D4B21] hover:bg-[#4C5D2A] text-xs font-semibold text-[#FAF7F0] border border-[#55692E] transition-colors"
              title="Switch to another user or customer account"
            >
              <Users className="w-3.5 h-3.5 text-[#D5A65A]" />
              <span>Switch User</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/70 hover:bg-red-900 text-xs font-semibold text-red-200 border border-red-800/60 transition-colors"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1440px] w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Live Customers Online */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Live Online</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-md text-2xl font-bold text-green-700">
                {onlineCustomersCount}
              </span>
              <span className="text-[11px] text-green-600 font-semibold">Active Now</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Patrons on website</p>
          </div>

          {/* Card 2: Registered Patrons */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Total Patrons</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="font-headline-md text-2xl font-bold text-on-surface block">
              {customers.length}
            </span>
            <p className="text-[10px] text-on-surface-variant mt-1">MongoDB Customer Accounts</p>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Orders Placed</span>
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <span className="font-headline-md text-2xl font-bold text-on-surface block">
              {orders.length}
            </span>
            <p className="text-[10px] text-on-surface-variant mt-1">Lifetime tasting orders</p>
          </div>

          {/* Card 4: Gross Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Gross Revenue</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <span className="font-headline-md text-2xl font-bold text-primary block truncate">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-on-surface-variant mt-1">Processed payments</p>
          </div>

          {/* Card 5: Active Baking Batches */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Oven Queue</span>
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-headline-md text-2xl font-bold text-orange-700 block">
              {orders.filter((o) => o.statusCode === 'processing' || o.statusCode === 'baking').length}
            </span>
            <p className="text-[10px] text-on-surface-variant mt-1">Batches baking at 175°C</p>
          </div>

          {/* Card 6: Zero-Waste Cups Saved */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
              <span className="font-bold">Cups Saved</span>
              <ShieldCheck className="w-4 h-4 text-[#596B35]" />
            </div>
            <span className="font-headline-md text-2xl font-bold text-[#596B35] block">
              {customers.reduce((s, c) => s + (c.stats?.cupsSaved || 0), 0) + 70}
            </span>
            <p className="text-[10px] text-on-surface-variant mt-1">Plastic/paper cups diverted</p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#DFD8BF] pb-1 overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Logins &amp; Patrons ({customers.length})</span>
              {onlineCustomersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Atelier Orders &amp; Fulfillment ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Website Viewer (See Whole Website)</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Activity Stream</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon Manager ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/80 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Product Manager ({products.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CUSTOMERS & LIVE LOGINS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patrons by name, email, or mobile..."
                  className="w-full bg-[#FAF6EC] border border-[#DFD8BF] pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  {onlineCustomersCount} Online Currently
                </span>
                <span>•</span>
                <span>{customers.length} Accounts in MongoDB</span>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-[#DFD8BF] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6EC] border-b border-[#EAE3D2] text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Patron / Customer</th>
                      <th className="py-3 px-4">Live Status</th>
                      <th className="py-3 px-4">Last Login Event</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Total Spend</th>
                      <th className="py-3 px-4">Eco Cups Saved</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EEDB]">
                    {filteredCustomers.map((cust) => {
                      const isOnline = cust.isOnline;
                      const lastLoginDate = cust.lastLogin
                        ? new Date(cust.lastLogin).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })
                        : 'Never';

                      return (
                        <tr
                          key={cust._id}
                          className={`hover:bg-[#FAF6EC]/60 transition-colors ${
                            isOnline ? 'bg-green-50/30' : ''
                          }`}
                        >
                          {/* Name & Contact */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={cust.avatar}
                                  alt={cust.name}
                                  className="w-10 h-10 rounded-full object-cover border border-[#DFD8BF]"
                                />
                                {isOnline && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-on-surface text-sm block">
                                  {cust.name}
                                </span>
                                <span className="text-[11px] text-on-surface-variant block">
                                  {cust.email}
                                </span>
                                <span className="text-[10px] text-primary font-medium block">
                                  {cust.tier}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Live Status Badge */}
                          <td className="py-3.5 px-4">
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-300 shadow-sm animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                Online Now
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F2EEDB] text-on-surface-variant">
                                Offline
                              </span>
                            )}
                          </td>

                          {/* Last Login */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-on-surface block">
                                {lastLoginDate}
                              </span>
                              <span className="text-[10px] text-on-surface-variant font-mono block">
                                IP: {cust.lastIp}
                              </span>
                              <span className="text-[10px] text-on-surface-variant block">
                                Total Logins: {cust.loginCount}
                              </span>
                            </div>
                          </td>

                          {/* Total Orders */}
                          <td className="py-3.5 px-4 font-bold text-on-surface">
                            {cust.orderCount || 1} Orders
                          </td>

                          {/* Total Spend */}
                          <td className="py-3.5 px-4 font-bold text-primary">
                            ₹{(cust.totalSpend || 1897).toLocaleString('en-IN')}
                          </td>

                          {/* Eco Cups Saved */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#42531F] bg-[#FAF6EC] px-2 py-0.5 rounded-full border border-[#EAE3D2]">
                              🌿 {cust.stats?.cupsSaved || 42} Cups
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedCustomer(cust)}
                                className="text-primary hover:underline font-bold text-[11px] border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary/5 transition-colors"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  onShowToast?.(`Sent complimentary ₹250 tasting credit to ${cust.name}`);
                                }}
                                className="text-amber-700 hover:underline font-bold text-[11px] border border-amber-300/50 px-2.5 py-1 rounded-full hover:bg-amber-50 transition-colors"
                              >
                                Send Reward
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATELIER ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#DFD8BF] shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F2EEDB] mb-4">
                <div>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    Live Atelier Baking &amp; Dispatch Queue
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Manage small-batch baking states and courier handovers in real time
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#F2EEDB]">
                {orders.map((ord) => {
                  const isProcessing = ord.statusCode === 'processing' || ord.statusCode === 'baking';
                  const isInTransit = ord.statusCode === 'in_transit';
                  const isDelivered = ord.statusCode === 'delivered';

                  return (
                    <div key={ord.orderId} className="py-4 first:pt-2 last:pb-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-on-surface">
                            #{ord.orderId}
                          </span>
                          <span className="text-xs text-on-surface-variant">• {ord.customerName}</span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              isProcessing
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                : isInTransit
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-green-100 text-green-800 border border-green-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <p className="text-xs text-on-surface font-medium">
                          {ord.itemsSummary}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
                          <span>AWB: <strong className="font-mono">{ord.trackingId}</strong></span>
                          <span>Courier: {ord.courier}</span>
                          <span className="text-primary font-bold">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isProcessing && (
                          <button
                            onClick={() => handleAdvanceOrderStatus(ord.orderId, ord.status, ord.statusCode)}
                            className="bg-primary hover:bg-[#344218] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Dispatch via BlueDart Air</span>
                          </button>
                        )}

                        {isInTransit && (
                          <button
                            onClick={() => handleAdvanceOrderStatus(ord.orderId, ord.status, ord.statusCode)}
                            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Delivered</span>
                          </button>
                        )}

                        {isDelivered && (
                          <span className="text-xs text-green-700 font-bold px-3 py-1 bg-green-50 rounded-full border border-green-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Fulfillment Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE WEBSITE VIEWER (SEE WHOLE WEBSITE THROUGH ADMIN) */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Viewer Controls */}
            <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">Store Preview Page:</span>
                <div className="flex bg-[#FAF6EC] p-1 rounded-xl border border-[#EAE3D2]">
                  <button
                    onClick={() => setPreviewPage('catalogue')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      previewPage === 'catalogue' ? 'bg-primary text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    Catalogue
                  </button>
                  <button
                    onClick={() => setPreviewPage('tracking')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      previewPage === 'tracking' ? 'bg-primary text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    Order Tracking
                  </button>
                  <button
                    onClick={() => setPreviewPage('craft')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      previewPage === 'craft' ? 'bg-primary text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    Our Craft
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-[#FAF6EC] p-1 rounded-xl border border-[#EAE3D2]">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                      previewDevice === 'desktop' ? 'bg-primary text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                      previewDevice === 'mobile' ? 'bg-primary text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <button
                  onClick={onSwitchToCustomerView}
                  className="px-3.5 py-1.5 bg-[#566346] text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Screen</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Viewport Container */}
            <div className="flex justify-center bg-[#E5DFD0] p-4 sm:p-6 rounded-3xl border border-[#D5CDC0] overflow-hidden min-h-[700px]">
              <div
                className={`bg-white shadow-2xl rounded-2xl overflow-y-auto border border-[#C5BDB0] transition-all duration-300 ${
                  previewDevice === 'mobile'
                    ? 'w-[390px] h-[780px] max-w-full'
                    : 'w-full h-[780px]'
                }`}
              >
                {/* Embedded Website Frame header */}
                <div className="bg-[#FAF6EC] px-4 py-2 border-b border-[#EAE3D2] flex items-center justify-between text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 font-mono text-[10px]">https://cup2eat.in/{previewPage}</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">Live Atelier Customer Simulation</span>
                </div>

                {/* Simulated Customer Experience view */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Banner */}
                  <div className="bg-[#FAF6EC] p-6 rounded-2xl border border-[#EAE3D2] text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                      Cup2Eat Live Customer Store
                    </span>
                    <h3 className="font-headline-lg text-2xl font-bold text-on-surface">
                      {previewPage === 'catalogue' && 'Artisanal Cookie Cups & Tasting Vessels'}
                      {previewPage === 'tracking' && 'Real-Time Order Tracking & Fulfillment'}
                      {previewPage === 'craft' && 'The Craft of Edible Culinary Vessels'}
                    </h3>
                    <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                      {previewPage === 'catalogue' && 'Oven-baked with ancient grains and glazed with single-origin Belgian dark chocolate.'}
                      {previewPage === 'tracking' && 'Order #C2E-89241 currently in oven baking queue #04.'}
                      {previewPage === 'craft' && 'Engineered to hold boiling espresso at 85°C for 45 minutes.'}
                    </p>
                  </div>

                  {/* Sample Grid Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PRODUCTS.slice(0, 2).map((item) => (
                      <div key={item.id} className="bg-[#FAF7F0] p-4 rounded-xl border border-[#EAE3D2] space-y-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-36 object-cover rounded-lg"
                        />
                        <h4 className="font-bold text-xs truncate">{item.title}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-primary">₹{item.defaultPrice.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE ACTIVITY STREAM */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-3xl border border-[#DFD8BF] shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EEDB]">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Real-Time Customer Activity Feed
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Every login, registration, and order event streams into this console live
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                Live Socket Stream
              </span>
            </div>

            <div className="divide-y divide-[#F2EEDB]">
              {activities.map((act) => (
                <div key={act._id} className="py-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EC] border border-[#EAE3D2] flex items-center justify-center text-primary shrink-0 mt-0.5">
                    {act.eventType === 'login' ? (
                      <Users className="w-4 h-4 text-green-700" />
                    ) : act.eventType === 'order_placed' ? (
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    ) : (
                      <Activity className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface">
                        {act.description}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-mono shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-on-surface-variant mt-0.5">
                      <span>Customer: <strong>{act.customerName}</strong> ({act.customerEmail})</span>
                      <span>•</span>
                      <span>IP: {act.ip}</span>
                      {act.device && (
                        <>
                          <span>•</span>
                          <span>Device: {act.device}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COUPON MANAGER */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Header + Add Button */}
            <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Coupon & Discount Manager
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Create, activate, and expire promotional coupon codes for your customers
                </p>
              </div>
              <button
                onClick={() => { setShowCouponForm(v => !v); setCouponFormError(''); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#344218] transition-colors shadow-sm"
              >
                {showCouponForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCouponForm ? 'Cancel' : 'Create New Coupon'}
              </button>
            </div>

            {/* Create Coupon Form */}
            {showCouponForm && (
              <div className="bg-white border border-primary/30 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-on-surface">New Coupon Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Coupon Code *</label>
                    <input
                      type="text"
                      value={couponForm.code}
                      onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SUMMER25"
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Discount Type *</label>
                    <select
                      value={couponForm.type}
                      onChange={e => setCouponForm(f => ({ ...f, type: e.target.value }))}
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                      Discount Value * {couponForm.type === 'percent' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      value={couponForm.value}
                      onChange={e => setCouponForm(f => ({ ...f, value: e.target.value }))}
                      placeholder={couponForm.type === 'percent' ? 'e.g. 15' : 'e.g. 150'}
                      min="1"
                      max={couponForm.type === 'percent' ? 100 : undefined}
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Min. Order Amount (₹)</label>
                    <input
                      type="number"
                      value={couponForm.minOrder}
                      onChange={e => setCouponForm(f => ({ ...f, minOrder: e.target.value }))}
                      placeholder="e.g. 500 (0 = no minimum)"
                      min="0"
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Expiry Date *</label>
                    <input
                      type="date"
                      value={couponForm.expiresAt}
                      onChange={e => setCouponForm(f => ({ ...f, expiresAt: e.target.value }))}
                      min={new Date().toISOString().slice(0, 10)}
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Usage Limit (0 = unlimited)</label>
                    <input
                      type="number"
                      value={couponForm.usageLimit}
                      onChange={e => setCouponForm(f => ({ ...f, usageLimit: e.target.value }))}
                      placeholder="e.g. 100"
                      min="0"
                      className="mt-1 w-full border border-[#DFD8BF] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-on-surface">Activate immediately?</label>
                  <button
                    type="button"
                    onClick={() => setCouponForm(f => ({ ...f, isActive: !f.isActive }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      couponForm.isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-[#F2EEDB] text-on-surface-variant border-[#DFD8BF]'
                    }`}
                  >
                    {couponForm.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {couponForm.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                {couponFormError && (
                  <p className="text-xs text-red-600 font-medium">{couponFormError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleAddCoupon}
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-[#344218] transition-colors shadow-sm"
                  >
                    Create Coupon
                  </button>
                </div>
              </div>
            )}

            {/* Coupon List */}
            <div className="space-y-3">
              {coupons.length === 0 && (
                <div className="bg-white border border-[#DFD8BF] rounded-2xl p-10 text-center text-on-surface-variant">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No coupons yet. Create your first one above.</p>
                </div>
              )}
              {coupons.map((coupon) => {
                const expired = isCouponExpired(coupon.expiresAt);
                const days = expired ? 0 : daysUntilExpiry(coupon.expiresAt);
                const usagePct = coupon.usageLimit > 0 ? Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100)) : null;

                return (
                  <div
                    key={coupon.id}
                    className={`bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm transition-all ${
                      expired ? 'border-red-200 opacity-70' : coupon.isActive ? 'border-green-200' : 'border-[#DFD8BF]'
                    }`}
                  >
                    {/* Left: Code & Details */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        expired ? 'bg-red-100' : coupon.isActive ? 'bg-green-100' : 'bg-[#F2EEDB]'
                      }`}>
                        <Tag className={`w-5 h-5 ${expired ? 'text-red-600' : coupon.isActive ? 'text-green-700' : 'text-on-surface-variant'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-base text-on-surface">{coupon.code}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            expired
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : coupon.isActive
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-[#F2EEDB] text-on-surface-variant border-[#DFD8BF]'
                          }`}>
                            {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant flex-wrap">
                          <span className="font-bold text-primary">
                            {coupon.type === 'percent' ? `${coupon.value}% Off` : `₹${coupon.value} Flat Off`}
                          </span>
                          {coupon.minOrder > 0 && <span>Min. ₹{coupon.minOrder.toLocaleString('en-IN')}</span>}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {expired ? 'Expired on' : `Expires`} {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {!expired && days <= 3 && <span className="text-orange-600 font-bold">(⚠ {days}d left)</span>}
                          </span>
                        </div>
                        {/* Usage bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[11px] text-on-surface-variant">
                            Used: <strong className="text-on-surface">{coupon.usageCount}</strong>
                            {coupon.usageLimit > 0 && ` / ${coupon.usageLimit}`}
                          </span>
                          {usagePct !== null && (
                            <div className="flex-1 max-w-[120px] h-1.5 bg-[#EAE3D2] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 60 ? 'bg-orange-500' : 'bg-primary'}`}
                                style={{ width: `${usagePct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!expired && (
                        <button
                          onClick={() => handleToggleCoupon(coupon.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                            coupon.isActive
                              ? 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200'
                              : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                          }`}
                        >
                          {coupon.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* TAB: PRODUCT MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">

            {/* Header bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DFD8BF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search by name, category, or badge…"
                  className="w-full bg-[#FAF6EC] border border-[#DFD8BF] pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant">{filteredProducts.length} products</span>
                <button
                  onClick={() => { setEditingProduct({ ...BLANK_PRODUCT }); setProductFormError(''); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Add / Edit Form */}
            {editingProduct !== null && (
              <div className="bg-white rounded-3xl border border-[#DFD8BF] shadow-sm overflow-hidden">
                <div className="bg-[#FAF6EC] border-b border-[#EAE3D2] px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                    {editingProduct.id && products.find(p => p.id === editingProduct.id) ? (
                      <><Edit3 className="w-4 h-4 text-primary" /> Edit Product</>
                    ) : (
                      <><Plus className="w-4 h-4 text-primary" /> Add New Product</>
                    )}
                  </h3>
                  <button onClick={() => { setEditingProduct(null); setProductFormError(''); }} className="text-on-surface-variant hover:text-on-surface">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {productFormError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl">{productFormError}</div>
                  )}

                  {/* Row 1: Title + ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={editingProduct.title}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev,
                          title: e.target.value,
                          id: prev.id || slugify(e.target.value),
                        }))}
                        placeholder="e.g. Artisanal Dark Espresso Cup"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Product ID / Slug *</label>
                      <input
                        type="text"
                        value={editingProduct.id}
                        onChange={e => setEditingProduct(prev => ({ ...prev, id: slugify(e.target.value) }))}
                        placeholder="auto-generated from title"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category + Badge + Badge Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      >
                        {['espresso', 'flat-white', 'cacao-rim', 'vanilla-oat', 'gifting'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Badge Label</label>
                      <input
                        type="text"
                        value={editingProduct.badge}
                        onChange={e => setEditingProduct(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="e.g. Chef's Selection"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Badge Style</label>
                      <select
                        value={editingProduct.badgeType}
                        onChange={e => setEditingProduct(prev => ({ ...prev, badgeType: e.target.value }))}
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      >
                        {['olive', 'gold', 'earth', 'sage', 'warm'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Product Photo — Upload or URL */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2">Product Photo</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Upload from device */}
                      <div>
                        <label className="block text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wide">Upload from Device</label>
                        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-[#C8C2AA] hover:border-primary bg-[#FAF6EC] hover:bg-[#F2EDDF] rounded-xl px-4 py-5 transition-colors group">
                          <ImageIcon className="w-6 h-6 text-[#C8C2AA] group-hover:text-primary transition-colors" />
                          <span className="text-[10px] text-on-surface-variant group-hover:text-primary font-semibold">Click to choose photo</span>
                          <span className="text-[9px] text-on-surface-variant/60">JPG, PNG, WebP — max 5 MB</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                setProductFormError('Image must be under 5 MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = ev => setEditingProduct(prev => ({
                                ...prev,
                                image: ev.target.result,
                                imageAlt: prev.imageAlt || file.name.replace(/\.[^.]+$/, ''),
                              }));
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>

                      {/* URL or Preview */}
                      <div className="flex flex-col gap-2">
                        <div>
                          <label className="block text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wide">Or paste image URL</label>
                          <input
                            type="url"
                            value={editingProduct.image?.startsWith('data:') ? '' : editingProduct.image}
                            onChange={e => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="https://…"
                            className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                        {/* Live preview */}
                        {editingProduct.image ? (
                          <div className="relative">
                            <img
                              src={editingProduct.image}
                              alt="Preview"
                              className="w-full h-28 object-cover rounded-xl border border-[#DFD8BF]"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <button
                              onClick={() => setEditingProduct(prev => ({ ...prev, image: '', imageAlt: '' }))}
                              className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-white rounded-full p-1 shadow text-on-surface-variant hover:text-red-600 transition-colors"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-28 rounded-xl border border-dashed border-[#DFD8BF] bg-[#FAF6EC] flex items-center justify-center">
                            <span className="text-[10px] text-on-surface-variant/60">Preview will appear here</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Alt text */}
                    <div className="mt-2">
                      <label className="block text-[10px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wide">Image Alt Text</label>
                      <input
                        type="text"
                        value={editingProduct.imageAlt}
                        onChange={e => setEditingProduct(prev => ({ ...prev, imageAlt: e.target.value }))}
                        placeholder="Descriptive alt text for accessibility"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Row 4: Short Desc */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Short Description *</label>
                    <textarea
                      rows={2}
                      value={editingProduct.shortDesc}
                      onChange={e => setEditingProduct(prev => ({ ...prev, shortDesc: e.target.value }))}
                      placeholder="One-liner shown on catalogue cards…"
                      className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Row 5: Long Desc */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Long Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.longDesc}
                      onChange={e => setEditingProduct(prev => ({ ...prev, longDesc: e.target.value }))}
                      placeholder="Full product story shown in product detail…"
                      className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Row 6: Capacity + Heat Resistance + Sustainability */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Capacity</label>
                      <input
                        type="text"
                        value={editingProduct.capacity}
                        onChange={e => setEditingProduct(prev => ({ ...prev, capacity: e.target.value }))}
                        placeholder="e.g. 6 Cups • 60ml"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Heat Resistance</label>
                      <input
                        type="text"
                        value={editingProduct.heatResistance}
                        onChange={e => setEditingProduct(prev => ({ ...prev, heatResistance: e.target.value }))}
                        placeholder="e.g. 85°C for 45 Mins"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Sustainability</label>
                      <input
                        type="text"
                        value={editingProduct.sustainability}
                        onChange={e => setEditingProduct(prev => ({ ...prev, sustainability: e.target.value }))}
                        placeholder="e.g. Zero Waste • Edible"
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Row 7: Rating + Review Count + Active toggle */}
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Rating (0–5)</label>
                      <input
                        type="number"
                        min="0" max="5" step="0.1"
                        value={editingProduct.rating}
                        onChange={e => setEditingProduct(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Review Count</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.reviewCount}
                        onChange={e => setEditingProduct(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2 pb-2">
                      <button
                        onClick={() => setEditingProduct(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          editingProduct.isActive
                            ? 'bg-green-50 border-green-300 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                      >
                        {editingProduct.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {editingProduct.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  {/* Row 8: Tasting Notes */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2">Tasting Notes (up to 4)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <input
                          key={i}
                          type="text"
                          value={editingProduct.tastingNotes[i] || ''}
                          onChange={e => {
                            const notes = [...editingProduct.tastingNotes];
                            notes[i] = e.target.value;
                            setEditingProduct(prev => ({ ...prev, tastingNotes: notes }));
                          }}
                          placeholder={`Note ${i + 1}`}
                          className="border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Row 9: Pairing */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Pairing Suggestion</label>
                    <input
                      type="text"
                      value={editingProduct.pairing}
                      onChange={e => setEditingProduct(prev => ({ ...prev, pairing: e.target.value }))}
                      placeholder="e.g. Pairs beautifully with aged cheese…"
                      className="w-full border border-[#DFD8BF] bg-[#FAF6EC] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Row 10: Packs editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-on-surface-variant">Packs / Sizes *</label>
                      <button
                        onClick={() => setEditingProduct(prev => ({
                          ...prev,
                          packs: [...prev.packs, { size: '', count: 0, price: '', originalPrice: '', isDefault: false }]
                        }))}
                        className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Pack
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingProduct.packs.map((pack, idx) => (
                        <div key={idx} className="flex items-center gap-2 flex-wrap bg-[#FAF6EC] border border-[#DFD8BF] rounded-xl px-3 py-2">
                          <input
                            type="text"
                            value={pack.size}
                            onChange={e => {
                              const packs = [...editingProduct.packs];
                              packs[idx] = { ...packs[idx], size: e.target.value };
                              setEditingProduct(prev => ({ ...prev, packs }));
                            }}
                            placeholder="Size label"
                            className="border border-[#DFD8BF] bg-white rounded-lg px-2 py-1 text-xs w-24 focus:outline-none focus:border-primary"
                          />
                          <input
                            type="number"
                            value={pack.count}
                            onChange={e => {
                              const packs = [...editingProduct.packs];
                              packs[idx] = { ...packs[idx], count: e.target.value };
                              setEditingProduct(prev => ({ ...prev, packs }));
                            }}
                            placeholder="Count"
                            className="border border-[#DFD8BF] bg-white rounded-lg px-2 py-1 text-xs w-16 focus:outline-none focus:border-primary"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-on-surface-variant">₹</span>
                            <input
                              type="number"
                              value={pack.price}
                              onChange={e => {
                                const packs = [...editingProduct.packs];
                                packs[idx] = { ...packs[idx], price: e.target.value };
                                setEditingProduct(prev => ({ ...prev, packs }));
                              }}
                              placeholder="Price"
                              className="border border-[#DFD8BF] bg-white rounded-lg px-2 py-1 text-xs w-20 focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-on-surface-variant">MRP ₹</span>
                            <input
                              type="number"
                              value={pack.originalPrice}
                              onChange={e => {
                                const packs = [...editingProduct.packs];
                                packs[idx] = { ...packs[idx], originalPrice: e.target.value };
                                setEditingProduct(prev => ({ ...prev, packs }));
                              }}
                              placeholder="Original"
                              className="border border-[#DFD8BF] bg-white rounded-lg px-2 py-1 text-xs w-20 focus:outline-none focus:border-primary"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const packs = editingProduct.packs.map((p, i) => ({ ...p, isDefault: i === idx }));
                              setEditingProduct(prev => ({ ...prev, packs }));
                            }}
                            className={`text-xs font-bold px-2 py-1 rounded-lg border transition-colors ${
                              pack.isDefault
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-[#DFD8BF] text-on-surface-variant hover:border-primary'
                            }`}
                          >
                            {pack.isDefault ? '★ Default' : 'Set Default'}
                          </button>
                          {editingProduct.packs.length > 1 && (
                            <button
                              onClick={() => {
                                const packs = editingProduct.packs.filter((_, i) => i !== idx);
                                if (!packs.some(p => p.isDefault)) packs[0].isDefault = true;
                                setEditingProduct(prev => ({ ...prev, packs }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE3D2]">
                    <button
                      onClick={() => { setEditingProduct(null); setProductFormError(''); }}
                      className="px-5 py-2 rounded-xl text-xs font-bold border border-[#DFD8BF] text-on-surface-variant hover:bg-[#FAF6EC] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Product
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#DFD8BF] p-12 text-center text-on-surface-variant text-sm">
                No products found. Add your first product above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all ${
                      product.isActive ? 'border-[#DFD8BF]' : 'border-red-200 opacity-60'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative h-44 bg-[#FAF6EC] overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.imageAlt || product.title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-[#C8C2AA]" />
                        </div>
                      )}
                      {/* Active / Inactive badge */}
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        product.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {/* Badge label */}
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#262E15]/80 text-[#D5EBA8] backdrop-blur-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <h4 className="font-bold text-xs text-on-surface leading-tight line-clamp-2">{product.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                        <span className="px-2 py-0.5 rounded-full bg-[#EAE3D2] font-semibold capitalize">{product.category}</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                        <span className="font-black text-sm text-on-surface">₹{product.defaultPrice || product.packs?.[0]?.price || '—'}</span>
                        {(product.defaultOriginalPrice || product.packs?.[0]?.originalPrice) > (product.defaultPrice || product.packs?.[0]?.price) && (
                          <span className="text-[10px] text-on-surface-variant line-through">₹{product.defaultOriginalPrice || product.packs?.[0]?.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant line-clamp-2">{product.shortDesc}</p>

                      {/* Expanded Details */}
                      {expandedProduct === product.id && (
                        <div className="text-[10px] text-on-surface-variant border-t border-[#EAE3D2] pt-2 mt-1 space-y-1">
                          {product.capacity && <p><span className="font-bold">Capacity:</span> {product.capacity}</p>}
                          {product.heatResistance && <p><span className="font-bold">Heat:</span> {product.heatResistance}</p>}
                          {product.sustainability && <p><span className="font-bold">Eco:</span> {product.sustainability}</p>}
                          {product.tastingNotes?.filter(n => n).length > 0 && (
                            <p><span className="font-bold">Notes:</span> {product.tastingNotes.filter(n => n).join(' • ')}</p>
                          )}
                          {product.pairing && <p><span className="font-bold">Pairs with:</span> {product.pairing}</p>}
                          <p><span className="font-bold">ID:</span> <code className="bg-[#EAE3D2] px-1 rounded">{product.id}</code></p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {product.packs?.map((pk, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                                pk.isDefault ? 'bg-primary text-white border-primary' : 'bg-[#EAE3D2] border-[#C8C2AA] text-on-surface-variant'
                              }`}>
                                {pk.size} · ₹{pk.price}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAE3D2] mt-1">
                        <button
                          onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-[#FAF6EC] border border-[#DFD8BF] text-on-surface-variant hover:bg-[#EAE3D2] transition-colors"
                        >
                          {expandedProduct === product.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {expandedProduct === product.id ? 'Less' : 'More'}
                        </button>
                        <button
                          onClick={() => { setEditingProduct({ ...product }); setProductFormError(''); setExpandedProduct(null); }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleProduct(product.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            product.isActive
                              ? 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
                              : 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                          }`}
                        >
                          {product.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {product.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
