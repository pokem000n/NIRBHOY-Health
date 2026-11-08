import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, FileText, CheckCircle2, MessageSquare, Shield, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function TelemedicineRoomModal({ open, onClose, appointment }) {
  const { lang } = useLanguage();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [activeTab, setActiveTab] = useState('call'); // 'call' or 'prescription'
  const [rxGenerated, setRxGenerated] = useState(null);
  const [loadingRx, setLoadingRx] = useState(false);

  if (!open || !appointment) return null;

  const handleGeneratePrescription = async () => {
    setLoadingRx(true);
    try {
      const res = await ApiService.prescribeMedicine(appointment.id, {
        diagnosis: "Upper Respiratory Tract Infection with Fever",
        medicines: [
          { name: "Napa Extra 500mg+65mg", dosage: "1+0+1", duration: "5 days", timing: "ভরা পেটে (After meal)" },
          { name: "Sergel 20mg", dosage: "1+0+1", duration: "7 days", timing: "খাওয়ার ২০ মিনিট আগে (Before meal)" },
          { name: "Fexo 120mg", dosage: "0+0+1", duration: "5 days", timing: "রাতে শোয়ার আগে (At bedtime)" }
        ],
        advice: "প্রচুর কুসুম গরম পানি ও তরল খাবার পান করুন। ৫ দিন পর জ্বর না কমলে সিবিসি পরীক্ষা করুন।"
      });
      setRxGenerated(res.prescription);
      setActiveTab('prescription');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-4 border border-slate-700 flex flex-col h-[85vh]">
        {/* Top Header */}
        <div className="bg-slate-800/90 px-6 py-3.5 border-b border-slate-700 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">{appointment.doctorName}</h4>
              <p className="text-[11px] text-slate-300">BMDC {appointment.bmdcNumber} • Consultation Room</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'call' ? 'prescription' : 'call')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'prescription' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{rxGenerated ? 'View Prescription' : 'Digital Rx'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'call' ? (
          <div className="relative flex-1 bg-slate-950 flex flex-col items-center justify-center overflow-hidden p-4">
            {/* Doctor Video Feed Simulation */}
            <div className="relative w-full h-full max-h-[500px] rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700">
              <img
                src={appointment.doctorImage || "https://images.unsplash.com/photo-1594824813511-37d402b1f868?auto=format&fit=crop&q=80&w=1200"}
                alt="Doctor Feed"
                className="w-full h-full object-cover filter brightness-95"
              />

              {/* Watermark badge */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
                <span>Encrypted Telemedicine Call</span>
              </div>

              {/* Self Camera Inset Preview */}
              <div className="absolute bottom-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-xl bg-slate-900/90 border-2 border-slate-600 overflow-hidden shadow-2xl flex items-center justify-center">
                {camOn ? (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex flex-col items-center justify-center text-white text-[11px] p-2 text-center">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                      {appointment.patientName?.charAt(0) || 'P'}
                    </div>
                    <span className="font-bold truncate max-w-[100px]">{appointment.patientName}</span>
                    <span className="text-[9px] text-slate-300">You (HD Feed)</span>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                    <VideoOff className="h-5 w-5" />
                    <span className="text-[10px]">Camera Off</span>
                  </div>
                )}
              </div>
            </div>

            {/* In-call controls bar */}
            <div className="mt-4 flex items-center gap-4 bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700 flex-shrink-0">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-xl transition-all ${
                  micOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white'
                }`}
                title={micOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCamOn(!camOn)}
                className={`p-3 rounded-xl transition-all ${
                  camOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-600 text-white'
                }`}
                title={camOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button
                onClick={handleGeneratePrescription}
                disabled={loadingRx}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <FileText className="h-4 w-4" />
                <span>{loadingRx ? 'Generating...' : 'Issue Prescription'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-all"
                title="End Call"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Digital Prescription View */
          <div className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto border-2 border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              {/* Doctor Prescription Header */}
              <div className="flex items-center justify-between pb-5 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{appointment.doctorName}</h3>
                  <p className="text-xs font-semibold text-blue-600">{appointment.doctorSpecialty}</p>
                  <p className="text-[11px] text-gray-500">BMDC Reg No: {appointment.bmdcNumber} • Dhaka, Bangladesh</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tight text-blue-700">NIRBHOY<span className="text-blue-500 font-normal">Rx</span></span>
                  <p className="text-[11px] text-gray-400">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* Patient Meta */}
              <div className="py-4 border-b border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block">Patient Name:</span>
                  <span className="font-bold text-gray-800">{appointment.patientName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Contact:</span>
                  <span className="font-bold text-gray-800">{appointment.patientPhone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Consultation Type:</span>
                  <span className="font-bold text-blue-600 uppercase">Telemedicine Video</span>
                </div>
              </div>

              {/* Prescription Body (Rx) */}
              <div className="py-6 space-y-4">
                <div className="text-2xl font-black text-blue-700 italic">Rx</div>

                {rxGenerated ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {rxGenerated.medicines.map((m, idx) => (
                        <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-black text-gray-900 text-sm block">{idx + 1}. {m.name}</span>
                            <span className="text-gray-500">{m.timing}</span>
                          </div>
                          <div className="text-right font-bold text-blue-700">
                            <span>{m.dosage}</span>
                            <span className="text-[10px] text-gray-400 block font-normal">{m.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-700 block mb-1">Doctor's Advice:</span>
                      <p className="text-xs text-gray-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        {rxGenerated.advice}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 mb-3">No digital prescription issued yet for this call.</p>
                    <button
                      onClick={handleGeneratePrescription}
                      disabled={loadingRx}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      {loadingRx ? 'Generating...' : 'Issue Prescription Now'}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Digitally Verified Signature
                </span>
                <button
                  onClick={() => alert("Digital Prescription downloaded as PDF!")}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-bold text-gray-700 flex items-center gap-1 text-[11px]"
                >
                  <Download className="h-3 w-3" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
