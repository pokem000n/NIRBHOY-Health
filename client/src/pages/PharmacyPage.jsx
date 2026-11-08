import React, { useState, useEffect } from 'react';
import { Pill, Search, ShoppingBag, Plus, Minus, UploadCloud, CheckCircle2, ShieldCheck, ChevronRight, Building2, Star, ArrowRight, X } from 'lucide-react';
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

export default function PharmacyPage({ onUploadPrescriptionClick, onCheckoutClick }) {
  const { lang, t } = useLanguage();
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedPharmacyId, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [meds, pharmaList] = await Promise.all([
        ApiService.getMedicines(selectedCategory, searchQuery, selectedPharmacyId),
        ApiService.getPharmacies()
      ]);
      setMedicines(meds);
      setPharmacies(pharmaList);
    } catch (err) {
      console.error(err);
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
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-teal-700 font-semibold">E-Pharmacy & Verified Retail Chains</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-teal-800 font-semibold text-xs uppercase tracking-wider bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                100% Genuine Medicine • Cold-Chain Guaranteed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {lang === 'bn' ? 'বিশ্বস্ত ফার্মেসি ও ওষুধ হোম ডেলিভারি' : 'Verified Pharmacy Network & Medicine Delivery'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'bn'
                  ? 'লাজ ফার্মা ও শীর্ষ হাসপাতালের নিজস্ব ড্রাগ ডিসপেনসারি থেকে আসল ওষুধ সংগ্রহ করে ৪৫ মিনিটে পৌঁছে দিচ্ছি আপনার ঠিকানায়।'
                  : 'Eliminating counterfeit drug risks. Order exclusively from licensed model pharmacies like Lazz Pharma, Tamanna, and hospital in-house dispensaries.'}
              </p>
            </div>

            <button
              onClick={onUploadPrescriptionClick}
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 self-start lg:self-auto"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Doctor Prescription</span>
            </button>
          </div>
        </div>

        {/* Renowned Pharmacy Badges Grid (Trust Builder) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Verified Partner Pharmacies (DGDA Licensed)</span>
            </h3>
            <span className="text-xs text-slate-500">Filter by preferred pharmacy</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              onClick={() => setSelectedPharmacyId('')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedPharmacyId === ''
                  ? 'border-teal-600 bg-white ring-1 ring-teal-600 font-semibold shadow-xs'
                  : 'border-navy-100 bg-white hover:bg-navy-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  ALL
                </div>
                <div>
                  <h4 className="font-bold text-navy-950 text-xs">All Certified Pharmacies</h4>
                  <p className="text-[10px] text-slate-400">Broadest stock availability</p>
                </div>
              </div>
            </div>

            {pharmacies.map((pharma) => {
              const isSelected = selectedPharmacyId === pharma.id;
              return (
                <div
                  key={pharma.id}
                  onClick={() => setSelectedPharmacyId(pharma.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-white ring-1 ring-teal-600 shadow-xs'
                      : 'border-navy-100 bg-white hover:bg-navy-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <img src={pharma.logo} alt={pharma.name} className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded border border-teal-200">
                          DGDA Verified
                        </span>
                      </div>
                      <h4 className="font-bold text-navy-950 text-xs mt-0.5 truncate">{pharma.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{pharma.area}</p>
                      <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
                        ~{pharma.deliveryTimeMinutes} mins delivery
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Bar & Category Tabs */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-navy-100 shadow-xs mb-8 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by brand name (Napa, Sergel, Monas) or generic (Paracetamol, Montelukast)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy-950 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center flex-shrink-0"
              title="View Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pulse-electric text-white font-black text-[9px] h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-navy-50/70 hover:bg-navy-100 text-navy-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Catalog Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(n => <div key={n} className="bg-white rounded-2xl p-5 h-64 animate-pulse border border-navy-100"></div>)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl border border-navy-100 hover:border-teal-400 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-50 h-32 flex items-center justify-center border border-slate-100">
                    <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {/* Wired Accent for Rx Requirement */}
                    {med.prescriptionRequired && (
                      <span className="absolute top-2 left-2 bg-pulse-electric text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                        Rx Required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60">
                      {med.dosageForm}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={med.pharmacyName}>
                      From: {med.pharmacyName?.split(' ')[0]}
                    </span>
                  </div>

                  <h4 className="font-bold text-navy-950 text-sm mt-1 truncate group-hover:text-teal-700 transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{med.generic}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{med.manufacturer}</p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{med.unit}</span>
                    <span className="text-base font-bold text-navy-950">৳{med.pricePerStrip}</span>
                  </div>

                  <button
                    onClick={() => addToCart(med)}
                    className="p-2 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col justify-between">
            <div className="p-4 border-b border-navy-900 flex items-center justify-between bg-navy-950 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-teal-400" />
                <h3 className="font-bold text-sm">Your Medicine Cart</h3>
                <span className="bg-navy-800 text-teal-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-navy-700">
                  {cart.length}
                </span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-navy-950 text-xs truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.unit}</p>
                    <span className="text-xs font-bold text-teal-700">৳{item.pricePerStrip}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded border border-slate-200 hover:bg-slate-50">
                      <Minus className="h-3 w-3 text-slate-600" />
                    </button>
                    <span className="text-xs font-semibold text-slate-800 w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded border border-slate-200 hover:bg-slate-50">
                      <Plus className="h-3 w-3 text-slate-600" />
                    </button>
                  </div>

                  <span className="font-bold text-xs text-navy-950 min-w-[50px] text-right">
                    ৳{item.pricePerStrip * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-navy-50/50 border-t border-navy-100 space-y-3">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-navy-950">৳{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Cold-Chain Delivery:</span>
                  <span className="font-semibold text-navy-950">৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-navy-950 pt-2 border-t border-navy-100">
                  <span>Grand Total:</span>
                  <span className="text-teal-700 font-extrabold">৳{grandTotal}</span>
                </div>
              </div>

              {/* Wired Accent Checkout Button */}
              <button
                onClick={() => {
                  setCartOpen(false);
                  onCheckoutClick({ items: cart, totalAmount: grandTotal });
                }}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Checkout (৳{grandTotal})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
