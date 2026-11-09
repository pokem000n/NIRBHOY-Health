import React, { useState } from 'react';
import { Phone, Radio, MapPin, CheckCircle2, Siren, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function EmergencySOSBanner({ onSOSClick }) {
  const { lang, t } = useLanguage();
  const [quickSent, setQuickSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInstantGPSDispatch = async () => {
    setLoading(true);
    let coords = { latitude: 23.8103, longitude: 90.4125 };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          coords.latitude = position.coords.latitude;
          coords.longitude = position.coords.longitude;
          await sendDistress(coords);
        },
        async () => {
          await sendDistress(coords);
        },
        { timeout: 4000 }
      );
    } else {
      await sendDistress(coords);
    }
  };

  const sendDistress = async (coords) => {
    try {
      await ApiService.sendSOS({
        location: `Latitude: ${coords.latitude.toFixed(4)}, Longitude: ${coords.longitude.toFixed(4)}`,
        latitude: coords.latitude,
        longitude: coords.longitude,
        phone: "+8801700000000",
        emergencyType: "Critical SOS Panic Alert"
      });
      setQuickSent(true);
      setTimeout(() => setQuickSent(false), 8000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#21183B] text-white border-b-2 border-[#ff1753]/40 shadow-xl relative overflow-hidden">
      {/* Subtle pulsating emergency glow */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#ff1753]/15 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Triage Info */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="h-11 w-11 rounded-2xl bg-[#ff1753]/20 border-2 border-[#ff1753] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff1753]/30">
              <Siren className="h-6 w-6 text-[#ff1753] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#ff1753] text-white shadow-xs">
                  {lang === 'bn' ? 'জরুরি ইমার্জেন্সি সাপোর্ট' : 'CRITICAL EMERGENCY SOS'}
                </span>
                <span className="text-xs flex items-center gap-1.5 font-bold text-violet-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ৮-১২ মিনিট রেসপন্স লাইভ
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-1 leading-snug">
                {lang === 'bn'
                  ? 'যেকোনো চিকিৎসা সংকটে ১-ট্যাপে জিপিএস অ্যাম্বুলেন্স ডাকুন অথবা সরকারি হটলাইনে সরাসরি কল করুন।'
                  : 'Broadcast real-time GPS distress to nearby ambulance & ICU teams or direct dial hotlines.'}
              </p>
            </div>
          </div>

          {/* Quick Hotline Actions */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-end">
            <a
              href="tel:999"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-all shadow-md active:scale-95"
            >
              <Phone className="h-4 w-4 text-slate-950" />
              <span>৯৯৯ পুলিশ/অ্যাম্বুলেন্স</span>
            </a>

            <a
              href="tel:16263"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a1f4b] hover:bg-[#3b2c63] text-white font-bold text-xs transition-colors border border-violet-700/60"
            >
              <Phone className="h-3.5 w-3.5 text-violet-300" />
              <span>১৬২৬৩ স্বাস্থ্য বাতায়ন</span>
            </a>

            {quickSent ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg animate-pulse">
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'bn' ? '✓ জরুরি সিগন্যাল পাঠানো হয়েছে' : '✓ SOS Dispatched'}</span>
              </div>
            ) : (
              <button
                onClick={handleInstantGPSDispatch}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff1753] hover:bg-[#e11d48] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#ff1753]/40 border-2 border-white/30 active:scale-95 transition-all animate-pulse"
              >
                <MapPin className="h-4 w-4 text-white" />
                <span>{loading ? 'অনুসন্ধান চলছে...' : (lang === 'bn' ? '১-ট্যাপে GPS অ্যাম্বুলেন্স' : 'One-Tap GPS SOS')}</span>
              </button>
            )}

            <button
              onClick={onSOSClick}
              className="px-4 py-2 rounded-xl font-extrabold text-xs bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/25"
            >
              {lang === 'bn' ? 'পূর্ণাঙ্গ ট্র্যাকার' : 'Live Tracker'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
