import React, { useState, useEffect } from 'react';
import { Droplet, Heart, Phone, MapPin, Search, Plus, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function BloodDonationPage({ onOpenBloodRequest, onOpenDonorRegister }) {
  const { lang, t } = useLanguage();
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'donors', 'inventory'

  useEffect(() => {
    loadBloodData();
  }, [selectedGroup, searchArea]);

  const loadBloodData = async () => {
    try {
      setLoading(true);
      const [donorList, reqList, invList] = await Promise.all([
        ApiService.getBloodDonors(selectedGroup, searchArea),
        ApiService.getBloodRequests(),
        ApiService.getBloodInventory()
      ]);
      setDonors(donorList);
      setRequests(reqList);
      setInventory(invList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-pulse-electric font-semibold">Emergency Blood Network</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <span className="text-pulse-electric font-semibold text-xs uppercase tracking-wider bg-pulse-50 border border-pulse-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                <Heart className="h-3.5 w-3.5 fill-pulse-electric text-pulse-electric animate-pulse" />
                <span>Life-Saving Blood Transfusion Network</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {lang === 'bn' ? 'জরুরি রক্তদাতা ও হাসপাতাল ব্লাড ব্যাংক নেটওয়ার্ক' : 'Emergency Blood Bank & Donor Network'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'bn'
                  ? 'মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ডোনার খুঁজুন, হাসপাতালে রক্তের প্রাপ্যতা চেক করুন অথবা জরুরি রক্তের আবেদন প্রকাশ করুন।'
                  : 'Connect with verified voluntary blood donors, check live hospital transfusion inventories, or broadcast emergency patient blood requests.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenDonorRegister}
                className="px-4 py-2.5 rounded-xl bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Heart className="h-3.5 w-3.5 text-teal-600" />
                <span>{lang === 'bn' ? 'রক্তদাতা হিসেবে যুক্ত হোন' : 'Register as Donor'}</span>
              </button>

              {/* Wired Accent Button: Blood Request */}
              <button
                onClick={onOpenBloodRequest}
                className="px-4 py-2.5 rounded-xl bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs sm:text-sm shadow-xs shadow-pulse-electric/25 transition-all flex items-center gap-1.5 animate-wired-pulse"
              >
                <Droplet className="h-3.5 w-3.5 fill-white" />
                <span>{lang === 'bn' ? 'জরুরি রক্তের আবেদন' : 'Post Blood Request'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-navy-100 rounded-xl shadow-xs mb-6 w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests' ? 'bg-pulse-electric text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Urgent Patient Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-navy-950 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Droplet className="h-3.5 w-3.5" />
            <span>Hospital Blood Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'donors' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Volunteer Donors ({donors.length})</span>
          </button>
        </div>

        {/* Blood Group Filter Pills */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-navy-100 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by Blood Group:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedGroup === bg
                      ? 'bg-pulse-electric text-white border-pulse-electric shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: Urgent Patient Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pulse-electric animate-ping"></span>
                <span>Active Blood Requirements</span>
              </h3>
              <span className="text-xs text-slate-500">Live verified requests</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-navy-100 hover:border-pulse-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-pulse-electric text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-bl-lg">
                    {req.urgency.includes('Immediate') ? 'CRITICAL EMERGENCY' : 'URGENT'}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-pulse-50 border border-pulse-200 flex flex-col items-center justify-center font-bold text-pulse-electric">
                        <Droplet className="h-4 w-4 fill-pulse-electric text-pulse-electric" />
                        <span className="text-xs font-extrabold -mt-0.5">{req.bloodGroup}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-950 text-sm">{req.patientName}</h4>
                        <p className="text-xs text-slate-500">{req.hospitalName}</p>
                        <span className="text-[10px] font-semibold text-pulse-electric bg-pulse-50 px-2 py-0.2 rounded border border-pulse-200 mt-0.5 inline-block">
                          {req.bagsNeeded} Bag(s) Needed
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2.5 font-normal">
                      <strong className="text-navy-950">Reason:</strong> {req.reason}
                    </p>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{req.area}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Contact: {req.contactName}</span>
                      <span className="font-semibold text-navy-950 text-xs">{req.contactPhone}</span>
                    </div>

                    <a
                      href={`tel:${req.contactPhone}`}
                      className="px-3.5 py-2 rounded-lg bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call to Donate</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Hospital Blood Stock Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-navy-950 text-base">Hospital Blood Bank Stock Matrix</h3>
              <p className="text-xs text-slate-500">Live units available across major Dhaka hospitals</p>
            </div>

            <div className="grid gap-3.5">
              {inventory.map((hosp) => (
                <div key={hosp.hospitalId} className="bg-white rounded-2xl border border-navy-100 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-navy-950 text-sm">{hosp.hospitalName}</h4>
                      <p className="text-xs text-slate-500">{hosp.area}</p>
                    </div>

                    <a
                      href={`tel:${hosp.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-900 font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors border border-navy-200"
                    >
                      <Phone className="h-3.5 w-3.5 text-pulse-electric" />
                      <span>Transfusion Hotline: {hosp.phone}</span>
                    </a>
                  </div>

                  {/* Stock Pills Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-3.5">
                    {Object.entries(hosp.bloodStock).map(([bg, bags]) => (
                      <div
                        key={bg}
                        className={`p-2.5 rounded-xl text-center border ${
                          selectedGroup === bg
                            ? 'bg-pulse-50 border-pulse-electric ring-1 ring-pulse-electric'
                            : 'bg-navy-50/40 border-navy-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-pulse-electric block">{bg}</span>
                        <span className="text-base font-extrabold text-navy-950 block mt-0.5">{bags}</span>
                        <span className="text-[10px] text-slate-400">Bags</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Volunteer Donors Directory */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-navy-950 text-base">Registered Life Saver Donors</h3>
              <span className="text-xs text-slate-500">Contact directly during emergencies</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor) => (
                <div key={donor.id} className="bg-white rounded-2xl border border-navy-100 hover:border-teal-400 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="h-9 w-9 rounded-lg bg-pulse-50 border border-pulse-200 flex items-center justify-center font-bold text-pulse-electric text-xs">
                        {donor.bloodGroup}
                      </span>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-teal-600" /> Available to Donate
                      </span>
                    </div>

                    <h4 className="font-bold text-navy-950 text-sm">{donor.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {donor.area}, {donor.district}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
                      Donated {donor.totalDonations} times • Last: {donor.lastDonatedDate}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-navy-950 text-xs">{donor.phone}</span>
                    <a
                      href={`tel:${donor.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-pulse-electric hover:bg-pulse-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call Donor</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
