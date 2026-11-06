'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { calculateDiscount } from '@/lib/pricing';
import { CheckCircle } from 'lucide-react';
import CustomerAuthModal from '@/components/CustomerAuthScreen';
import CartDrawer from '@/components/CartDrawer';
import BottomAlert from '@/components/BottomAlert';

interface StorefrontProps {
  searchQuery?: string;
}

export default function Storefront({ searchQuery = '' }: StorefrontProps) {
  const { store, items, cart, addToCart, placeOrder } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCustomerAuthModal, setShowCustomerAuthModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [lastOrderPin, setLastOrderPin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'building-materials' | 'household-tools'>('building-materials');

  // Modern Bottom Alert Sheet State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Filter items based on active tab category and search query
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'building-materials' 
      ? item.category.toLowerCase().includes('building') || item.category.toLowerCase().includes('material')
      : item.category.toLowerCase().includes('tool') || item.category.toLowerCase().includes('household');

    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleCheckout = async (phone: string) => {
    const order = await placeOrder(currentCustomer!.name, phone);
    setLastOrderPin(order.verificationPin);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Store Banner */}
      <div className="relative h-36 sm:h-48 w-full bg-skin-card border-b border-skin-base overflow-hidden">
        <img 
          src={store.bannerUrl} 
          alt={store.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Profile Box & Store Name inside Banner */}
        <div className="absolute bottom-3 left-4 sm:left-8 flex items-center gap-3 sm:gap-4">
          <img 
            src={store.profileUrl} 
            alt="Store Owner" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white object-cover shadow-2xl bg-skin-card"
          />
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-black drop-shadow-md tracking-tight">{store.name}</h1>
            <p className="text-xs text-gray-200 font-medium">Official Vendor Store</p>
          </div>
        </div>
      </div>
      
      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-skin-base/20 px-4">
        <button
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
            <h3 className="font-bold text-lg text-skin-base mb-2">Building Materials Catalog</h3>
            <p className="text-xs text-skin-muted">Explore cement, iron rods, roofing sheets, and heavy-duty construction supplies here.</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            <h3 className="font-bold text-lg text-skin-base mb-2">Household Tools Catalog</h3>
            <p className="text-xs text-skin-muted">Explore hammers, drills, screwdrivers, and everyday home maintenance tools here.</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-6">

        {/* Success Modal for Last Order PIN */}
        {lastOrderPin && (
          <div className="bg-green-500/10 border border-green-500 text-green-700 dark:text-green-300 p-6 rounded-2xl mb-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <h3 className="text-lg font-bold">Order Placed Successfully!</h3>
            <p className="text-sm mb-3">Your payment was processed through the app. Show this 6-digit Verification PIN to collect your items:</p>
            <div className="text-3xl font-mono font-black tracking-widest bg-skin-card py-3 px-6 rounded-xl inline-block border border-green-500/30">
              {lastOrderPin}
            </div>
            <button 
              onClick={() => setLastOrderPin(null)} 
              className="block mx-auto mt-4 text-xs underline text-skin-muted hover:text-skin-base"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Item Grid */}
        <h2 className="text-xl font-bold mb-4">Available Items ({filteredItems.length})</h2>
        {filteredItems.length === 0 ? (
          <p className="text-skin-muted text-center py-12">No items found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => {
              const pricing = calculateDiscount(item.price);
              return (
                <div key={item.id} className="bg-skin-card border border-skin-base rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
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
                    <h3 className="font-bold text-base mb-2 line-clamp-1">{item.name}</h3>
                    
                    <div className="mt-auto pt-2 flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-brand-yellow">
                        ₦{pricing.finalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm line-through text-skin-muted">
                        ₦{pricing.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded font-bold ml-auto">
                        -₦{pricing.discountAmount} app discount
                      </span>
                    </div>

                    <button 
                      onClick={() => addToCart(item)}
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

      {/* Customer Authentication Modal */}
      <CustomerAuthModal 
        isOpen={showCustomerAuthModal}
        onClose={() => setShowCustomerAuthModal(false)}
        onSuccess={(userData) => {
          setCurrentCustomer(userData);
          setShowCustomerAuthModal(false);
          setIsCartOpen(true);
          setAlertConfig({
            isOpen: true,
            title: 'Welcome Back!',
            message: `Signed in as ${userData.name}. You can now complete your checkout.`,
            type: 'success'
          });
        }}
      />

      {/* Native Bottom Alert Sheet */}
      <BottomAlert 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(p => ({ ...p, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}

          
