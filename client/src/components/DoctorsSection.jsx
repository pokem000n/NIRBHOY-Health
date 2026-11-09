import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Clock, Award, CheckCircle, Video, Hospital } from 'lucide-react';
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

export default function DoctorsSection({ onDoctorSelect }) {
  const { lang, t } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty, searchQuery]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDoctors(selectedSpecialty, searchQuery);
      setDoctors(data);
    } catch (err) {
      console.error("Error loading doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="doctors" className="py-20 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-100/70 px-3 py-1 rounded-full">
              {lang === 'bn' ? 'বিএমডিসি অনুমোদিত বিশেষজ্ঞ চিকিৎসক' : 'BMDC Verified Specialists'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
              {t('doctorsTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              {t('doctorsSubtitle')}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'ডাক্তারের নাম বা হাসপাতাল খুঁজুন...' : 'Search doctor or hospital...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {spec === 'All' ? t('allSpecialties') : spec}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-gray-200 animate-pulse h-80">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <p className="text-gray-500 font-semibold text-lg">
              {lang === 'bn' ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No doctors found matching criteria'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#7c3aed] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Prominent Verification & Availability Banner */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-black">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                      <span>BMDC {doctor.bmdcNumber} (Govt Verified)</span>
                    </span>

                    {doctor.available ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">
                        CHAMBER ONLY
                      </span>
                    )}
                  </div>

                  {/* Doctor Info Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#7c3aed]/20 group-hover:scale-105 transition-transform"
                      />
                      {doctor.available && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-[#7c3aed] transition-colors leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-xs font-bold text-[#7c3aed] mt-0.5">
                        {doctor.specialty}
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                        {doctor.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Hospital & Experience */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Hospital className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Award className="h-4 w-4 text-[#7c3aed] flex-shrink-0" />
                        <span>{doctor.experience} {t('experience')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-black">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span>{doctor.rating}</span>
                        <span className="text-slate-500 font-semibold text-[11px]">
                          ({doctor.reviews} {lang === 'bn' ? 'রোগী' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prominent Real-time Availability Badge */}
                  <div className="mt-4 p-3 rounded-2xl bg-[#21183B]/5 border border-[#7c3aed]/20">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span className="flex items-center gap-1.5 text-[#21183B]">
                        <Clock className="h-3.5 w-3.5 text-[#7c3aed]" /> 
                        {doctor.available
                          ? (lang === 'bn' ? 'তাৎক্ষণিক ভিডিও কল উপলব্ধ' : 'Instant Video Call Available')
                          : (lang === 'bn' ? 'আজকের চেম্বার সময়সূচি:' : "Today's Chamber Schedule:")}
                      </span>
                      <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        {doctor.available
                          ? (lang === 'bn' ? 'অপেক্ষার সময় ~২ মি.' : 'Wait ~2 mins')
                          : (lang === 'bn' ? 'সিরিয়াল শুরু' : 'Serial Ready')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {doctor.slots.slice(0, 3).map((slot, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 text-slate-800 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          {slot}
                        </span>
                      ))}
                      {doctor.slots.length > 3 && (
                        <span className="text-[11px] text-slate-500 font-bold">
                          +{doctor.slots.length - 3} {lang === 'bn' ? 'আরও' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Fee & Book Action */}
                <div className="p-6 pt-0 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">{t('fee')}</span>
                    <span className="text-2xl font-black text-slate-900">
                      ৳{doctor.fee}
                    </span>
                  </div>

                  <button
                    onClick={() => onDoctorSelect(doctor)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#7c3aed]/25 hover:shadow-[#7c3aed]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>{t('bookAppointment')}</span>
                  </button>
                </div>
              </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
