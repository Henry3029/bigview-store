'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Menu, User, ShoppingBag, Store } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import UserProfileModal from './UserProfileModal';
import CartDrawer from './CartDrawer';
import BottomAlert from './BottomAlert';

interface HeaderProps {
  onBack?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  onBack,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const {
    cart,
    ownerAccount,
    customerAccount,
    isOwner,
    isCustomer,
    items,
    placeOrder,
  } = useStore();

  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  // Body scroll lock effect across overlays
  useEffect(() => {
    if (
      mobileMenuOpen ||
      isProfileModalOpen ||
      isSearchOpen ||
      isCartDrawerOpen
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    mobileMenuOpen,
    isProfileModalOpen,
    isSearchOpen,
    isCartDrawerOpen,
  ]);

  const currentCustomer =
    isCustomer && customerAccount
      ? {
          name: customerAccount.name || customerAccount.email,
          email: customerAccount.email,
          phone: customerAccount.phone,
        }
      : null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeEmail = isOwner
    ? ownerAccount?.email
    : isCustomer
    ? customerAccount?.email
    : null;
  const userInitial = activeEmail ? activeEmail.charAt(0).toUpperCase() : null;

  const searchResults = searchQuery.trim()
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const handleCheckout = async (phone: string) => {
    if (!currentCustomer) {
      setIsCartDrawerOpen(false);
      router.push('/login/customer');
      return;
    }

    try {
      const order = await placeOrder(currentCustomer.name, phone);
      setIsCartDrawerOpen(false);
      setAlertConfig({
        isOpen: true,
        title: 'Order Placed!',
        message: `Your 6-digit pickup verification PIN is ${order.verificationPin}.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Header checkout error:', err);
      setAlertConfig({
        isOpen: true,
        title: 'Checkout Failed',
        message: 'Could not complete your order. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-skin-card border-b border-skin-base/30 py-1 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* LEFT: Back Icon + Clickable BIGVIEW Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsProfileModalOpen(false);
                setIsSearchOpen(false);
                setIsCartDrawerOpen(false);
                if (onBack) {
                  onBack();
                } else if (window.history.length > 1) {
                  window.history.back();
                }
              }}
              className="p-1.5 rounded-full hover:bg-stone-500/20 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsProfileModalOpen(false);
                setIsSearchOpen(false);
                setIsCartDrawerOpen(false);
                setSearchQuery('');
              }}
              className="font-black text-base sm:text-lg tracking-wider text-[#D4AF37] hover:bg-stone-500/20 drop-shadow-sm select-none hover:opacity-90 text-left"
            >
              BIGVIEW
            </button>
          </div>

          {/* MIDDLE: Sleek Opacity Search Bar */}
          <div className="flex-1 max-w-md mx-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-skin-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setIsProfileModalOpen(false);
                  setMobileMenuOpen(false);
                  setIsCartDrawerOpen(false);
                }}
                placeholder="Search items..."
                className="w-full bg-stone-500/20 rounded-full pl-9 pr-3 py-1 text-xs sm:text-sm text-skin-base placeholder:text-skin-muted/70 focus:outline-none hover:bg-stone-500/30 cursor-pointer sm:cursor-text"
              />
            </div>
          </div>

          {isSearchOpen && (
            <div className="fixed inset-0 z-50 bg-skin-base flex flex-col p-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-skin-base">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 absolute left-3 text-skin-muted" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsSearchOpen(false);
                    }}
                    placeholder="Search items..."
                    className="w-full bg-skin-card border-2 border-[#48BB78] rounded-full pl-10 pr-4 py-2 text-sm text-skin-base focus:outline-none shadow-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="font-bold text-sm px-3 py-2 text-skin-muted hover:text-skin-base"
                >
                  {searchQuery.trim() ? 'Done' : 'Cancel'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <p className="text-xs text-skin-muted font-bold uppercase tracking-wider mb-3">
                  {searchQuery.trim()
                    ? `Matching Items (${searchResults.length})`
                    : 'Type to search'}
                </p>

                {searchQuery.trim() && (
                  <div className="space-y-2">
                    {searchResults.length === 0 ? (
                      <p className="text-xs text-skin-muted py-6 text-center">
                        No items match &ldquo;{searchQuery}&rdquo;.
                      </p>
                    ) : (
                      searchResults.map((item, idx) => (
                        <button
                          key={item.id || item._id || `search-${idx}`}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item.name);
                            setIsSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-skin-card border border-skin-base/40 hover:border-brand-yellow text-left transition"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-skin-base truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-skin-muted">
                              {item.category} • ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT: Mobile Menu, User Profile, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setIsProfileModalOpen(false);
                setIsSearchOpen(false);
                setIsCartDrawerOpen(false);
              }}
              className="md:hidden p-1.5 rounded-xl hover:bg-stone-500/20 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Icon Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
                setIsSearchOpen(false);
                setIsCartDrawerOpen(false);
              }}
              className="p-1 rounded-full hover:bg-stone-500/20 transition-transform active:scale-95"
              aria-label="Manage Account"
            >
              {userInitial ? (
                <div className="w-7 h-7 rounded-full bg-[#48BB78] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userInitial}
                </div>
              ) : (
                <div className="p-1.5 rounded-full hover:bg-skin-base/50 text-skin-muted hover:text-skin-base">
                  <User className="w-5 h-5" />
                </div>
              )}
            </button>

            {/* Cart Icon Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsCartDrawerOpen(true);
                setMobileMenuOpen(false);
                setIsProfileModalOpen(false);
                setIsSearchOpen(false);
              }}
              className="relative p-1.5 rounded-xl hover:bg-stone-500/20 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#48BB78] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP TOP NAVIGATION SUB-BAR */}
        <div className="hidden md:flex items-center justify-center gap-6 border-t border-skin-base/20 py-1.5 bg-skin-card/50 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#48BB78] text-white shadow-sm">
            <Store className="w-3.5 h-3.5" />
            Storefront
          </div>
        </div>
      </header>

      {/* MOBILE FULL-PAGE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[49px] bottom-0 bg-skin-card border-b border-skin-base/30 shadow-2xl z-40 md:hidden p-5 flex flex-col gap-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="py-2">
            <h3 className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-3 px-1">
              Shop By Categories
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {Array.from(new Set(items.map((item) => item.category))).map(
                (category, index) => {
                  const catItem = items.find(
                    (item) => item.category === category
                  );

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSearchQuery(category);
                        setMobileMenuOpen(false);
                      }}
                      className="bg-skin-base border border-skin-base/60 rounded-2xl p-2.5 flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group shadow-sm"
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-skin-card mb-2 shadow-inner relative">
                        <img
                          src={
                            catItem?.imageUrl ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'
                          }
                          alt={category}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <span className="font-bold text-xs text-skin-base truncate w-full">
                        {category}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Cart Drawer Integration */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        currentCustomer={currentCustomer}
        onCheckout={handleCheckout}
        onRequireAuth={() => {
          setIsCartDrawerOpen(false);
          router.push('/login/customer');
        }}
      />

      <BottomAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((p) => ({ ...p, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </>
  );
}
