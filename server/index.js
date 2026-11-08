import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NIRBHOY Health Multi-Module API', timestamp: new Date().toISOString() });
});

// Init Data (Reset/Refresh)
app.post('/api/init-data', (req, res) => {
  const data = db.reset();
  res.json({
    success: true,
    message: "Sample data initialized successfully",
    doctorsCount: data.doctors.length,
    hospitalsCount: data.hospitals.length,
    pharmaciesCount: data.pharmacies.length,
    donorsCount: data.bloodDonors.length
  });
});

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, phone, address } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const existing = db.find('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    password,
    name,
    phone: phone || "+8801700000000",
    role: "patient",
    address: address || "Dhaka, Bangladesh",
    subscription: { status: "free" },
    createdAt: new Date().toISOString()
  };

  db.insert('users', newUser);
  res.json({
    success: true,
    user: newUser,
    token: `token_${newUser.id}_${Date.now()}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.find('users', u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    success: true,
    user,
    token: `token_${user.id}_${Date.now()}`
  });
});

app.get('/api/auth/user', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const users = db.get('users');
  const matched = users.find(u => token.includes(u.id)) || users[0];
  res.json({ user: matched });
});

// Doctors Routes (Online Telemedicine + Offline Chambers)
app.get('/api/doctors', (req, res) => {
  const { specialty, search, hospitalId, mode } = req.query;
  let doctors = db.get('doctors');

  if (specialty && specialty !== 'All') {
    doctors = doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  if (hospitalId) {
    doctors = doctors.filter(d => 
      d.hospitalId === hospitalId || 
      d.chambers?.some(c => c.hospitalId === hospitalId)
    );
  }

  if (mode === 'chamber') {
    doctors = doctors.filter(d => d.chambers && d.chambers.length > 0);
  } else if (mode === 'video') {
    doctors = doctors.filter(d => d.availableOnline);
  }

  if (search) {
    const q = search.toLowerCase();
    doctors = doctors.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.specialty.toLowerCase().includes(q) || 
      d.primaryHospital.toLowerCase().includes(q) ||
      d.chambers?.some(c => c.hospitalName.toLowerCase().includes(q) || c.area.toLowerCase().includes(q))
    );
  }

  res.json({ doctors });
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = db.find('doctors', d => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  res.json({ doctor });
});

// Book Online Appointment (Telemedicine)
app.post('/api/appointments/book', (req, res) => {
  const { doctorId, patientName, patientPhone, date, time, consultationType, symptoms } = req.body;
  if (!doctorId || !patientName || !patientPhone) {
    return res.status(400).json({ error: "Doctor, patient name, and phone are required" });
  }

  const doctor = db.find('doctors', d => d.id === doctorId);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  const appointment = {
    id: `apt_${Date.now()}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    doctorImage: doctor.image,
    bmdcNumber: doctor.bmdcNumber,
    patientName,
    patientPhone,
    date: date || new Date().toISOString().split('T')[0],
    time: time || "10:00 AM",
    consultationType: consultationType || "video",
    symptoms: symptoms || "General Consultation",
    fee: doctor.onlineFee || doctor.fee || 600,
    paymentStatus: "paid",
    status: "confirmed",
    videoRoomUrl: `/consultation/room_apt_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  db.insert('appointments', appointment);
  res.json({ success: true, appointment });
});

// Book Offline Chamber Serial
app.post('/api/appointments/book-chamber', (req, res) => {
  const { doctorId, chamberId, patientName, patientPhone, patientAge, date, symptoms } = req.body;
  if (!doctorId || !chamberId || !patientName || !patientPhone) {
    return res.status(400).json({ error: "Doctor, chamber selection, patient name, and phone are required" });
  }

  const doctor = db.find('doctors', d => d.id === doctorId);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });

  const chamber = doctor.chambers?.find(c => c.id === chamberId);
  if (!chamber) return res.status(404).json({ error: "Chamber not found" });

  const assignedSerial = (chamber.currentBookedSerials || 0) + 1;

  const chamberTicket = {
    id: `chamb_tkt_${Date.now()}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    bmdcNumber: doctor.bmdcNumber,
    doctorImage: doctor.image,
    chamberId: chamber.id,
    hospitalName: chamber.hospitalName,
    roomNumber: chamber.roomNumber,
    area: chamber.area,
    visitingDays: chamber.visitingDays,
    visitingHours: chamber.visitingHours,
    serialNumber: assignedSerial,
    estimatedReportingTime: `${chamber.visitingHours.split(' - ')[0]} (Reporting recommended 15 mins prior)`,
    date: date || chamber.nextAvailableDate,
    patientName,
    patientPhone,
    patientAge: patientAge || "Adult",
    symptoms: symptoms || "Chamber Consultation",
    chamberFee: chamber.chamberFee,
    paymentStatus: "paid",
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.insert('chamberBookings', chamberTicket);
  res.json({ success: true, ticket: chamberTicket });
});

