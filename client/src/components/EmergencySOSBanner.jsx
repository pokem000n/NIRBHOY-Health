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
    <div className="bg-navy-950 text-white border-b border-navy-900" style={{ backgroundColor: 'var(--theme-navy)', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Triage Info */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-9 w-9 rounded-xl border flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--theme-navy-surface)', borderColor: 'var(--theme-navy-border)', color: 'var(--theme-accent)' }}>
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--theme-accent-light)', borderColor: 'var(--theme-accent)', color: 'var(--theme-accent)' }}>
                  {lang === 'bn' ? 'জরুরি চিকিৎসা সহায়তা' : 'EMERGENCY TRIAGE'}
                </span>
                <span className="text-[11px] flex items-center gap-1 font-medium" style={{ color: 'var(--theme-primary-accent)' }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }}></span> Rapid Response Live
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">
                {lang === 'bn'
                  ? 'যেকোনো চিকিৎসা সংকটে এক ক্লিকে জিপিএস এলার্ট পাঠান অথবা সরকারি হটলাইনে কল করুন।'
                  : 'Broadcast real-time GPS distress to nearby hospital teams or direct dial national hotlines.'}
              </p>
            </div>
          </div>

          {/* Quick Hotline Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            <a
              href="tel:999"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-100 font-semibold text-xs transition-colors border border-slate-700 hover:border-slate-500"
              style={{ backgroundColor: 'var(--theme-navy-surface)' }}
            >
              <Phone className="h-3.5 w-3.5" style={{ color: 'var(--theme-primary-accent)' }} />
              <span>999 Emergency</span>
            </a>

            <a
              href="tel:16263"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-100 font-semibold text-xs transition-colors border border-slate-700 hover:border-slate-500"
              style={{ backgroundColor: 'var(--theme-navy-surface)' }}
            >
              <Phone className="h-3.5 w-3.5" style={{ color: 'var(--theme-primary-accent)' }} />
              <span>16263 Shastho Batayan</span>
            </a>

            {quickSent ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-bold text-xs" style={{ backgroundColor: 'var(--theme-primary)' }}>
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'bn' ? 'SOS পাঠানো হয়েছে' : 'Dispatched'}</span>
              </div>
            ) : (
              <button
                onClick={handleInstantGPSDispatch}
                disabled={loading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white font-bold text-xs transition-all shadow-sm animate-wired-pulse"
                style={{ backgroundColor: 'var(--theme-accent)', borderColor: 'var(--theme-accent)' }}
              >
                <MapPin className="h-3.5 w-3.5 text-white" />
                <span>{loading ? 'Pinging...' : (lang === 'bn' ? 'GPS SOS প্রেরণ' : 'One-Tap GPS SOS')}</span>
              </button>
            )}

            <button
              onClick={onSOSClick}
              className="px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors border"
              style={{ backgroundColor: 'var(--theme-navy-surface)', color: 'var(--theme-primary-accent)', borderColor: 'var(--theme-primary-border)' }}
            >
              {lang === 'bn' ? 'অ্যাম্বুলেন্স ডাকুন' : 'Call Ambulance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
