import React, { useState } from 'react';
import { X, Calendar, Clock, Video, User, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function DoctorBookingModal({ open, onClose, doctor, onBookingSuccess, onPaymentRequired }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(doctor?.slots?.[0] || '10:00 AM');
  const [consultationType, setConsultationType] = useState('video');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !doctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setError(lang === 'bn' ? 'দয়া করে রোগীর নাম ও ফোন নম্বর দিন' : 'Please provide patient name and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.bookAppointment({
        doctorId: doctor.id,
        patientName,
        patientPhone,
        date,
        time: selectedSlot,
        consultationType,
        symptoms: symptoms || "General Consultation"
      });

      // Pass to payment gateway
      onPaymentRequired({
        amount: doctor.fee,
        purpose: 'doctor_consultation',
        referenceId: res.appointment.id,
        description: `Consultation with ${doctor.name} (${doctor.specialty})`,
        metadata: res.appointment
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-blue-100">
                BMDC {doctor.bmdcNumber}
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">{doctor.name}</h3>
              <p className="text-xs text-blue-200">{doctor.specialty} • {doctor.hospital}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Consultation Type Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              {lang === 'bn' ? 'কনসালটেশন টাইপ' : 'Consultation Mode'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('video')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  consultationType === 'video'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${consultationType === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">{lang === 'bn' ? 'অনলাইন ভিডিও কল' : 'Online Video Call'}</p>
                  <p className="text-[10px] text-gray-500">HD Call + Digital Rx</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('chamber')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  consultationType === 'chamber'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${consultationType === 'chamber' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">{lang === 'bn' ? 'চেম্বার ভিজিট' : 'In-Person Chamber'}</p>
                  <p className="text-[10px] text-gray-500">{doctor.hospital.split(',')[0]}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date & Slot Selection */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'তারিখ নির্বাচন করুন' : 'Select Date'}
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'সময় (Slot)' : 'Available Slot'}
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800 bg-white"
              >
                {doctor.slots.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'রোগীর পূর্ণ নাম' : 'Patient Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="01712-XXXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Symptoms description */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'সমস্যা বা লক্ষণ (সংক্ষেপে)' : 'Symptoms / Medical Problem'}
            </label>
            <textarea
              rows={2}
              placeholder={lang === 'bn' ? 'জ্বর, কাশি বা বুক ব্যথার মতো সমস্যা উল্লেখ করুন...' : 'Briefly describe your symptoms...'}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
            />
          </div>

          {/* Fee & Checkout Bar */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Total Consultation Fee</span>
              <span className="text-2xl font-black text-blue-700">৳{doctor.fee}</span>
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
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                {loading ? 'Booking...' : (lang === 'bn' ? 'পেমেন্ট করুন (bKash/Cards)' : 'Proceed to Payment')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