app.get('/api/appointments', (req, res) => {
  const appointments = db.get('appointments');
  const chambers = db.get('chamberBookings');
  res.json({ appointments, chambers });
});

app.post('/api/appointments/:id/prescribe', (req, res) => {
  const { diagnosis, medicines, advice } = req.body;
  const apt = db.find('appointments', a => a.id === req.params.id) || db.find('chamberBookings', c => c.id === req.params.id);
  if (!apt) return res.status(404).json({ error: "Appointment not found" });

  const prescription = {
    prescriptionId: `rx_${Date.now()}`,
    appointmentId: apt.id,
    patientName: apt.patientName,
    doctorName: apt.doctorName,
    bmdcNumber: apt.bmdcNumber,
    date: new Date().toISOString().split('T')[0],
    diagnosis: diagnosis || "Acute Upper Respiratory Infection",
    medicines: medicines || [
      { name: "Napa Extra 500mg+65mg", dosage: "1+0+1", duration: "5 days", timing: "After meal" },
      { name: "Fexo 120mg", dosage: "0+0+1", duration: "7 days", timing: "At night" }
    ],
    advice: advice || "Drink plenty of warm water, rest, and follow up in 5 days."
  };

  if (apt.id.startsWith('apt_')) {
    db.update('appointments', apt.id, { prescription, status: "completed" });
  } else {
    db.update('chamberBookings', apt.id, { prescription, status: "completed" });
  }

  res.json({ success: true, prescription });
});

// Ambulance Fleet & Dispatch Routes (Individual & Hospital Fleets)
app.get('/api/ambulance/fleet', (req, res) => {
  const { ownershipType, hospitalId } = req.query;
  let fleet = db.get('ambulances');

  if (ownershipType && ownershipType !== 'all') {
    fleet = fleet.filter(a => a.ownershipType === ownershipType);
  }
  if (hospitalId) {
    fleet = fleet.filter(a => a.hospitalId === hospitalId);
  }

  res.json({ ambulances: fleet });
});

app.post('/api/ambulance/book', (req, res) => {
  const { pickupLocation, destination, patientName, phone, emergencyType, ambulanceType, preferredHospitalId } = req.body;
  if (!pickupLocation || !phone) {
    return res.status(400).json({ error: "Pickup location and contact phone are required" });
  }

  const fleet = db.get('ambulances');
  let assigned = fleet.find(a => 
    (ambulanceType ? a.type.toLowerCase().includes(ambulanceType.toLowerCase()) : true) &&
    (preferredHospitalId ? a.hospitalId === preferredHospitalId : true)
  ) || fleet[0];

  const booking = {
    id: `amb_bk_${Date.now()}`,
    trackingId: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    patientName: patientName || "Emergency Patient",
    phone,
    pickupLocation,
    destination: destination || "Nearest Tertiary Hospital",
    emergencyType: emergencyType || "Critical Emergency",
    ambulanceType: assigned.type,
    ownershipType: assigned.ownershipType,
    hospitalName: assigned.hospitalName,
    vehicleNumber: assigned.vehicleNumber,
    driverName: assigned.driverName,
    driverPhone: assigned.driverPhone,
    etaMinutes: Math.floor(7 + Math.random() * 6),
    status: "dispatched",
    coordinates: {
      pickup: { lat: 23.7776, lng: 90.4054 },
      current: { lat: 23.7720, lng: 90.4010 }
    },
    totalFee: assigned.baseFee + (10 * assigned.perKmFee),
    createdAt: new Date().toISOString()
  };

  db.insert('ambulanceBookings', booking);
  res.json({ success: true, trackingId: booking.trackingId, booking });
});

app.get('/api/ambulance/track/:trackingId', (req, res) => {
  const booking = db.find('ambulanceBookings', b => b.trackingId === req.params.trackingId || b.id === req.params.trackingId);
  if (!booking) return res.status(404).json({ error: "Tracking ID not found" });
  res.json({ booking });
});

// Pharmacies & Verified Retail Chains
app.get('/api/pharmacies', (req, res) => {
  const { hospitalId, type } = req.query;
  let pharmacies = db.get('pharmacies');

  if (hospitalId) {
    pharmacies = pharmacies.filter(p => p.hospitalId === hospitalId);
  }
  if (type && type !== 'All') {
    pharmacies = pharmacies.filter(p => p.type.toLowerCase().includes(type.toLowerCase()));
  }

  res.json({ pharmacies });
});

