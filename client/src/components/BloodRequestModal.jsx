import React, { useState } from 'react';
import { X, Droplet, Hospital, Phone, User, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function BloodRequestModal({ open, onClose, defaultGroup = 'O+', onRequestCreated }) {
  const { lang } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState(defaultGroup);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [area, setArea] = useState('Dhanmondi, Dhaka');
  const [bagsNeeded, setBagsNeeded] = useState(1);
  const [urgency, setUrgency] = useState('Immediate Emergency (Within 2 hours)');
  const [reason, setReason] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !hospitalName.trim() || !contactPhone.trim()) {
      setError(lang === 'bn' ? 'রোগীর নাম, হাসপাতাল ও মোবাইল নম্বর দিন' : 'Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.createBloodRequest({
        patientName,
        bloodGroup,
        bagsNeeded: Number(bagsNeeded),
        hospitalName,
        area,
        urgency,
        reason: reason || "Emergency Surgery / Blood Transfusion",
        contactName: contactName || patientName,
        contactPhone
      });

      setSuccess(true);
      onRequestCreated?.(res.request);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit blood request');
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
              <Droplet className="h-6 w-6 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-rose-300 border border-slate-700">
                EMERGENCY BLOOD BROADCAST
              </span>
              <h3 className="text-base font-bold mt-1 text-white">
                {lang === 'bn' ? 'জরুরি রক্তের আবেদন করুন' : 'Post Emergency Blood Request'}
              </h3>
              <p className="text-xs text-slate-400 font-normal">Broadcasts instant notification to nearby verified donors</p>
            </div>
          </div>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3.5">
            <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'রক্তের আবেদন পোস্ট করা হয়েছে!' : 'Blood Request Broadcasted!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
              {lang === 'bn'
                ? 'নিকটস্থ নিবন্ধিত ডোনার ও ব্লাড ব্যাংকগুলোতে অ্যালার্ট পাঠানো হয়েছে। ডোনাররা সরাসরি আপনার সাথে যোগাযোগ করবেন।'
                : 'Nearby donors and partner blood banks have received distress alerts. They will call you directly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Blood Group Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Required Blood Group'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => setBloodGroup(bg)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-all border ${
                      bloodGroup === bg
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient & Bags */}
            <div className="grid sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'রোগীর পূর্ণ নাম' : 'Patient Name'}
                </label>
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'ব্যাগ সংখ্যা' : 'Bags Needed'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={bagsNeeded}
                  onChange={(e) => setBagsNeeded(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-bold"
                  required
                />
              </div>
            </div>

            {/* Hospital & Area */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'হাসপাতালের নাম ও ওয়ার্ড' : 'Hospital & Ward'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. DMCH (Ward 14) or Square ICU"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'এলাকা / থানা' : 'Location / Area'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'কখন প্রয়োজন (জরুরি মাত্রা)' : 'Required Timeline (Urgency)'}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium bg-white"
              >
                <option value="Immediate Emergency (Within 2 hours)">Immediate Emergency (Within 2 hours)</option>
                <option value="Today (Within 6 hours)">Today (Within 6 hours)</option>
                <option value="Tomorrow (Within 24 hours)">Tomorrow / Scheduled Operation</option>
              </select>
            </div>

            {/* Contact details */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'যোগাযোগকারীর নাম' : 'Contact Person'}
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'যোগাযোগের মোবাইল' : 'Contact Phone'}
                </label>
                <input
                  type="tel"
                  placeholder="01712-XXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>
            </div>

            {/* Action buttons */}
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
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Droplet className="h-4 w-4 fill-white" />
                <span>{loading ? 'Broadcasting...' : (lang === 'bn' ? 'আবেদন প্রকাশ করুন' : 'Broadcast Request')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
