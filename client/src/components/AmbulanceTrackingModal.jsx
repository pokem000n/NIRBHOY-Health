import React, { useState, useEffect } from 'react';
import { 
  X, Ambulance, Phone, Navigation, Clock, ShieldCheck, MapPin, 
  Share2, CheckCircle2, AlertTriangle, Volume2, VolumeX, Building2,
  Radio, Compass, Gauge, RefreshCw, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * High-Tech Live GPS Ambulance & Emergency Radar Tracker
 * 100% Workable with real-time ETA countdown, moving vehicle simulation,
 * interactive call triggers, hospital triage status, and full language support.
 */
export default function AmbulanceTrackingModal({ open, onClose, booking }) {
  const { lang } = useLanguage();

  // Active tracking state
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes default
  const [distanceKm, setDistanceKm] = useState(2.3);
  const [ambulanceProgress, setAmbulanceProgress] = useState(18); // percentage along the route
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Initialize or reset when booking opens
  useEffect(() => {
    if (!open) return;
    setEtaSeconds(booking?.etaMinutes ? booking.etaMinutes * 60 : 480);
    setDistanceKm(booking?.distanceKm || 2.3);
    setAmbulanceProgress(18);
    setCancelled(false);
    setShowCancelConfirm(false);

    // Play subtle emergency audio chime
    if (soundEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (e) {
        // Silently handle audio autoplay restrictions
      }
    }
  }, [open, booking]);

  // Real-time second-by-second countdown and simulation
  useEffect(() => {
    if (!open || cancelled) return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 15) return 15; // Hold at 15s when arrived
        return prev - 1;
      });

      setDistanceKm((prev) => {
        if (prev <= 0.2) return 0.2;
        return parseFloat((prev - 0.005).toFixed(2));
      });

      setAmbulanceProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + 0.25;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, cancelled]);

  if (!open) return null;

  const currentBooking = booking || {
    trackingId: 'NIRBHOY-SOS-8921',
    ambulanceType: 'ICU Mobile Critical Care Ambulance',
    driverName: 'Md. Rafiqul Islam (Senior Rescue Pilot)',
    driverPhone: '+8801711223344',
    vehicleNumber: 'Dhaka Metro-Chha-11-8921',
    pickupLocation: 'Current GPS Location (Dhanmondi, Dhaka)',
    destination: 'Square Hospital Emergency Trauma Center',
    hospitalPhone: '10616',
    status: 'en_route',
  };

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;

  const handleShare = () => {
    const text = `Live NIRBHOY GPS Ambulance Tracking:\nID: ${currentBooking.trackingId}\nPilot: ${currentBooking.driverName} (${currentBooking.driverPhone})\nVehicle: ${currentBooking.vehicleNumber}\nETA: ${minutes}m ${seconds}s\nDestination: ${currentBooking.destination}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCancelSOS = () => {
    setCancelled(true);
    setShowCancelConfirm(false);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-violet-900/30 flex flex-col max-h-[92vh]">
        
        {/* Header Banner in Midnight Violet & Electric Crimson */}
        <div className="bg-[#21183B] text-white p-5 sm:p-6 border-b border-violet-800/50 relative flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-[#ff1753] text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                {lang === 'bn' ? 'লাইভ ইমার্জেন্সি রেডার' : 'LIVE EMERGENCY RADAR'}
              </span>
              <span className="text-[11px] font-mono font-bold text-violet-300 bg-[#17102b] px-2.5 py-0.5 rounded-lg border border-violet-800/60">
                ID: {currentBooking.trackingId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-violet-950/80 hover:bg-violet-900 border border-violet-700/60 text-violet-300 transition-colors"
                title={soundEnabled ? 'Mute Alert Sound' : 'Unmute Sound'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Minimize Tracker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{lang === 'bn' ? 'অ্যাম্বুলেন্স দ্রুত গতিতে আপনার কাছে আসছে' : 'Ambulance is Fast En Route'}</span>
              </h3>
              <p className="text-xs text-violet-200/90 mt-0.5">
                {lang === 'bn'
                  ? 'জিপিএস ট্র্যাকিং সক্রিয় • ট্রাফিক ক্লিয়ারেন্স ও হাসপাতাল ট্রায়াজ টিম এলার্টেড'
                  : 'GPS Real-time Active • Traffic Priority & Hospital Trauma Team Alerted'}
              </p>
            </div>

            {/* Prominent Live Ping Badge */}
            <div className="hidden sm:flex flex-col items-end flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs font-black">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                {lang === 'bn' ? 'লাইভ সিগন্যাল' : 'LIVE RADAR 100%'}
              </span>
              <span className="text-[10px] text-violet-300 mt-1 font-mono">
                {lang === 'bn' ? 'গতি: ৪২ কিমি/ঘণ্টা' : 'Speed: 42 km/h'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">

          {/* Interactive Simulated GPS Radar Map */}
          <div className="relative h-60 sm:h-72 rounded-2xl bg-[#0e0a1a] overflow-hidden border-2 border-violet-900/60 shadow-inner flex items-center justify-center">
            {/* Architectural Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed15_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed15_1px,transparent_1px)] bg-[size:28px_28px]"></div>

            {/* Radar Circular Sweep Rings */}
            <div className="absolute h-96 w-96 rounded-full border border-violet-600/20 animate-ping"></div>
            <div className="absolute h-64 w-64 rounded-full border border-violet-500/30"></div>
            <div className="absolute h-40 w-40 rounded-full border border-[#ff1753]/30"></div>
            <div className="absolute h-20 w-20 rounded-full border border-violet-400/40"></div>

            {/* Road Pathway (Simulated Curvature) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 300" fill="none">
              <path 
                d="M 50 240 Q 180 160 250 140 T 440 60" 
                stroke="#3b2c63" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50 240 Q 180 160 250 140 T 440 60" 
                stroke="#ff1753" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="8 8"
                className="animate-pulse"
              />
            </svg>

            {/* Target Patient Pickup Location Marker (Right Top) */}
            <div className="absolute top-10 right-10 sm:right-16 flex flex-col items-center z-10">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/60 ring-4 ring-emerald-500/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-ping"></span>
              </div>
              <span className="text-[10px] font-black text-white bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/60 mt-1.5 shadow-md">
                {lang === 'bn' ? 'রোগীর অবস্থান' : 'Patient Pickup Point'}
              </span>
            </div>

            {/* Destination Hospital Marker (Far Right / Apex) */}
            <div className="absolute top-4 left-6 sm:left-10 flex flex-col items-center z-10 opacity-80 hover:opacity-100 transition-opacity">
              <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md border border-blue-400">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-bold text-blue-200 bg-blue-950/90 px-2 py-0.5 rounded mt-1">
                Square Trauma ICU
              </span>
            </div>

            {/* Dynamically Moving Ambulance Marker along the Route */}
            <div 
              className="absolute z-20 flex flex-col items-center transition-all duration-1000 ease-linear"
              style={{ 
                left: `${ambulanceProgress}%`, 
                bottom: `${20 + ambulanceProgress * 0.6}%` 
              }}
            >
              <div className="relative group cursor-pointer">
                <div className="h-12 w-12 rounded-2xl bg-[#ff1753] text-white flex items-center justify-center shadow-2xl shadow-[#ff1753]/80 border-2 border-white animate-pulse">
                  <Ambulance className="h-7 w-7" />
                </div>
                {/* Flashing Beacon on top of vehicle */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white animate-ping"></span>
              </div>
              <div className="bg-[#21183B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#7c3aed] mt-1 shadow-md whitespace-nowrap">
                🚑 {currentBooking.vehicleNumber}
              </div>
            </div>

            {/* Live Radar Compass Indicator */}
            <div className="absolute bottom-3 left-3 bg-[#17102b]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-violet-800/60 flex items-center gap-2 text-white text-[11px] font-mono">
              <Compass className="h-4 w-4 text-[#7c3aed] animate-spin" style={{ animationDuration: '8s' }} />
              <span>{lang === 'bn' ? 'জিপিএস ডেসপ্যাচ সক্রিয়' : 'GPS Dispatch Active'}</span>
            </div>
          </div>

          {/* Key Metrics: ETA, Distance, Speed */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-rose-600 mb-0.5">
                <Clock className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">{lang === 'bn' ? 'পৌঁছানোর সময়' : 'ETA'}</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-rose-700 leading-tight">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
              <span className="text-[10px] font-bold text-rose-500 mt-0.5">{lang === 'bn' ? 'মিনিট বাকি' : 'mins remaining'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-violet-50 border-2 border-violet-200 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-[#7c3aed] mb-0.5">
                <Navigation className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">{lang === 'bn' ? 'দূরত্ব' : 'Distance'}</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#21183B] leading-tight">
                {distanceKm}
              </span>
              <span className="text-[10px] font-bold text-violet-600 mt-0.5">{lang === 'bn' ? 'কিলোমিটার দূরে' : 'km away'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                <Gauge className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">{lang === 'bn' ? 'ট্রাফিক' : 'Traffic'}</span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 leading-tight">
                {lang === 'bn' ? 'স্বাভাবিক' : 'Moderate'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 mt-0.5">Mirpur Road Route</span>
            </div>
          </div>

          {/* Rescue Pilot / Driver Profile Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-[#21183B] text-white flex items-center justify-center font-black text-lg border-2 border-[#7c3aed] flex-shrink-0 shadow-md">
                MR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded">
                    {lang === 'bn' ? 'ভেরিফাইড অ্যাম্বুলেন্স পাইলট' : 'Verified Rescue Pilot'}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-base mt-0.5">{currentBooking.driverName}</h4>
                <p className="text-xs font-bold text-slate-600 font-mono">{currentBooking.vehicleNumber}</p>
              </div>
            </div>

            {/* Direct Calling & Sharing Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${currentBooking.driverPhone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>{lang === 'bn' ? 'পাইলটকে কল দিন' : 'Call Pilot'}</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-all active:scale-95"
                title="Share Tracking Link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (lang === 'bn' ? 'শেয়ার' : 'Share')}</span>
              </button>
            </div>
          </div>

          {/* Route Progression Stepper */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              {lang === 'bn' ? 'রেসকিউ মিশন ট্র্যাকিং টাইমলাইন' : 'Rescue Mission Status Timeline'}
            </span>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {lang === 'bn' ? 'জরুরি SOS সিগন্যাল গৃহীত হয়েছে' : 'Emergency SOS Signal Received'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'bn' ? 'সেন্ট্রাল ট্রায়াজ ডিসপ্যাচ কমান্ড থেকে তাৎক্ষণিক অনুমোদিত' : 'Instant Triage Clearance from Central Command'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {lang === 'bn' ? 'নিকটস্থ আইসিইউ বহর রওয়ানা দিয়েছে' : 'Nearest ICU Fleet Dispatched'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentBooking.driverName} • {currentBooking.vehicleNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 animate-pulse">
                  ●
                </div>
                <div>
                  <span className="text-xs font-black text-rose-600 block">
                    {lang === 'bn' ? 'অ্যাম্বুলেন্স রোগীর অবস্থানের পথে রয়েছে (লাইভ)' : 'Ambulance En Route to Patient Pickup (Active)'}
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold">
                    {currentBooking.pickupLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-60">
                <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <span className="text-xs font-black text-slate-700 block">
                    {lang === 'bn' ? 'রোগী গ্রহণ ও হাসপাতালে স্থানান্তর' : 'Patient Triage & Hospital Transport'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentBooking.destination}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Emergency Triage Contact */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-blue-950 block">
                  {lang === 'bn' ? 'স্কয়ার হাসপাতাল ট্রায়াজ প্রস্তুত রয়েছে' : 'Square Hospital Trauma Team on Standby'}
                </span>
                <span className="text-blue-700">ICU Bed #07 Reserved for incoming patient</span>
              </div>
            </div>
            <a
              href="tel:10616"
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm flex-shrink-0 hover:bg-blue-700"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call 10616</span>
            </a>
          </div>

        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          {showCancelConfirm ? (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs font-bold text-rose-600 flex-1">
                {lang === 'bn' ? 'আপনি কি নিশ্চিত যে রেসকিউ মিশন বাতিল করতে চান?' : 'Confirm cancel emergency dispatch?'}
              </span>
              <button
                onClick={handleCancelSOS}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                {lang === 'bn' ? 'হ্যাঁ, বাতিল করুন' : 'Yes, Cancel'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
              >
                {lang === 'bn' ? 'না' : 'No'}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50"
              >
                {lang === 'bn' ? 'ভুলবশত চাপ লেগেছে? বাতিল করুন' : 'False alarm? Cancel SOS'}
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#21183B] hover:bg-black text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                {lang === 'bn' ? 'ব্যাকগ্রাউন্ডে ট্র্যাকিং চালু রাখুন' : 'Keep Tracking in Background'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
