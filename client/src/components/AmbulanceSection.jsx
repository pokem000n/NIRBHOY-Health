import React, { useState, useEffect } from 'react';
import { Ambulance, Check, MapPin, Phone, Shield, Radio, Navigation, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function AmbulanceSection({ onBookAmbulanceClick }) {
  const { lang, t } = useLanguage();
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        const data = await ApiService.getAmbulanceFleet();
        setFleet(data);
      } catch (err) {
        console.error("Error loading fleet:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFleet();
  }, []);

  return (
    <section id="ambulance" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider bg-orange-100/70 px-3 py-1 rounded-full">
              <Radio className="h-3.5 w-3.5 animate-pulse text-red-600" />
              <span>{lang === 'bn' ? '২৪/৭ জিপিএস লাইভ ট্র্যাকিং বহর' : '24/7 Rapid Response Network'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
              {t('ambulanceTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              {t('ambulanceSubtitle')}
            </p>
          </div>

          <button
            onClick={() => onBookAmbulanceClick()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Ambulance className="h-5 w-5" />
            <span>{t('bookAmbulanceBtn')}</span>
          </button>
        </div>

        {/* Fleet Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleet.map((amb) => {
            const isICU = amb.type.includes('ICU');
            return (
              <div
                key={amb.id}
                className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative ${
                  isICU
                    ? 'border-red-300 bg-gradient-to-b from-red-50/50 via-white to-red-50/30 shadow-lg shadow-red-500/5 ring-1 ring-red-200'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg'
                }`}
              >
                {isICU && (
                  <span className="absolute -top-3 left-6 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Critical Life Support
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                      isICU ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Ambulance className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Available
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-lg mb-1">{amb.type}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{amb.currentLocation}</span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-2xl p-3.5 mb-5 border border-gray-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-gray-500">Base Fare:</span>
                      <span className="text-xl font-black text-gray-900">৳{amb.baseFee}</span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-gray-500 mt-1">
                      <span>Per KM:</span>
                      <span className="font-bold text-gray-700">+৳{amb.perKmFee}/km</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Features Included:</p>
                    {amb.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onBookAmbulanceClick(amb.type)}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                    isICU
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  <Navigation className="h-4 w-4" />
                  <span>{lang === 'bn' ? 'এই অ্যাম্বুলেন্স বুক করুন' : 'Dispatch Now'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
