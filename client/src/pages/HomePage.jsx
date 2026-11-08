import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import { Droplet, Hospital, Video, Ambulance, Pill, Building2, ShieldCheck, ArrowRight, Heart, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({
  onNavigate,
  onConsultClick,
  onAmbulanceClick,
  onPharmacyClick,
  onFindHospitalClick,
  onSOSClick,
  onSubscribeClick,
  onOpenBloodRequest
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-0">
      {/* Hero section */}
      <Hero
        onConsultClick={() => onNavigate('doctors')}
        onAmbulanceClick={() => onNavigate('ambulance')}
        onFindHospitalClick={() => onNavigate('hospitals')}
      />

      {/* Quick Access Action Matrix (Clinical Bio-Teal & Wired Pulse Accents) */}
      <section className="bg-navy-50/40 py-10 border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div
              onClick={() => onNavigate('doctors')}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-teal-50/50 border border-navy-100 hover:border-teal-400 cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Video className="h-5 w-5 stroke-[2]" />
              </div>
              <h4 className="font-bold text-navy-950 text-sm group-hover:text-teal-700 transition-colors">Doctor Consultation</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Online Call & Chamber</p>
            </div>

            <div
              onClick={() => onNavigate('ambulance')}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-pulse-50/50 border border-navy-100 hover:border-pulse-electric cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="h-10 w-10 rounded-xl bg-pulse-50 text-pulse-electric flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Ambulance className="h-5 w-5 stroke-[2]" />
              </div>
              <h4 className="font-bold text-navy-950 text-sm group-hover:text-pulse-electric transition-colors">24/7 Ambulance</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">ICU & Hospital Fleets</p>
            </div>

            <div
              onClick={() => onNavigate('pharmacy')}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-teal-50/50 border border-navy-100 hover:border-teal-400 cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Pill className="h-5 w-5 stroke-[2]" />
              </div>
              <h4 className="font-bold text-navy-950 text-sm group-hover:text-teal-700 transition-colors">Model Pharmacy</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Lazz Pharma & Upload Rx</p>
            </div>

            <div
              onClick={() => onNavigate('hospitals')}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-navy-50/80 border border-navy-100 hover:border-navy-400 cursor-pointer transition-all hover:shadow-xs group"
            >
              <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="h-5 w-5 stroke-[2]" />
              </div>
              <h4 className="font-bold text-navy-950 text-sm group-hover:text-navy-700 transition-colors">Hospitals & Beds</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Live ICU Bed Booking</p>
            </div>

            <div
              onClick={() => onNavigate('blood')}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-pulse-50/50 border border-navy-100 hover:border-pulse-electric cursor-pointer transition-all hover:shadow-xs group col-span-2 md:col-span-1"
            >
              <div className="h-10 w-10 rounded-xl bg-pulse-50 text-pulse-electric flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Droplet className="h-5 w-5 fill-pulse-electric stroke-[1.5]" />
              </div>
              <h4 className="font-bold text-navy-950 text-sm group-hover:text-pulse-electric transition-colors">Blood Donation</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Donors & Hospital Stock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services
        onConsultClick={() => onNavigate('doctors')}
        onAmbulanceClick={() => onNavigate('ambulance')}
        onPharmacyClick={() => onNavigate('pharmacy')}
        onFindHospitalClick={() => onNavigate('hospitals')}
        onSOSClick={onSOSClick}
        onSubscribeClick={onSubscribeClick}
      />

      {/* Emergency Blood Distress Callout Strip (Major 1: Navy-950 with Wired Pulse Accent) */}
      <section className="bg-navy-950 text-white py-12 border-t border-b border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-pulse-950 text-pulse-electric border border-pulse-900 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Droplet className="h-3 w-3 fill-pulse-electric text-pulse-electric" />
              <span>URGENT BLOOD TRANSFUSION NETWORK</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {lang === 'bn' ? 'জরুরি রক্তের প্রয়োজন বা রক্তদান করতে চান?' : 'Need Emergency Blood or Want to Save a Life?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-normal leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের ব্লাড ব্যাংকে হাসপাতালের লাইভ রক্তের স্টক দেখুন অথবা সরাসরি নিবন্ধিত ভলান্টিয়ার ডোনারদের সাথে যোগাযোগ করুন।'
                : 'Connect directly with verified voluntary blood donors across Dhaka and check live hospital transfusion bank stocks.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('blood')}
              className="px-5 py-3 rounded-xl bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-pulse-electric/25 transition-all animate-wired-pulse"
            >
              Explore Blood Bank Network
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip (Major 1: Midnight Navy + Major 2: Bio-Teal) */}
      <section className="bg-navy-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-navy-900/90 border border-navy-800">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">DGHS & BMDC Verified</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-normal">
                  Every doctor holds active Bangladesh Medical & Dental Council (BMDC) credentials. No unverified practitioners.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-navy-900/90 border border-navy-800">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">100% Genuine Medicines</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-normal">
                  Dispensed exclusively from licensed model pharmacies (Lazz Pharma, Tamanna) with climate-controlled cold chain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-navy-900/90 border border-navy-800">
              <div className="h-10 w-10 rounded-xl bg-pulse-electric/10 text-pulse-electric flex items-center justify-center flex-shrink-0">
                <Ambulance className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">8-12 Min Emergency Dispatch</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-normal">
                  Integrated with private operators and top hospital ICU fleets with live radar GPS tracking and transparent fares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
