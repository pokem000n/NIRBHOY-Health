import React from 'react';
import { Siren, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingSOSButton({ onSOSClick }) {
  const { lang } = useLanguage();

  return (
    <div className="hidden lg:block fixed bottom-6 right-6 z-40">
      <button
        onClick={onSOSClick}
        className="group relative flex items-center gap-3 bg-[#ff1753] hover:bg-[#e11d48] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-[#ff1753]/50 border-2 border-white/60 active:scale-95 transition-all hover:scale-105"
        title="Immediate Emergency Ambulance & Hospital Distress Signal"
      >
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
        </span>

        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
          <Siren className="h-5 w-5 text-white animate-pulse" />
        </div>

        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-wider block leading-none text-white/90">
            {lang === 'bn' ? 'জরুরি চিকিৎসা' : '24/7 EMERGENCY'}
          </span>
          <span className="text-sm font-black tracking-tight leading-tight block">
            {lang === 'bn' ? 'ইমার্জেন্সি SOS' : 'Instant GPS SOS'}
          </span>
        </div>
      </button>
    </div>
  );
}
