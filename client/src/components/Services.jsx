import React from 'react';
import { Video, Ambulance, Pill, Building2, AlertTriangle, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services({ onConsultClick, onAmbulanceClick, onPharmacyClick, onFindHospitalClick, onSOSClick, onSubscribeClick }) {
  const { lang, t } = useLanguage();

  const services = [
    {
      icon: Video,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border border-teal-200/80',
      badge: '24/7 Available',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
      title: t('srvDoctorTitle'),
      desc: t('srvDoctorDesc'),
      action: lang === 'bn' ? 'ডাক্তার খুঁজুন' : 'Book Video Call',
      onClick: onConsultClick
    },
    {
      icon: Ambulance,
      iconColor: 'text-pulse-electric',
      iconBg: 'bg-pulse-50 border border-pulse-200',
      badge: '8-12 Min ETA',
      badgeStyle: 'bg-pulse-50 text-pulse-electric border-pulse-200',
      title: t('srvAmbulanceTitle'),
      desc: t('srvAmbulanceDesc'),
      action: lang === 'bn' ? 'অ্যাম্বুলেন্স খুঁজুন' : 'Call Ambulance',
      onClick: onAmbulanceClick
    },
    {
      icon: Pill,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border border-teal-200/80',
      badge: '100% Genuine Medicine',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
      title: t('srvPharmacyTitle'),
      desc: t('srvPharmacyDesc'),
      action: lang === 'bn' ? 'ওষুধ অর্ডার করুন' : 'Order Medicine',
      onClick: onPharmacyClick
    },
    {
      icon: Building2,
      iconColor: 'text-navy-700',
      iconBg: 'bg-navy-50 border border-navy-200/80',
      badge: 'Live ICU Beds',
      badgeStyle: 'bg-navy-50 text-navy-800 border-navy-200',
      title: t('srvHospitalTitle'),
      desc: t('srvHospitalDesc'),
      action: lang === 'bn' ? 'হাসপাতাল খুঁজুন' : 'View Hospitals',
      onClick: onFindHospitalClick
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-pulse-electric',
      iconBg: 'bg-pulse-50 border border-pulse-200',
      badge: 'Emergency SOS',
      badgeStyle: 'bg-pulse-electric text-white border-pulse-electric',
      title: t('srvSOSTitle'),
      desc: t('srvSOSDesc'),
      action: lang === 'bn' ? 'জরুরি এসওএস' : 'Emergency SOS',
      onClick: onSOSClick
    },
    {
      icon: Sparkles,
      iconColor: 'text-teal-700',
      iconBg: 'bg-teal-50 border border-teal-200/80',
      badge: 'Healthcare Pass',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
      title: t('srvPremiumTitle'),
      desc: t('srvPremiumDesc'),
      action: lang === 'bn' ? 'প্রিমিয়াম প্ল্যান দেখুন' : 'Explore Pass',
      onClick: onSubscribeClick
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-teal-700 font-semibold text-xs tracking-wider uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {lang === 'bn' ? 'এক প্ল্যাটফর্মে সম্পূর্ণ স্বাস্থ্য সমাধান' : 'Integrated Digital Healthcare'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-3 tracking-tight">
            {t('serviceSectionTitle')}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            {t('serviceSectionSubtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border border-navy-100 hover:border-teal-400 rounded-2xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${srv.iconBg} ${srv.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${srv.badgeStyle}`}>
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-950 mb-1.5 group-hover:text-teal-700 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={srv.onClick}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 group-hover:text-teal-800 transition-colors"
                  >
                    <span>{srv.action}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
