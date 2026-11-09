import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EmergencySOSBanner from './components/EmergencySOSBanner';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingSOSButton from './components/FloatingSOSButton';

// Dedicated Pages
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import AmbulancePage from './pages/AmbulancePage';
import PharmacyPage from './pages/PharmacyPage';
import HospitalsPage from './pages/HospitalsPage';
import BloodDonationPage from './pages/BloodDonationPage';
import PartnerPage from './pages/PartnerPage';

// Modals
import DoctorBookingModal from './components/DoctorBookingModal';
import ChamberBookingModal from './components/ChamberBookingModal';
import AmbulanceBookingModal from './components/AmbulanceBookingModal';
import AmbulanceTrackingModal from './components/AmbulanceTrackingModal';
import PrescriptionUploadModal from './components/PrescriptionUploadModal';
import HospitalDetailModal from './components/HospitalDetailModal';
import HospitalBedBookingModal from './components/HospitalBedBookingModal';
import BloodRequestModal from './components/BloodRequestModal';
import BloodDonorRegisterModal from './components/BloodDonorRegisterModal';
import PartnerOnboardingModal from './components/PartnerOnboardingModal';
import TelemedicineRoomModal from './components/TelemedicineRoomModal';
import PaymentModal from './components/PaymentModal';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import AdminDashboardModal from './components/AdminDashboardModal';