// Medicines Catalog
app.get('/api/medicines', (req, res) => {
  const { search, category, pharmacyId } = req.query;
  let meds = db.get('medicines');

  if (category && category !== 'All') {
    meds = meds.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }

  if (pharmacyId) {
    meds = meds.filter(m => m.pharmacyId === pharmacyId);
  }

  if (search) {
    const q = search.toLowerCase();
    meds = meds.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.generic.toLowerCase().includes(q) || 
      d.manufacturer.toLowerCase().includes(q) ||
      d.pharmacyName.toLowerCase().includes(q)
    );
  }

  res.json({ medicines: meds });
});

app.post('/api/medicine/order', (req, res) => {
  const { customerName, phone, deliveryAddress, items, totalAmount, paymentMethod, prescriptionUrl, selectedPharmacy } = req.body;
  if (!customerName || !phone || !deliveryAddress || !items || items.length === 0) {
    return res.status(400).json({ error: "Order details, address, and items are required" });
  }

  const order = {
    id: `ord_${Date.now()}`,
    customerName,
    phone,
    deliveryAddress,
    items,
    selectedPharmacy: selectedPharmacy || "Lazz Pharma (Central Kalabagan)",
    totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.pricePerStrip * item.quantity), 0) + 60,
    deliveryFee: 60,
    paymentMethod: paymentMethod || "Cash on Delivery",
    paymentStatus: paymentMethod === "Cash on Delivery" ? "pending" : "paid",
    prescriptionUrl: prescriptionUrl || null,
    status: "confirmed",
    estimatedDeliveryTime: "35-50 minutes",
    createdAt: new Date().toISOString()
  };

  db.insert('medicineOrders', order);
  res.json({ success: true, order });
});

app.post('/api/medicine/upload-prescription', (req, res) => {
  const { prescriptionImage, notes, patientPhone, patientName, preferredPharmacy } = req.body;
  if (!prescriptionImage) {
    return res.status(400).json({ error: "Prescription image is required" });
  }

  const uploadRecord = {
    id: `rx_up_${Date.now()}`,
    patientName: patientName || "Patient",
    patientPhone: patientPhone || "+8801700000000",
    preferredPharmacy: preferredPharmacy || "Lazz Pharma (Central Kalabagan)",
    notes: notes || "Review prescription and dispatch medicines",
    prescriptionImage,
    status: "Under Pharmacist Review",
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: "Prescription uploaded successfully. A registered A-Grade Pharmacist is reviewing your order.",
    record: uploadRecord
  });
});

// Hospitals Directory, Bed Booking & Seat Reservation
app.get('/api/hospitals', (req, res) => {
  const { city, search, maxDistance } = req.query;
  let hospitals = db.get('hospitals');

  if (city && city !== 'All') {
    hospitals = hospitals.filter(h => h.city.toLowerCase() === city.toLowerCase());
  }

  if (maxDistance) {
    hospitals = hospitals.filter(h => h.distanceKm <= Number(maxDistance));
  }

  if (search) {
    const q = search.toLowerCase();
    hospitals = hospitals.filter(h => 
      h.name.toLowerCase().includes(q) || 
      h.area.toLowerCase().includes(q) ||
      h.type.toLowerCase().includes(q)
    );
  }

  res.json({ hospitals });
});

app.get('/api/hospitals/:id', (req, res) => {
  const hospital = db.find('hospitals', h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ error: "Hospital not found" });

  // Attach hospital's doctors, ambulances, and in-house pharmacy
  const doctors = db.filter('doctors', d => d.hospitalId === hospital.id || d.chambers?.some(c => c.hospitalId === hospital.id));
  const ambulances = db.filter('ambulances', a => a.hospitalId === hospital.id);
  const pharmacy = db.find('pharmacies', p => p.hospitalId === hospital.id);

  res.json({ hospital, doctors, ambulances, pharmacy });
});

