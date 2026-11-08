const API_BASE = '/api';

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
    const res = await fetch(`${API_BASE}/init-data`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

  // Auth
  static async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  }

  static async signup(userData) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  }

  static async getCurrentUser() {
    const token = localStorage.getItem('nirbhoy_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/user`, {
        headers: this.getHeaders(true)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch (err) {
      console.error("Error fetching current user:", err);
      return null;
    }
  }

  // Doctors & Offline Chambers
  static async getDoctors(specialty = '', search = '', hospitalId = '', mode = '') {
    const params = new URLSearchParams();
    if (specialty && specialty !== 'All') params.append('specialty', specialty);
    if (search) params.append('search', search);
    if (hospitalId) params.append('hospitalId', hospitalId);
    if (mode) params.append('mode', mode);

    const res = await fetch(`${API_BASE}/doctors?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.doctors || [];
  }

  static async bookAppointment(appointmentData) {
    const res = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(appointmentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Appointment booking failed');
    return data;
  }

  static async bookChamberSerial(chamberData) {
    const res = await fetch(`${API_BASE}/appointments/book-chamber`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(chamberData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Chamber serial booking failed');
    return data;
  }

  static async getAppointments() {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: this.getHeaders(true)
    });
    const data = await res.json();
    return data;
  }

  static async prescribeMedicine(appointmentId, prescriptionData) {
    const res = await fetch(`${API_BASE}/appointments/${appointmentId}/prescribe`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(prescriptionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Prescription generation failed');
    return data;
  }

  // Ambulance (Hospital-owned & Individual)
  static async getAmbulanceFleet(ownershipType = 'all', hospitalId = '') {
    const params = new URLSearchParams();
    if (ownershipType && ownershipType !== 'all') params.append('ownershipType', ownershipType);
    if (hospitalId) params.append('hospitalId', hospitalId);

    const res = await fetch(`${API_BASE}/ambulance/fleet?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.ambulances || [];
  }

  static async bookAmbulance(bookingData) {
    const res = await fetch(`${API_BASE}/ambulance/book`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ambulance booking failed');
    return data;
  }

  static async trackAmbulance(trackingId) {
    const res = await fetch(`${API_BASE}/ambulance/track/${trackingId}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tracking failed');
    return data.booking;
  }

  // Emergency SOS
  static async sendSOS(sosData) {
    const res = await fetch(`${API_BASE}/emergency/sos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(sosData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'SOS trigger failed');
    return data;
  }

  // Pharmacies
  static async getPharmacies(hospitalId = '', type = '') {
    const params = new URLSearchParams();
    if (hospitalId) params.append('hospitalId', hospitalId);
    if (type && type !== 'All') params.append('type', type);

    const res = await fetch(`${API_BASE}/pharmacies?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.pharmacies || [];
  }

  // Medicines Catalog
  static async getMedicines(category = '', search = '', pharmacyId = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (pharmacyId) params.append('pharmacyId', pharmacyId);

    const res = await fetch(`${API_BASE}/medicines?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.medicines || [];
  }

  static async orderMedicines(orderData) {
    const res = await fetch(`${API_BASE}/medicine/order`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Medicine ordering failed');
    return data;
  }

  static async uploadPrescription(uploadData) {
    const res = await fetch(`${API_BASE}/medicine/upload-prescription`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(uploadData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Prescription upload failed');
    return data;
  }

  // Hospitals Directory & Bed Reservation
  static async getHospitals(city = '', search = '', maxDistance = '') {
    const params = new URLSearchParams();
    if (city && city !== 'All') params.append('city', city);
    if (search) params.append('search', search);
    if (maxDistance) params.append('maxDistance', maxDistance);

    const res = await fetch(`${API_BASE}/hospitals?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.hospitals || [];
  }

  static async getHospitalDetails(id) {
    const res = await fetch(`${API_BASE}/hospitals/${id}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hospital not found');
    return data;
  }

  static async bookHospitalBed(bedData) {
    const res = await fetch(`${API_BASE}/hospitals/book-bed`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(bedData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Bed reservation failed');
    return data;
  }

  // Blood Donation Network
  static async getBloodDonors(bloodGroup = '', area = '') {
    const params = new URLSearchParams();
    if (bloodGroup && bloodGroup !== 'All') params.append('bloodGroup', bloodGroup);
    if (area) params.append('area', area);

    const res = await fetch(`${API_BASE}/blood/donors?${params.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.donors || [];
  }

  static async registerBloodDonor(donorData) {
    const res = await fetch(`${API_BASE}/blood/donors/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(donorData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Blood donor registration failed');
    return data;
  }

  static async getBloodRequests() {
    const res = await fetch(`${API_BASE}/blood/requests`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.requests || [];
  }

  static async createBloodRequest(requestData) {
    const res = await fetch(`${API_BASE}/blood/requests/create`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(requestData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Blood request submission failed');
    return data;
  }

  static async getBloodInventory() {
    const res = await fetch(`${API_BASE}/blood/inventory`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    return data.inventory || [];
  }

  // Partner Onboarding
  static async registerPartner(partnerData) {
    const res = await fetch(`${API_BASE}/partners/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(partnerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Partner registration failed');
    return data;
  }

  // Payments
  static async processPayment(paymentData) {
    const res = await fetch(`${API_BASE}/payment/process`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment failed');
    return data;
  }

  // Subscription
  static async subscribe(plan) {
    const res = await fetch(`${API_BASE}/subscription/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ plan })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Subscription failed');
    return data.subscription;
  }

  // Admin
  static async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: this.getHeaders(true)
    });
    return res.json();
  }
}
