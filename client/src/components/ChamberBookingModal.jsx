import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Hospital, User, Phone, FileText, CheckCircle2, Ticket, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function ChamberBookingModal({ open, onClose, doctor, selectedChamber, onPaymentRequired, onSerialBooked }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [chosenChamberId, setChosenChamberId] = useState(selectedChamber?.id || doctor?.chambers?.[0]?.id || '');
  const [date, setDate] = useState(selectedChamber?.nextAvailableDate || new Date().toISOString().split('T')[0]);
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAge, setPatientAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !doctor) return null;

  const currentChamber = doctor.chambers?.find(c => c.id === chosenChamberId) || doctor.chambers?.[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !currentChamber) {
      setError(lang === 'bn' ? 'দয়া করে রোগীর নাম, ফোন নম্বর ও চেম্বার নির্বাচন করুন' : 'Please provide patient name, phone number, and chamber');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.bookChamberSerial({
        doctorId: doctor.id,
        chamberId: currentChamber.id,
        patientName,
        patientPhone,
        patientAge: patientAge || "Adult",
        date,
        symptoms: symptoms || "Chamber Consultation"
      });

      onPaymentRequired({
        amount: currentChamber.chamberFee,
        purpose: 'chamber_serial',
        referenceId: res.ticket.id,
        description: `Offline Chamber Serial with ${doctor.name} at ${currentChamber.hospitalName}`,
        metadata: res.ticket
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Chamber booking failed');
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
          
          <div className="flex items-center gap-3.5">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-blue-400 border border-slate-700">
                OFFLINE CHAMBER SERIAL BOOKING
              </span>
              <h3 className="text-base font-bold mt-1 text-white">{doctor.name}</h3>
              <p className="text-xs text-slate-400 font-normal">{doctor.specialty} • BMDC {doctor.bmdcNumber}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Chamber Location Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              {lang === 'bn' ? 'ডাক্তারের চেম্বার / হাসপাতাল বেছে নিন' : 'Select Chamber & Hospital Location'}
            </label>
            <div className="space-y-2">
              {doctor.chambers?.map((chamb) => (
                <div
                  key={chamb.id}
                  onClick={() => {
                    setChosenChamberId(chamb.id);
                    setDate(chamb.nextAvailableDate);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    currentChamber?.id === chamb.id
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Hospital className="h-4 w-4 text-teal-600" />
                      <h4 className="font-bold text-navy-950 text-xs sm:text-sm">{chamb.hospitalName}</h4>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-teal-700">৳{chamb.chamberFee}</span>
                  </div>

                  <div className="mt-1.5 text-xs text-slate-500 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="truncate">{chamb.area} ({chamb.roomNumber})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="truncate">{chamb.visitingDays}: {chamb.visitingHours}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-teal-800 font-medium">
                      Next Sitting: {chamb.nextAvailableDate}
                    </span>
                    <span className="bg-pulse-50 text-pulse-electric font-bold px-2 py-0.2 rounded border border-pulse-200">
                      Serial #{chamb.currentBookedSerials + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              {lang === 'bn' ? 'সাক্ষাতের তারিখ' : 'Chamber Appointment Date'}
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          {/* Patient Details */}
          <div className="grid sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'রোগীর পূর্ণ নাম' : 'Patient Full Name'}
              </label>
              <input
                type="text"
                placeholder="Patient Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-blue-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'বয়স' : 'Age'}
              </label>
              <input
                type="text"
                placeholder="e.g. 35"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              {lang === 'bn' ? 'মোবাইল নম্বর' : 'Contact Phone Number'}
            </label>
            <input
              type="tel"
              placeholder="01712-XXXXXX"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-blue-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              {lang === 'bn' ? 'প্রধান সমস্যা বা প্রিভিয়াস হিস্ট্রি' : 'Primary Complaint / Notes'}
            </label>
            <textarea
              rows={2}
              placeholder={lang === 'bn' ? 'যেমন: ৩ মাস ধরে মাথাব্যথা বা বুক ধড়ফড়...' : 'Brief description of illness...'}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* Summary & Checkout Action */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Chamber Fee</span>
              <span className="text-xl font-bold text-navy-950">৳{currentChamber?.chamberFee || 1000}</span>
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
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Ticket className="h-4 w-4" />
                <span>{loading ? 'Booking...' : (lang === 'bn' ? 'সিরিয়াল নিশ্চিত করুন' : 'Confirm Chamber Serial')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
