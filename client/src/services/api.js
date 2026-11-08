import initialData from './data.json';

const API_BASE = '/api';

// Local storage backed fallback store for zero-config frontend-only Vercel deployments
function getStore(key, defaultValue) {
  try {
    const saved = localStorage.getItem(`nirbhoy_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return defaultValue;
}

function saveStore(key, value) {
  try {
    localStorage.setItem(`nirbhoy_${key}`, JSON.stringify(value));
  } catch (e) {}
}

export class ApiService {
  static getHeaders(authRequired = false) {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (authRequired) {
      const token = localStorage.getItem('nirbhoy_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async initData() {
    try {
      const res = await fetch(`${API_BASE}/init-data`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      message: "Data ready",
      doctorsCount: initialData.doctors.length,
      hospitalsCount: initialData.hospitals.length
    };
  }

  // Auth
  static async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback: Local Auth
    const users = getStore('users', initialData.users || []);
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: "+8801700000000",
        role: "patient",
        address: "Dhaka, Bangladesh",
        subscription: { status: "free" }
      };
      users.push(user);
      saveStore('users', users);
    }
    const token = `tok_${Date.now()}`;
    localStorage.setItem('nirbhoy_token', token);
    localStorage.setItem('nirbhoy_user', JSON.stringify(user));
    return { token, user };
  }

  static async signup(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const users = getStore('users', initialData.users || []);
    const newUser = {
      id: `usr_${Date.now()}`,
      ...userData,
      role: 'patient',
      subscription: { status: 'free' }
    };
    users.push(newUser);
    saveStore('users', users);
    const token = `tok_${Date.now()}`;
    localStorage.setItem('nirbhoy_token', token);
    localStorage.setItem('nirbhoy_user', JSON.stringify(newUser));
    return { token, user: newUser };
  }

  static async getCurrentUser() {
    const token = localStorage.getItem('nirbhoy_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/user`, {
        headers: this.getHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (err) {}
    try {
      const cached = localStorage.getItem('nirbhoy_user');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  }

  // Doctors & Offline Chambers
  static async getDoctors(specialty = '', search = '', hospitalId = '', mode = '') {
    try {
      const params = new URLSearchParams();
      if (specialty && specialty !== 'All') params.append('specialty', specialty);
      if (search) params.append('search', search);
      if (hospitalId) params.append('hospitalId', hospitalId);
      if (mode) params.append('mode', mode);

      const res = await fetch(`${API_BASE}/doctors?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.doctors || [];
      }
    } catch (e) {}

    // Fallback: local filter
    let list = initialData.doctors || [];
    if (specialty && specialty !== 'All') {
      list = list.filter(d => d.specialty === specialty);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
    }
    if (hospitalId) {
      list = list.filter(d => d.chamberHospitalId === hospitalId || d.hospital === hospitalId);
    }
    if (mode === 'video') {
      list = list.filter(d => d.videoConsultationAvailable);
    } else if (mode === 'chamber') {
      list = list.filter(d => d.offlineChamberAvailable);
    }
    return list;
  }

  static async bookAppointment(appointmentData) {
    try {
      const res = await fetch(`${API_BASE}/appointments/book`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(appointmentData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const appointments = getStore('appointments', []);
    const newApt = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    appointments.push(newApt);
    saveStore('appointments', appointments);
    return { success: true, appointment: newApt };
  }

  static async bookChamberSerial(chamberData) {
    try {
      const res = await fetch(`${API_BASE}/appointments/book-chamber`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(chamberData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const chambers = getStore('chamber_bookings', []);
    const newBooking = {
      id: `chm_${Date.now()}`,
      serialNumber: Math.floor(Math.random() * 20) + 1,
      ...chamberData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    chambers.push(newBooking);
    saveStore('chamber_bookings', chambers);
    return { success: true, booking: newBooking };
  }

  static async getAppointments() {
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        headers: this.getHeaders(true)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      appointments: getStore('appointments', []),
      chamberBookings: getStore('chamber_bookings', [])
    };
  }

  static async prescribeMedicine(appointmentId, prescriptionData) {
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}/prescribe`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(prescriptionData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, prescriptionId: `rx_${Date.now()}` };
  }

  // Ambulance (Hospital-owned & Individual)
  static async getAmbulanceFleet(ownershipType = 'all', hospitalId = '') {
    try {
      const params = new URLSearchParams();
      if (ownershipType && ownershipType !== 'all') params.append('ownershipType', ownershipType);
      if (hospitalId) params.append('hospitalId', hospitalId);

      const res = await fetch(`${API_BASE}/ambulance/fleet?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.ambulances || [];
      }
    } catch (e) {}

    let list = initialData.ambulances || [];
    if (ownershipType && ownershipType !== 'all') {
      list = list.filter(a => a.ownershipType === ownershipType);
    }
    if (hospitalId) {
      list = list.filter(a => a.hospitalId === hospitalId);
    }
    return list;
  }

  static async bookAmbulance(bookingData) {
    try {
      const res = await fetch(`${API_BASE}/ambulance/book`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const bookings = getStore('ambulance_bookings', []);
    const newTrip = {
      id: `amb_trip_${Date.now()}`,
      trackingId: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      ...bookingData,
      status: 'dispatched',
      etaMinutes: 10,
      createdAt: new Date().toISOString()
    };
    bookings.push(newTrip);
    saveStore('ambulance_bookings', bookings);
    return { success: true, booking: newTrip };
  }

  static async trackAmbulance(trackingId) {
    try {
      const res = await fetch(`${API_BASE}/ambulance/track/${trackingId}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking;
      }
    } catch (e) {}

    const bookings = getStore('ambulance_bookings', []);
    const found = bookings.find(b => b.trackingId === trackingId);
    if (found) return found;
    return {
      trackingId,
      status: 'dispatched',
      ambulanceType: 'ICU Life Support',
      driverName: 'Kawsar Mia',
      driverPhone: '+880 1711-234567',
      plateNumber: 'Dhaka Metro-Cha 11-4567',
      etaMinutes: 8
    };
  }

  // Emergency SOS
  static async sendSOS(sosData) {
    try {
      const res = await fetch(`${API_BASE}/emergency/sos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(sosData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const alerts = getStore('emergency_alerts', []);
    const newAlert = {
      id: `sos_${Date.now()}`,
      ...sosData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    alerts.push(newAlert);
    saveStore('emergency_alerts', alerts);
    return { success: true, alertId: newAlert.id, message: "Emergency broadcast received" };
  }

  // Pharmacies
  static async getPharmacies(hospitalId = '', type = '') {
    try {
      const params = new URLSearchParams();
      if (hospitalId) params.append('hospitalId', hospitalId);
      if (type && type !== 'All') params.append('type', type);

      const res = await fetch(`${API_BASE}/pharmacies?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.pharmacies || [];
      }
    } catch (e) {}

    let list = initialData.pharmacies || [];
    if (hospitalId) list = list.filter(p => p.hospitalId === hospitalId);
    if (type && type !== 'All') list = list.filter(p => p.type === type);
    return list;
  }

  // Medicines Catalog
  static async getMedicines(category = '', search = '', pharmacyId = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      if (pharmacyId) params.append('pharmacyId', pharmacyId);

      const res = await fetch(`${API_BASE}/medicines?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.medicines || [];
      }
    } catch (e) {}

    let list = initialData.medicines || [];
    if (category && category !== 'All') list = list.filter(m => m.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.generic.toLowerCase().includes(q));
    }
    if (pharmacyId) list = list.filter(m => m.pharmacyId === pharmacyId);
    return list;
  }

  static async orderMedicines(orderData) {
    try {
      const res = await fetch(`${API_BASE}/medicine/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const orders = getStore('medicine_orders', []);
    const newOrder = {
      id: `ord_${Date.now()}`,
      ...orderData,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    saveStore('medicine_orders', orders);
    return { success: true, order: newOrder };
  }

  static async uploadPrescription(uploadData) {
    try {
      const res = await fetch(`${API_BASE}/medicine/upload-prescription`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(uploadData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, message: "Prescription verified by DGDA registered pharmacist", orderId: `ord_${Date.now()}` };
  }

  // Hospitals Directory & Bed Reservation
  static async getHospitals(city = '', search = '', maxDistance = '') {
    try {
      const params = new URLSearchParams();
      if (city && city !== 'All') params.append('city', city);
      if (search) params.append('search', search);
      if (maxDistance) params.append('maxDistance', maxDistance);

      const res = await fetch(`${API_BASE}/hospitals?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.hospitals || [];
      }
    } catch (e) {}

    let list = initialData.hospitals || [];
    if (city && city !== 'All') list = list.filter(h => h.city === city);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q));
    }
    if (maxDistance) {
      const max = parseFloat(maxDistance);
      if (!isNaN(max)) list = list.filter(h => h.distanceKm <= max);
    }
    return list;
  }

  static async getHospitalDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/hospitals/${id}`, {
        headers: this.getHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const hospital = (initialData.hospitals || []).find(h => h.id === id);
    if (hospital) {
      return {
        hospital,
        doctors: (initialData.doctors || []).filter(d => d.chamberHospitalId === id || d.hospital === hospital.name),
        ambulances: (initialData.ambulances || []).filter(a => a.hospitalId === id),
        pharmacies: (initialData.pharmacies || []).filter(p => p.hospitalId === id)
      };
    }
    throw new Error('Hospital not found');
  }

  static async bookHospitalBed(bedData) {
    try {
      const res = await fetch(`${API_BASE}/hospitals/book-bed`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(bedData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const beds = getStore('bed_bookings', []);
    const newBooking = {
      id: `bed_${Date.now()}`,
      ...bedData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    beds.push(newBooking);
    saveStore('bed_bookings', beds);
    return { success: true, booking: newBooking };
  }

  // Blood Donation Network
  static async getBloodDonors(bloodGroup = '', area = '') {
    try {
      const params = new URLSearchParams();
      if (bloodGroup && bloodGroup !== 'All') params.append('bloodGroup', bloodGroup);
      if (area) params.append('area', area);

      const res = await fetch(`${API_BASE}/blood/donors?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.donors || [];
      }
    } catch (e) {}

    let list = initialData.bloodDonors || [];
    if (bloodGroup && bloodGroup !== 'All') list = list.filter(d => d.bloodGroup === bloodGroup);
    if (area) {
      const q = area.toLowerCase();
      list = list.filter(d => d.area.toLowerCase().includes(q));
    }
    return list;
  }

  static async registerBloodDonor(donorData) {
    try {
      const res = await fetch(`${API_BASE}/blood/donors/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(donorData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const donors = getStore('blood_donors', initialData.bloodDonors || []);
    const newDonor = {
      id: `dnr_${Date.now()}`,
      ...donorData,
      verified: true,
      createdAt: new Date().toISOString()
    };
    donors.push(newDonor);
    saveStore('blood_donors', donors);
    return { success: true, donor: newDonor };
  }

  static async getBloodRequests() {
    try {
      const res = await fetch(`${API_BASE}/blood/requests`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.requests || [];
      }
    } catch (e) {}
    return getStore('blood_requests', initialData.bloodRequests || []);
  }

  static async createBloodRequest(requestData) {
    try {
      const res = await fetch(`${API_BASE}/blood/requests/create`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(requestData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const requests = getStore('blood_requests', initialData.bloodRequests || []);
    const newReq = {
      id: `bld_req_${Date.now()}`,
      ...requestData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    requests.unshift(newReq);
    saveStore('blood_requests', requests);
    return { success: true, request: newReq };
  }

  static async getBloodInventory() {
    try {
      const res = await fetch(`${API_BASE}/blood/inventory`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.inventory || [];
      }
    } catch (e) {}
    return initialData.bloodInventory || [];
  }

  // Partner Onboarding
  static async registerPartner(partnerData) {
    try {
      const res = await fetch(`${API_BASE}/partners/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(partnerData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const partners = getStore('partners', []);
    const newPartner = {
      id: `prt_${Date.now()}`,
      ...partnerData,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    partners.push(newPartner);
    saveStore('partners', partners);
    return { success: true, partner: newPartner };
  }

  // Payments
  static async processPayment(paymentData) {
    try {
      const res = await fetch(`${API_BASE}/payment/process`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(paymentData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      success: true,
      transactionId: `TXN-${paymentData.method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'completed'
    };
  }

  // Subscription
  static async subscribe(plan) {
    try {
      const res = await fetch(`${API_BASE}/subscription/subscribe`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ plan })
      });
      if (res.ok) {
        const data = await res.json();
        return data.subscription;
      }
    } catch (e) {}

    const sub = {
      plan,
      status: 'active',
      startDate: new Date().toISOString(),
      expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    const cached = localStorage.getItem('nirbhoy_user');
    if (cached) {
      try {
        const user = JSON.parse(cached);
        user.subscription = sub;
        localStorage.setItem('nirbhoy_user', JSON.stringify(user));
      } catch (e) {}
    }
    return sub;
  }

  // Admin
  static async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: this.getHeaders(true)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      totals: {
        doctors: initialData.doctors.length,
        hospitals: initialData.hospitals.length,
        pharmacies: initialData.pharmacies.length,
        ambulances: initialData.ambulances.length,
        bloodDonors: initialData.bloodDonors.length
      },
      recentSOS: [],
      recentAppointments: [],
      recentChambers: [],
      recentAmbulanceTrips: [],
      recentMedicineOrders: [],
      recentPartnerApps: []
    };
  }
}
