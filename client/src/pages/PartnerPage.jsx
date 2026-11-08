import React from 'react';
import { Building2, Pill, Ambulance, ShieldCheck, CheckCircle2, ArrowRight, Phone, Mail, Award, Users, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PartnerPage({ onOpenPartnerModal }) {
  const { lang, t } = useLanguage();

  const benefits = [
    {
      title: "Hospitals & Diagnostic Centers",
      icon: Building2,
      desc: "List your emergency ICU beds, specialist doctor chambers, in-house pharmacy, and blood bank stock to receive direct patient admissions.",
      tag: "Hospital Bed & Chamber Integration",
      tagStyle: "text-navy-900 bg-navy-50 border-navy-200"
    },
    {
      title: "Retail & Model Pharmacies",
      icon: Pill,
      desc: "List your pharmacy chain to fulfill prescription medicine orders across Dhaka and major divisional cities with zero fulfillment friction.",
      tag: "DGDA Model Pharmacy Delivery",
      tagStyle: "text-teal-800 bg-teal-50 border-teal-200"
    },
    {
      title: "Ambulance Fleets & Private Drivers",
      icon: Ambulance,
      desc: "Connect your ICU, AC, or standard ambulances to our automated GPS dispatch engine with guaranteed base fees and live trip routing.",
      tag: "Rapid 8-12 Min Dispatch Network",
      tagStyle: "text-pulse-electric bg-pulse-50 border-pulse-200"
    }
  ];

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-teal-700 font-semibold">Partner Onboarding Portal</span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-teal-800 font-semibold text-xs uppercase tracking-wider bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
              National Healthcare Infrastructure Integration
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 mt-2.5 tracking-tight">
              {lang === 'bn' ? 'নির্ভয় হেলথ পার্টনার নেটওয়ার্কে যুক্ত হোন' : 'Partner with NIRBHOY Health Network'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-base mt-2 font-normal leading-relaxed">
              {lang === 'bn'
                ? 'হাসপাতাল, মডেল ফার্মেসি এবং অ্যাম্বুলেন্স বহর এক প্ল্যাটফর্মে যুক্ত হয়ে দেশের লক্ষাধিক রোগীকে ২৪/৭ নির্ভরযোগ্য সেবা দিন।'
                : 'Join Bangladesh’s fastest growing digital health infrastructure. Empower your medical institution with instant patient dispatch and digital booking.'}
            </p>
            <div className="mt-5 flex justify-center">
              <button
                onClick={onOpenPartnerModal}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Apply for Partner Onboarding</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-12">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-navy-100 hover:border-teal-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${b.tagStyle}`}>
                    {b.tag}
                  </span>
                  <h3 className="text-base font-bold text-navy-950 mt-2.5 mb-1.5">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">{b.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={onOpenPartnerModal}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Register Facility</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Technical Support Banner (Major 1: Navy-950) */}
        <div className="bg-navy-950 rounded-2xl p-6 sm:p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-navy-900">
          <div className="space-y-1">
            <h4 className="font-bold text-lg text-white">Need Institutional Technical Support?</h4>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Direct API integrations for hospital HMS, pharmacy ERPs, and ambulance fleet tracking systems.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-300">partner@nirbhoyhealth.com</span>
            <span className="text-slate-600">•</span>
            <span className="text-teal-400">+880 9612-647246</span>
          </div>
        </div>
      </div>
    </div>
  );
}
