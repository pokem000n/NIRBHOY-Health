import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Video, FileText, Ambulance, Package, LogOut, CheckCircle2, Ticket, Building2, Droplet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function UserProfileModal({ open, onClose, onJoinCall }) {
  const { lang } = useLanguage();
  const { currentUser, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [chambers, setChambers] = useState([]);
  const [activeTab, setActiveTab] = useState('chambers'); // 'chambers', 'online', 'prescriptions'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadAppointments();
    }
  }, [open]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAppointments();
      setAppointments(data.appointments || []);
      setChambers(data.chambers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black text-white ring-2 ring-white/30">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full">
                  {currentUser.subscription?.status === 'active' ? 'Premium Member' : 'Standard Patient'}
                </span>
              </div>
              <p className="text-xs text-blue-200">{currentUser.email} • {currentUser.phone}</p>
              <p className="text-[11px] text-blue-300 mt-0.5">{currentUser.address || 'Dhaka, Bangladesh'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-4 bg-gray-50/50">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('chambers')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'chambers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>Chamber Serials ({chambers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('online')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'online'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Video Consultations ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'prescriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Digital Prescriptions</span>
            </button>
          </div>

          <button
            onClick={() => { logout(); onClose(); }}
            className="pb-3 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {activeTab === 'chambers' ? (
            chambers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Ticket className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No offline chamber serials booked yet.</p>
              </div>
            ) : (
              chambers.map((tkt) => (
                <div
                  key={tkt.id}
                  className="bg-white border-2 border-indigo-100 rounded-3xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center font-black text-indigo-700">
                        <span className="text-[10px] uppercase font-bold text-gray-400">SERIAL</span>
                        <span className="text-lg -mt-1 font-black">#{tkt.serialNumber}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-base">{tkt.doctorName}</h4>
                        <p className="text-xs text-blue-600 font-semibold">{tkt.doctorSpecialty} • BMDC {tkt.bmdcNumber}</p>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                      Confirmed & Paid ৳{tkt.chamberFee}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-700 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block font-medium">Chamber Hospital:</span>
                      <span className="font-bold text-gray-900">{tkt.hospitalName}</span>
                      <p className="text-gray-500">{tkt.area} ({tkt.roomNumber})</p>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Appointment Date & Timing:</span>
                      <span className="font-bold text-gray-900">{tkt.date} ({tkt.visitingDays})</span>
                      <p className="text-indigo-600 font-semibold">{tkt.visitingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>Patient: <strong>{tkt.patientName}</strong> ({tkt.patientPhone})</span>
                    <button
                      onClick={() => alert(`Chamber Serial #${tkt.serialNumber}\nDoctor: ${tkt.doctorName}\nHospital: ${tkt.hospitalName}\nRoom: ${tkt.roomNumber}\nDate: ${tkt.date}`)}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-bold text-gray-700"
                    >
                      Print Slip
                    </button>
                  </div>
                </div>
              ))
            )
          ) : activeTab === 'online' ? (
            appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No online video consultations booked.</p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{apt.doctorName}</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Online Video
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                        Paid ৳{apt.fee}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{apt.doctorSpecialty} • Slot: {apt.date} at {apt.time}</p>
                    <p className="text-xs text-gray-600 italic">"{apt.symptoms}"</p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onJoinCall(apt);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Enter Call Room</span>
                  </button>
                </div>
              ))
            )
          ) : (
            /* Prescriptions Tab */
            <div className="space-y-3">
              {appointments.filter(a => a.prescription).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No prescriptions issued yet.</p>
                </div>
              ) : (
                appointments.filter(a => a.prescription).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Rx: {apt.prescription.diagnosis}</h4>
                      <p className="text-xs text-gray-500">By {apt.doctorName} • Date: {apt.prescription.date}</p>
                    </div>
                    <button
                      onClick={() => alert(`Prescription Rx Details:\n${JSON.stringify(apt.prescription.medicines, null, 2)}`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                    >
                      View Rx
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
