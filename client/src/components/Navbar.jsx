import React, { useState } from 'react';
import { Shield, AlertCircle, User, Globe, Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar({
  currentPage,
  onNavigate,
  onSOSClick,
  onAuthClick,
  onProfileClick,
  onAdminClick,
  onSubscribeClick
}) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: lang === 'bn' ? 'হোম' : 'Home' },
    { id: 'doctors', label: lang === 'bn' ? 'ডাক্তার' : 'Doctors' },
    { id: 'ambulance', label: lang === 'bn' ? 'অ্যাম্বুলেন্স' : 'Ambulance' },
    { id: 'pharmacy', label: lang === 'bn' ? 'ফার্মেসি' : 'Pharmacy' },
    { id: 'hospitals', label: lang === 'bn' ? 'হাসপাতাল' : 'Hospitals' },
    { id: 'blood', label: lang === 'bn' ? 'ব্লাড ব্যাংক' : 'Blood Bank', badge: 'Live Pulse' },
    { id: 'partner', label: lang === 'bn' ? 'পার্টনার' : 'Partner' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-navy-100 transition-all">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with explicit margins and no shrink */}
          <div className="flex items-center flex-shrink-0 mr-4 sm:mr-6 lg:mr-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group"
            >
              <Logo size="md" />
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-normal text-[#21183B]">
                  NIRBHOY<span className="font-bold ml-1 text-[#7c3aed]">Health</span>
                </span>
                <p className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
                  {lang === 'bn' ? 'নির্ভয় ডিজিটাল স্বাস্থ্যসেবা' : 'Digital Healthcare Bangladesh'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-[13px] font-semibold text-slate-600 whitespace-nowrap">
            {navItems.map((item) => {
              const isCurrent = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1.5 transition-colors flex items-center gap-1.5 ${
                    isCurrent ? 'font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={isCurrent ? { color: 'var(--theme-primary)' } : {}}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border" style={{ color: 'var(--theme-accent)', borderColor: 'var(--theme-primary-border)', backgroundColor: 'var(--theme-accent-light)' }}>
                      {item.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }}></span>
                  )}
                </button>
              );
            })}

            <button
              onClick={onSubscribeClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={{ backgroundColor: 'var(--theme-primary-light)', color: 'var(--theme-primary-text)', borderColor: 'var(--theme-primary-border)' }}
            >
              <Sparkles className="h-3 w-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Premium Pass</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              title="Toggle Language"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
            </button>

            {/* Wired Color Accent: 24/7 SOS Alert Pill */}
            <button
              onClick={onSOSClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-95 animate-wired-pulse"
              style={{ backgroundColor: 'var(--theme-accent)' }}
            >
              <AlertCircle className="h-4 w-4" />
              <span>24/7 SOS</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors text-xs font-semibold"
              >
                <div className="h-6 w-6 rounded-full text-white flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: 'var(--theme-primary)' }}>
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold text-slate-800">{currentUser.name?.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:opacity-90"
                style={{ backgroundColor: 'var(--theme-navy)' }}
              >
                <User className="h-4 w-4" />
                <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 text-left rounded-xl text-xs font-bold transition-colors ${
                  currentPage === item.id ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onSOSClick}
              className="w-full py-2.5 rounded-xl bg-pulse-electric text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Emergency 24/7 SOS Alert</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
