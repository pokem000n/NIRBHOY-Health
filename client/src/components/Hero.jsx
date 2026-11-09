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

          {/* Right Column: Authentic Real Healthcare Photography + Floating Telehealth Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg">
              {/* Background ambient aura with Midnight Violet & Lavender */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#7c3aed]/20 via-[#21183B]/10 to-[#ff1753]/15 rounded-3xl blur-2xl -z-10"></div>

              {/* Main Real Healthcare Photography Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#21183B]/15 bg-white">
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=900"
                    alt="Professional Healthcare Consultation at NIRBHOY Health"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient Overlay for clinical text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21183B]/90 via-[#21183B]/20 to-transparent"></div>

                  {/* Top Floating Badge: Live Availability */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-lg flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black text-[#21183B]">৩৪ জন স্পেশালিস্ট লাইভ আছেন</span>
                  </div>

                  {/* Top Right Floating Badge: GPS Radar */}
                  <div className="absolute top-4 right-4 bg-[#21183B]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#7c3aed]/40 text-white shadow-lg flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff1753] animate-pulse"></span>
                    <span className="text-[11px] font-bold text-violet-200">GPS অ্যাম্বুলেন্স: ৮-১২ মি.</span>
                  </div>

                  {/* Bottom Image Inset Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 block">
                      ১০০% বিএমডিসি ভেরিফাইড চিকিৎসক
                    </span>
                    <p className="text-sm font-extrabold text-white leading-tight mt-0.5">
                      ডিজিটাল ভিডিও কল ও অফলাইন চেম্বার — তাৎক্ষণিক সিরিয়াল
                    </p>
                  </div>
                </div>

                {/* Sub-Card: Live Doctor Profile Card */}
                <div className="p-4 sm:p-5 bg-white space-y-3.5">
                  <div className="flex items-start gap-3.5 pb-3 border-b border-slate-100">
                    <div className="relative flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                        alt="Dr. Farhana Yasmin"
                        className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[#7c3aed]/30 bg-violet-50"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ff1753]"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white bg-[#ff1753]"></span>
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h4 className="font-extrabold text-[#21183B] text-base truncate">ডাঃ ফারহানা ইয়াসমিন</h4>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> BMDC A-54321
                        </span>
                      </div>
                      <p className="text-xs text-[#7c3aed] font-bold">এফসিপিএস (মেডিসিন) • ঢাকা মেডিকেল কলেজ</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-xs text-amber-500 font-extrabold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" /> ৪.৯ (১৪২ রিভিউ)
                        </span>
                        <span className="text-[10px] text-violet-800 font-bold bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                          ভিডিও ও চেম্বার রেডি
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Fast Actions */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={onConsultClick}
                      className="p-3 rounded-xl bg-violet-50 hover:bg-violet-100/80 border border-violet-200 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Video className="h-4 w-4 text-[#7c3aed]" />
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">লাইভ</span>
                      </div>
                      <span className="text-xs font-black text-[#21183B] group-hover:text-[#7c3aed]">ভিডিও কনসাল্টেশন</span>
                      <span className="text-[10px] text-slate-500">অপেক্ষার সময় ~ ২ মিনিট</span>
                    </button>

                    <button
                      onClick={onAmbulanceClick}
                      className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Ambulance className="h-4 w-4 text-[#ff1753]" />
                        <span className="text-[9px] font-extrabold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">জরুরি</span>
                      </div>
                      <span className="text-xs font-black text-[#21183B] group-hover:text-[#ff1753]">জিপিএস অ্যাম্বুলেন্স</span>
                      <span className="text-[10px] text-slate-500">নিকটস্থ ড্রাইভার ডিসপ্যাচ</span>
                    </button>
                  </div>
                </div>
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
