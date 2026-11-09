import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    brandSubtitle: "Safe & Trusted Healthcare",
    navServices: "Services",
    navDoctors: "Doctors",
    navAmbulance: "Ambulance",
    navPharmacy: "Pharmacy",
    navHospitals: "Hospitals",
    navEmergency: "24/7 SOS",
    navLogin: "Sign In",
    navProfile: "My Account",
    navAdmin: "Admin Portal",
    heroTag: "Rapid Healthcare Ecosystem in Bangladesh",
    heroTitlePrefix: "Your Most Trusted ",
    heroTitleAccent: "Healthcare",
    heroTitleSuffix: " Partner in Bangladesh",
    heroDesc: "Connect with certified BMDC specialist doctors, dispatch GPS-tracked emergency ambulances in 8-12 mins, and get verified medicines delivered to your doorstep.",
    btnConsultDoctor: "Consult Doctor Now",
    btnFindHospital: "Find Emergency Hospital",
    btnEmergencySOS: "EMERGENCY SOS",
    statsDoctors: "Verified Doctors",
    statsHospitals: "Hospitals & Labs",
    statsPatients: "Happy Patients",
    statsResponse: "Avg Emergency Dispatch",
    serviceSectionTitle: "Comprehensive Healthcare Services",
    serviceSectionSubtitle: "Integrated digital health solutions built for rapid response and clinical excellence.",
    srvDoctorTitle: "Doctor Video Consultation",
    srvDoctorDesc: "Instant online video appointment with top specialists and digital prescriptions.",
    srvAmbulanceTitle: "24/7 Rapid Ambulance",
    srvAmbulanceDesc: "ICU, AC & Non-AC ambulance fleet with real-time GPS tracking and live ETA.",
    srvPharmacyTitle: "E-Pharmacy & Prescriptions",
    srvPharmacyDesc: "Upload your prescription or order genuine medicines delivered within 45-60 mins.",
    srvHospitalTitle: "Hospital & Bed Directory",
    srvHospitalDesc: "Real-time ICU bed availability, specialist chambers, and diagnostic center booking.",
    srvSOSTitle: "One-Touch Emergency SOS",
    srvSOSDesc: "Instant distress siren with automated GPS location broadcast to nearby rescue teams.",
    srvPremiumTitle: "NIRBHOY Premium Pass",
    srvPremiumDesc: "Unlimited GP consultations, priority ambulance access, and 15% discount on medicines.",
    doctorsTitle: "Featured Specialist Doctors",
    doctorsSubtitle: "Consult experienced and BMDC-certified physicians across Dhaka and all divisions",
    allSpecialties: "All Specialties",
    bookAppointment: "Book Appointment",
    experience: "experience",
    fee: "Fee",
    rating: "Rating",
    ambulanceTitle: "Rapid Emergency Ambulance Fleet",
    ambulanceSubtitle: "Choose from basic life support, AC, and fully equipped ICU life support ambulances",
    bookAmbulanceBtn: "Book Ambulance Now",
    pharmacyTitle: "NIRBHOY Digital Pharmacy",
    pharmacySubtitle: "100% genuine medicines from top manufacturers delivered safely to your home",
    uploadPrescriptionBtn: "Upload Prescription",
    searchMedicinesPlaceholder: "Search medicine by brand or generic name (e.g. Napa, Sergel, Monas)...",
    addToCart: "Add to Cart",
    inStock: "In Stock",
    prescriptionRequired: "Rx Required",
    cartTitle: "Your Medicine Cart",
    checkoutBtn: "Proceed to Checkout",
    hospitalsTitle: "Hospitals & Diagnostic Centers",
    hospitalsSubtitle: "Emergency contacts and real-time bed availability check",
    icuBeds: "ICU Beds Free",
    generalBeds: "General Beds",
    callEmergency: "Emergency Call",
    footerText: "© 2026 NIRBHOY Health Ltd. All rights reserved. Registered under DGHS & Bangladesh Medical Council.",
    emergencyHotline: "National Emergency Hotlines",
  },
  bn: {
    brandSubtitle: "নির্ভয় স্বাস্থ্য সেবা",
    navServices: "সেবাসমূহ",
    navDoctors: "ডাক্তারগণ",
    navAmbulance: "অ্যাম্বুলেন্স",
    navPharmacy: "ফার্মেসি",
    navHospitals: "হাসপাতাল",
    navEmergency: "২৪/৭ ইমার্জেন্সি SOS",
    navLogin: "লগইন করুন",
    navProfile: "আমার প্রোফাইল",
    navAdmin: "অ্যাডমিন পোর্টাল",
    heroTag: "বাংলাদেশের সর্বাধুনিক জরুরি স্বাস্থ্যসেবা প্ল্যাটফর্ম",
    heroTitlePrefix: "আপনার পরিবারের বিশ্বস্ত ",
    heroTitleAccent: "স্বাস্থ্যসেবা",
    heroTitleSuffix: " সহযোগী নির্ভয় হেলথ",
    heroDesc: "ঘরে বসেই অভিজ্ঞ বিএমডিসি নিবন্ধিত স্পেশালিস্ট ডাক্তারের ভিডিও পরামর্শ, ৮-১২ মিনিটে জিপিএস ট্র্যাকিংযুক্ত অ্যাম্বুলেন্স এবং ঘরে বসে খাঁটি ওষুধ ডেলিভারি পান।",
    btnConsultDoctor: "ডাক্তার দেখান",
    btnFindHospital: "নিকটস্থ হাসপাতাল খুঁজুন",
    btnEmergencySOS: "জরুরি এসওএস (SOS)",
    statsDoctors: "নিবন্ধিত ডাক্তার",
    statsHospitals: "হাসপাতাল ও ডায়াগনস্টিক",
    statsPatients: "সন্তুষ্ট রোগী",
    statsResponse: "গড় অ্যাম্বুলেন্স ডিসপ্যাচ",
    serviceSectionTitle: "আমাদের পূর্ণাঙ্গ স্বাস্থ্য সেবাসমূহ",
    serviceSectionSubtitle: "আপনার এবং আপনার পরিবারের প্রতিটি স্বাস্থ্য সংকটে দ্রুত ও নির্ভুল সমাধান",
    srvDoctorTitle: "অনলাইন ডাক্তার কনসালটেশন",
    srvDoctorDesc: "ভিডিও কলে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন এবং তাৎক্ষণিক ডিজিটাল প্রেসক্রিপশন পান।",
    srvAmbulanceTitle: "২৪/৭ দ্রুত অ্যাম্বুলেন্স বুকিং",
    srvAmbulanceDesc: "লাইভ জিপিএস ট্র্যাকিং ও ইটিএ সহ এসি, নন-এসি এবং আইসিইউ ভেন্টিলেটর অ্যাম্বুলেন্স।",
    srvPharmacyTitle: "ডিজিটাল ফার্মেসি ও প্রেসক্রিপশন",
    srvPharmacyDesc: "প্রেসক্রিপশন আপলোড করুন অথবা ৪৫-৬০ মিনিটে আসল ওষুধ ডেলিভারি নিন।",
    srvHospitalTitle: "হাসপাতাল ও আইসিইউ বেড ডিরেক্টরি",
    srvHospitalDesc: "হাসপাতালে খালি আইসিইউ ও জেনারেল বেড তথ্য এবং সরাসরি ইমার্জেন্সি বুকিং।",
    srvSOSTitle: "এক ক্লিকে ইমার্জেন্সি এসওএস",
    srvSOSDesc: "বিপদের মুহূর্তে এক ক্লিকে জিপিএস লোকেশন সহ জরুরি রেসকিউ টিম ও পরিবারকে সতর্কবার্তা।",
    srvPremiumTitle: "নির্ভয় প্রিমিয়াম পাস",
    srvPremiumDesc: "আনলিমিটেড সাধারণ ডাক্তার পরামর্শ, দ্রুত অ্যাম্বুলেন্স ও ওষুধে ১৫% পর্যন্ত ছাড়।",
    doctorsTitle: "আমাদের বিশেষজ্ঞ ডাক্তারগণ",
    doctorsSubtitle: "বিএমডিসি অনুমোদিত সিনিয়র কনসালট্যান্ট ও বিশেষজ্ঞ চিকিৎসকদের তালিকা",
    allSpecialties: "সকল বিভাগ",
    bookAppointment: "অ্যাপয়েন্টমেন্ট নিন",
    experience: "অভিজ্ঞতা",
    fee: "ফি",
    rating: "রেটিং",
    ambulanceTitle: "জরুরি অ্যাম্বুলেন্স সার্ভিস",
    ambulanceSubtitle: "লাইফ সাপোর্ট আইসিইউ, এসি ও ফ্রিজিং অ্যাম্বুলেন্স বুকিং",
    bookAmbulanceBtn: "অ্যাম্বুলেন্স বুক করুন",
    pharmacyTitle: "নির্ভয় ডিজিটাল ফার্মেসি",
    pharmacySubtitle: "টপ ফার্মাসিউটিক্যালসের ১০০% জেনুইন ওষুধ সরাসরি আপনার ঠিকানায়",
    uploadPrescriptionBtn: "প্রেসক্রিপশন আপলোড করুন",
    searchMedicinesPlaceholder: "ওষুধের নাম বা জেনেরিক দিয়ে খুঁজুন (যেমন: Napa, Sergel, Monas)...",
    addToCart: "কার্টে যোগ করুন",
    inStock: "স্টকে আছে",
    prescriptionRequired: "প্রেসক্রিপশন আবশ্যক",
    cartTitle: "আপনার মেডিসিন কার্ট",
    checkoutBtn: "অর্ডার কনফার্ম করুন",
    hospitalsTitle: "হাসপাতাল ও ডায়াগনস্টিক সেন্টার",
    hospitalsSubtitle: "২৪ ঘণ্টা জরুরি সেবা ও আইসিইউ বেড প্রাপ্যতা",
    icuBeds: "খালি আইসিইউ বেড",
    generalBeds: "জেনারেল বেড",
    callEmergency: "জরুরি কল করুন",
    footerText: "© ২০২৬ নির্ভয় হেলথ লিমিটেড। সর্বস্বত্ব সংরক্ষিত। স্বাস্থ্য অধিদপ্তর ও বিএমডিসি নীতিমালার আওতাভুক্ত।",
    emergencyHotline: "জাতীয় জরুরি হেল্পলাইন নম্বর",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('bn'); // Default to Bangla for Bangladeshi users

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'bn' : 'en');
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
