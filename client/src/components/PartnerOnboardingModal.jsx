import React, { useState } from 'react';
import { X, Building2, Pill, Ambulance, ShieldCheck, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function PartnerOnboardingModal({ open, onClose }) {
  const { lang } = useLanguage();
  const [partnerType, setPartnerType] = useState('hospital'); // 'hospital', 'pharmacy', 'ambulance'
  const [organizationName, setOrganizationName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [facilities, setFacilities] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organizationName.trim() || !phone.trim()) {
      setError(lang === 'bn' ? 'প্রতিষ্ঠানের নাম ও ফোন নম্বর দিন' : 'Organization name and phone are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ApiService.registerPartner({
        organizationName,
        partnerType,
        contactPerson,
        phone,
        email,
        address,
        licenseNumber,
        facilitiesOffered: facilities.split(',').map(s => s.trim()).filter(Boolean)
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Onboarding submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden my-8 border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-blue-300 border border-slate-700">
                JOIN BANGLADESH HEALTHCARE NETWORK
              </span>
              <h3 className="text-base font-bold mt-1 text-white">
                {lang === 'bn' ? 'পার্টনার অনবোর্ডিং রেজিস্ট্রেশন' : 'Partner Facility Onboarding'}
              </h3>
              <p className="text-xs text-slate-400 font-normal">Expand your reach to 50,000+ patients across Bangladesh</p>
            </div>
          </div>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3.5">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'আবেদন সফলভাবে গ্রহণ করা হয়েছে!' : 'Partner Application Received!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
              আমাদের অনবোর্ডিং ম্যানেজার আগামী ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করে ভেরিফিকেশন ও এপিআই ইন্টিগ্রেশন সম্পন্ন করবেন।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Partner Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'প্রতিষ্ঠানের ধরন' : 'Partner Facility Category'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hospital', label: 'Hospital / Clinic', icon: Building2 },
                  { id: 'pharmacy', label: 'Pharmacy Chain', icon: Pill },
                  { id: 'ambulance', label: 'Ambulance Owner', icon: Ambulance }
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = partnerType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setPartnerType(type.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <span className="text-[11px] block">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Organization Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'প্রতিষ্ঠান বা ফার্মেসির নাম' : 'Organization Name'}
              </label>
              <input
                type="text"
                placeholder="e.g. Modern Specialized Hospital or Green Care Pharmacy"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            {/* Contact Person & Phone */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  placeholder="Manager / Director"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Official Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                  required
                />
              </div>
            </div>

            {/* License & Location */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  DGHS / DGDA / Trade License No
                </label>
                <input
                  type="text"
                  placeholder="License or Registration #"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                placeholder="House, Road, Area, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Facilities to List (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. ICU Beds, Doctors Chambers, In-House Pharmacy, 24/7 Ambulance, Blood Bank"
                value={facilities}
                onChange={(e) => setFacilities(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                {loading ? 'Submitting...' : (lang === 'bn' ? 'আবেদন জমা দিন' : 'Submit Application')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