app.post('/api/hospitals/book-bed', (req, res) => {
  const { hospitalId, bedType, patientName, patientPhone, emergencyContact, symptoms, doctorReferral } = req.body;
  if (!hospitalId || !bedType || !patientName || !patientPhone) {
    return res.status(400).json({ error: "Hospital, bed type, patient name, and phone are required" });
  }

  const hospital = db.find('hospitals', h => h.id === hospitalId);
  if (!hospital) return res.status(404).json({ error: "Hospital not found" });

  const bedInfo = hospital.beds?.[bedType] || { available: 5, feePerDay: 5000 };

  const reservation = {
    id: `bed_res_${Date.now()}`,
    tokenNumber: `BED-${Math.floor(1000 + Math.random() * 9000)}`,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hospitalAddress: hospital.area,
    emergencyHotline: hospital.emergencyHotline,
    bedType: bedType.toUpperCase(),
    dailyFeeBDT: bedInfo.feePerDay || 5000,
    patientName,
    patientPhone,
    emergencyContact: emergencyContact || patientPhone,
    symptoms: symptoms || "Immediate Clinical Admission",
    doctorReferral: doctorReferral || "Self / Emergency Walk-in",
    status: "Bed Reserved - Admission Token Active",
    validForHours: 3,
    createdAt: new Date().toISOString()
  };

  db.insert('hospitalBedBookings', reservation);
  res.json({ success: true, reservation });
});

// Blood Donation & Blood Bank Network
app.get('/api/blood/donors', (req, res) => {
  const { bloodGroup, area } = req.query;
  let donors = db.get('bloodDonors');

  if (bloodGroup && bloodGroup !== 'All') {
    donors = donors.filter(d => d.bloodGroup.toUpperCase() === bloodGroup.toUpperCase());
  }

  if (area) {
    const q = area.toLowerCase();
    donors = donors.filter(d => d.area.toLowerCase().includes(q) || d.district.toLowerCase().includes(q));
  }

  res.json({ donors });
});

app.post('/api/blood/donors/register', (req, res) => {
  const { name, bloodGroup, phone, area, district, lastDonatedDate } = req.body;
  if (!name || !bloodGroup || !phone || !area) {
    return res.status(400).json({ error: "Name, blood group, phone, and area are required" });
  }

  const donor = {
    id: `donor_${Date.now()}`,
    name,
    bloodGroup: bloodGroup.toUpperCase(),
    phone,
    area,
    district: district || "Dhaka",
    lastDonatedDate: lastDonatedDate || new Date().toISOString().split('T')[0],
    isAvailable: true,
    totalDonations: 1,
    verifiedBadge: true,
    createdAt: new Date().toISOString()
  };

  db.insert('bloodDonors', donor);
  res.json({ success: true, donor, message: "Thank you for registering as a life-saving blood donor!" });
});

app.get('/api/blood/requests', (req, res) => {
  const requests = db.get('bloodRequests');
  res.json({ requests });
});

app.post('/api/blood/requests/create', (req, res) => {
  const { patientName, bloodGroup, bagsNeeded, hospitalName, area, urgency, reason, contactName, contactPhone } = req.body;
  if (!patientName || !bloodGroup || !hospitalName || !contactPhone) {
    return res.status(400).json({ error: "Patient name, blood group, hospital name, and contact phone are required" });
  }

  const newRequest = {
    id: `breq_${Date.now()}`,
    patientName,
    bloodGroup: bloodGroup.toUpperCase(),
    bagsNeeded: bagsNeeded || 1,
    hospitalName,
    area: area || "Dhaka",
    urgency: urgency || "Immediate Emergency",
    reason: reason || "Surgery / Emergency Transfusion",
    contactName: contactName || patientName,
    contactPhone,
    status: "open",
    createdAt: new Date().toISOString()
  };

  db.insert('bloodRequests', newRequest);
  res.json({ success: true, request: newRequest });
});

app.get('/api/blood/inventory', (req, res) => {
  const hospitals = db.get('hospitals');
  const inventorySummary = hospitals.map(h => ({
    hospitalId: h.id,
    hospitalName: h.name,
    area: h.area,
    phone: h.emergencyHotline,
    bloodStock: h.bloodInventory || {}
  }));
  res.json({ inventory: inventorySummary });
});

// Partner Onboarding (Hospitals, Pharmacies, Ambulance Owners)
app.post('/api/partners/register', (req, res) => {
  const { organizationName, partnerType, contactPerson, phone, email, address, licenseNumber, facilitiesOffered } = req.body;
  if (!organizationName || !partnerType || !phone) {
    return res.status(400).json({ error: "Organization name, partner type, and contact phone are required" });
  }

  const application = {
    id: `partner_app_${Date.now()}`,
    organizationName,
    partnerType, // 'hospital', 'pharmacy', 'ambulance'
    contactPerson: contactPerson || organizationName,
    phone,
    email: email || '',
    address: address || '',
    licenseNumber: licenseNumber || 'Pending Verification',
    facilitiesOffered: facilitiesOffered || [],
    status: "Under Verification by NIRBHOY Operations",
    submittedAt: new Date().toISOString()
  };

  db.insert('partnerApplications', application);
  res.json({
    success: true,
    message: "Partner onboarding application received! Our onboarding officer will contact you within 24 hours.",
    application
  });
});

