import React from 'react';
import { Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onSOSClick, onAdminClick }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency Hotlines Grid */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 mb-14 border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                {lang === 'bn' ? 'জাতীয় জরুরি হটলাইনসমূহ' : 'National Emergency Helplines'}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {lang === 'bn' ? '২৪ ঘণ্টা যেকোনো জরুরি প্রয়োজনে সরাসরি কল করুন' : 'Direct Access to Government & Emergency Lines'}
              </h3>
            </div>
            <button
              onClick={onSOSClick}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            >
              Emergency SOS Panic
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <a href="tel:999" className="p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/60 block group transition-all">
              <span className="text-2xl font-black text-yellow-400 block group-hover:scale-105 transition-transform">999</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">National Emergency</span>
              <span className="text-[10px] text-slate-400">Police, Fire, Ambulance</span>
            </a>

            <a href="tel:16263" className="p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/60 block group transition-all">
              <span className="text-2xl font-black text-emerald-400 block group-hover:scale-105 transition-transform">16263</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">Shastho Batayan</span>
              <span className="text-[10px] text-slate-400">Ministry of Health DGHS</span>
            </a>

            <a href="tel:10655" className="p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/60 block group transition-all">
              <span className="text-2xl font-black text-blue-400 block group-hover:scale-105 transition-transform">10655</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">IEDCR Hotline</span>
              <span className="text-[10px] text-slate-400">Disease Control Helpline</span>
            </a>

            <a href="tel:333" className="p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/60 block group transition-all">
              <span className="text-2xl font-black text-purple-400 block group-hover:scale-105 transition-transform">333</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">Citizen Services</span>
              <span className="text-[10px] text-slate-400">Govt Health & Relief</span>
            </a>

            <a href="tel:109" className="p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/60 block group transition-all">
              <span className="text-2xl font-black text-pink-400 block group-hover:scale-105 transition-transform">109</span>
              <span className="text-xs font-bold text-slate-200 block mt-1">Women & Child Helpline</span>
              <span className="text-[10px] text-slate-400">Violence & Support</span>
            </a>
          </div>
        </div>

        {/* 4-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Shield className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                NIRBHOY<span className="text-blue-500 font-normal">Health</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'নির্ভয় হেলথ বাংলাদেশের সর্বাধুনিক ডিজিটাল স্বাস্থ্য ইকোসিস্টেম। অভিজ্ঞ ডাক্তার, জরুরি অ্যাম্বুলেন্স এবং খাঁটি ওষুধ পৌঁছে দিচ্ছি দেশের প্রতিটি কোণায়।'
                : 'NIRBHOY Health connects Bangladesh with 24/7 doctor consultations, rapid GPS ambulance dispatch, and authentic medicine delivery.'}
            </p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>DGHS License No: DGHS/DH/2026/0942</p>
              <p>Trade License: TRAD/DNCC/014892/2026</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">Healthcare Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#doctors" className="hover:text-blue-400 transition-colors">Specialist Video Consultations</a></li>
              <li><a href="#ambulance" className="hover:text-blue-400 transition-colors">ICU & AC Ambulance Booking</a></li>
              <li><a href="#pharmacy" className="hover:text-blue-400 transition-colors">Genuine Medicine Home Delivery</a></li>
              <li><a href="#hospitals" className="hover:text-blue-400 transition-colors">Hospital Bed & ICU Directory</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">NIRBHOY Family Premium Pass</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">Corporate Office</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Level 7, Concord Tower, Gulshan-1, Dhaka 1212, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>+880 9612-NIRBHOY (+880 9612-647246)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span>support@nirbhoyhealth.com</span>
              </p>
            </div>
          </div>

          {/* Payment & Security Badges */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-4">Supported Payment Methods</h4>
            <p className="text-xs text-slate-400 mb-3">All major Bangladeshi payment gateways accepted:</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-pink-400">bKash</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-orange-400">Nagad</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-purple-400">Rocket</span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-blue-400">Visa / Mastercard</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('footerText')}</p>
          <div className="flex items-center gap-3">
            {onAdminClick && (
              <>
                <button
                  onClick={onAdminClick}
                  className="text-slate-600 hover:text-slate-400 text-[11px] transition-colors"
                >
                  Staff Portal
                </button>
                <span className="text-slate-700">•</span>
              </>
            )}
            <p className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the people of Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
