import React, { useState, useEffect } from 'react';
import { Pill, Search, ShoppingBag, Plus, Minus, Trash2, UploadCloud, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

const categories = [
  'All',
  'Pain & Fever',
  'Gastric & Acidity',
  'Respiratory & Allergy',
  'Vitamins & Supplements',
  'Antibiotics'
];

export default function MedicinePharmacy({ onUploadPrescriptionClick, onCheckoutClick }) {
  const { lang, t } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    loadMedicines();
  }, [selectedCategory, searchQuery]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getMedicines(selectedCategory, searchQuery);
      setMedicines(data);
    } catch (err) {
      console.error("Error loading medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...med, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerStrip * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 60 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <section id="pharmacy" className="py-20 bg-gray-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upload Prescription Hero Banner */}
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="bg-white/20 text-white font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
              {lang === 'bn' ? 'প্রেসক্রিপশন দেখে ওষুধ নিন' : 'Fast Prescription Order'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              {lang === 'bn' ? 'প্রেসক্রিপশন আপলোড করলেই ওষুধ পৌঁছে যাবে আপনার দরজায়' : 'Have a Prescription? Just Upload & We Deliver'}
            </h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              {lang === 'bn'
                ? 'ডাক্তারের প্রেসক্রিপশনের ছবি তুলুন ও আপলোড দিন। আমাদের বিএমডিসি নিবন্ধিত ‘এ’ গ্রেড ফার্মাসিস্ট যাচাই করে ৪৫ মিনিটে পাঠাবেন।'
                : 'Take a photo of your prescription. Our certified A-Grade pharmacists will verify dosages and dispatch medicines right away.'}
            </p>
          </div>

          <div className="flex-shrink-0 z-10">
            <button
              onClick={onUploadPrescriptionClick}
              className="px-6 py-4 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <UploadCloud className="h-5 w-5 text-emerald-600" />
              <span>{t('uploadPrescriptionBtn')}</span>
            </button>
          </div>
        </div>

        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full">
              100% Genuine Medicine Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
              {t('pharmacyTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              {t('pharmacySubtitle')}
            </p>
          </div>

          {/* Search Box & Cart Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchMedicinesPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            {/* Cart Button with Badge */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
              title="View Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-black text-[10px] h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Medicine Product Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-gray-200 animate-pulse h-64"></div>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <p className="text-gray-500 font-semibold text-lg">
              {lang === 'bn' ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicines found'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-50 h-36 flex items-center justify-center">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {med.prescriptionRequired && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                        Rx Required
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {med.dosageForm}
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-base mt-1.5 truncate group-hover:text-emerald-700 transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium truncate">{med.generic}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{med.manufacturer}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">{med.unit}</span>
                    <span className="text-lg font-black text-gray-900">৳{med.pricePerStrip}</span>
                  </div>

                  <button
                    onClick={() => addToCart(med)}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 active:scale-95"
                    title="Add to cart"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('addToCart')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-out Medicine Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            {/* Cart Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h3 className="font-black text-lg">{t('cartTitle')}</h3>
                <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <Plus className="h-6 w-6 transform rotate-45" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-1 divide-y divide-gray-100">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-gray-600">
                    {lang === 'bn' ? 'আপনার কার্ট এখন খালি' : 'Your cart is empty'}
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                      <span className="text-xs font-black text-emerald-700">৳{item.pricePerStrip}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-gray-900 min-w-[50px] text-right">
                      ৳{item.pricePerStrip * item.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Medicines Subtotal:</span>
                    <span className="font-bold text-gray-900">৳{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Home Delivery (Dhaka):</span>
                    <span className="font-bold text-gray-900">৳{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-700">৳{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    onCheckoutClick({ items: cart, totalAmount: grandTotal });
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('checkoutBtn')} (৳{grandTotal})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