// Emergency SOS
app.post('/api/emergency/sos', (req, res) => {
  const { location, latitude, longitude, phone, name, emergencyType } = req.body;

  const alert = {
    id: `sos_${Date.now()}`,
    patientName: name || "Anonymous Citizen",
    phone: phone || "+8801700000000",
    location: location || "Live GPS Location (Bangladesh)",
    latitude: latitude || 23.8103,
    longitude: longitude || 90.4125,
    emergencyType: emergencyType || "Critical Emergency",
    status: "dispatched",
    emergencyContactsAlerted: true,
    nearestHospitalAlerted: "Dhaka Medical College & Hospital (DMCH)",
    timestamp: new Date().toISOString()
  };

  db.insert('emergencyAlerts', alert);
  res.json({
    success: true,
    alertId: alert.id,
    message: "EMERGENCY SOS SIGNAL RECEIVED! Rapid response team and emergency contacts alerted.",
    alert
  });
});

app.get('/api/emergency/alerts', (req, res) => {
  const alerts = db.get('emergencyAlerts');
  res.json({ alerts });
});

// Payments
app.post('/api/payment/process', (req, res) => {
  const { amount, method, purpose, referenceId, phoneNumber } = req.body;
  if (!amount || !method) {
    return res.status(400).json({ error: "Amount and payment method are required" });
  }

  const payment = {
    id: `pay_${Date.now()}`,
    transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    amount,
    currency: "BDT (৳)",
    method, // bkash, nagad, rocket, card
    purpose: purpose || "Healthcare Service",
    referenceId: referenceId || `ref_${Date.now()}`,
    phoneNumber: phoneNumber || "+8801700000000",
    status: "successful",
    paidAt: new Date().toISOString()
  };

  db.insert('payments', payment);
  res.json({
    success: true,
    message: `Payment of ৳${amount} via ${method.toUpperCase()} completed successfully`,
    payment
  });
});

// Subscriptions
app.post('/api/subscription/subscribe', (req, res) => {
  const { plan } = req.body;
  const isYearly = plan === 'yearly';
  const subscription = {
    status: "active",
    plan: plan || "monthly",
    price: isYearly ? 4999 : 499,
    startDate: new Date().toISOString(),
    validUntil: new Date(Date.now() + (isYearly ? 365 : 30) * 86400000).toISOString(),
    features: [
      "Unlimited doctor video consultations",
      "Priority ambulance dispatch",
      "Free medicine home delivery",
      "15% discount on hospital partner beds & labs"
    ]
  };

  res.json({ success: true, subscription });
});

app.get('/api/subscription/status', (req, res) => {
  res.json({
    subscription: {
      status: "active",
      plan: "monthly",
      validUntil: "2026-12-31"
    }
  });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const appointments = db.get('appointments');
  const chambers = db.get('chamberBookings');
  const ambulanceBookings = db.get('ambulanceBookings');
  const emergencyAlerts = db.get('emergencyAlerts');
  const medicineOrders = db.get('medicineOrders');
  const payments = db.get('payments');
  const doctors = db.get('doctors');
  const hospitals = db.get('hospitals');
  const donors = db.get('bloodDonors');
  const partnerApps = db.get('partnerApplications');

  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  res.json({
    stats: {
      totalDoctors: doctors.length,
      totalHospitals: hospitals.length,
      totalAppointments: appointments.length + chambers.length,
      totalChamberSerials: chambers.length,
      activeAmbulancesDispatched: ambulanceBookings.length,
      emergencySOSCount: emergencyAlerts.length,
      medicineOrdersCount: medicineOrders.length,
      totalRegisteredDonors: donors.length,
      pendingPartnerApps: partnerApps.length,
      totalRevenueBDT: totalRevenue
    },
    recentSOS: emergencyAlerts.slice(0, 5),
    recentAppointments: appointments.slice(0, 5),
    recentChambers: chambers.slice(0, 5),
    recentAmbulanceTrips: ambulanceBookings.slice(0, 5),
    recentMedicineOrders: medicineOrders.slice(0, 5),
    recentPartnerApps: partnerApps.slice(0, 5)
  });
});

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[NIRBHOY HEALTH SERVER] Running on http://localhost:${PORT}`);
    console.log(`[NIRBHOY HEALTH SERVER] Multi-module database ready (Doctors, Chambers, Hospitals, Blood Network, Pharmacies, Ambulances)`);
  });
}

export default app;
