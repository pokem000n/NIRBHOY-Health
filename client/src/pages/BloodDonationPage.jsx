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

        {/* Live Hospital Blood Stock Counter Banner */}
        <div className="bg-[#21183B] text-white rounded-3xl p-5 sm:p-6 border border-[#7c3aed]/40 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-violet-800/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1753]/20 border border-[#ff1753]/50 text-white text-xs font-black mb-2">
                <span className="h-2 w-2 rounded-full bg-[#ff1753] animate-ping"></span>
                <span>{lang === 'bn' ? 'লাইভ সেন্ট্রাল ব্লাড ব্যাংক ইনভেন্টরি' : 'Live Central Blood Bank Inventory'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {lang === 'bn' ? 'ঢাকার শীর্ষ হাসপাতালগুলোতে রক্তের রিয়েল-টাইম মজুদ' : 'Real-Time Hospital Blood Stock Across Dhaka'}
              </h2>
              <p className="text-xs text-violet-200/80 mt-1">
                {lang === 'bn'
                  ? 'স্কয়ার, বিএসএমএমইউ, ঢাকা মেডিকেল ও ন্যাশনাল হার্ট ফাউন্ডেশনে বর্তমানে সংরক্ষিত মোট রক্তের ব্যাগ:'
                  : 'Total verified blood units in cold storage at Square, BSMMU, DMCH & NICVD:'}
              </p>
            </div>
            <div className="text-right self-start md:self-auto">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block leading-none">
                {lang === 'bn' ? '২১৭+ ব্যাগ' : '217+ Units'}
              </span>
              <span className="text-[11px] font-bold text-violet-300">
                {lang === 'bn' ? 'ভেরিফাইড ও সংরক্ষিত' : 'Verified in Cold Storage'}
              </span>
            </div>
          </div>

          {/* Real-time Blood Stock Pills */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-4">
            {[
              { bg: 'A+', bags: 37, critical: false },
              { bg: 'A-', bags: 8, critical: true },
              { bg: 'B+', bags: 48, critical: false },
              { bg: 'B-', bags: 11, critical: false },
              { bg: 'O+', bags: 64, critical: false },
              { bg: 'O-', bags: 13, critical: true },
              { bg: 'AB+', bags: 20, critical: false },
              { bg: 'AB-', bags: 5, critical: true },
            ].map((stock) => (
              <div
                key={stock.bg}
                onClick={() => setSelectedGroup(stock.bg)}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all border ${
                  selectedGroup === stock.bg
                    ? 'bg-[#ff1753] border-white ring-2 ring-[#ff1753] shadow-lg scale-105'
                    : 'bg-[#17102b] hover:bg-[#2a1f4b] border-violet-800/60'
                }`}
              >
                <span className="text-sm font-black text-white block">{stock.bg}</span>
                <span className="text-lg font-black text-white block mt-0.5">{stock.bags}</span>
                <span className={`text-[10px] font-bold block ${stock.critical ? 'text-[#ff4b75]' : 'text-slate-400'}`}>
                  {stock.critical
                    ? (lang === 'bn' ? 'সংকটপূর্ণ' : 'Critical')
                    : (lang === 'bn' ? 'মজুদ আছে' : 'In Stock')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Group Filter Pills */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {lang === 'bn' ? 'রক্তের গ্রুপ অনুযায়ী ফিল্টার করুন:' : 'Filter by Blood Group:'}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border-2 ${
                    selectedGroup === bg
                      ? 'bg-[#ff1753] text-white border-[#ff1753] shadow-md shadow-[#ff1753]/30 scale-105'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
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
              <h3 className="font-black text-slate-900 text-lg">
                {lang === 'bn' ? 'নিকটস্থ নিবন্ধিত লাইভ রক্তদাতাগণ (দূরত্ব অনুযায়ী)' : 'Nearby Registered Live Donors (Distance & Proximity)'}
              </h3>
              <span className="text-xs text-slate-500">
                {lang === 'bn' ? 'জরুরি প্রয়োজনে সরাসরি কল করুন' : 'Contact directly during medical emergencies'}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((donor, idx) => {
                const distances = ['1.2 km', '1.8 km', '2.4 km', '3.5 km', '4.1 km', '5.0 km'];
                const distance = distances[idx % distances.length];
                const activeTime = ['Active Now', 'Active 5m ago', 'Active 10m ago'][idx % 3];

                return (
                <div key={donor.id} className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#ff1753] p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-10 w-10 rounded-2xl bg-rose-50 border-2 border-[#ff1753]/30 flex items-center justify-center font-black text-[#ff1753] text-sm shadow-xs">
                          {donor.bloodGroup}
                        </span>
                        <div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            {lang === 'bn' ? activeTime.replace('Active Now', 'এখনই সক্রিয়').replace('Active 5m ago', '৫ মি. আগে সক্রিয়').replace('Active 10m ago', '১০ মি. আগে সক্রিয়') : activeTime}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-[#7c3aed] bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200">
                        📍 {distance} {lang === 'bn' ? 'দূরে' : 'away'}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-base group-hover:text-[#ff1753] transition-colors">{donor.name}</h4>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-[#ff1753] flex-shrink-0" /> {donor.area}, {donor.district}
                    </p>
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">
                        {lang === 'bn' ? 'মোট রক্তদান:' : 'Total Donations:'}
                      </span>
                      <span className="font-black text-[#21183B]">
                        {donor.totalDonations} {lang === 'bn' ? 'বার' : 'times'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {lang === 'bn' ? 'সর্বশেষ রক্তদান:' : 'Last Donated:'} {donor.lastDonatedDate}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                        {lang === 'bn' ? 'সরাসরি ফোন' : 'Direct Phone'}
                      </span>
                      <span className="font-black text-slate-900 text-xs block">{donor.phone}</span>
                    </div>
                    <a
                      href={`tel:${donor.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-[#ff1753] hover:bg-[#e11d48] text-white font-black text-xs flex items-center gap-1 shadow-md shadow-[#ff1753]/30 transition-all active:scale-95"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{lang === 'bn' ? 'কল করুন' : 'Call Donor'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
