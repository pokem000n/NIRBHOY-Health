import React, { useState } from 'react';
import { X, Heart, Droplet, Phone, MapPin, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';

export default function BloodDonorRegisterModal({ open, onClose, onRegistered }) {
  const { lang } = useLanguage();
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [area, setArea] = useState('Dhanmondi, Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [lastDonatedDate, setLastDonatedDate] = useState('2026-06-15');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !area.trim()) {
      setError(lang === 'bn' ? 'দয়া করে নাম, ফোন নম্বর ও এলাকা দিন' : 'Please provide all details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await ApiService.registerBloodDonor({
        name,
        bloodGroup,
        phone,
        area,
        district,
        lastDonatedDate
      });

      setSuccess(true);
      onRegistered?.(res.donor);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Donor registration failed');
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
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-rose-300 border border-slate-700">
                NIRBHOY LIFE HEROES
              </span>
              <h3 className="text-base font-bold mt-1 text-white">
                {lang === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন' : 'Register as a Blood Donor'}
              </h3>
              <p className="text-xs text-slate-400 font-normal">Be ready to save lives during critical emergencies in Bangladesh</p>
            </div>
          </div>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3.5">
            <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <Heart className="h-8 w-8 fill-rose-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {lang === 'bn' ? 'অভিনন্দন! আপনি এখন একজন জীবন রক্ষাকারী রক্তদাতা!' : 'Welcome to NIRBHOY Life Savers!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
              আপনার রক্তের গ্রুপের জরুরি প্রয়োজনে রোগীরা সরাসরি আপনার সাথে যোগাযোগ করতে পারবেন। রক্তদানে এগিয়ে আসার জন্য ধন্যবাদ!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            {/* Select Blood Group */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                {lang === 'bn' ? 'আপনার রক্তের গ্রুপ' : 'Your Blood Group'}
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

            {/* Donor Name & Phone */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'আপনার নাম' : 'Donor Full Name'}
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder="01712-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>
            </div>

            {/* District & Area */}
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'জেলা' : 'District'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-semibold bg-white"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? 'থানা / এলাকা' : 'Area / Thana'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Mirpur, Uttara"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
                  required
                />
              </div>
            </div>

            {/* Last Donated Date */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? 'সর্বশেষ রক্তদানের তারিখ' : 'Last Blood Donation Date'}
              </label>
              <input
                type="date"
                value={lastDonatedDate}
                onChange={(e) => setLastDonatedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-rose-600 font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Healthy adults can donate whole blood every 90-120 days.
              </span>
            </div>

            {/* Actions */}
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
                <Heart className="h-4 w-4 fill-white" />
                <span>{loading ? 'Registering...' : (lang === 'bn' ? 'নিবন্ধন সম্পন্ন করুন' : 'Join as Life Saver')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
