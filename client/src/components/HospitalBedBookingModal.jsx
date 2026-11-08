import React, { useState } from 'react';
import { X, Building2, Bed, Phone, User, CheckCircle2, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function HospitalBedBookingModal({ open, onClose, hospital, defaultBedType = 'icu', onReserved }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [bedType, setBedType] = useState(defaultBedType);
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorReferral, setDoctorReferral] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');

  if (!open || !hospital) return null;

  const bedInfo = hospital.beds?.[bedType] || { available: 4, feePerDay: 5000, total: 15 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setError(lang === 'bn' ? 'রোগীর নাম ও ফোন নম্বর দিন' : 'Please provide patient name and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.bookHospitalBed({
        hospitalId: hospital.id,
        bedType,
        patientName,
        patientPhone,
        emergencyContact: emergencyContact || patientPhone,
        symptoms,
        doctorReferral
      });

      setReservation(res.reservation);
      onReserved?.(res.reservation);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Bed reservation failed');
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
              <Building2 className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-teal-300 border border-slate-700">
                HOSPITAL BED & SEAT RESERVATION
              </span>
              <h3 className="text-base font-bold mt-1 text-white">{hospital.name}</h3>
              <p className="text-xs text-slate-400 font-normal">{hospital.area} • Hotline: {hospital.emergencyHotline}</p>
            </div>
          </div>
        </div>

        {reservation ? (
          /* Confirmation State */
          <div className="p-6 text-center space-y-4">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                ADMISSION TOKEN ACTIVE
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{reservation.tokenNumber}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Present this token at the emergency admission desk</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Reserved Bed:</span>
                <span className="font-semibold text-slate-900">{reservation.bedType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Charge:</span>
                <span className="font-bold text-teal-700">৳{reservation.dailyFeeBDT}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{reservation.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hold Duration:</span>
                <span className="font-bold text-pulse-electric">Valid for {reservation.validForHours} Hours</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${hospital.emergencyHotline}`}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Admission Desk</span>
              </a>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Select Bed Type */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'বেড / সিটের ক্যাটাগরি' : 'Select Bed Category'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'icu', name: 'ICU Bed', desc: 'Ventilator life support' },
                  { id: 'ccu', name: 'CCU Bed', desc: 'Coronary cardiac unit' },
                  { id: 'cabin', name: 'AC Single Cabin', desc: 'Private suite' },
                  { id: 'generalWard', name: 'General Ward', desc: 'Economy clinical bed' }
                ].map((b) => {
                  const bStat = hospital.beds?.[b.id] || { available: 5, feePerDay: 4000 };
                  const isSelected = bedType === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setBedType(b.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy-950 text-xs">{b.name}</span>
                        <span className="text-xs font-bold text-teal-700">৳{bStat.feePerDay}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
                      <span className="text-[10px] font-medium text-teal-800 block mt-1">
                        ● {bStat.available} beds vacant now
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patient Name & Phone */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'রোগীর পূর্ণ নাম' : 'Patient Name'}
                </label>
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-teal-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'রোগী / অভিভাবকের ফোন' : 'Contact Phone'}
                </label>
                <input
                  type="tel"
                  placeholder="01712-XXXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-teal-600 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'রেফারেল ডাক্তার (যদি থাকে)' : 'Referral Doctor / Hospital Memo'}
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Farhana Yasmin or Self Emergency"
                value={doctorReferral}
                onChange={(e) => setDoctorReferral(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'জরুরি কারণ / বর্তমান অবস্থা' : 'Medical Condition / Symptoms'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'bn' ? 'জরুরি আইসিইউ প্রয়োজন বা স্ট্রোক...' : 'e.g. ICU admission for respiratory distress...'}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-normal">Daily Rate</span>
                <span className="text-lg font-bold text-navy-950">৳{bedInfo.feePerDay}/day</span>
              </div>

              <div className="flex items-center gap-2">
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  {loading ? 'Reserving...' : (lang === 'bn' ? 'সিট রিজার্ভ করুন' : 'Generate Token')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
