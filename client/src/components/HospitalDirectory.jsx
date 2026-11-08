import React, { useState, useEffect } from 'react';
import { Building2, Phone, MapPin, Search, Bed, Activity, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function HospitalDirectory() {
  const { lang, t } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHospitals();
  }, [searchQuery]);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getHospitals('', searchQuery);
      setHospitals(data);
    } catch (err) {
      console.error("Error loading hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hospitals" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-purple-700 font-bold text-xs uppercase tracking-wider bg-purple-100/70 px-3 py-1 rounded-full">
              {lang === 'bn' ? '২৪ ঘণ্টা জরুরি সেবা ও আইসিইউ বেড নেটওয়ার্ক' : 'Emergency Hospital & ICU Bed Network'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
              {t('hospitalsTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              {t('hospitalsSubtitle')}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'হাসপাতাল বা এলাকার নাম খুঁজুন...' : 'Search hospital or area...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* Hospital Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-gray-50 rounded-3xl p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-purple-300 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                      {hosp.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      24/7 Open
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-lg mb-1 group-hover:text-purple-700 transition-colors">
                    {hosp.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{hosp.area}</span>
                  </div>

                  {/* Bed Stats Counters */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3 text-center">
                      <span className="text-xs text-purple-700 font-bold block">{t('icuBeds')}</span>
                      <span className="text-2xl font-black text-purple-900">{hosp.icuBedsAvailable}</span>
                    </div>

                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-center">
                      <span className="text-xs text-blue-700 font-bold block">{t('generalBeds')}</span>
                      <span className="text-2xl font-black text-blue-900">{hosp.generalBedsAvailable}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Call Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 block">Emergency Helpline</span>
                    <span className="text-sm font-bold text-gray-900">{hosp.emergencyHotline}</span>
                  </div>

                  <a
                    href={`tel:${hosp.emergencyHotline}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{t('callEmergency')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
