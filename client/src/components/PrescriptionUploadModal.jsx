import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Phone, MapPin, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function PrescriptionUploadModal({ open, onClose }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [preview, setPreview] = useState(null);
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      setError(lang === 'bn' ? 'দয়া করে প্রেসক্রিপশনের ছবি সিলেক্ট করুন' : 'Please select or upload a prescription image');
      return;
    }
    if (!patientPhone.trim() || !deliveryAddress.trim()) {
      setError(lang === 'bn' ? 'ফোন নম্বর ও ডেলিভারি ঠিকানা আবশ্যক' : 'Phone number and delivery address are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ApiService.uploadPrescription({
        prescriptionImage: preview,
        patientName,
        patientPhone,
        deliveryAddress,
        notes
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPreview(null);
        onClose();
      }, 3500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Prescription upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <UploadCloud className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                100% Confidential
              </span>
              <h3 className="text-xl font-black mt-1 text-white">
                {lang === 'bn' ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Doctor Prescription'}
              </h3>
              <p className="text-xs text-emerald-100">Verified by DGHS Licensed Pharmacists</p>
            </div>
          </div>
        </div>

        {/* Form Body or Success State */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-black text-gray-900">
              {lang === 'bn' ? 'প্রেসক্রিপশন সফলভাবে জমা হয়েছে!' : 'Prescription Submitted!'}
            </h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              {lang === 'bn'
                ? 'আমাদের ফার্মাসিস্ট প্রেসক্রিপশন যাচাই করে আপনাকে ফোন করবেন এবং ৪৫ মিনিটে ওষুধ পৌঁছে দেওয়া হবে।'
                : 'Our registered A-Grade pharmacist will verify the dosages and contact you within 5-10 minutes.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/30 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="Prescription Preview" className="h-32 mx-auto object-contain rounded-lg shadow-sm" />
                  <p className="text-xs text-emerald-700 font-bold">Image selected! Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="h-10 w-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-gray-800">
                    {lang === 'bn' ? 'প্রেসক্রিপশনের ছবি আপলোড করুন' : 'Click or Drag & Drop Prescription'}
                  </p>
                  <p className="text-[11px] text-gray-400">JPG, PNG, WebP or PDF (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Contact & Address Fields */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'রোগীর নাম' : 'Patient Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House 24, Road 5, Dhanmondi, Dhaka"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'বিশেষ নির্দেশনা (ঐচ্ছিক)' : 'Special Instructions / Dosage Notes'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'bn' ? 'নির্দিষ্ট কোনো ব্র্যান্ড বা নির্দেশনা থাকলে লিখুন...' : 'Any brand preference or note for pharmacist...'}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
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
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {loading ? 'Uploading...' : (lang === 'bn' ? 'প্রেসক্রিপশন পাঠান' : 'Submit Prescription')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
