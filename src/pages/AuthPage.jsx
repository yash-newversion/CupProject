import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Coffee, User, Mail, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle, Flame, Leaf, Package } from 'lucide-react';

export default function AuthPage({ onLoginSuccess, onExploreCatalogue }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        await onLoginSuccess({
          isRegister: true,
          name,
          email,
          password,
          phone
        });
      } else {
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        await onLoginSuccess({
          isRegister: false,
          email,
          password
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoType) => {
    if (demoType === 'customer') {
      setIsRegister(false);
      setEmail('aarav@connoisseur.in');
      setPassword('password123');
    } else if (demoType === 'admin') {
      setIsRegister(false);
      setEmail('admin@cup2eat.in');
      setPassword('admin123');
    }
  };

  return (
    <main className="flex-1 min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-[#FAF7F0] relative overflow-hidden">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#D5EBA8]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FAF6EC] rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Landing & Auth Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#DFD8BF] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10 my-4">
        {/* Left Editorial Visual Section (Cols 1-5) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#384323] to-[#252C16] text-[#FAF7F0] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#596B35]/20 rounded-full filter blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#49572B] text-[#D5EBA8] text-xs font-semibold border border-[#596B35]">
              <Sparkles className="w-3.5 h-3.5 text-[#D5A65A]" />
              <span>Connoisseur Patron Portal</span>
            </div>

            <div className="space-y-1">
              <span className="font-headline-lg text-3xl sm:text-4xl font-bold tracking-tight text-white block">
                Cup2Eat
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-[#B8C793] font-semibold">
                Artisanal Edible Vessels
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#C9D1B3] leading-relaxed pt-2">
              Welcome to the world&apos;s finest zero-waste coffee experience. Every cup is 100% edible, stone-milled from whole ancient grains, and glazed with Belgian chocolate to hold hot espresso at 85°C for 45 minutes.
            </p>
          </div>

          <div className="relative z-10 pt-8 space-y-3 border-t border-[#485626]">
            <div className="flex items-center gap-3 text-xs text-[#E1E7D0]">
              <ShieldCheck className="w-4 h-4 text-[#D5A65A] shrink-0" />
              <span>MongoDB Enterprise Database Protected</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#E1E7D0]">
              <Coffee className="w-4 h-4 text-[#D5A65A] shrink-0" />
              <span>Live Real-Time Atelier Oven Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Form Section (Cols 6-12) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Tab Switcher */}
            <div className="flex bg-[#FAF6EC] p-1 rounded-2xl border border-[#EAE3D2] mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isRegister
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In to Atelier
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  isRegister
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title */}
            <div className="mb-5">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                {isRegister ? 'Join The Connoisseur Circle' : 'Welcome Back, Patron'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {isRegister
                  ? 'Create an account to receive 200 welcome reward points & save your taste profile.'
                  : 'Enter your credentials to access your tasting archives & live dispatches.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}



            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      required={isRegister}
                      className="w-full bg-[#FAF6EC] border border-[#DFD8BF] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="connoisseur@cup2eat.in"
                    required
                    className="w-full bg-[#FAF6EC] border border-[#DFD8BF] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FAF6EC] border border-[#DFD8BF] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                    Mobile Number (for live SMS &amp; WhatsApp dispatch alerts)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12894"
                      className="w-full bg-[#FAF6EC] border border-[#DFD8BF] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#344218] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-70 mt-3"
              >
                {loading ? (
                  <span>Authenticating with MongoDB...</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Create Account & Enter Atelier' : 'Sign In to Atelier'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Security Note & Concierge Link */}
          <div className="pt-6 border-t border-[#F2EEDB] mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-on-surface-variant">
            <span>Need assistance? Contact Concierge</span>
            <div className="flex items-center gap-1.5 text-primary font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#845E18]" />
              <span>Verified Account Required to Unlock Homepage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Landing Page 4 Pillars Footer Strip */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 relative z-10 text-xs text-on-surface">
        <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#DFD8BF] flex items-center gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary shrink-0">
            <Leaf className="w-4 h-4 text-[#42531F]" />
          </div>
          <div>
            <span className="font-bold text-on-surface block text-[11px]">100% Edible</span>
            <span className="text-[10px] text-on-surface-variant">Zero single-use waste</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#DFD8BF] flex items-center gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary shrink-0">
            <Flame className="w-4 h-4 text-[#D5A65A]" />
          </div>
          <div>
            <span className="font-bold text-on-surface block text-[11px]">85°C Heat Proof</span>
            <span className="text-[10px] text-on-surface-variant">Sip mindfully 45 mins</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#DFD8BF] flex items-center gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary shrink-0">
            <Coffee className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <span className="font-bold text-on-surface block text-[11px]">Belgian Cocoa</span>
            <span className="text-[10px] text-on-surface-variant">Single-origin dark glaze</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#DFD8BF] flex items-center gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#EDF0E5] flex items-center justify-center text-primary shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-bold text-on-surface block text-[11px]">Live Dispatch</span>
            <span className="text-[10px] text-on-surface-variant">BlueDart Air transit</span>
          </div>
        </div>
      </div>
    </main>
  );
}