import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { currentUser, updateSubscription } = useAuth();
  const { lang } = useLanguage();

  // Multi-Page Routing State
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'doctors', 'ambulance', 'pharmacy', 'hospitals', 'blood', 'partner'

  // Global Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  // Doctors & Telemedicine / Chamber Modals
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chamberModalOpen, setChamberModalOpen] = useState(false);
  const [selectedChamberDoc, setSelectedChamberDoc] = useState(null);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [telemedicineRoomOpen, setTelemedicineRoomOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);

  // Ambulance Modals
  const [ambulanceModalOpen, setAmbulanceModalOpen] = useState(false);
  const [defaultAmbulanceType, setDefaultAmbulanceType] = useState('ICU Ambulance (Life Support)');
  const [preferredHospitalId, setPreferredHospitalId] = useState(null);
  const [ambulanceTrackingOpen, setAmbulanceTrackingOpen] = useState(false);
  const [activeAmbulanceBooking, setActiveAmbulanceBooking] = useState(null);

  // Pharmacy & Prescription
  const [prescriptionUploadOpen, setPrescriptionUploadOpen] = useState(false);

  // Hospital Detail & Bed Booking
  const [hospitalDetailOpen, setHospitalDetailOpen] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [bedBookingModalOpen, setBedBookingModalOpen] = useState(false);
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState(null);
  const [selectedBedType, setSelectedBedType] = useState('icu');

  // Blood Donation Modals
  const [bloodRequestOpen, setBloodRequestOpen] = useState(false);
  const [bloodDonorRegisterOpen, setBloodDonorRegisterOpen] = useState(false);

  // Partner Modal
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  // Payment
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentData, setActivePaymentData] = useState(null);

  // Navigation Handler with scroll to top
  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Doctor Select Handlers
  const handleSelectVideoCall = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorModalOpen(true);
  };

  const handleSelectChamber = (doctor, chamber) => {
    setSelectedChamberDoc(doctor);
    setSelectedChamber(chamber);
    setChamberModalOpen(true);
  };

  // Ambulance & Emergency Radar Handlers
  const handleOpenAmbulanceBooking = (type, hospitalId = null) => {
    setDefaultAmbulanceType(type || 'ICU Ambulance (Life Support)');
    setPreferredHospitalId(hospitalId);
    setAmbulanceModalOpen(true);
  };

  const handleAmbulanceDispatched = (booking) => {
    setActiveAmbulanceBooking(booking);
    setAmbulanceTrackingOpen(true);
  };

  const handleInstantSOS = (coords) => {
    const trackingNumber = Math.floor(1000 + Math.random() * 9000);
    const locString = coords?.latitude
      ? `Live GPS (${coords.latitude.toFixed(4)}° N, ${coords.longitude.toFixed(4)}° E)`
      : 'Current GPS Location (Dhanmondi, Dhaka)';

    const newBooking = {
      trackingId: `NIRBHOY-SOS-${trackingNumber}`,
      ambulanceType: 'ICU Mobile Critical Care Ambulance',
      driverName: 'Md. Rafiqul Islam (Senior Rescue Pilot)',
      driverPhone: '+8801711223344',
      vehicleNumber: 'Dhaka Metro-Chha-11-8921',
      pickupLocation: locString,
      destination: 'Square Hospital Emergency Trauma Center',
      hospitalPhone: '10616',
      etaMinutes: 8,
      distanceKm: 2.3,
      status: 'en_route',
      gpsCoords: coords
    };

    setActiveAmbulanceBooking(newBooking);
    setAmbulanceTrackingOpen(true);
  };

  const handleOpenLiveTracker = () => {
    if (!activeAmbulanceBooking) {
      setActiveAmbulanceBooking({
        trackingId: 'NIRBHOY-SOS-8921',
        ambulanceType: 'ICU Mobile Critical Care Ambulance',
        driverName: 'Md. Rafiqul Islam (Senior Rescue Pilot)',
        driverPhone: '+8801711223344',
        vehicleNumber: 'Dhaka Metro-Chha-11-8921',
        pickupLocation: 'Current GPS Location (Dhanmondi Road 11, Dhaka)',
        destination: 'Square Hospital Emergency Trauma Center',
        hospitalPhone: '10616',
        etaMinutes: 8,
        distanceKm: 2.3,
        status: 'en_route'
      });
    }
    setAmbulanceTrackingOpen(true);
  };

  // Hospital Handlers
  const handleOpenHospitalDetail = (hospitalId) => {
    setSelectedHospitalId(hospitalId);
    setHospitalDetailOpen(true);
  };

  const handleOpenBedBooking = (hospital, bedType = 'icu') => {
    setSelectedHospitalForBed(hospital);
    setSelectedBedType(bedType);
    setBedBookingModalOpen(true);
  };

  // Payment Trigger & Confirmation
  const handlePaymentRequired = (paymentData) => {
    setActivePaymentData(paymentData);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (receipt) => {
    setPaymentModalOpen(false);
    if (activePaymentData?.purpose === 'subscription') {
      updateSubscription({
        status: 'active',
        plan: activePaymentData.metadata?.plan || 'monthly',
        validUntil: '2026-12-31'
      });
      alert(lang === 'bn' ? 'অভিনন্দন! আপনার নির্ভয় প্রিমিয়াম হেলথ পাস অ্যাক্টিভ হয়েছে!' : 'Congratulations! Your NIRBHOY Premium Pass is now active!');
    } else if (activePaymentData?.purpose === 'doctor_consultation') {
      setActiveAppointment(activePaymentData.metadata);
      alert(lang === 'bn' ? 'অনলাইন অ্যাপয়েন্টমেন্ট কনফার্ম হয়েছে! ভিডিও কল রুমে প্রবেশ করুন।' : 'Online consultation confirmed! Entering video room...');
      setTelemedicineRoomOpen(true);
    } else if (activePaymentData?.purpose === 'chamber_serial') {
      alert(lang === 'bn' ? `অফলাইন চেম্বার সিরিয়াল #${activePaymentData.metadata?.serialNumber} নিশ্চিত হয়েছে! প্রোফাইলে টিকিট দেখুন।` : `Chamber Serial #${activePaymentData.metadata?.serialNumber} confirmed! Check slip in profile.`);
      setProfileModalOpen(true);
    } else if (activePaymentData?.purpose === 'medicine_order') {
      alert(lang === 'bn' ? 'ওষুধের অর্ডার কনফার্ম হয়েছে! ৪৫ মিনিটে ডেলিভারি পৌঁছে যাবে।' : 'Medicine order placed! Estimated delivery in 45 mins.');
    }
    setActivePaymentData(null);
  };

  // Medicine Checkout
  const handleMedicineCheckout = ({ items, totalAmount }) => {
    handlePaymentRequired({
      amount: totalAmount,
      purpose: 'medicine_order',
      referenceId: `ord_${Date.now()}`,
      description: `Medicine Order (${items.length} items)`,
      metadata: { items }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSOSClick={() => handleInstantSOS()}
        onAuthClick={() => setAuthModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
        onAdminClick={() => setAdminModalOpen(true)}
        onSubscribeClick={() => setSubscriptionModalOpen(true)}
      />

      {/* 24/7 Live Emergency SOS Distress Banner */}
      <EmergencySOSBanner
        onSOSClick={handleOpenLiveTracker}
        onOpenLiveTracker={handleOpenLiveTracker}
        onInstantSOS={handleInstantSOS}
      />

      {/* Dynamic Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onConsultClick={() => handleNavigate('doctors')}
            onAmbulanceClick={() => handleNavigate('ambulance')}
            onPharmacyClick={() => handleNavigate('pharmacy')}
            onFindHospitalClick={() => handleNavigate('hospitals')}
            onSOSClick={() => handleInstantSOS()}
            onSubscribeClick={() => setSubscriptionModalOpen(true)}
            onOpenBloodRequest={() => setBloodRequestOpen(true)}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onSelectVideoCall={handleSelectVideoCall}
            onSelectChamber={handleSelectChamber}
          />
        )}

        {currentPage === 'ambulance' && (
          <AmbulancePage
            onBookAmbulance={handleOpenAmbulanceBooking}
          />
        )}

        {currentPage === 'pharmacy' && (
          <PharmacyPage
            onUploadPrescriptionClick={() => setPrescriptionUploadOpen(true)}
            onCheckoutClick={handleMedicineCheckout}
          />
        )}

        {currentPage === 'hospitals' && (
          <HospitalsPage
            onSelectHospitalDetail={handleOpenHospitalDetail}
            onBookBed={handleOpenBedBooking}
          />
        )}

        {currentPage === 'blood' && (
          <BloodDonationPage
            onOpenBloodRequest={() => setBloodRequestOpen(true)}
            onOpenDonorRegister={() => setBloodDonorRegisterOpen(true)}
          />
        )}

        {currentPage === 'partner' && (
          <PartnerPage
            onOpenPartnerModal={() => setPartnerModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSOSClick={() => handleInstantSOS()}
        onAdminClick={() => setAdminModalOpen(true)}
      />

      {/* Modals & Workflows */}
      {/* 1. Doctor Video Consultation Booking Modal */}
      <DoctorBookingModal
        open={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        doctor={selectedDoctor}
        onPaymentRequired={handlePaymentRequired}
      />

      {/* 2. Doctor Offline Chamber Serial Booking Modal */}
      <ChamberBookingModal
        open={chamberModalOpen}
        onClose={() => setChamberModalOpen(false)}
        doctor={selectedChamberDoc}
        selectedChamber={selectedChamber}
        onPaymentRequired={handlePaymentRequired}
      />

      {/* 3. Ambulance Booking Modal */}
      <AmbulanceBookingModal
        open={ambulanceModalOpen}
        onClose={() => setAmbulanceModalOpen(false)}
        defaultType={defaultAmbulanceType}
        onDispatched={handleAmbulanceDispatched}
      />

      {/* 4. Live Ambulance Radar Tracking Modal */}
      <AmbulanceTrackingModal
        open={ambulanceTrackingOpen}
        onClose={() => setAmbulanceTrackingOpen(false)}
        booking={activeAmbulanceBooking}
      />

      {/* 5. Prescription Upload Modal */}
      <PrescriptionUploadModal
        open={prescriptionUploadOpen}
        onClose={() => setPrescriptionUploadOpen(false)}
      />

      {/* 6. Hospital Integrated Detail Modal */}
      <HospitalDetailModal
        open={hospitalDetailOpen}
        onClose={() => setHospitalDetailOpen(false)}
        hospitalId={selectedHospitalId}
        onBookBed={handleOpenBedBooking}
        onDoctorSelect={handleSelectVideoCall}
        onAmbulanceClick={handleOpenAmbulanceBooking}
      />

      {/* 7. Hospital Bed / Seat Reservation Modal */}
      <HospitalBedBookingModal
        open={bedBookingModalOpen}
        onClose={() => setBedBookingModalOpen(false)}
        hospital={selectedHospitalForBed}
        defaultBedType={selectedBedType}
      />

      {/* 8. Emergency Blood Request Modal */}
      <BloodRequestModal
        open={bloodRequestOpen}
        onClose={() => setBloodRequestOpen(false)}
        onRequestCreated={() => {
          if (currentPage === 'blood') {
            window.location.reload();
          }
        }}
      />

      {/* 9. Volunteer Blood Donor Register Modal */}
      <BloodDonorRegisterModal
        open={bloodDonorRegisterOpen}
        onClose={() => setBloodDonorRegisterOpen(false)}
        onRegistered={() => {
          if (currentPage === 'blood') {
            window.location.reload();
          }
        }}
      />

      {/* 10. Partner Onboarding Modal */}
      <PartnerOnboardingModal
        open={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
      />

      {/* 11. Telemedicine Video Call Room Modal */}
      <TelemedicineRoomModal
        open={telemedicineRoomOpen}
        onClose={() => setTelemedicineRoomOpen(false)}
        appointment={activeAppointment}
      />

      {/* 12. Payment Modal (bKash, Nagad, Rocket, Cards) */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        paymentData={activePaymentData}
        onSuccess={handlePaymentSuccess}
      />

      {/* 13. Premium Pass Modal */}
      <SubscriptionModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onPaymentRequired={handlePaymentRequired}
      />

      {/* 14. Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* 15. User Profile Modal */}
      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onJoinCall={(apt) => {
          setActiveAppointment(apt);
          setTelemedicineRoomOpen(true);
        }}
      />

      {/* 16. Admin Operations Command Center */}
      <AdminDashboardModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Persistent Floating Desktop SOS Button */}
      <FloatingSOSButton
        onSOSClick={() => handleInstantSOS()}
      />

      {/* Mobile-First Sticky Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSOSClick={() => handleInstantSOS()}
      />
    </div>
  );
}
