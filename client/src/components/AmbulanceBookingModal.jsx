import React, { useState } from 'react';
import { X, Ambulance, MapPin, Phone, User, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function AmbulanceBookingModal({ open, onClose, defaultType, onDispatched }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [ambulanceType, setAmbulanceType] = useState(defaultType || 'ICU Ambulance (Life Support)');
  const [pickupLocation, setPickupLocation] = useState(currentUser?.address || '');
  const [destination, setDestination] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [emergencyType, setEmergencyType] = useState('Critical Cardiac / Trauma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupLocation.trim() || !phone.trim()) {
      setError(lang === 'bn' ? 'দয়া করে পিকআপ ঠিকানা ও ফোন নম্বর দিন' : 'Please provide pickup location and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.bookAmbulance({
        pickupLocation,
        destination: destination || "Nearest Tertiary Hospital",
        patientName,
        phone,
        emergencyType,
        ambulanceType
      });

      onDispatched(res.booking);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to dispatch ambulance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Ambulance className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-orange-100">
                24/7 Rapid Dispatch
              </span>
              <h3 className="text-xl font-black mt-1 text-white">
                {lang === 'bn' ? 'জরুরি অ্যাম্বুলেন্স ডিসপ্যাচ' : 'Dispatch Emergency Ambulance'}
              </h3>
              <p className="text-xs text-orange-100">ETA in Dhaka metropolitan: 8 - 12 minutes</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Select Ambulance Type */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'অ্যাম্বুলেন্সের ধরন' : 'Ambulance Category'}
            </label>
            <select
              value={ambulanceType}
              onChange={(e) => setAmbulanceType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold text-gray-800 bg-white"
            >
              <option value="ICU Ambulance (Life Support)">ICU Ambulance with Ventilator (৳4,500 base)</option>
              <option value="AC Ambulance">AC Ambulance with Oxygen (৳1,800 base)</option>
              <option value="Non-AC Standard Ambulance">Non-AC Standard Ambulance (৳1,200 base)</option>
              <option value="Freezing Ambulance">Freezing Ambulance (৳3,000 base)</option>
            </select>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'পিকআপের সঠিক ঠিকানা / এলাকা' : 'Pickup Location (House, Road, Area)'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
              <input
                type="text"
                placeholder="e.g. House 14, Road 7, Dhanmondi, Dhaka"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-800"
                required
              />
            </div>
          </div>

          {/* Destination Hospital */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'গন্তব্য হাসপাতাল (ঐচ্ছিক)' : 'Destination Hospital (Optional)'}
            </label>
            <input
              type="text"
              placeholder="e.g. DMCH, Square Hospital, Evercare or Nearest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-800"
            />
          </div>

          {/* Patient Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'রোগীর নাম' : 'Patient Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'জরুরি ফোন নম্বর' : 'Emergency Contact'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="01712-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Nature */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'রোগের প্রকৃতি / জরুরি অবস্থা' : 'Nature of Medical Emergency'}
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-gray-800 bg-white"
            >
              <option value="Critical Cardiac / Trauma">Heart Attack / Chest Pain / Stroke</option>
              <option value="Severe Respiratory Distress">Breathing Problem / Oxygen Low</option>
              <option value="Road Accident / Fracture">Road Accident / Physical Trauma</option>
              <option value="Maternal / Delivery Emergency">Pregnancy / Labor Emergency</option>
              <option value="General Patient Transfer">Inter-hospital Transfer</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span className="font-bold text-orange-600 block">No Advance Needed</span>
              <span>Pay driver directly or via bKash</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                {loading ? 'Dispatched...' : (lang === 'bn' ? 'অ্যাম্বুলেন্স পাঠান' : 'Dispatch Now')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
