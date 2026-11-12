import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Sparkles, Coffee, Heart } from 'lucide-react';

export default function Footer({ setActiveTab, onShowToast }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    onShowToast?.("Welcome to the Connoisseur Club! Check your inbox for ₹200 off your next tasting.");
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="w-full bg-[#2E3618] text-[#E7EBD8] border-t border-[#3D4720] mt-auto relative overflow-hidden">
      {/* Subtle organic top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#596B35] via-[#D5A65A] to-[#596B35] opacity-80" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#434F26]">
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3D4821] border border-[#55652E] flex items-center justify-center text-[#D5EBA8]">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-headline-lg text-2xl font-bold tracking-tight text-white block">
                  Cup2Eat
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8C793] font-semibold">
                  Artisanal Edible Vessels
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#C9D1B3] max-w-sm">
              Grounded luxury and sustainable gastronomy. Every cup is 100% edible, certified plant-based, and baked to transform your daily coffee ritual into zero-waste mindful delight.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#394420] text-[#D5EBA8] border border-[#495729]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D5A65A]" />
                Zero Single-Use Waste
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#394420] text-[#D5EBA8] border border-[#495729]">
                <Sparkles className="w-3.5 h-3.5 text-[#D5A65A]" />
                85°C Heat Proof
              </span>
            </div>
          </div>

          {/* Quick Links: Tasting Vessels (Cols 5-7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.16em] font-bold text-white">
              Tasting Vessels
            </h4>
            <ul className="space-y-2 text-sm text-[#B8C2A0]">
              <li>
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Espresso 60ml Cups
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Flat White 150ml Cups
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Belgian Cocoa Rim
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Toasted Vanilla Oat
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Luxury Gifting Box
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Atelier & Rituals (Cols 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.16em] font-bold text-white">
              The Sanctuary
            </h4>
            <ul className="space-y-2 text-sm text-[#B8C2A0]">
              <li>
                <button
                  onClick={() => navigateTo('craft')}
                  className="hover:text-white transition-colors"
                >
                  Our Baking Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('tracking')}
                  className="hover:text-white transition-colors"
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-white transition-colors"
                >
                  Patron Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('craft')}
                  className="hover:text-white transition-colors"
                >
                  The 3-Step Ritual
                </button>
              </li>
              <li>
                <a
                  href="mailto:concierge@cup2eat.in"
                  className="hover:text-white transition-colors"
                >
                  Atelier Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter (Cols 10-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.16em] font-bold text-white">
              The Connoisseur Circle
            </h4>
            <p className="text-xs text-[#B8C2A0] leading-relaxed">
              Subscribe for private batch invitations, seasonal cocoa pairings, and complimentary express cold-pack shipping.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-full overflow-hidden border border-[#495729] bg-[#222812] focus-within:border-[#A2B677] transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-transparent px-4 py-2.5 text-xs text-white placeholder-[#879371] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-[#4C5D26] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  {subscribed ? <CheckCircle2 className="w-4 h-4 text-[#D5EBA8]" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{subscribed ? 'Joined' : 'Join'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#8C9874]">
                Strictly artisanal dispatches. Never spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C9874]">
          <p>© 2026 Cup2Eat Atelier Inc. All rights reserved. Handcrafted in Bengaluru, India.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">FSSAI Lic. #11224333000841</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
