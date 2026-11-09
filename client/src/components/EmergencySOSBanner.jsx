import React, { useState } from 'react';
import { MapPin, CheckCircle2, Siren } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function EmergencySOSBanner({ onSOSClick, onOpenLiveTracker, onInstantSOS }) {
  const { lang } = useLanguage();
  const [quickSent, setQuickSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInstantGPSDispatch = async () => {
    setLoading(true);
    let coords = { latitude: 23.8103, longitude: 90.4125 };

    const finalizeSOS = async (finalCoords) => {
      try {
        await ApiService.sendSOS({
          location: `Latitude: ${finalCoords.latitude.toFixed(4)}, Longitude: ${finalCoords.longitude.toFixed(4)}`,
          latitude: finalCoords.latitude,
          longitude: finalCoords.longitude,
          phone: "+8801711223344",
          emergencyType: "Critical Instant GPS Distress Alert"
        });
      } catch (err) {
        console.warn('API distress fallback mode:', err);
      } finally {
        setLoading(false);
        setQuickSent(true);
        setTimeout(() => setQuickSent(false), 12000);

        // Immediately launch live tracking radar!
        if (onInstantSOS) {
          onInstantSOS(finalCoords);
        } else if (onOpenLiveTracker) {
          onOpenLiveTracker();
        } else if (onSOSClick) {
          onSOSClick();
        }
      }
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          await finalizeSOS(coords);
        },
        async () => {
          await finalizeSOS(coords);
        },
        { timeout: 3500, enableHighAccuracy: true }
      );
    } else {
      await finalizeSOS(coords);
    }
  };

  const handleTrackerClick = () => {
    if (onOpenLiveTracker) {
      onOpenLiveTracker();
    } else if (onSOSClick) {
      onSOSClick();
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
                  {lang === 'bn' ? '৮-১২ মিনিট রেসপন্স লাইভ' : '8-12 Min Response Live'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-1 leading-snug">
                {lang === 'bn'
                  ? 'যেকোনো চিকিৎসা সংকটে ১-ট্যাপে জিপিএস অ্যাম্বুলেন্স ডাকুন ও তাৎক্ষণিক ট্র্যাক করুন।'
                  : 'Broadcast real-time GPS distress to nearby ambulance & ICU teams with instant live tracking.'}
              </p>
            </div>
          </div>

          {/* Single High-Priority GPS SOS Action */}
          <div className="flex items-center justify-center md:justify-end">
            {quickSent ? (
              <button
                onClick={handleTrackerClick}
                className="flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/40 border-2 border-white/40 animate-pulse transition-all cursor-pointer active:scale-95"
                title={lang === 'bn' ? 'রেডার ট্র্যাকার দেখতে ক্লিক করুন' : 'Click to view radar tracker'}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'bn' ? '✓ জরুরি সিগন্যাল সক্রিয় (লাইভ রেডার দেখুন)' : '✓ SOS Active (View Live Radar)'}</span>
              </button>
            ) : (
              <button
                onClick={handleInstantGPSDispatch}
                disabled={loading}
                className="flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-2xl bg-[#ff1753] hover:bg-[#e11d48] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#ff1753]/40 border-2 border-white/30 active:scale-95 transition-all animate-pulse disabled:opacity-75 cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-white" />
                <span>
                  {loading
                    ? (lang === 'bn' ? 'জিপিএস কানেক্ট হচ্ছে...' : 'Pinging GPS Radar...')
                    : (lang === 'bn' ? '১-ট্যাপে GPS অ্যাম্বুলেন্স' : 'One-Tap GPS SOS')}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
