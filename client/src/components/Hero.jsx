import React from 'react';
import { Video, Ambulance, Pill, Building2, CheckCircle2, ShieldCheck, Star, Users, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onConsultClick, onAmbulanceClick, onFindHospitalClick }) {
  const { lang, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-50/50 via-white to-slate-50/60 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-navy-100">
      {/* Subtle radial ambient light using Royal Cobalt & Navy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-blue-100/30 blur-3xl -z-10 rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Badges, Description, Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge (Royal Clinical Cobalt) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-xs">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>{t('heroTag')}</span>
            </div>

            {/* Main Title (Major 1: Midnight Clinical Navy with Major 2: Royal Cobalt Accent) */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-navy-950 tracking-normal leading-[1.3] sm:leading-[1.25]">
              {t('heroTitlePrefix')}{' '}
              <span className="text-blue-600 inline-block font-black">
                {t('heroTitleAccent')}
              </span>{' '}
              {t('heroTitleSuffix')}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('heroDesc')}
            </p>

            {/* CTA Buttons (Showcasing all 3 theme colors harmoniously) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              {/* Major 2: Primary CTA */}
              <button
                onClick={onConsultClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                <Video className="h-4 w-4" />
                <span>{t('btnConsultDoctor')}</span>
              </button>

              {/* Wired Accent: Emergency CTA */}
              <button
                onClick={onAmbulanceClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                style={{ color: 'var(--theme-accent)', borderColor: 'var(--theme-accent)' }}
              >
                <Ambulance className="h-4 w-4" style={{ color: 'var(--theme-accent)' }} />
                <span>{lang === 'bn' ? 'জরুরি অ্যাম্বুলেন্স' : 'Emergency Ambulance'}</span>
              </button>

              {/* Major 1: Clean Neutral Hospital Finder */}
              <button
                onClick={onFindHospitalClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-900 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="h-4 w-4 text-navy-600" />
                <span>{t('btnFindHospital')}</span>
              </button>
            </div>

            {/* Trust Micro-Bullets */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>100% BMDC Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Model Pharmacies & Genuine Rx</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>8-12 Min Ambulance Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Clinical Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl p-5 shadow-xl shadow-navy-950/5 border border-navy-100">
              {/* Doctor Consultation Snippet Card */}
              <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                <div className="relative flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                    alt="Dr. Farhana Yasmin"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://ui-avatars.com/api/?name=Farhana+Yasmin&background=7c3aed&color=fff&size=128';
                    }}
                    className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 bg-blue-50"
                  />
                  {/* Wired Electric Heartbeat Live Ping */}
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--theme-accent)' }}></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white" style={{ backgroundColor: 'var(--theme-accent)' }}></span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-navy-950 text-sm truncate">Dr. Farhana Yasmin</h4>
                    <span className="bg-navy-50 text-navy-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-navy-200">
                      BMDC A-54321
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium">FCPS (Medicine) • Dhaka Medical College</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-xs text-amber-500 font-bold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" /> 4.9 (142 reviews)
                    </span>
                    <span className="text-[10px] text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                      Live for Video & Chamber
                    </span>
                  </div>
                </div>
              </div>

              {/* Chamber Schedule Snippet */}
              <div className="my-3 p-3 bg-navy-50/50 rounded-xl border border-navy-100 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5 text-navy-950">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Square Hospital (Panthapath)</span>
                  </span>
                  <span className="text-blue-700 font-bold">Room 402</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Visiting: Sat, Mon, Wed (6:00 PM - 9:00 PM)</span>
                  <span className="text-blue-700 font-medium">Next Serial #04</span>
                </div>
              </div>

              {/* Quick Action Matrix inside Card */}
              <div className="grid grid-cols-2 gap-2.5 py-1">
                <div
                  onClick={onConsultClick}
                  className="p-3 rounded-xl bg-white hover:bg-blue-50/40 cursor-pointer border border-slate-200 hover:border-blue-300 transition-all text-left group"
                >
                  <Video className="h-5 w-5 text-blue-600 mb-1" />
                  <p className="text-xs font-bold text-navy-950 group-hover:text-blue-700 transition-colors">Video Call Doctor</p>
                  <p className="text-[10px] text-slate-500">Wait time ~ 3 mins</p>
                </div>

                <div
                  onClick={onAmbulanceClick}
                  className="p-3 rounded-xl bg-white hover:bg-pulse-50/40 cursor-pointer border border-slate-200 hover:border-pulse-300 transition-all text-left group"
                >
                  <Ambulance className="h-5 w-5 text-pulse-electric mb-1" style={{ color: '#ff1753' }} />
                  <p className="text-xs font-bold text-navy-950 group-hover:text-pulse-electric transition-colors" style={{ color: '#060b16' }}>Emergency Ambulance</p>
                  <p className="text-[10px] text-slate-500">GPS Live Radar</p>
                </div>

                <div
                  onClick={onFindHospitalClick}
                  className="p-3 rounded-xl bg-white hover:bg-navy-50 cursor-pointer border border-slate-200 hover:border-navy-300 transition-all text-left group"
                >
                  <Building2 className="h-5 w-5 text-navy-700 mb-1" />
                  <p className="text-xs font-bold text-navy-950 group-hover:text-navy-700 transition-colors">Hospital Bed Check</p>
                  <p className="text-[10px] text-slate-500">ICU, CCU & Cabin</p>
                </div>

                <a
                  href="#pharmacy"
                  className="p-3 rounded-xl bg-white hover:bg-blue-50/40 cursor-pointer border border-slate-200 hover:border-blue-300 transition-all text-left group"
                >
                  <Pill className="h-5 w-5 text-blue-600 mb-1" />
                  <p className="text-xs font-bold text-navy-950 group-hover:text-blue-700 transition-colors">Model Pharmacy</p>
                  <p className="text-[10px] text-slate-500">45-min Home Delivery</p>
                </a>
              </div>

              {/* Bottom Schedule Capsule */}
              <div className="mt-3 text-white rounded-xl p-3 flex items-center justify-between text-xs" style={{ backgroundColor: 'var(--theme-navy)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--theme-primary-accent)' }} />
                  <div>
                    <span className="font-semibold text-slate-200">Next Video Consultation:</span>
                    <span className="block text-[11px]" style={{ color: 'var(--theme-primary-light)' }}>Today at 10:30 AM (Available)</span>
                  </div>
                </div>
                <button
                  onClick={onConsultClick}
                  className="text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                  Book ৳600
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Color Themed Metrics Counter */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-navy-100">
          <div className="bg-white p-5 rounded-xl border border-navy-100 text-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 block tracking-normal">250+</span>
            <span className="text-xs font-medium text-slate-500 mt-1 block">{t('statsDoctors')}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-navy-100 text-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 block tracking-normal">180+</span>
            <span className="text-xs font-medium text-slate-500 mt-1 block">{t('statsHospitals')}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-navy-100 text-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold block tracking-normal" style={{ color: 'var(--theme-primary)' }}>50,000+</span>
            <span className="text-xs font-medium text-slate-500 mt-1 block">{t('statsPatients')}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-navy-100 text-center shadow-xs">
            {/* Wired Accent Metric */}
            <span className="text-2xl sm:text-3xl font-extrabold text-pulse-electric block tracking-normal" style={{ color: 'var(--theme-accent)' }}>8-12 min</span>
            <span className="text-xs font-medium text-slate-500 mt-1 block">{t('statsResponse')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
