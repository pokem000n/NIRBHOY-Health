import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, MapPin, Bed, Video, Ambulance, Pill, Droplet, Star, Clock, ShieldCheck, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function HospitalDetailModal({ open, onClose, hospitalId, onBookBed, onDoctorSelect, onAmbulanceClick }) {
  const { lang } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('beds'); // 'beds', 'doctors', 'ambulances', 'pharmacy', 'blood'

  useEffect(() => {
    if (open && hospitalId) {
      loadDetails();
    }
  }, [open, hospitalId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await ApiService.getHospitalDetails(hospitalId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !hospitalId) return null;

  const hospital = data?.hospital;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-navy-950 text-white p-5 sm:p-6 relative flex-shrink-0 border-b border-navy-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-navy-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-7 w-7 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-navy-800 text-teal-300 px-2 py-0.5 rounded border border-navy-700">
                    {hospital?.type || 'Tertiary Care'}
                  </span>
                  <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span> 24/7 Active
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">{hospital?.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-400" /> {hospital?.area}
                  </span>
                  <span>•</span>
                  <span className="text-teal-300 font-semibold">{hospital?.distanceKm} km away from your location</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${hospital?.emergencyHotline}`}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Emergency {hospital?.emergencyHotline}</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-navy-100 bg-navy-50/30 overflow-x-auto scrollbar-none flex-shrink-0">
          {[
            { id: 'beds', label: 'Seat & Bed Availability', icon: Bed },
            { id: 'doctors', label: `Doctors (${data?.doctors?.length || 0})`, icon: Video },
            { id: 'ambulances', label: `Ambulance Fleet (${data?.ambulances?.length || 0})`, icon: Ambulance },
            { id: 'pharmacy', label: 'In-House Pharmacy', icon: Pill },
            { id: 'blood', label: 'Blood Bank Inventory', icon: Droplet }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 font-bold text-xs whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                  isSelected
                    ? 'border-teal-600 text-teal-800 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-navy-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 className="h-12 w-12 animate-pulse mx-auto mb-2 text-indigo-300" />
              <p className="text-sm font-semibold">Loading hospital integrated network...</p>
            </div>
          ) : activeTab === 'beds' ? (
            /* Beds Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-base">Real-Time Bed & Seat Occupancy</h4>
                  <p className="text-xs text-gray-500">Live data synced with {hospital?.name} admission desk</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospital?.beds && Object.entries(hospital.beds).map(([bedKey, bInfo]) => (
                  <div
                    key={bedKey}
                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm uppercase text-gray-900 tracking-wider">
                          {bedKey === 'icu' ? 'ICU Bed (Ventilator)' : bedKey === 'ccu' ? 'CCU Cardiac Bed' : bedKey === 'nicu' ? 'NICU Neonatal' : bedKey === 'cabin' ? 'AC Private Cabin' : 'General Ward'}
                        </span>
                        <span className="text-xs font-black text-indigo-700">৳{bInfo.feePerDay}/day</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 py-1 border-t border-gray-100">
                        <span>Total Capacity:</span>
                        <span className="font-bold">{bInfo.total} Beds</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1">
                        <span>Currently Vacant:</span>
                        <span className="font-black text-emerald-600">● {bInfo.available} Beds Available</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onBookBed(hospital, bedKey);
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Reserve Admission Token</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'doctors' ? (
            /* Hospital Doctors */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-base">Consultants & Specialists Stationed Here</h4>
                  <p className="text-xs text-gray-500">Book online video consultation or in-person chamber serial</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {data?.doctors?.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-blue-300 bg-white shadow-sm flex items-start gap-3.5"
                  >
                    <img src={doc.image} alt={doc.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/20" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">BMDC {doc.bmdcNumber}</span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1 truncate">{doc.name}</h4>
                      <p className="text-xs text-blue-600 font-medium truncate">{doc.specialty}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900">৳{doc.onlineFee || 600}</span>
                        <button
                          onClick={() => {
                            onClose();
                            onDoctorSelect(doc);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                        >
                          Book Doctor
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'ambulances' ? (
            /* Hospital Ambulances */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-base">Hospital Stationed Emergency Ambulances</h4>
                  <p className="text-xs text-gray-500">Equipped with critical life support and paramedic staff</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {data?.ambulances?.map((amb) => (
                  <div key={amb.id} className="p-4 rounded-2xl border border-orange-200 bg-orange-50/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-gray-900">{amb.type}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Available</span>
                    </div>
                    <p className="text-xs text-gray-500">{amb.vehicleNumber} • Driver: {amb.driverName}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-orange-100">
                      <span className="font-black text-gray-900 text-sm">৳{amb.baseFee} Base</span>
                      <button
                        onClick={() => {
                          onClose();
                          onAmbulanceClick(amb.type, hospital.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                      >
                        Dispatch Fleet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'pharmacy' ? (
            /* In-House Pharmacy */
            <div className="space-y-4">
              {data?.pharmacy ? (
                <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">{data.pharmacy.name}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{data.pharmacy.dgdaLicense} • DGDA Certified</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{data.pharmacy.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-700 pt-2">
                    <span>⚡ Average Delivery: <strong>{data.pharmacy.deliveryTimeMinutes} mins</strong></span>
                    <span>•</span>
                    <span>📞 Contact: <strong>{data.pharmacy.phone}</strong></span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-8">In-house pharmacy details are being updated.</p>
              )}
            </div>
          ) : (
            /* Blood Bank Inventory */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-gray-900 text-base">Blood Bank Transfusion Unit Stock</h4>
                  <p className="text-xs text-gray-500">Screened and verified units stored at 2-6°C</p>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {hospital?.bloodInventory && Object.entries(hospital.bloodInventory).map(([bg, bags]) => (
                  <div key={bg} className="p-3 rounded-2xl bg-red-50 border border-red-200 text-center">
                    <span className="text-xs font-black text-red-700 block">{bg}</span>
                    <span className="text-xl font-black text-gray-900 block mt-1">{bags}</span>
                    <span className="text-[10px] text-gray-400">Bags</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
