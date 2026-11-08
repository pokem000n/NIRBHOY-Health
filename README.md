# NIRBHOY Health (নির্ভয় স্বাস্থ্য সেবা) 🩺🚑💊
> **Bangladesh's Premier Full-Stack Digital Healthcare & Emergency Dispatch Platform**

A production-ready full-stack prototype engineered to transform healthcare delivery in Bangladesh. NIRBHOY Health unites online BMDC-verified doctor video consultations, rapid GPS-tracked ambulance booking, authentic prescription medicine delivery, and real-time hospital ICU bed availability into one cohesive ecosystem.

---

## 🌟 Key Upgrades & Fixes over the Figma Prototype

In the initial Figma Make prototype (`https://show-drawn-09359963.figma.site`), several critical bottlenecks and gaps existed:

1. **Dead/Unreachable Supabase Edge Function**:
   - The Figma site pointed to `https://ncxwcefutbnevvyllstk.supabase.co/functions/v1/make-server-a38fe0a3`, which failed DNS resolution, causing the doctor listings, bookings, emergency SOS, and authentication to hang indefinitely on a spinner.
   - **Fix**: Replaced with an independent, fast Express.js REST API with file-persisted JSON database (`server/db.js`) and complete endpoint coverage.
2. **Incomplete Medicine Delivery System**:
   - The Figma site only showed a placeholder button with an alert saying *"Medicine ordering feature coming soon!"*.
   - **Fix**: Built a complete e-Pharmacy with generic and brand-name search (Napa, Sergel, Monas, Seclo, etc.), cart management, delivery address input, and a dedicated **Prescription Upload Modal** for DGHS A-Grade pharmacist verification.
3. **Ambulance Dispatch & Live GPS Tracking**:
   - The Figma site had a static modal without vehicle categorization, fee calculations, or route updates.
   - **Fix**: Implemented a realistic Bangladesh ambulance fleet selector (ICU with Ventilator, AC, Non-AC, Freezing) with base/per-km pricing, driver assignment, simulated radar/map live tracking, ETA countdown, and direct call/share capabilities.
4. **Telemedicine Video Room & Digital Rx**:
   - The Figma prototype lacked a consultation room and prescription delivery.
   - **Fix**: Created an interactive Telemedicine Consultation Room simulation with audio/video toggles, patient/doctor feeds, and instant generation of a signed digital prescription (Rx) with dosage timings (যেমন: ১+০+১ ভরা পেটে).
5. **Bangladesh Mobile Financial Services (MFS) Integration**:
   - Added realistic payment gateways tailored for Bangladesh: **bKash (বিকাশ)**, **Nagad (নগদ)**, **Rocket (রকেট)**, and debit/credit cards with OTP validation and instant downloadable receipts.
6. **Operations Command Center (Admin Dispatcher)**:
   - Added an interactive Admin Dashboard modal to monitor live SOS distress calls, ambulance trips, doctor consultations, and revenue metrics in real-time.
7. **Bilingual Support (বাংলা & English)**:
   - Integrated full English and Bengali localization for accessibility across all demographics in Bangladesh.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Context API (`LanguageContext`, `AuthContext`).
- **Backend**: Node.js, Express.js REST API, CORS, persistent database engine (`server/db.js`).
- **Payment Gateway Simulation**: bKash, Nagad, Rocket, SSLCommerz-ready architecture.
- **Portability**: Ready to deploy to Vercel, Netlify, Render, Railway, or AWS.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Start Backend API (Port 5000)
```bash
cd nirbhoy-health/server
npm install
npm start
```
The server will start at `http://localhost:5000` with pre-seeded doctors, ambulance fleet, medicines, and hospitals.

### Step 2: Start Frontend Application (Port 5173)
```bash
cd nirbhoy-health/client
npm install
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 📋 Default Credentials (Demo)

- **Patient Demo Account**:
  - Email: `demo@nirbhoyhealth.com`
  - Password: `password123`
- **Admin / Dispatcher Account**:
  - Email: `admin@nirbhoyhealth.com`
  - Password: `admin123`

---

## 📂 Project Structure

```
nirbhoy-health/
├── server/
│   ├── index.js                     # Express REST API routes
│   ├── db.js                        # JSON-persisted database engine
│   ├── data.json                    # Persisted data storage
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky nav, brand, SOS pill, language toggle
│   │   │   ├── EmergencySOSBanner.jsx # 24/7 Red SOS with GPS panic dispatch
│   │   │   ├── Hero.jsx             # Hero section with trust badges & metrics
│   │   │   ├── Services.jsx         # 6 core healthcare service modules
│   │   │   ├── DoctorsSection.jsx   # BMDC doctor catalog with specialty tabs
│   │   │   ├── DoctorBookingModal.jsx # Slot picker & consultation scheduler
│   │   │   ├── AmbulanceSection.jsx # Fleet overview (ICU, AC, Non-AC, Freezing)
│   │   │   ├── AmbulanceBookingModal.jsx # Dispatch form with destination hospital
│   │   │   ├── AmbulanceTrackingModal.jsx # Live radar map, driver ETA & contact
│   │   │   ├── MedicinePharmacy.jsx # E-Pharmacy with cart drawer & search
│   │   │   ├── PrescriptionUploadModal.jsx # Rx drag-and-drop & pharmacist review
│   │   │   ├── HospitalDirectory.jsx# ICU bed vacancy & emergency hotlines
│   │   │   ├── TelemedicineRoomModal.jsx # Video call room & live digital prescription
│   │   │   ├── PaymentModal.jsx     # bKash, Nagad, Rocket, card checkout
│   │   │   ├── SubscriptionModal.jsx# Monthly ৳499 & Yearly ৳4999 Pass
│   │   │   ├── AuthModal.jsx        # Login & Signup with BD phone validation
│   │   │   ├── UserProfileModal.jsx # My appointments & prescription vault
│   │   │   ├── AdminDashboardModal.jsx # Live dispatcher control center
│   │   │   └── Footer.jsx           # Hotlines (999, 16263, 10655), DGHS compliance
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication & user state
│   │   │   └── LanguageContext.jsx  # English & Bengali translations
│   │   ├── services/
│   │   │   └── api.js               # Clean frontend API client
│   │   ├── App.jsx                  # Main unified application
│   │   ├── index.css                # Tailwind CSS + pulse animations
│   │   └── main.jsx
│   ├── vite.config.js               # Vite config with backend proxy
│   ├── tailwind.config.js
│   └── package.json
├── README.md
└── BUSINESS_PLAN_BANGLADESH.md      # Comprehensive real-life startup roadmap
```
