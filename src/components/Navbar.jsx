import React, { useState } from 'react';
import { ShoppingBag, Search, User, Users, Menu, X, Sparkles, Compass, ShieldCheck, LogIn, LogOut, Clock, RefreshCw, ChevronDown } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  setIsCartOpen,
  searchTerm,
  setSearchTerm,
  onOpenCraft,
  user,
  onLogout,
  onSwitchUser,
  onOpenAuth,
  sessionInfo
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const remainingSeconds = sessionInfo?.remainingSeconds ?? 1800;
  const minsLeft = Math.floor(remainingSeconds / 60);
  const secsLeft = remainingSeconds % 60;
  const formattedCountdown = `${minsLeft}m ${String(secsLeft).padStart(2, '0')}s`;

  const navLinks = [
    { id: 'catalogue', label: 'Catalogue', icon: Sparkles },
    { id: 'craft', label: 'Our Craft', icon: Compass },
    { id: 'tracking', label: 'Order Tracking', badge: 'Live', icon: null },
    { id: 'account', label: 'Patron Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 shadow-[0_1px_8px_rgba(41,45,36,0.06)] bg-[#FAF6EC]">
      <div className="relative w-full border-b border-[#EAE3D2] px-4 sm:px-8 py-3 overflow-hidden shadow-[0_2px_10px_rgba(41,45,36,0.04)]">
        {/* Left Botanical Foliage SVG */}
        <svg
          className="absolute -top-1 -left-2 w-28 h-20 pointer-events-none opacity-85 z-0"
          viewBox="0 0 120 90"
          fill="none"
        >
          <path d="M-5 10 C20 25, 50 45, 85 70" stroke="#556633" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M15 18 C25 5, 45 10, 52 28 C40 32, 22 28, 15 18 Z" fill="#6A803B" opacity="0.9" />
          <path d="M15 18 C30 22, 45 24, 52 28" stroke="#485922" strokeWidth="1" />
          <path d="M38 35 C55 22, 75 30, 80 48 C65 52, 48 46, 38 35 Z" fill="#586E2E" opacity="0.95" />
          <path d="M38 35 C55 38, 70 42, 80 48" stroke="#3D4E1D" strokeWidth="1" />
          <path d="M62 52 C78 40, 102 46, 110 65 C95 70, 75 64, 62 52 Z" fill="#758E40" opacity="0.9" />
        </svg>

        {/* Right Botanical Foliage SVG */}
        <svg
          className="absolute -top-1 -right-2 w-28 h-20 pointer-events-none opacity-85 z-0 transform scale-x-[-1]"
          viewBox="0 0 120 90"
          fill="none"
        >
          <path d="M-5 10 C20 25, 50 45, 85 70" stroke="#556633" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M15 18 C25 5, 45 10, 52 28 C40 32, 22 28, 15 18 Z" fill="#6A803B" opacity="0.9" />
          <path d="M15 18 C30 22, 45 24, 52 28" stroke="#485922" strokeWidth="1" />
          <path d="M38 35 C55 22, 75 30, 80 48 C65 52, 48 46, 38 35 Z" fill="#586E2E" opacity="0.95" />
          <path d="M38 35 C55 38, 70 42, 80 48" stroke="#3D4E1D" strokeWidth="1" />
          <path d="M62 52 C78 40, 102 46, 110 65 C95 70, 75 64, 62 52 Z" fill="#758E40" opacity="0.9" />
        </svg>

        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-2 sm:gap-4 relative z-10">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => {
              setActiveTab('catalogue');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 text-left group transition-transform focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-headline-lg text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-primary">
                  Cup2Eat
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#E5DFCA] text-[#42531F] px-1.5 py-0.5 rounded-full border border-[#D5CDAE]">
                  Atelier
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#556633] font-semibold -mt-1 hidden md:block">
                Artisanal Edible Cookie Cups
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on Large Screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-[#EFEAD7]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#DFD8BF]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              const IconComp = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-[#FAF6EC]'
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Bar or Button */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-white border border-primary/30 rounded-full px-3 py-1 shadow-sm">
                  <Search className="w-3.5 h-3.5 text-primary mr-1.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cups, roasts..."
                    autoFocus
                    className="w-32 sm:w-48 text-xs bg-transparent focus:outline-none text-on-surface"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchTerm('');
                    }}
                    className="text-on-surface-variant hover:text-primary ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="w-9 h-9 rounded-full bg-white/80 border border-[#DFD8BF] flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors shadow-sm"
                  title="Search Catalogue"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Functional User Profile Icon & Session Controller */}
            {user ? (
              <div className="relative flex items-center">
                {/* Profile Pill: Clicking Avatar / Name directly opens Profile Page! */}
                <div className={`flex items-center rounded-full border transition-all duration-200 shadow-sm ${
                  activeTab === 'account' || userDropdownOpen
                    ? 'bg-[#EAE3D2] border-primary text-primary ring-2 ring-primary/20'
                    : 'bg-white/90 border-[#DFD8BF] hover:border-primary/50 text-on-surface'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('account');
                      setUserDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="View Patron Profile"
                    className="flex items-center gap-2 py-1 pl-1.5 pr-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
                    title="Click profile picture to open Patron Profile"
                  >
                    <div className="relative flex items-center justify-center">
                      {user.avatar && !avatarError ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          onError={() => setAvatarError(true)}
                          className="w-7 h-7 rounded-full object-cover border border-primary/30 shadow-xs"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#E8ECD9] text-primary flex items-center justify-center border border-primary/30 shadow-xs">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      {/* Live Online Green Dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>


                  </button>

                  {/* Dropdown Chevron button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                    className="py-1 px-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Account options & session settings"
                    aria-label="Toggle Account Menu"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Dropdown Menu & Backdrop */}
                {userDropdownOpen && (
                  <>
                    {/* Outside click overlay */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-[#DFD8BF] shadow-2xl py-3 z-50 text-xs animation-fade-in">
                      {/* Patron Identity Card - Clicking opens Profile! */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('account');
                          setUserDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left px-4 pb-3 border-b border-[#F2EEDB] flex items-center gap-3 hover:bg-[#FAF6EC] transition-colors cursor-pointer group"
                        title="Click to open My Patron Profile"
                      >
                        <div className="relative">
                          {user.avatar && !avatarError ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-primary/30 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#E8ECD9] text-primary flex items-center justify-center border border-primary/30 group-hover:scale-105 transition-transform">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-on-surface text-sm truncate group-hover:text-primary transition-colors">{user.name}</p>
                          <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold bg-[#E8ECD9] text-[#42531F] px-2 py-0.5 rounded-full border border-[#D5DFC0]">
                              {user.tier || 'Patron Member • Tier I'}
                            </span>
                            <span className="text-[9px] text-primary font-semibold underline">View Profile &rarr;</span>
                          </div>
                        </div>
                      </button>

                      {/* Active Session Limit Widget */}
                      <div className="p-3 mx-2 my-2 rounded-xl bg-[#FAF6EC] border border-[#EAE3D2] space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#845E18]" />
                            <span>Session Limit (30 Mins)</span>
                          </div>
                          <span className="font-mono text-primary bg-white px-2 py-0.5 rounded-md border border-[#DFD8BF] text-[10px]">
                            {formattedCountdown}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#DFD8BF]">
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

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[10px] text-on-surface-variant">Auto-logout on timeout</span>
                          <button
                            type="button"
                            onClick={() => {
                              sessionInfo?.onExtendSession?.();
                            }}
                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#DFD8BF] shadow-2xs hover:bg-[#FAF7F0]"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Extend (+30m)</span>
                          </button>
                        </div>
                      </div>

                      {/* Navigation Actions */}
                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveTab('account');
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-[#FAF6EC] flex items-center gap-2.5 font-medium transition-colors ${
                            activeTab === 'account' ? 'text-primary font-bold bg-[#FAF6EC]' : 'text-on-surface'
                          }`}
                        >
                          <User className="w-4 h-4 text-primary" />
                          <div>
                            <span className="block font-bold">My Patron Profile</span>
                            <span className="text-[10px] text-on-surface-variant block">View badges, taste profile & addresses</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('tracking');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#FAF6EC] flex items-center gap-2.5 font-medium text-on-surface transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                          <div>
                            <span className="block font-bold">Live Order Tracking</span>
                            <span className="text-[10px] text-on-surface-variant block">Real-time oven baking & courier status</span>
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-[#F2EEDB] my-1" />

                      {/* Switch to Other User */}
                      <button
                        onClick={() => {
                          onSwitchUser?.();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF6EC] flex items-center gap-2.5 font-medium text-on-surface transition-colors"
                      >
                        <Users className="w-4 h-4 text-[#556633]" />
                        <div>
                          <span className="block font-bold">Switch to Other User</span>
                          <span className="text-[10px] text-on-surface-variant block">Sign in as another account or patron</span>
                        </div>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <div>
                          <span className="block font-bold">Sign Out &amp; Logout</span>
                          <span className="text-[10px] text-red-500 block">Close current session and lock store</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#DFD8BF] hover:border-primary/40 text-xs font-semibold text-primary transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Quick Header Switch User & Logout Icons for Desktop */}
            {user && (
              <div className="hidden lg:flex items-center gap-1 pl-1 border-l border-[#DFD8BF]">
                <button
                  onClick={onSwitchUser}
                  className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-[#FAF6EC] transition-colors"
                  title="Switch to Other User"
                >
                  <Users className="w-4 h-4 text-[#556633]" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign Out & Logout"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative flex items-center gap-2 bg-primary hover:bg-[#344218] text-white px-3 sm:px-4 py-2 rounded-full font-semibold text-xs tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Basket</span>
              <span className="bg-[#D5EBA8] text-[#141F00] font-bold text-[11px] px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
              {cartTotal > 0 && (
                <span className="hidden md:inline text-white/80 font-normal pl-1 border-l border-white/20">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>

            {/* Mobile & Tablet Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 border border-[#DFD8BF] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-[#DFD8BF] mt-3 flex flex-col gap-2 relative z-20 animation-fade-in">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              const MobileIcon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-between ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:bg-[#EFEAD7]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {MobileIcon && <MobileIcon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {user && (
              <div className="pt-2 border-t border-[#DFD8BF] space-y-2">
                <button
                  onClick={() => {
                    onSwitchUser?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide bg-[#FAF6EC] text-[#556633] flex items-center gap-2 border border-[#EAE3D2]"
                >
                  <Users className="w-4 h-4 text-[#556633]" />
                  <span>Switch to Other User</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide bg-red-50 text-red-600 flex items-center gap-2 border border-red-200"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out &amp; Logout</span>
                </button>

                <div className="flex items-center justify-between px-2 pt-1 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1 font-semibold text-[#556633]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Session: {formattedCountdown} left</span>
                  </span>
                  <button
                    onClick={() => {
                      sessionInfo?.onExtendSession?.();
                    }}
                    className="text-primary font-bold hover:underline text-[11px]"
                  >
                    Extend (+30m)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
