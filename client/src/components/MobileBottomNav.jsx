import React from 'react';
import { Home, Video, Ambulance, Droplet, Siren } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav({ currentPage, onNavigate, onSOSClick }) {
  const { lang } = useLanguage();

  const navItems = [
    { id: 'home', label: lang === 'bn' ? 'হোম' : 'Home', icon: Home },
    { id: 'doctors', label: lang === 'bn' ? 'ডাক্তার' : 'Doctors', icon: Video },
    { id: 'sos', label: 'SOS', icon: Siren, isSOS: true },
    { id: 'ambulance', label: lang === 'bn' ? 'অ্যাম্বুলেন্স' : 'Ambulance', icon: Ambulance },
    { id: 'blood', label: lang === 'bn' ? 'ব্লাড ব্যাংক' : 'Blood', icon: Droplet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-3 shadow-2xl lg:hidden flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        if (item.isSOS) {
          return (
            <button
              key="sos"
              onClick={onSOSClick}
              className="relative -top-5 flex flex-col items-center group focus:outline-none"
              title="Emergency SOS"
            >
              <div className="h-14 w-14 rounded-full bg-[#ff1753] border-4 border-white shadow-xl shadow-[#ff1753]/50 flex items-center justify-center text-white active:scale-90 transition-transform animate-bounce">
                <Siren className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black text-[#ff1753] uppercase tracking-wider mt-0.5">
                SOS
              </span>
            </button>
          );
        }

        const isCurrent = currentPage === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
              isCurrent ? 'text-[#7c3aed] font-black' : 'text-slate-700 hover:text-slate-900 font-semibold'
            }`}
          >
            <div className={`p-1 rounded-lg ${isCurrent ? 'bg-[#7c3aed]/10' : ''}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] leading-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
