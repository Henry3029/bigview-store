'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { calculateDiscount } from '@/lib/pricing';
import { CheckCircle, ShoppingBag, X } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import CustomerLogin from '@/components/CustomerLogin';
import BottomAlert from '@/components/BottomAlert';
import { Item } from '@/types';

interface StorefrontProps {
  searchQuery?: string;
}

export default function Storefront({ searchQuery = '' }: StorefrontProps) {
  const {
    store,
    items,
    cart,
    addToCart,
    placeOrder,
    customerAccount,
    loginCustomer,
  } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCustomerAuthModal, setShowCustomerAuthModal] = useState(false);
  const [lastOrderPin, setLastOrderPin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'building-materials' | 'household-tools'
  >('building-materials');

  // Modern Bottom Alert Sheet State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const currentCustomer = customerAccount
    ? {
        name: customerAccount.name || customerAccount.email,
        email: customerAccount.email,
        phone: customerAccount.phone,
      }
    : null;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter items based on active tab category and search query
  const filteredItems = items.filter((item) => {
    const categoryText = (item.category || '').toLowerCase();
    const matchesTab =
      activeTab === 'building-materials'
        ? categoryText.includes('building') || categoryText.includes('material')
        : categoryText.includes('tool') || categoryText.includes('household');

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery === '' ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      categoryText.includes(normalizedQuery);

    return matchesTab && matchesSearch;
  });

  const handleCheckout = async (phone: string) => {
    if (!currentCustomer) {
      setIsCartOpen(false);
      setShowCustomerAuthModal(true);
      return;
    }

    try {
      const order = await placeOrder(currentCustomer.name, phone);
      setLastOrderPin(order.verificationPin);
      setIsCartOpen(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setAlertConfig({
        isOpen: true,
        title: 'Checkout Failed',
        message: 'Could not place your order. Please try again.',
        type: 'error',
      });
    }
  };

  const handleCustomerLogin = async (email: string, pass: string) => {
    const success = await loginCustomer(email, pass);
    if (success) {
      setShowCustomerAuthModal(false);
      setIsCartOpen(true);
    }
    return success;
  };

  const getItemId = (item: Item, index: number) =>
    item.id || item._id || `store-item-${index}`;

  return (
    <div className="min-h-screen pb-24">
      {/* Store Banner */}
      <div className="relative h-36 sm:h-48 w-full bg-skin-card border-b border-skin-base overflow-hidden">
        <img
          src={
            store.bannerUrl ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
          }
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Profile Box & Store Name inside Banner */}
        <div className="absolute bottom-3 left-4 sm:left-8 flex items-center gap-3 sm:gap-4">
          <img
            src={
              store.profileUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt="Store Owner"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white object-cover shadow-2xl bg-skin-card"
          />
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-black drop-shadow-md tracking-tight">
              {store.name}
            </h1>
            <p className="text-xs text-gray-200 font-medium">
              Official Vendor Store
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-skin-base/20 px-4 mt-4">
        <button
          type="button"
          onClick={() => setActiveTab('building-materials')}
          className={`pb-2.5 text-sm sm:text-base font-bold transition-all relative ${
            activeTab === 'building-materials'
              ? 'text-black font-black'
              : 'text-skin-muted hover:text-skin-base'
          }`}
        >
          Building Materials
          {activeTab === 'building-materials' && (
            <span className="absolute bottom-0 left-0 w-full h-[4px] bg-black rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('household-tools')}
          className={`pb-2.5 text-sm sm:text-base font-bold transition-all relative ${
            activeTab === 'household-tools'
              ? 'text-black font-black'
              : 'text-skin-muted hover:text-skin-base'
          }`}
        >
          Household Tools
          {activeTab === 'household-tools' && (
            <span className="absolute bottom-0 left-0 w-full h-[4px] bg-black rounded-full" />
          )}
        </button>
      </div>

      {/* Dynamic Content Description */}
      <div className="px-4 py-2">
        {activeTab === 'building-materials' ? (
          <div className="animate-in fade-in duration-200">
            <h3 className="font-bold text-lg text-skin-base mb-1">
              Building Materials Catalog
            </h3>
            <p className="text-xs text-skin-muted">
              Explore cement, iron rods, roofing sheets, and heavy-duty
              construction supplies here.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            <h3 className="font-bold text-lg text-skin-base mb-1">
              Household Tools Catalog
            </h3>
            <p className="text-xs text-skin-muted">
              Explore hammers, drills, screwdrivers, and everyday home
              maintenance tools here.
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        {/* Success Modal for Last Order PIN */}
        {lastOrderPin && (
          <div className="bg-green-500/10 border border-green-500 text-green-700 dark:text-green-300 p-6 rounded-2xl mb-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <h3 className="text-lg font-bold">Order Placed Successfully!</h3>
            <p className="text-sm mb-3">
              Your payment was processed through the app. Show this 6-digit
              Verification PIN to collect your items:
            </p>
            <div className="text-3xl font-mono font-black tracking-widest bg-skin-card py-3 px-6 rounded-xl inline-block border border-green-500/30">
              {lastOrderPin}
            </div>
            <button
              type="button"
              onClick={() => setLastOrderPin(null)}
              className="block mx-auto mt-4 text-xs underline text-skin-muted hover:text-skin-base"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Item Grid */}
        <h2 className="text-xl font-bold mb-4">
          Available Items ({filteredItems.length})
        </h2>
        {filteredItems.length === 0 ? (
          <p className="text-skin-muted text-center py-12">
            No items found matching your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
              const pricing = calculateDiscount(item.price);
              const discountAmt =
                pricing.discountAmount ??
                Math.max(0, pricing.originalPrice - pricing.finalPrice);

              return (
                <div
                  key={getItemId(item, index)}
                  className="bg-skin-card border border-skin-base rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-base mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="mt-auto pt-2 flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-brand-yellow">
                        ₦{pricing.finalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm line-through text-skin-muted">
                        ₦{pricing.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded font-bold ml-auto">
                        -₦{discountAmt.toLocaleString()} app discount
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item);
                        setAlertConfig({
                          isOpen: true,
                          title: 'Added to Cart',
                          message: `${item.name} was added to your cart.`,
                          type: 'success',
                        });
                      }}
                      className="w-full bg-brand-yellow text-black font-bold py-2.5 rounded-xl hover:opacity-90 transition active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Trigger */}
      {cartItemCount > 0 && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-brand-yellow text-black font-extrabold px-5 py-3.5 rounded-full shadow-2xl hover:opacity-95 transition active:scale-95"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>View Cart ({cartItemCount})</span>
        </button>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currentCustomer={currentCustomer}
        onCheckout={handleCheckout}
        onRequireAuth={() => {
          setIsCartOpen(false);
          setShowCustomerAuthModal(true);
        }}
      />

      {/* Customer Sign-In Modal */}
      {showCustomerAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative">
            <button
              type="button"
              onClick={() => setShowCustomerAuthModal(false)}
              className="fixed top-4 right-4 z-50 bg-skin-card border border-skin-base p-2 rounded-full shadow-lg"
              aria-label="Close customer sign-in modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-w-lg bg-skin-base rounded-3xl overflow-hidden shadow-2xl">
              <CustomerLogin
                onClose={() => setShowCustomerAuthModal(false)}
                onLogin={handleCustomerLogin}
                setShowTroubleModal={() => {
                  setAlertConfig({
                    isOpen: true,
                    title: 'Password Help',
                    message:
                      'Please contact store support or register a new customer account.',
                    type: 'info',
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Native Bottom Alert Sheet */}
      <BottomAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((p) => ({ ...p, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}
