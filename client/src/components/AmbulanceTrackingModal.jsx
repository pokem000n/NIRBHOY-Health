import React, { useState, useEffect } from 'react';
import { X, Ambulance, Phone, Navigation, Clock, ShieldCheck, MapPin, Share2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AmbulanceTrackingModal({ open, onClose, booking }) {
  const { lang } = useLanguage();
  const [etaSeconds, setEtaSeconds] = useState(booking ? (booking.etaMinutes || 9) * 60 : 540);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setEtaSeconds(prev => (prev > 10 ? prev - 1 : 10));
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  if (!open || !booking) return null;

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;

  const handleShare = () => {
    navigator.clipboard?.writeText(`Tracking NIRBHOY Ambulance: ID ${booking.trackingId}. Driver: ${booking.driverName} (${booking.driverPhone}). ETA: ${minutes} mins.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              TRACKING ID: {booking.trackingId}
            </span>
            <span className="text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              En Route
            </span>
          </div>

          <h3 className="text-2xl font-black mt-2 text-white">
            {lang === 'bn' ? 'অ্যাম্বুলেন্স আপনার পথে আসছে' : 'Ambulance is En Route'}
          </h3>
          <p className="text-xs text-orange-100">Live GPS tracking active in Bangladesh dispatch system</p>
        </div>

        {/* Simulated Map / Radar View */}
        <div className="relative h-48 bg-slate-900 overflow-hidden flex items-center justify-center">
          {/* Radar Circles */}
          <div className="absolute h-64 w-64 rounded-full border border-orange-500/30 animate-ping"></div>
          <div className="absolute h-44 w-44 rounded-full border border-orange-500/20"></div>
          <div className="absolute h-24 w-24 rounded-full border border-orange-500/40"></div>

          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Target Pickup Location Marker */}
          <div className="absolute right-14 top-12 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/50">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-white bg-blue-900/80 px-2 py-0.5 rounded mt-1">
              Pickup Point
            </span>
          </div>

          {/* Moving Ambulance Marker */}
          <div className="absolute left-16 bottom-10 flex flex-col items-center animate-pulse">
            <div className="h-10 w-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/70">
              <Ambulance className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-white bg-orange-900/90 px-2 py-0.5 rounded mt-1">
              {booking.vehicleNumber || 'Ambulance'}
            </span>
          </div>

          {/* Dotted Route Connector */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-1/2 border-b-2 border-dashed border-orange-400 opacity-60 transform -rotate-12"></div>
          </div>
        </div>

        {/* ETA & Driver Info Body */}
        <div className="p-6 space-y-5">
          {/* Live ETA Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500 text-white rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-orange-800 uppercase tracking-wider block">
                  {lang === 'bn' ? 'পৌঁছানোর আনুমানিক সময় (ETA)' : 'Estimated Arrival'}
                </span>
                <span className="text-2xl font-black text-gray-900">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds} <span className="text-sm font-semibold text-gray-500">mins</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-orange-200 text-orange-700 hover:bg-orange-100/50 text-xs font-bold transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? 'Copied!' : 'Share Live Trip'}</span>
            </button>
          </div>

          {/* Driver & Vehicle Details */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Assigned Pilot / Driver
              </span>
              <h4 className="font-bold text-gray-900 text-base">{booking.driverName || 'Md. Rafiqul Islam'}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{booking.vehicleNumber || 'Dhaka Metro-Chha-11-8921'}</p>
            </div>

            <a
              href={`tel:${booking.driverPhone || '01711223344'}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Call Pilot</span>
            </a>
          </div>

          {/* Trip Details Checklist */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-800">Pickup: </span>
                <span>{booking.pickupLocation}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-800">Hospital: </span>
                <span>{booking.destination}</span>
              </div>
            </div>
          </div>

          {/* Close / Return Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all"
          >
            {lang === 'bn' ? 'ট্র্যাকিং স্ক্রিন মিনিমাইজ করুন' : 'Keep Tracking in Background'}
          </button>
        </div>
      </div>
    </div>
  );
}
