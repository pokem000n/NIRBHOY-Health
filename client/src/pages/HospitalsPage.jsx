import React, { useState, useEffect } from 'react';
import { Building2, Phone, MapPin, Search, Bed, Activity, ShieldCheck, ChevronRight, Ticket, Droplet, Ambulance, Video, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function HospitalsPage({ onSelectHospitalDetail, onBookBed }) {
  const { lang, t } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(''); // '', '3', '5'

  useEffect(() => {
    loadHospitals();
  }, [searchQuery, distanceFilter]);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getHospitals('', searchQuery, distanceFilter);
      setHospitals(data);
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
            <span className="text-teal-700 font-semibold">Hospitals, Bed Booking & Centers</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-teal-800 font-semibold text-xs uppercase tracking-wider bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                Real-Time Bed Booking & Hospital Directory
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {lang === 'bn' ? 'নিকটস্থ হাসপাতাল ও লাইভ আইসিইউ বেড বুকিং' : 'Hospital Network & Instant Bed Reservation'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার অবস্থান থেকে হাসপাতাল কত দূরে জানুন, সরাসরি আইসিইউ/কেবিন বেড বুক করুন এবং ঐ হাসপাতালের ডাক্তার, অ্যাম্বুলেন্স ও ব্লাড ব্যাংক স্টক দেখুন।'
                  : 'Check live hospital distance, reserve verified ICU/cabin beds, and explore linked doctors, emergency ambulance stations, and blood inventories.'}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Distance Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-navy-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'হাসপাতালের নাম (যেমন: স্কয়ার, এভারকেয়ার, ডিএমসিএইচ) বা এলাকা দিয়ে খুঁজুন...' : 'Search hospital by name (Square, Evercare, DMCH) or area...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy-950 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Distance:</span>
            {[
              { id: '', label: 'All Dhaka' },
              { id: '3', label: '< 3 KM Nearby' },
              { id: '6', label: '< 6 KM Range' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDistanceFilter(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  distanceFilter === d.id
                    ? 'bg-navy-950 text-white border-navy-950 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Cards Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="bg-white rounded-2xl p-5 h-80 animate-pulse border border-navy-100"></div>)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl border border-navy-100 hover:border-teal-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top image & badges */}
                  <div className="relative mb-3.5 h-40 rounded-xl overflow-hidden bg-navy-950">
                    <img
                      src={hosp.image}
                      alt={hosp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent"></div>

                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-navy-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      📍 {hosp.distanceKm} km away
                    </span>

                    <span className="absolute top-2.5 right-2.5 bg-teal-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      ● 24/7 Open
                    </span>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <span className="text-[10px] font-medium text-teal-300 uppercase tracking-wider block">
                        {hosp.type?.split(' ')[0]} Healthcare
                      </span>
                      <h3 className="font-bold text-base text-white truncate">{hosp.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{hosp.area}</span>
                  </div>

                  {/* Bed Occupancy Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3.5">
                    <div className="bg-navy-50/50 rounded-xl p-2.5 border border-navy-100">
                      <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider block">ICU Beds</span>
                      <span className="text-lg font-bold text-navy-950">
                        {hosp.beds?.icu?.available || 6} <span className="text-xs font-normal text-slate-500">vacant</span>
                      </span>
                    </div>

                    <div className="bg-navy-50/50 rounded-xl p-2.5 border border-navy-100">
                      <span className="text-[10px] font-semibold text-navy-800 uppercase tracking-wider block">Cabins & Wards</span>
                      <span className="text-lg font-bold text-navy-950">
                        {hosp.beds?.cabin?.available || 18} <span className="text-xs font-normal text-slate-500">vacant</span>
                      </span>
                    </div>
                  </div>

                  {/* Integrated facilities snippet */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 py-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-pulse-electric font-semibold">
                      <Droplet className="h-3 w-3 fill-pulse-electric" /> Blood Bank
                    </span>
                    <span className="flex items-center gap-1 text-navy-800 font-medium">
                      <Ambulance className="h-3 w-3" /> {hosp.ambulanceFleetCount} Ambulances
                    </span>
                    <span className="flex items-center gap-1 text-teal-700 font-medium">
                      <ShieldCheck className="h-3 w-3" /> In-House Pharma
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectHospitalDetail(hosp.id)}
                    className="py-2 px-3 rounded-lg bg-white hover:bg-navy-50 text-navy-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1 border border-navy-200"
                  >
                    <span>View Network</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onBookBed(hosp, 'icu')}
                    className="py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>Reserve Bed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
