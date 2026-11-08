import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Smartphone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function PaymentModal({ open, onClose, paymentData, onSuccess }) {
  const { lang } = useLanguage();
  const [method, setMethod] = useState('bkash'); // bkash, nagad, rocket, card
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'otp', 'success'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  if (!open || !paymentData) return null;

  const handleInitiate = (e) => {
    e.preventDefault();
    if (method !== 'card' && !phoneNumber.trim()) {
      setError(lang === 'bn' ? 'দয়া করে আপনার ওয়ালেট নম্বর দিন' : 'Please provide your mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await ApiService.processPayment({
        amount: paymentData.amount,
        method,
        purpose: paymentData.purpose,
        referenceId: paymentData.referenceId,
        phoneNumber: phoneNumber || '01700000000'
      });

      setReceipt(res.payment);
      setStep('success');
      setTimeout(() => {
        onSuccess(res.payment);
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              SSL 256-bit Encrypted Checkout
            </span>
          </div>

          <h3 className="text-xl font-black mt-1 text-white">
            {lang === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে' : 'Secure Payment Checkout'}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 truncate">{paymentData.description || 'NIRBHOY Health Services'}</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Payable Amount:</span>
            <span className="text-2xl font-black text-white">৳{paymentData.amount}</span>
          </div>
        </div>

        {/* Payment Methods Selection */}
        {step === 'input' && (
          <form onSubmit={handleInitiate} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                {lang === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setMethod('bkash')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/70 text-gray-900 ring-2 ring-[#E2136E]/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="h-7 w-7 rounded-xl bg-[#E2136E] text-white flex items-center justify-center font-black text-[10px]">
                    bK
                  </div>
                  <div>
                    <span className="text-xs font-bold block">bKash (বিকাশ)</span>
                    <span className="text-[10px] text-gray-500">Instant MFS</span>
                  </div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setMethod('nagad')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'nagad'
                      ? 'border-[#F7931E] bg-amber-50/70 text-gray-900 ring-2 ring-[#F7931E]/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="h-7 w-7 rounded-xl bg-[#F7931E] text-white flex items-center justify-center font-black text-[10px]">
                    NG
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Nagad (নগদ)</span>
                    <span className="text-[10px] text-gray-500">Fast Checkout</span>
                  </div>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setMethod('rocket')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'rocket'
                      ? 'border-[#8C3494] bg-purple-50/70 text-gray-900 ring-2 ring-[#8C3494]/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="h-7 w-7 rounded-xl bg-[#8C3494] text-white flex items-center justify-center font-black text-[10px]">
                    RK
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Rocket (রকেট)</span>
                    <span className="text-[10px] text-gray-500">DBBL MFS</span>
                  </div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    method === 'card'
                      ? 'border-blue-600 bg-blue-50/70 text-gray-900 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="h-7 w-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Cards</span>
                    <span className="text-[10px] text-gray-500">Visa / MC</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Input Details depending on Method */}
            {method !== 'card' ? (
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  {method.toUpperCase()} Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{lang === 'bn' ? 'ওটিপি যাচাইয়ে এগিয়ে যান' : 'Proceed to OTP Verification'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* OTP / PIN Verification Step */}
        {step === 'otp' && (
          <form onSubmit={handleConfirmPayment} className="p-6 space-y-4">
            <div className="text-center py-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                Verification Code Sent
              </span>
              <h4 className="text-lg font-black text-gray-900 mt-1">Enter 6-Digit OTP / PIN</h4>
              <p className="text-xs text-gray-500">Sent to {phoneNumber || 'registered mobile'}</p>
            </div>

            <div>
              <input
                type="password"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-2xl font-black tracking-widest py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>

            <p className="text-center text-[11px] text-gray-400">
              Demo mode: Enter any 4-6 digit PIN or OTP to test!
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : `Confirm & Pay ৳${paymentData.amount}`}
            </button>
          </form>
        )}

        {/* Success / Invoice Step */}
        {step === 'success' && receipt && (
          <div className="p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-black text-gray-900">
              {lang === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
            </h4>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="font-bold text-gray-800">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="font-extrabold text-emerald-600">৳{receipt.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gateway:</span>
                <span className="font-bold uppercase text-gray-800">{receipt.method}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Booking and receipt confirmed. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
