import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Clock, Award, CheckCircle, Video, Hospital, MapPin, Ticket, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

const specialties = [
  'All',
  'General Physician',
  'Cardiologist',
  'Pediatrician',
  'Neurologist',
  'Gynecologist & Obstetrician',
  'Orthopedic Surgeon'
];

export default function DoctorsPage({ onSelectVideoCall, onSelectChamber }) {
  const { lang, t } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all'); // 'all', 'chamber', 'video'

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty, searchQuery, modeFilter]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDoctors(selectedSpecialty, searchQuery, '', modeFilter === 'all' ? '' : modeFilter);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-teal-700 font-semibold">Doctors & Offline Chambers</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-teal-800 font-semibold text-xs uppercase tracking-wider bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                100% BMDC Verified Specialists
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {lang === 'bn' ? 'বিশেষজ্ঞ ডাক্তার ও অফলাইন চেম্বার বুকিং' : 'Find Doctors & Book Offline Chambers'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'bn'
                  ? 'ঘরে বসে অনলাইনে ভিডিও পরামর্শ নিন অথবা সরাসরি হাসপাতালে গিয়ে দেখানোর জন্য অফলাইন চেম্বার সিরিয়াল বুক করুন।'
                  : 'Consult online via encrypted video call or book guaranteed in-person chamber serials at top hospitals across Bangladesh.'}
              </p>
            </div>

            {/* Mode Switcher Filter */}
            <div className="flex items-center p-1 bg-white border border-navy-100 rounded-xl shadow-xs self-start lg:self-auto">
              <button
                onClick={() => setModeFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modeFilter === 'all' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setModeFilter('chamber')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  modeFilter === 'chamber' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                <Hospital className="h-3.5 w-3.5" />
                <span>Chamber Visit</span>
              </button>
              <button
                onClick={() => setModeFilter('video')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  modeFilter === 'video' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>Video Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Specialty Tabs */}
        <div className="bg-white rounded-2xl p-5 border border-navy-100 shadow-xs mb-8 space-y-3.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'ডাক্তারের নাম, হাসপাতাল (যেমন: স্কয়ার, পপুলার) বা স্পেশালিস্ট খুঁজুন...' : 'Search doctor name, hospital chamber (Square, Popular, Labaid), or specialty...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy-950 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-navy-50/70 hover:bg-navy-100 text-navy-800'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 border border-navy-100 h-80 animate-pulse"></div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-navy-100">
            <p className="text-sm font-semibold text-slate-600">No doctors match your criteria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-navy-100 hover:border-teal-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Profile Top */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      {/* Wired Coral Accent for LIVE status */}
                      {doctor.availableOnline ? (
                        <span className="absolute -top-1 -right-1 bg-pulse-electric text-white text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white animate-wired-pulse">
                          LIVE
                        </span>
                      ) : (
                        <span className="absolute -top-1 -right-1 bg-slate-400 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                          OFFLINE
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold bg-navy-50 text-navy-800 px-2 py-0.5 rounded border border-navy-200">
                        BMDC {doctor.bmdcNumber}
                      </span>
                      <h3 className="font-bold text-navy-950 text-base mt-1 truncate group-hover:text-teal-700 transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-xs font-semibold text-teal-600 truncate">{doctor.specialty}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">{doctor.qualification}</p>
                    </div>
                  </div>

                  {/* Primary Hospital & Experience */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Hospital className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate font-medium text-navy-950">{doctor.primaryHospital}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">{doctor.experience} Experience</span>
                      <span className="flex items-center text-amber-500 font-bold text-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                        {doctor.rating} ({doctor.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Offline Chambers List */}
                  {doctor.chambers && doctor.chambers.length > 0 && (
                    <div className="mt-3.5 bg-navy-50/50 rounded-xl p-3 border border-navy-100 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-navy-900 tracking-wider">
                        <span className="flex items-center gap-1">
                          <Hospital className="h-3 w-3 text-teal-600" /> Offline Chambers
                        </span>
                        <span className="text-teal-700 font-semibold">{doctor.chambers.length} Locations</span>
                      </div>

                      {doctor.chambers.map((chamb) => (
                        <div
                          key={chamb.id}
                          className="bg-white p-2.5 rounded-lg border border-navy-100 text-xs text-slate-700 hover:border-teal-400 transition-all cursor-pointer"
                          onClick={() => onSelectChamber(doctor, chamb)}
                        >
                          <div className="flex items-center justify-between font-bold text-navy-950">
                            <span className="truncate text-xs">{chamb.hospitalName}</span>
                            <span className="text-teal-700 text-xs font-bold ml-2">৳{chamb.chamberFee}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                            <span>{chamb.visitingDays}</span>
                            <span className="text-navy-900 font-medium">{chamb.visitingHours}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-teal-800 mt-1 pt-1 border-t border-slate-100 font-medium">
                            <span>Room: {chamb.roomNumber}</span>
                            <span>Next: {chamb.nextAvailableDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking Action Buttons */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectChamber(doctor, doctor.chambers?.[0])}
                    className="py-2 px-3 rounded-lg bg-white hover:bg-navy-50 text-navy-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-navy-200"
                  >
                    <Ticket className="h-3.5 w-3.5 text-navy-600" />
                    <span>Chamber Serial</span>
                  </button>

                  <button
                    onClick={() => onSelectVideoCall(doctor)}
                    disabled={!doctor.availableOnline}
                    className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      doctor.availableOnline
                        ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Video (৳{doctor.onlineFee})</span>
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
