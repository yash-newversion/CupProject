import React, { useState, useEffect, useCallback } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import ReceiptModal from './components/ReceiptModal';
import Toast from './components/Toast';

import CataloguePage from './pages/CataloguePage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import OurCraftPage from './pages/OurCraftPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';

import { INITIAL_USER, INITIAL_ORDERS, INITIAL_CART } from './data/initialData';
import { api } from './services/api';
import { ShieldCheck } from 'lucide-react';

const SESSION_LIMIT_MINUTES = 30;

export default function App() {
  // If user is saved in storage and session has not expired, resume session; otherwise land on the Login/Signup Landing Page!
  const [sessionExpiresAt, setSessionExpiresAt] = useState(() => {
    try {
      const savedExp = localStorage.getItem('cup2eat_session_expires');
      if (savedExp) {
        const expTime = parseInt(savedExp, 10);
        if (expTime > Date.now()) return expTime;
      }
      const savedUser = localStorage.getItem('cup2eat_user');
      if (savedUser) {
        const newExp = Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000;
        localStorage.setItem('cup2eat_session_expires', String(newExp));
        return newExp;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState(() => {
    if (sessionExpiresAt) {
      return Math.max(0, Math.floor((sessionExpiresAt - Date.now()) / 1000));
    }
    return SESSION_LIMIT_MINUTES * 60;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedExp = localStorage.getItem('cup2eat_session_expires');
      if (savedExp && parseInt(savedExp, 10) <= Date.now()) {
        localStorage.removeItem('cup2eat_user');
        localStorage.removeItem('cup2eat_session_expires');
        return null;
      }
      const saved = localStorage.getItem('cup2eat_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedExp = localStorage.getItem('cup2eat_session_expires');
      if (savedExp && parseInt(savedExp, 10) <= Date.now()) return 'auth';
      const saved = localStorage.getItem('cup2eat_user');
      return saved ? 'catalogue' : 'auth';
    } catch {
      return 'auth';
    }
  });

  const [cart, setCart] = useState(INITIAL_CART);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [lastAddedItem, setLastAddedItem] = useState('Artisanal Assortment (12 Cups)');

  // Admin and live state
  const [adminData, setAdminData] = useState({
    customers: [],
    activities: [],
    orders: INITIAL_ORDERS,
    stats: null
  });

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    actionLabel: null,
    onAction: null
  });

  const showToast = (message, actionLabel = null, onAction = null) => {
    setToast({ visible: true, message, actionLabel, onAction });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Sync with API on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [fetchedCustomers, fetchedActivities, fetchedOrders, fetchedStats] = await Promise.all([
          api.getAdminCustomers(),
          api.getAdminActivities(),
          api.getAdminOrders(),
          api.getAdminStats()
        ]);

        setAdminData({
          customers: fetchedCustomers || [],
          activities: fetchedActivities || [],
          orders: fetchedOrders?.length ? fetchedOrders : INITIAL_ORDERS,
          stats: fetchedStats
        });

        if (fetchedOrders?.length) {
          setOrders(fetchedOrders);
        }
      } catch (err) {
        console.warn('Backend sync warning, using local state:', err);
      }
    };
    initData();
  }, []);

  // Session Timeout & Expiration Handlers
  const handleSessionExpired = useCallback(async () => {
    if (user?.email) {
      try {
        await api.logout(user.email);
      } catch (e) {}
    }
    try {
      localStorage.removeItem('cup2eat_user');
      localStorage.removeItem('cup2eat_session_expires');
    } catch (e) {}
    setUser(null);
    setSessionExpiresAt(null);
    setActiveTab('auth');
    showToast('⏱️ Session limit reached (30 minutes). Please sign in again to verify your identity.');
  }, [user]);

  const handleExtendSession = async () => {
    const newExpiresAt = Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000;
    setSessionExpiresAt(newExpiresAt);
    try {
      localStorage.setItem('cup2eat_session_expires', String(newExpiresAt));
    } catch (e) {}
    setSessionRemainingSeconds(SESSION_LIMIT_MINUTES * 60);

    if (user?.email) {
      try {
        await api.extendSession(user.email);
      } catch (e) {}
    }
    showToast('✨ Session limit extended by 30 minutes.');
  };

  // Active Session Countdown Timer
  useEffect(() => {
    if (!user || !sessionExpiresAt) return;

    const currentDiff = Math.max(0, Math.floor((sessionExpiresAt - Date.now()) / 1000));
    setSessionRemainingSeconds(currentDiff);
    if (currentDiff <= 0) {
      handleSessionExpired();
      return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((sessionExpiresAt - Date.now()) / 1000));
      setSessionRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        handleSessionExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user, sessionExpiresAt, handleSessionExpired]);

  // Authentication Handlers
  const handleAuthSubmit = async ({ isRegister, name, email, password, phone }) => {
    try {
      let result;
      if (isRegister) {
        result = await api.register(name, email, password, phone);
      } else {
        result = await api.login(email, password);
      }

      if (result && result.user) {
        setUser(result.user);
        const expTime = Date.now() + SESSION_LIMIT_MINUTES * 60 * 1000;
        setSessionExpiresAt(expTime);
        setSessionRemainingSeconds(SESSION_LIMIT_MINUTES * 60);
        try {
          localStorage.setItem('cup2eat_user', JSON.stringify(result.user));
          localStorage.setItem('cup2eat_session_expires', String(expTime));
        } catch (e) {}

        showToast(
          `✨ Welcome, ${result.user.name}! ${isRegister ? '200 bonus reward points added.' : 'Logged in successfully.'}`,
          result.user.role === 'admin' ? 'Open Admin Panel' : 'My Account',
          () => setActiveTab(result.user.role === 'admin' ? 'admin' : 'account')
        );

        if (result.user.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('catalogue');
        }

        // Refresh admin data so new login shows immediately on admin panel!
        const [updatedCusts, updatedActs] = await Promise.all([
          api.getAdminCustomers(),
          api.getAdminActivities()
        ]);
        if (updatedCusts) {
          setAdminData((prev) => ({ ...prev, customers: updatedCusts, activities: updatedActs || prev.activities }));
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    if (user?.email) {
      await api.logout(user.email);
    }
    try {
      localStorage.removeItem('cup2eat_user');
      localStorage.removeItem('cup2eat_session_expires');
    } catch (e) {}
    setUser(null);
    setSessionExpiresAt(null);
    setActiveTab('auth');
    showToast('You have been signed out from the Atelier.');
  };

  const handleSwitchUser = async () => {
    if (user?.email) {
      try {
        await api.logout(user.email);
      } catch (e) {}
    }
    try {
      localStorage.removeItem('cup2eat_user');
      localStorage.removeItem('cup2eat_session_expires');
    } catch (e) {}
    setUser(null);
    setSessionExpiresAt(null);
    setActiveTab('auth');
    showToast('Switching user: please enter credentials for the other account.');
  };

  // Cart operations
  const handleAddToCart = (product, pack, quantity = 1) => {
    const variantName = pack?.size || 'Standard';
    const unitPrice = pack?.price || product.defaultPrice;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (i) => i.id === product.id && i.variant === variantName
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            title: product.title,
            variant: variantName,
            price: unitPrice,
            quantity: quantity,
            image: product.image
          }
        ];
      }
    });

    const itemLabel = `${product.title} (${variantName})`;
    setLastAddedItem(itemLabel);
    showToast(
      `Added ${quantity}x ${itemLabel} (₹${(unitPrice * quantity).toLocaleString('en-IN')}) to your basket!`,
      'View Basket',
      () => setIsCartOpen(true)
    );
  };

  const handleUpdateQuantity = (itemId, variant, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId && item.variant === variant) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (itemId, variant) => {
    setCart((prevCart) => prevCart.filter((i) => !(i.id === itemId && i.variant === variant)));
    showToast('Item removed from basket.');
  };

  // Checkout flow
  const handleCheckout = async (checkoutData) => {
    const orderPayload = {
      userId: user?._id || 'usr-guest',
      customerName: user?.name || 'Aarav Sharma',
      customerEmail: user?.email || 'aarav@connoisseur.in',
      items: checkoutData.items,
      totalAmount: checkoutData.total,
      deliveryAddress: user?.addresses?.[0] || {
        recipient: user?.name || 'Aarav Sharma',
        street: 'Villa 14, The Palms Sanctuary, 100 Ft Road',
        locality: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      pricing: {
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        shipping: checkoutData.shipping,
        packaging: checkoutData.giftWrap,
        total: checkoutData.total
      }
    };

    let createdOrder = await api.createOrder(orderPayload);

    if (!createdOrder) {
      // Local fallback
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      createdOrder = {
        orderId: `C2E-${randomSuffix}`,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        date: 'Just Now',
        status: 'Baking in Atelier',
        statusCode: 'processing',
        trackingId: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        courier: 'BlueDart Express Air',
        estimatedDelivery: 'Saturday, 16 Nov • By 2:00 PM',
        totalAmount: checkoutData.total,
        itemsSummary: checkoutData.items.map((i) => `${i.title} (${i.variant})`).join(' + '),
        items: checkoutData.items,
        deliveryAddress: orderPayload.deliveryAddress,
        pricing: orderPayload.pricing,
        steps: INITIAL_ORDERS[0].steps.map((s) => ({ ...s }))
      };
    }

    setOrders([createdOrder, ...orders]);
    setCart([]);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast(
      `🎉 Tasting Order #${createdOrder.orderId} placed! Savor the anticipation.`,
      'Track Order',
      () => setActiveTab('tracking')
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus, newStatusCode) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus, statusCode: newStatusCode } : o
      )
    );
  };

  const handleReorder = (pastOrder) => {
    pastOrder.items.forEach((item) => {
      handleAddToCart(
        { id: item.id, title: item.title, defaultPrice: item.price, image: item.image },
        { size: item.variant, price: item.price },
        item.quantity
      );
    });
    setIsCartOpen(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // HOMEPAGE ONLY ACTIVATES WHEN LOGIN CREDENTIALS ARE VERIFIED VIA MONGODB!
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-fixed">
        <AnnouncementBar />
        <AuthPage onLoginSuccess={handleAuthSubmit} />
        <Toast
          message={toast.message}
          visible={toast.visible}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
        />
      </div>
    );
  }

  // If in Admin Console mode or logged in as Admin, display AdminPage completely separate
  if (activeTab === 'admin' || user?.role === 'admin') {
    return (
      <>
        <AdminPage
          user={user}
          onSwitchToCustomerView={() => {}}
          onShowToast={showToast}
          adminData={adminData}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
        />
        <Toast
          message={toast.message}
          visible={toast.visible}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenCraft={() => setActiveTab('craft')}
        user={user}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setActiveTab('auth')}
        sessionInfo={{
          remainingSeconds: sessionRemainingSeconds,
          totalSeconds: SESSION_LIMIT_MINUTES * 60,
          sessionLimitMinutes: SESSION_LIMIT_MINUTES,
          onExtendSession: handleExtendSession
        }}
      />

      {/* Page Content Switcher */}
      {activeTab === 'catalogue' && (
        <CataloguePage
          onAddToCart={handleAddToCart}
          onOpenQuickView={setQuickViewProduct}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cartCount={cartCount}
          cartTotal={cartTotal}
          lastAddedItem={lastAddedItem}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {activeTab === 'tracking' && (
        <OrderTrackingPage
          order={orders[0]}
          onShowToast={showToast}
          onExploreCatalogue={() => setActiveTab('catalogue')}
        />
      )}

      {activeTab === 'account' && (
        user ? (
          <AccountPage
            user={user}
            orders={orders}
            onTrackOrder={(ord) => {
              setActiveTab('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReorder={handleReorder}
            onViewReceipt={setReceiptOrder}
            onShowToast={showToast}
            onLogout={handleLogout}
            onSwitchUser={handleSwitchUser}
            sessionInfo={{
              remainingSeconds: sessionRemainingSeconds,
              totalSeconds: SESSION_LIMIT_MINUTES * 60,
              sessionLimitMinutes: SESSION_LIMIT_MINUTES,
              onExtendSession: handleExtendSession
            }}
          />
        ) : (
          <AuthPage
            onLoginSuccess={handleAuthSubmit}
            onExploreCatalogue={() => setActiveTab('catalogue')}
          />
        )
      )}

      {activeTab === 'craft' && (
        <OurCraftPage
          onExploreCatalogue={() => {
            setActiveTab('catalogue');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeTab === 'auth' && (
        <AuthPage
          onLoginSuccess={handleAuthSubmit}
          onExploreCatalogue={() => setActiveTab('catalogue')}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onShowToast={showToast} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onExploreCatalogue={() => {
          setIsCartOpen(false);
          setActiveTab('catalogue');
        }}
        user={user}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Tax Invoice Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={Boolean(receiptOrder)}
        onClose={() => setReceiptOrder(null)}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        actionLabel={toast.actionLabel}
        onAction={toast.onAction}
      />
    </div>
  );
}
