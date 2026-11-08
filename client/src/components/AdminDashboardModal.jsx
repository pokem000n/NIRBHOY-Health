import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, AlertTriangle, Ambulance, Calendar, Pill, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';

export default function AdminDashboardModal({ open, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (open) {
      loadStats();
    }
  }, [open]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await ApiService.getAdminStats();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    try {
      setResetting(true);
      await ApiService.initData();
      await loadStats();
      alert("Sample database refreshed successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">NIRBHOY Operations Command Center</h3>
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  LIVE OPS
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time Emergency & Business Dispatch Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
              title="Reset Sample Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset Data</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Key Metrics Grid */}
          {data?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <div className="flex items-center justify-between text-red-600 mb-1">
                  <span className="text-xs font-bold">Emergency SOS</span>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <span className="text-2xl font-black text-red-700">{data.stats.emergencySOSCount}</span>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <div className="flex items-center justify-between text-orange-600 mb-1">
                  <span className="text-xs font-bold">Ambulance Trips</span>
                  <Ambulance className="h-4 w-4" />
                </div>
                <span className="text-2xl font-black text-orange-700">{data.stats.activeAmbulancesDispatched}</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <span className="text-xs font-bold">Appointments</span>
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-2xl font-black text-blue-700">{data.stats.totalAppointments}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-600 mb-1">
                  <span className="text-xs font-bold">Medicine Orders</span>
                  <Pill className="h-4 w-4" />
                </div>
                <span className="text-2xl font-black text-emerald-700">{data.stats.medicineOrdersCount}</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-indigo-600 mb-1">
                  <span className="text-xs font-bold">Total Revenue</span>
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="text-2xl font-black text-indigo-700">৳{data.stats.totalRevenueBDT}</span>
              </div>
            </div>
          )}

          {/* Recent SOS Distress Alerts */}
          <div>
            <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Real-time SOS Distress Log</span>
            </h4>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200/80 overflow-hidden">
              {data?.recentSOS?.length === 0 ? (
                <div className="p-4 text-xs text-gray-500 text-center">No active distress signals.</div>
              ) : (
                data?.recentSOS?.map((sos) => (
                  <div key={sos.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-red-700 block">{sos.patientName} ({sos.phone})</span>
                      <span className="text-gray-500">{sos.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {sos.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{new Date(sos.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Ambulance Trips */}
          <div>
            <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-1.5">
              <Ambulance className="h-4 w-4 text-orange-600" />
              <span>Live Ambulance Bookings</span>
            </h4>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200/80 overflow-hidden">
              {data?.recentAmbulanceTrips?.length === 0 ? (
                <div className="p-4 text-xs text-gray-500 text-center">No recent ambulance trips.</div>
              ) : (
                data?.recentAmbulanceTrips?.map((trip) => (
                  <div key={trip.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{trip.patientName} • {trip.ambulanceType}</span>
                      <span className="text-gray-500">From {trip.pickupLocation} to {trip.destination}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-orange-600">{trip.trackingId}</span>
                      <span className="text-[10px] text-gray-400 block">ETA: {trip.etaMinutes} mins</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
