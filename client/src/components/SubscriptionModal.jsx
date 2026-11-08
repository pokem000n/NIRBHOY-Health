import React, { useState } from 'react';
import { X, Sparkles, Check, Crown, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function SubscriptionModal({ open, onClose, onPaymentRequired }) {
  const { lang } = useLanguage();
  const { updateSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' or 'yearly'
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const plans = {
    monthly: {
      name: "Monthly Family Pass",
      price: 499,
      period: "per month",
      savings: null
    },
    yearly: {
      name: "Yearly Platinum Pass",
      price: 4999,
      period: "per year",
      savings: "Save ৳1,000 (2 Months Free!)"
    }
  };

  const perks = [
    "Unlimited video consultations with General Physicians",
    "VIP Priority Ambulance dispatch with zero wait queuing",
    "Free medicine delivery across Dhaka metropolitan area",
    "15% flat discount on diagnostic tests and hospital partner labs",
    "Family Health Records vault for up to 5 members",
    "Dedicated 24/7 Personal Health Manager on WhatsApp"
  ];

  const handleSubscribe = async () => {
    const planDetails = plans[selectedPlan];
    onPaymentRequired({
      amount: planDetails.price,
      purpose: 'subscription',
      referenceId: `sub_${Date.now()}`,
      description: `NIRBHOY Health ${planDetails.name}`,
      metadata: { plan: selectedPlan }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-200 fill-yellow-200" />
            <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded text-white">
              NIRBHOY CARE+
            </span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {lang === 'bn' ? 'নির্ভয় প্রিমিয়াম হেলথ পাস' : 'NIRBHOY Premium Health Pass'}
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Unlimited family healthcare access and maximum emergency protection
          </p>
        </div>

        {/* Plan Switcher */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all text-center ${
                selectedPlan === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md shadow-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="block font-black text-base">৳499</span>
              <span className="text-[11px] font-normal text-gray-500">Monthly Billing</span>
            </button>

            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`relative py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all text-center ${
                selectedPlan === 'yearly'
                  ? 'bg-white text-gray-900 shadow-md shadow-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="absolute -top-2 right-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                Save ৳1000
              </span>
              <span className="block font-black text-base text-amber-600">৳4,999</span>
              <span className="text-[11px] font-normal text-gray-500">Yearly Best Value</span>
            </button>
          </div>

          {/* Perks list */}
          <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600 fill-amber-600" />
              <span>What You Get with NIRBHOY Premium:</span>
            </h4>
            <div className="space-y-2.5">
              {perks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <div className="h-4 w-4 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribe CTA */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Crown className="h-5 w-5 fill-white text-white" />
            <span>Upgrade to Premium (৳{plans[selectedPlan].price})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
