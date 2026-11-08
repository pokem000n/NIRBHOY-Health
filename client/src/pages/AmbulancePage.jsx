import React, { useState, useEffect } from 'react';
import { Ambulance, Check, MapPin, Phone, Shield, Radio, Navigation, Clock, Building2, User, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function AmbulancePage({ onBookAmbulance }) {
  const { lang, t } = useLanguage();
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownershipFilter, setOwnershipFilter] = useState('all'); // 'all', 'hospital', 'individual'
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadFleet();
  }, [ownershipFilter, typeFilter]);

  const loadFleet = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAmbulanceFleet(ownershipFilter);
      let filtered = data;
      if (typeFilter !== 'all') {
        filtered = filtered.filter(a => a.type.toLowerCase().includes(typeFilter.toLowerCase()));
      }
      setFleet(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-pulse-electric font-semibold">24/7 Rapid Ambulance Network</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-pulse-electric font-semibold text-xs uppercase tracking-wider bg-pulse-50 border border-pulse-200 px-2.5 py-0.5 rounded-full">
                <Radio className="h-3 w-3 animate-pulse text-pulse-electric" />
                <span>Hospital Fleets & Certified Private Operators</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {lang === 'bn' ? 'জরুরি অ্যাম্বুলেন্স বহর ও লাইভ জিপিএস ট্র্যাকিং' : 'Emergency Ambulance Fleet & GPS Tracking'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'bn'
                  ? 'শীর্ষস্থানীয় হাসপাতালের নিজস্ব আইসিইউ ভেন্টিলেটর অ্যাম্বুলেন্স এবং ভেরিফাইড প্রাইভেট ড্রাইভারদের থেকে মুহূর্তেই অ্যাম্বুলেন্স বুক করুন।'
                  : 'Book specialized ICU life-support ambulances from renowned hospitals or fast private operators with guaranteed 8-12 minute response.'}
              </p>
            </div>

            {/* Wired Accent Emergency CTA */}
            <button
              onClick={() => onBookAmbulance('ICU Ambulance (Life Support)')}
              className="px-5 py-3 rounded-xl bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs sm:text-sm shadow-sm shadow-pulse-electric/25 transition-all flex items-center gap-2 self-start lg:self-auto animate-wired-pulse"
            >
              <Ambulance className="h-4 w-4" />
              <span>Instant Emergency Dispatch</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-navy-100 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
          {/* Ownership Filter */}
          <div className="flex items-center p-1 bg-navy-50/70 rounded-xl">
            <button
              onClick={() => setOwnershipFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                ownershipFilter === 'all' ? 'bg-navy-950 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              All Fleets
            </button>
            <button
              onClick={() => setOwnershipFilter('hospital')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                ownershipFilter === 'hospital' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Hospital Owned Fleets</span>
            </button>
            <button
              onClick={() => setOwnershipFilter('individual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                ownershipFilter === 'individual' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Private Operators</span>
            </button>
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['all', 'ICU', 'AC', 'Non-AC', 'Freezing'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  typeFilter === t
                    ? 'bg-navy-950 text-white border-navy-950 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="bg-white rounded-2xl p-5 h-72 animate-pulse border border-navy-100"></div>)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {fleet.map((amb) => {
              const isHospital = amb.ownershipType === 'hospital';
              const isICU = amb.type.includes('ICU');
              return (
                <div
                  key={amb.id}
                  className="bg-white rounded-2xl border border-navy-100 hover:border-pulse-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      {isHospital ? (
                        <span className="text-[10px] font-semibold uppercase text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> Hospital Fleet
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase text-navy-800 bg-navy-50 border border-navy-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <User className="h-3 w-3" /> Private Operator
                        </span>
                      )}

                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span> Available
                      </span>
                    </div>

                    <h3 className="font-bold text-navy-950 text-base mb-0.5">{amb.type}</h3>
                    <p className="text-xs font-semibold text-teal-600">{amb.hospitalName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{amb.vehicleNumber} • Station: {amb.currentLocation}</p>

                    {/* Fare card */}
                    <div className="mt-3.5 bg-navy-50/50 rounded-xl p-3 border border-navy-100 flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">Base Booking Fee</span>
                        <span className="text-lg font-bold text-navy-950">৳{amb.baseFee}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] font-medium">Per KM Fare</span>
                        <span className="font-semibold text-teal-700">+৳{amb.perKmFee}/km</span>
                      </div>
                    </div>

                    {/* Equipment features */}
                    <div className="mt-3.5 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Life-Support Features:</p>
                      {amb.features?.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-xs text-slate-600 font-normal">
                          <Check className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                    <a
                      href={`tel:${amb.driverPhone}`}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Direct Driver Call"
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    {/* Wired Accent Dispatch CTA */}
                    <button
                      onClick={() => onBookAmbulance(amb.type, amb.hospitalId)}
                      className="flex-1 py-2.5 rounded-xl bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Book & Dispatch</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
