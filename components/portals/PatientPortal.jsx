'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  User,
  Users,
  FileText,
  FlaskConical,
  Pill,
  CreditCard,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Menu,
  ArrowLeft,
  Check,
  Shield,
  Activity,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from 'lucide-react';

const PatientPortal = ({ user, logout }) => {
  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation active state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // Simulated loading state (skeleton screen)
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Modal / Detail states
  const [activeModal, setActiveModal] = useState(null); // 'appointment-details', 'record-details', 'report-details', 'invoice-details', 'payment', 'logout-confirm'
  const [selectedItem, setSelectedItem] = useState(null);

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || 'Rahul Verma',
    email: user.email || 'rahul.verma@careflow.com',
    phone: user.phone || '+91 98765 43210',
    address: user.address || 'Flat 402, Block C, Green Meadows, Bengaluru, KA - 560037',
    gender: user.gender ? (user.gender.charAt(0).toUpperCase() + user.gender.slice(1)) : 'Male',
    dob: '15 Aug 1994',
    notifEmail: true,
    notifSms: false,
    notifPush: true
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password Settings state
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Booking Flow wizard states
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    department: '',
    doctor: '',
    date: '',
    timeSlot: '',
    reason: ''
  });

  // Mock patient notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'report', title: '🧪 Lab Report Ready', desc: 'Your CBC (Complete Blood Count) report has been verified by the pathologist.', time: '10 minutes ago', unread: true },
    { id: 2, type: 'prescription', title: '💊 New Prescription Added', desc: 'Dr. Anjali Mehta added a prescription for Amoxicillin 500mg.', time: '2 hours ago', unread: true },
    { id: 3, type: 'billing', title: '💳 Payment Received', desc: 'Payment of ₹1,950 for Invoice #INV-00125 was processed successfully.', time: 'Yesterday', unread: false },
    { id: 4, type: 'appointment', title: '📅 Appointment Confirmed', desc: 'Your consultation with Dr. Anjali Mehta is scheduled for today at 10:30 AM.', time: 'Yesterday', unread: false }
  ]);

  // Mock data setup mirroring the connected patient journey
  const doctorsList = [
    { id: 'doc-1', name: 'Dr. Anjali Mehta', title: 'Senior Consultant', spec: 'Cardiologist', dept: 'Cardiology', consultations: 4, lastVisit: '18 Aug 2026', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80' },
    { id: 'doc-2', name: 'Dr. Rajesh Patel', title: 'Consultant', spec: 'General Physician', dept: 'Internal Medicine', consultations: 2, lastVisit: '05 May 2026', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80' },
    { id: 'doc-3', name: 'Dr. Sarah Alva', title: 'Head of Department', spec: 'Neurologist', dept: 'Neurology', consultations: 1, lastVisit: '12 Jan 2026', img: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=150&h=150&q=80' }
  ];

  const appointmentsList = [
    { id: 'APT-2026-00452', doctor: 'Dr. Anjali Mehta', dept: 'Cardiology', date: '18 Aug 2026', time: '10:30 AM', status: 'Confirmed', visitStatus: 'Waiting for Doctor', reason: 'Routine cardiovascular checkup post minor arrhythmia report.' },
    { id: 'APT-2026-00214', doctor: 'Dr. Rajesh Patel', dept: 'Internal Medicine', date: '05 May 2026', time: '11:00 AM', status: 'Completed', visitStatus: 'Completed', reason: 'Seasonal flu symptoms and physical health checkup.' },
    { id: 'APT-2026-00109', doctor: 'Dr. Sarah Alva', dept: 'Neurology', date: '12 Jan 2026', time: '02:30 PM', status: 'Completed', visitStatus: 'Completed', reason: 'Frequent migraine triggers check and nerve assessment.' }
  ];

  const medicalRecords = [
    {
      id: 'REC-2026-982',
      date: '18 Aug 2026',
      doctor: 'Dr. Anjali Mehta',
      dept: 'Cardiology',
      type: 'Consultation',
      diagnosis: 'Sinus Tachycardia - Recovered, post-viral fatigue',
      vitals: { bp: '120/80 mmHg', pulse: '72 bpm', temp: '98.6 °F', weight: '70 kg' },
      notes: 'Patient reports no recurrence of chest constriction or severe heart flutters. Vitals are completely normal and stable. Advised to continue standard cardiovascular exercises and avoid high stimulant intake.',
      tests: ['CBC Test', 'Electrocardiogram (ECG)'],
      prescriptions: ['Amoxicillin 500 mg', 'Propranolol 10 mg'],
      followUp: 'Follow up in 2 weeks or on SOS basis.'
    },
    {
      id: 'REC-2026-431',
      date: '05 May 2026',
      doctor: 'Dr. Rajesh Patel',
      dept: 'Internal Medicine',
      type: 'Consultation',
      diagnosis: 'Acute Rhinitis (Common Cold)',
      vitals: { bp: '118/76 mmHg', pulse: '68 bpm', temp: '101.2 °F', weight: '71 kg' },
      notes: 'Running temperature, chest clear, tonsils mildly inflamed. Prescribed steam inhalations and standard antipyretics.',
      tests: [],
      prescriptions: ['Paracetamol 650 mg', 'Cetirizine 10 mg'],
      followUp: 'SOS check if fever persists beyond 3 days.'
    }
  ];

  const labReports = [
    { id: 'LAB-2026-928', testName: 'CBC (Complete Blood Count)', doctor: 'Dr. Anjali Mehta', dept: 'Cardiology', date: '18 Aug 2026', status: 'Ready', verifiedBy: 'Dr. Sameer Khan (Pathologist)', collectedAt: '18 Aug 2026, 08:30 AM', verifiedAt: '18 Aug 2026, 11:15 AM', results: [{ param: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5 - 17.5' }, { param: 'White Blood Cells (WBC)', value: '6.8', unit: 'x10^3/µL', range: '4.0 - 11.0' }, { param: 'Platelets', value: '250', unit: 'x10^3/µL', range: '150 - 450' }] },
    { id: 'LAB-2026-919', testName: 'Electrocardiogram (ECG)', doctor: 'Dr. Anjali Mehta', dept: 'Cardiology', date: '18 Aug 2026', status: 'Processing', collectedAt: '18 Aug 2026, 10:45 AM', verifiedAt: 'In Progress' },
    { id: 'LAB-2026-381', testName: 'Thyroid Profile (T3, T4, TSH)', doctor: 'Dr. Rajesh Patel', dept: 'Internal Medicine', date: '05 May 2026', status: 'Ready', verifiedBy: 'Dr. Sameer Khan (Pathologist)', collectedAt: '05 May 2026, 09:00 AM', verifiedAt: '05 May 2026, 04:30 PM', results: [{ param: 'TSH', value: '2.4', unit: 'µIU/mL', range: '0.4 - 4.5' }, { param: 'Free T4', value: '1.2', unit: 'ng/dL', range: '0.8 - 1.8' }] }
  ];

  const prescriptionsList = [
    { id: 'PRX-2026-581', doctor: 'Dr. Anjali Mehta', dept: 'Cardiology', date: '18 Aug 2026', status: 'Active', medicines: [{ name: 'Amoxicillin', strength: '500 mg', dosage: '1 tablet', freq: 'Twice daily', dur: '5 days', inst: 'After food', status: 'Dispensed' }, { name: 'Propranolol', strength: '10 mg', dosage: '1 tablet', freq: 'Once daily (morning)', dur: '14 days', inst: 'Before food', status: 'Dispensed' }] },
    { id: 'PRX-2026-102', doctor: 'Dr. Rajesh Patel', dept: 'Internal Medicine', date: '05 May 2026', status: 'Completed', medicines: [{ name: 'Paracetamol', strength: '650 mg', dosage: '1 tablet', freq: 'Thrice daily', dur: '3 days', inst: 'After food', status: 'Completed' }] }
  ];

  const billingRecords = [
    { id: 'INV-2026-00125', date: '18 Aug 2026', total: 1950, paid: 1950, remaining: 0, status: 'Paid', items: [{ desc: 'Cardiology Consultation Fee', cost: 500 }, { desc: 'Biochemistry Diagnostic Laboratory (CBC)', cost: 800 }, { desc: 'Pharmacy Dispensed Medicines (Amoxicillin & Propranolol)', cost: 650 }], txn: 'TXN-84729105', paidAt: '18 Aug 2026, 11:30 AM' },
    { id: 'INV-2026-00126', date: '18 Aug 2026', total: 1000, paid: 0, remaining: 1000, status: 'Unpaid', items: [{ desc: 'Cardiac Follow-up Evaluation Charge', cost: 1000 }] }
  ];

  // Global search filtering mechanism
  const getFilteredSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];

    // Match Doctors
    doctorsList.forEach(doc => {
      if (doc.name.toLowerCase().includes(query) || doc.spec.toLowerCase().includes(query)) {
        results.push({ category: 'My Doctors', title: doc.name, subtitle: `${doc.spec} (${doc.dept})`, tab: 'mydoctors', item: doc });
      }
    });

    // Match Appointments
    appointmentsList.forEach(apt => {
      if (apt.doctor.toLowerCase().includes(query) || apt.dept.toLowerCase().includes(query) || apt.id.toLowerCase().includes(query)) {
        results.push({ category: 'Appointments', title: `${apt.date} — ${apt.dept}`, subtitle: `With ${apt.doctor}`, tab: 'appointments', item: apt });
      }
    });

    // Match Medical Records
    medicalRecords.forEach(rec => {
      if (rec.diagnosis.toLowerCase().includes(query) || rec.doctor.toLowerCase().includes(query) || rec.id.toLowerCase().includes(query)) {
        results.push({ category: 'Medical Records', title: `${rec.date} — Consultation`, subtitle: `Diagnosis: ${rec.diagnosis}`, tab: 'medicalrecords', item: rec });
      }
    });

    // Match Lab Reports
    labReports.forEach(rep => {
      if (rep.testName.toLowerCase().includes(query) || rep.id.toLowerCase().includes(query)) {
        results.push({ category: 'Lab Reports', title: rep.testName, subtitle: `Ordered by ${rep.doctor}`, tab: 'labreports', item: rep });
      }
    });

    // Match Prescriptions
    prescriptionsList.forEach(rx => {
      if (rx.id.toLowerCase().includes(query) || rx.medicines.some(m => m.name.toLowerCase().includes(query))) {
        results.push({ category: 'Prescriptions', title: `Prescription from ${rx.date}`, subtitle: `By ${rx.doctor}`, tab: 'prescriptions', item: rx });
      }
    });

    // Match Billing
    billingRecords.forEach(bill => {
      if (bill.id.toLowerCase().includes(query) || bill.status.toLowerCase().includes(query)) {
        results.push({ category: 'Billing & Payments', title: `Invoice ${bill.id}`, subtitle: `Amount: ₹${bill.total} (${bill.status})`, tab: 'billing', item: bill });
      }
    });

    return results;
  };

  const handleSearchResultClick = (res) => {
    setActiveTab(res.tab);
    setSearchQuery('');
    setShowSearchDropdown(false);
    
    // Auto-open detail modal if applicable
    if (res.tab === 'appointments') {
      setSelectedItem(res.item);
      setActiveModal('appointment-details');
    } else if (res.tab === 'medicalrecords') {
      setSelectedItem(res.item);
      setActiveModal('record-details');
    } else if (res.tab === 'labreports') {
      if (res.item.status === 'Ready') {
        setSelectedItem(res.item);
        setActiveModal('report-details');
      }
    } else if (res.tab === 'prescriptions') {
      setSelectedItem(res.item);
      setActiveModal('prescription-details');
    } else if (res.tab === 'billing') {
      setSelectedItem(res.item);
      setActiveModal('invoice-details');
    }
  };

  // Sync / Refresh Simulation
  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }, 1200);
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Profile submission handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setProfileSuccessMsg('');
      setIsEditingProfile(false);
    }, 2000);
  };

  // Password submission handler
  const handleSavePassword = (e) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (passwordData.new !== passwordData.confirm) {
      setPasswordErrorMsg('New passwords do not match.');
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setPasswordSuccessMsg('Password updated successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccessMsg(''), 3000);
  };

  // Wizard Selectable Doctor options mapping
  const getDoctorOptions = () => {
    switch (bookingData.department) {
      case 'Cardiology': return ['Dr. Anjali Mehta'];
      case 'Internal Medicine': return ['Dr. Rajesh Patel'];
      case 'Neurology': return ['Dr. Sarah Alva'];
      default: return [];
    }
  };

  // Form submit for Book Appointment
  const handleConfirmBooking = () => {
    const newApt = {
      id: `APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      doctor: bookingData.doctor,
      dept: bookingData.department,
      date: bookingData.date,
      time: bookingData.timeSlot,
      status: 'Confirmed',
      visitStatus: 'Appointment Confirmed',
      reason: bookingData.reason
    };
    appointmentsList.unshift(newApt); // Simulates adding to list
    setBookingStep(1);
    setBookingData({ department: '', doctor: '', date: '', timeSlot: '', reason: '' });
    setActiveTab('appointments');
  };

  // QR Code payment confirmation
  const handleSimulatePayment = (billId) => {
    const billIdx = billingRecords.findIndex(b => b.id === billId);
    if (billIdx !== -1) {
      billingRecords[billIdx].status = 'Paid';
      billingRecords[billIdx].paid = billingRecords[billIdx].total;
      billingRecords[billIdx].remaining = 0;
      billingRecords[billIdx].txn = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      billingRecords[billIdx].paidAt = new Date().toLocaleString();
      setSelectedItem(billingRecords[billIdx]);
      setActiveModal('invoice-details');
    }
  };

  // Close search dropdown on click away
  useEffect(() => {
    const handleClose = () => setShowSearchDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row antialiased">
      
      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden cursor-pointer" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* 5. Patient Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo & Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-teal-400 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-lg text-deep-navy tracking-tight block leading-tight">CareFlow</span>
                <span className="text-[10px] text-teal font-semibold tracking-wider uppercase block leading-none">Care. Connect. Cure.</span>
              </div>
            </div>
            {/* Mobile close toggle */}
            <button className="md:hidden text-slate-500 hover:text-slate-900 cursor-pointer" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'mydoctors', label: 'My Doctors', icon: Users },
              { id: 'medicalrecords', label: 'Medical Records', icon: FileText },
              { id: 'labreports', label: 'Lab Reports', icon: FlaskConical },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => n.unread).length }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${isActive ? 'bg-blue-50/75 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-red text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile/Settings footer in sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              setActiveTab('myprofile');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'myprofile' ? 'bg-blue-50 text-primary font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-white">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-deep-navy truncate leading-snug">{profileData.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate leading-none">CF-2026-00125</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50 relative pb-16 md:pb-0">
        
        {/* 6. Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden text-slate-500 hover:text-slate-900 cursor-pointer" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-deep-navy capitalize truncate">
              {activeTab === 'mydoctors' ? 'My Doctors' : activeTab === 'medicalrecords' ? 'Medical Records' : activeTab === 'labreports' ? 'Lab Reports' : activeTab === 'billing' ? 'Billing & Payments' : activeTab}
            </h2>
          </div>

          {/* 7. Global Search & Bell / Avatar Icons */}
          <div className="flex items-center gap-4 relative">
            <div className="relative hidden sm:block w-64" onClick={(e) => e.stopPropagation()}>
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search your records..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder-slate-400"
              />
              
              {/* Contextual Search Dropdown Panel */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Search Results
                  </div>
                  {getFilteredSearchResults().length > 0 ? (
                    getFilteredSearchResults().map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchResultClick(res)}
                        className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex flex-col gap-0.5 cursor-pointer"
                      >
                        <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full w-fit">
                          {res.category}
                        </span>
                        <span className="text-xs font-bold text-deep-navy">{res.title}</span>
                        <span className="text-[10px] text-slate-500 truncate">{res.subtitle}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matches found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification trigger */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Sync Refresh button */}
            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className={`p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer ${isSyncing ? 'animate-spin' : ''}`}
              title="Sync Healthcare Data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            {/* Mobile quick settings access */}
            <button
              onClick={() => setActiveTab('myprofile')}
              className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs border border-white cursor-pointer select-none"
            >
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </button>
          </div>
        </header>

        {/* Sync Success Alert Notification Banner */}
        {showSyncSuccess && (
          <div className="bg-emerald-50 border-y border-emerald-200 text-emerald-700 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 select-none animate-fade-in shadow-sm">
            <Check className="h-4 w-4" />
            <span>Success: Patient medical dashboard has been synchronized with the CareFlow main diagnostic logs.</span>
          </div>
        )}

        {/* Tab-Based Views rendering simulated states */}
        <main className="p-4 md:p-8 flex-1">
          {isSyncing ? (
            /* 34. Skeletons Loading View */
            <div className="space-y-6 animate-pulse">
              <div className="h-10 bg-slate-200 rounded-xl w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-48 bg-slate-200 rounded-2xl"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'appointments' && renderAppointments()}
              {activeTab === 'mydoctors' && renderMyDoctors()}
              {activeTab === 'medicalrecords' && renderMedicalRecords()}
              {activeTab === 'labreports' && renderLabReports()}
              {activeTab === 'prescriptions' && renderPrescriptions()}
              {activeTab === 'billing' && renderBilling()}
              {activeTab === 'notifications' && renderNotifications()}
              {activeTab === 'myprofile' && renderProfile()}
            </>
          )}
        </main>

        {/* Mobile bottom navigation bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg">
          {[
            { id: 'dashboard', label: 'Home', icon: Home },
            { id: 'appointments', label: 'Booking', icon: Calendar },
            { id: 'medicalrecords', label: 'Records', icon: FileText },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'myprofile', label: 'Profile', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${isActive ? 'text-primary' : 'text-slate-400'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Render Active Modals */}
      {activeModal && renderModals()}
    </div>
  );

  // ==================== RENDERING SUBVIEWS ====================

  // 8. Patient Dashboard Tab
  function renderDashboard() {
    return (
      <div className="space-y-6">
        
        {/* Header Slogan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Good Morning, {profileData.name.split(' ')[0]} 👋</h1>
            <p className="text-sm text-slate-500 mt-0.5">Here's your healthcare overview for today.</p>
          </div>
          
          {/* Quick Actions Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setBookingStep(1);
                setActiveTab('appointments');
                // Scroll down to booking or let tab trigger booking view
                const el = document.getElementById('book-appointment-header');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-10 px-4 rounded-xl text-xs font-bold premium-button flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>+ Book Appointment</span>
            </button>
            <button
              onClick={() => setActiveTab('labreports')}
              className="h-10 px-4 rounded-xl text-xs font-bold glass-button-secondary text-primary flex items-center gap-2 cursor-pointer"
            >
              <span>View Lab Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className="h-10 px-4 rounded-xl text-xs font-bold glass-button-secondary text-primary flex items-center gap-2 cursor-pointer"
            >
              <span>Pay Invoice</span>
            </button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Next Appointment Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Appointment</span>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 font-semibold">Today • 10:30 AM</p>
              <p className="text-sm font-extrabold text-deep-navy mt-1">Dr. Anjali Mehta</p>
              <p className="text-xs text-teal font-semibold">Cardiology</p>
            </div>
            <span className="mt-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1 select-none">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
              Confirmed
            </span>
          </div>

          {/* Lab Test Status Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lab Reports</span>
              <FlaskConical className="h-5 w-5 text-teal" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-deep-navy">1 <span className="text-xs text-slate-400 font-normal">verified</span></p>
              <p className="text-xs text-slate-500 mt-1">CBC Hemoglobin results ready</p>
            </div>
            <span className="mt-3 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1 select-none">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
              1 Processing
            </span>
          </div>

          {/* Active Prescriptions Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Medication</span>
              <Pill className="h-5 w-5 text-violet-500" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-deep-navy">2 <span className="text-xs text-slate-400 font-normal">active</span></p>
              <p className="text-xs text-slate-500 mt-1">Amoxicillin & Propranolol</p>
            </div>
            <span className="mt-3 bg-blue-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full w-fit flex items-center gap-1 select-none">
              Auto-renew active
            </span>
          </div>

          {/* Financial Outstanding Bill */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Bill</span>
              <CreditCard className="h-5 w-5 text-red" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-red">₹1,000</p>
              <p className="text-xs text-slate-500 mt-1">Invoice #INV-2026-00126</p>
            </div>
            <button
              onClick={() => {
                setSelectedItem(billingRecords.find(b => b.status === 'Unpaid'));
                setActiveModal('payment');
              }}
              className="mt-3 text-[10px] font-bold text-primary hover:underline w-fit text-left cursor-pointer"
            >
              Pay Outstanding Bill →
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 9. Today's Visit / Active Appointment Status Timeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-deep-navy">Today's Clinic Visit</h3>
                <p className="text-xs text-slate-400">Track your current checkout diagnostics</p>
              </div>
              <span className="text-xs font-bold text-teal bg-teal-50 px-2.5 py-1 rounded-full">Active Visit</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physician</p>
                <p className="text-sm font-bold text-deep-navy">Dr. Anjali Mehta</p>
                <p className="text-xs text-slate-500">Cardiology Dept</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appointment ID</p>
                <p className="text-sm font-bold text-deep-navy">APT-2026-00452</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Time</p>
                <p className="text-sm font-bold text-deep-navy">10:30 AM</p>
              </div>
            </div>

            {/* Vertical Visit Timeline Progress Indicator */}
            <div className="mt-4 space-y-4">
              {[
                { label: 'Appointment Confirmed', desc: 'Secure booking verified in system calendar database.', status: 'completed' },
                { label: 'Checked In at Reception', desc: 'Demographics updated, waiting slot assigned.', status: 'completed' },
                { label: 'Nursing Vitals Assessment', desc: 'Blood pressure, pulse, temperature, and weight logged.', status: 'completed' },
                { label: 'Waiting for Doctor', desc: 'Estimated wait time is approximately 10 minutes.', status: 'active' },
                { label: 'Doctor Consultation', desc: 'Diagnosis, vitals critique, medical note summaries.', status: 'pending' },
                { label: 'Visit Completed', desc: 'Prescriptions issued and bills consolidated.', status: 'pending' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step.status === 'completed' ? 'bg-primary text-white' : step.status === 'active' ? 'bg-teal text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'}`}>
                      {step.status === 'completed' ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    {idx < 5 && <div className={`w-0.5 h-12 ${step.status === 'completed' ? 'bg-primary' : 'bg-slate-100'}`}></div>}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${step.status === 'active' ? 'text-teal' : step.status === 'completed' ? 'text-deep-navy' : 'text-slate-400'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 11. Recent Activity Feed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-deep-navy pb-3 border-b border-slate-100">Recent Updates</h3>
              <div className="mt-4 space-y-4">
                {[
                  { title: '🧪 CBC Report verified', desc: 'Hemoglobin and counts published.', time: '10 mins ago', type: 'report' },
                  { title: '💊 New prescription added', desc: 'Amoxicillin 500mg from Dr. Mehta.', time: '2 hours ago', type: 'prescription' },
                  { title: '💳 Invoice INV-00125 Paid', desc: 'Simulated payment completed.', time: 'Yesterday', type: 'billing' }
                ].map((act, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-primary">
                      {act.type === 'report' ? <FlaskConical className="h-4 w-4" /> : act.type === 'prescription' ? <Pill className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-deep-navy">{act.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{act.desc}</p>
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Consultation Summary info card */}
            <div className="bg-gradient-to-tr from-primary to-blue-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                <Shield className="h-32 w-32" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-200">Patient Guarantee</h4>
              <h3 className="font-extrabold text-lg mt-1.5 leading-snug">Secure Medical Records Protection</h3>
              <p className="text-xs text-blue-100 font-light mt-2 leading-relaxed">
                All diagnostic results, doctor summaries, and vitals updates logged by clinical staff undergo verified signature controls and encryption logs.
              </p>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // 13. Appointments Module Tab
  function renderAppointments() {
    return (
      <div className="space-y-6">
        
        {/* Booking Form Header banner */}
        <div id="book-appointment-header" className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-extrabold text-deep-navy">Appointments Management</h1>
            <p className="text-xs text-slate-500">Book new consultations or track histories.</p>
          </div>
          <span className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">
            Active Appointments: {appointmentsList.filter(a => a.status === 'Confirmed').length}
          </span>
        </div>

        {/* 16. Booking Appointment Flow Wizard Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-deep-navy pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              {bookingStep}
            </span>
            <span>Request Consultation Slot Wizard</span>
          </h3>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Steps Panel */}
            <div className="lg:col-span-2 space-y-4">
              {bookingStep === 1 && (
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Select Hospital Department</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {['Cardiology', 'Internal Medicine', 'Neurology'].map(dept => (
                      <button
                        key={dept}
                        onClick={() => setBookingData({ ...bookingData, department: dept, doctor: '' })}
                        className={`h-12 border text-xs font-bold rounded-xl transition-all cursor-pointer ${bookingData.department === dept ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Select Doctor Representative</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {getDoctorOptions().map(doc => (
                      <button
                        key={doc}
                        onClick={() => setBookingData({ ...bookingData, doctor: doc })}
                        className={`h-12 border text-xs font-bold rounded-xl transition-all cursor-pointer ${bookingData.doctor === doc ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Select Checkup Date</label>
                  <input
                    type="date"
                    min="2026-08-19"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="clinical-input w-full h-11 px-4 mt-2 rounded-xl outline-none text-xs"
                  />
                </div>
              )}

              {bookingStep === 4 && (
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Select Available Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM'].map(slot => (
                      <button
                        key={slot}
                        onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                        className={`h-11 border text-xs font-bold rounded-xl transition-all cursor-pointer ${bookingData.timeSlot === slot ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 5 && (
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Enter Reason for Visit</label>
                  <textarea
                    required
                    placeholder="Brief description of heart flutters, chest compression checks, followups, etc."
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    className="clinical-input w-full h-24 p-4 mt-2 rounded-xl outline-none text-xs"
                  />
                </div>
              )}

              {bookingStep === 6 && (
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-deep-navy pb-2 border-b border-slate-200">Confirmation Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">Department</p>
                      <p className="font-bold text-deep-navy">{bookingData.department}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Doctor</p>
                      <p className="font-bold text-deep-navy">{bookingData.doctor}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Date</p>
                      <p className="font-bold text-deep-navy">{bookingData.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Slot</p>
                      <p className="font-bold text-deep-navy">{bookingData.timeSlot}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-400">Reason for visit</p>
                    <p className="text-xs font-medium text-deep-navy mt-0.5">{bookingData.reason}</p>
                  </div>
                </div>
              )}

              {/* Wizard Navigations */}
              <div className="flex gap-3 pt-4">
                {bookingStep > 1 && (
                  <button
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                  >
                    <span>Back</span>
                  </button>
                )}

                {bookingStep < 6 ? (
                  <button
                    onClick={() => {
                      if (bookingStep === 1 && !bookingData.department) return;
                      if (bookingStep === 2 && !bookingData.doctor) return;
                      if (bookingStep === 3 && !bookingData.date) return;
                      if (bookingStep === 4 && !bookingData.timeSlot) return;
                      if (bookingStep === 5 && !bookingData.reason) return;
                      setBookingStep(bookingStep + 1);
                    }}
                    className="h-10 px-5 rounded-xl text-xs font-bold premium-button flex items-center justify-center cursor-pointer ml-auto"
                  >
                    <span>Continue</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-teal text-white hover:bg-teal-700 flex items-center justify-center cursor-pointer ml-auto"
                  >
                    <span>Confirm & Book Appointment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Summary Helper Panel */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-bold text-deep-navy mb-2">Hospital Booking Rules</h4>
              <ul className="text-[10px] text-slate-500 space-y-2 list-disc list-inside leading-relaxed">
                <li>Booking requires choosing a Department first to map available doctor schedules.</li>
                <li>Appointments can be cancelled or rescheduled up to 2 hours before the scheduled time slot.</li>
                <li>Payment for outpatient consultations can be processed pre-visit or at the receptionist queue.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Active Appointments list */}
        <div>
          <h3 className="font-extrabold text-deep-navy mb-4">Active Appointment Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointmentsList.filter(a => a.status === 'Confirmed').map(apt => (
              <div key={apt.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-teal bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{apt.dept}</span>
                    <h4 className="text-sm font-extrabold text-deep-navy mt-1">{apt.doctor}</h4>
                  </div>
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date / Time:</span>
                    <span className="font-bold text-deep-navy">{apt.date} • {apt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Appointment ID:</span>
                    <span className="font-medium text-slate-600">{apt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visit Status:</span>
                    <span className="font-bold text-primary">{apt.visitStatus}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(apt);
                    setActiveModal('appointment-details');
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 14. Appointment History */}
        <div>
          <h3 className="font-extrabold text-deep-navy mb-4">Past Visits History</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                    <th className="p-4">Appointment ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Physician</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {appointmentsList.filter(a => a.status === 'Completed').map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-deep-navy">{apt.id}</td>
                      <td className="p-4 text-slate-500">{apt.date}</td>
                      <td className="p-4 text-deep-navy font-bold">{apt.doctor}</td>
                      <td className="p-4 text-slate-500">{apt.dept}</td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedItem(apt);
                            setActiveModal('appointment-details');
                          }}
                          className="text-primary font-bold hover:underline cursor-pointer"
                        >
                          View Summary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 17. My Doctors Tab
  function renderMyDoctors() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-deep-navy">My Care Team</h1>
          <p className="text-xs text-slate-500">Doctors you have consulted with at the CareFlow diagnostic facilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctorsList.map(doc => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              
              {/* Doctor Details info */}
              <div className="p-5 flex gap-4">
                <img
                  src={doc.img}
                  alt={doc.name}
                  className="h-16 w-16 rounded-xl object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-deep-navy">{doc.name}</h4>
                  <p className="text-xs text-slate-400">{doc.title}</p>
                  <p className="text-xs text-teal font-semibold mt-1">{doc.spec} • {doc.dept}</p>
                </div>
              </div>

              {/* Consultation Stats */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400">Total Consults</p>
                  <p className="font-bold text-deep-navy">{doc.consultations} Visits</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Visited</p>
                  <p className="font-bold text-deep-navy">{doc.lastVisit}</p>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedItem(doc);
                    setActiveTab('medicalrecords'); // Redirects or opens Doctor consultation history
                  }}
                  className="w-full h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  View Consultation History
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    );
  }

  // 19. Medical Records Tab
  function renderMedicalRecords() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-deep-navy">Medical History Timeline</h1>
          <p className="text-xs text-slate-500">Your clinical reports, vitals assessment log, and doctor consult records.</p>
        </div>

        {/* 19. Medical Record timeline layout */}
        <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
          {medicalRecords.map((rec, idx) => (
            <div key={rec.id} className="relative pl-12 flex gap-4">
              
              {/* Timeline marker orb */}
              <div className="absolute left-3.5 top-1 h-5 w-5 rounded-full border-4 border-slate-50 bg-primary flex items-center justify-center shrink-0">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>

              {/* Card wrapper */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{rec.type}</span>
                    <h4 className="text-base font-extrabold text-deep-navy mt-1">{rec.diagnosis}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{rec.date} • {rec.doctor} ({rec.dept})</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedItem(rec);
                      setActiveModal('record-details');
                    }}
                    className="h-8 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    View Record Details
                  </button>
                </div>

                {/* Vitals Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-50">
                  {Object.entries(rec.vitals).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k.toUpperCase()}</p>
                      <p className="text-xs font-bold text-deep-navy">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Notes and checks summary */}
                <div className="pt-4 text-xs space-y-2">
                  <p className="text-slate-500 leading-relaxed font-light">{rec.notes}</p>
                  <div className="flex gap-2 pt-2">
                    {rec.tests.length > 0 && (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        🧪 {rec.tests.length} Labs requested
                      </span>
                    )}
                    {rec.prescriptions.length > 0 && (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        💊 {rec.prescriptions.length} Meds prescribed
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    );
  }

  // 21. Lab Reports Tab
  function renderLabReports() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-extrabold text-deep-navy">Laboratory Reports</h1>
            <p className="text-xs text-slate-500">View pathology findings and test diagnostics verification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {labReports.map(rep => (
            <div key={rep.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rep.id}</span>
                <FlaskConical className="h-5 w-5 text-teal" />
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-extrabold text-deep-navy">{rep.testName}</h4>
                <p className="text-xs text-slate-500 mt-1">Ordered by: {rep.doctor}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{rep.date} • {rep.dept}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                {rep.status === 'Ready' ? (
                  <>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                      Verified
                    </span>
                    <button
                      onClick={() => {
                        setSelectedItem(rep);
                        setActiveModal('report-details');
                      }}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      View Report
                    </button>
                  </>
                ) : (
                  <>
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                      <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      In Progress
                    </span>
                    <span className="text-[10px] text-slate-400">Ref: CBC Logs</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 23. Prescriptions Tab
  function renderPrescriptions() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-deep-navy">Prescriptions & Pharmacy</h1>
          <p className="text-xs text-slate-500">Track medication durations and checkout dispensing statuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptionsList.map(rx => (
            <div key={rx.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-extrabold text-deep-navy">Rx Prescription: {rx.id}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{rx.date} • {rx.doctor} ({rx.dept})</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${rx.status === 'Active' ? 'bg-blue-50 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                  {rx.status}
                </span>
              </div>

              {/* Medicine detail snippets */}
              <div className="py-4 space-y-3">
                {rx.medicines.map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-deep-navy">{med.name} {med.strength}</p>
                      <p className="text-[10px] text-slate-500">{med.dosage} • {med.freq} • {med.dur}</p>
                    </div>
                    <span className="text-[9px] font-bold text-teal bg-teal-50 px-2 py-0.5 rounded-full">
                      {med.status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedItem(rx);
                  setActiveModal('prescription-details');
                }}
                className="w-full h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                View Medication Instructions
              </button>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // 25. Billing & Payments Tab
  function renderBilling() {
    return (
      <div className="space-y-6">
        
        {/* Outstanding summary header banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outstanding Invoice Amount</p>
            <h2 className="text-3xl font-extrabold text-red mt-1">₹1,000</h2>
            <p className="text-xs text-slate-500 mt-1">Cardiac Follow-up Evaluation charge pending verification.</p>
          </div>
          <button
            onClick={() => {
              setSelectedItem(billingRecords.find(b => b.status === 'Unpaid'));
              setActiveModal('payment');
            }}
            className="h-10 px-6 rounded-xl text-xs font-bold bg-primary text-white hover:bg-blue-700 shadow-md cursor-pointer"
          >
            Pay Invoice Now
          </button>
        </div>

        {/* 25. Billing invoice record history */}
        <div>
          <h3 className="font-extrabold text-deep-navy mb-4">Diagnostic Billing Records</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total Fee</th>
                    <th className="p-4">Paid Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {billingRecords.map(bill => (
                    <tr key={bill.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-deep-navy">{bill.id}</td>
                      <td className="p-4 text-slate-500">{bill.date}</td>
                      <td className="p-4 text-deep-navy font-bold">₹{bill.total}</td>
                      <td className="p-4 text-slate-500">₹{bill.paid}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red'}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedItem(bill);
                            setActiveModal('invoice-details');
                          }}
                          className="text-primary font-bold hover:underline cursor-pointer"
                        >
                          View Statement
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 28. Notifications Center Tab
  function renderNotifications() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-extrabold text-deep-navy">Notification Logs</h1>
            <p className="text-xs text-slate-500">Real-time alerts, reminders, and lab report ready signals.</p>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex justify-between items-start gap-4 ${notif.unread ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${notif.unread ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                  {notif.type === 'report' ? <FlaskConical className="h-4.5 w-4.5" /> : notif.type === 'prescription' ? <Pill className="h-4.5 w-4.5" /> : notif.type === 'billing' ? <CreditCard className="h-4.5 w-4.5" /> : <Calendar className="h-4.5 w-4.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-deep-navy">{notif.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{notif.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{notif.time}</p>
                </div>
              </div>
              
              {notif.unread && (
                <button
                  onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    );
  }

  // 30. My Profile & Account Settings Tab
  function renderProfile() {
    return (
      <div className="space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-3xl border-2 border-white shadow-md">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-deep-navy">{profileData.name}</h2>
            <p className="text-xs text-slate-400 mt-1">Patient ID: CF-2026-00125</p>
            <span className="mt-2.5 inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full select-none">
              Active Member
            </span>
          </div>
          <div className="sm:ml-auto">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="h-10 px-5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {isEditingProfile ? 'Cancel Edits' : 'Edit Demographics'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Blocks */}
          <div className="lg:col-span-2 space-y-6">
            
            {isEditingProfile ? (
              /* 31. Profile Editing Form Layout */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-deep-navy pb-3 border-b border-slate-100">Update Profile Demographics</h3>
                
                {profileSuccessMsg && (
                  <div className="my-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                <form className="mt-4 space-y-4" onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-md text-xs text-on-surface pl-0.5">Full Name</label>
                      <input
                        required
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-xs text-on-surface pl-0.5">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Email Address</label>
                    <input
                      required
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Permanent Address</label>
                    <input
                      required
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl outline-none text-xs"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-5 rounded-xl text-xs font-bold premium-button cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Profile static Display */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h3 className="font-extrabold text-deep-navy pb-2 border-b border-slate-100 text-xs">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Gender</p>
                      <p className="font-bold text-deep-navy mt-0.5">{profileData.gender}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Date of Birth</p>
                      <p className="font-bold text-deep-navy mt-0.5">{profileData.dob}</p>
                    </div>
                  </div>
                </div>

                {/* Contact information */}
                <div>
                  <h3 className="font-extrabold text-deep-navy pb-2 border-b border-slate-100 text-xs">Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Phone</p>
                      <p className="font-bold text-deep-navy mt-0.5">{profileData.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Email</p>
                      <p className="font-bold text-deep-navy mt-0.5">{profileData.email}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-slate-400 font-semibold">Address</p>
                      <p className="font-bold text-deep-navy mt-0.5 leading-relaxed">{profileData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Account details */}
                <div>
                  <h3 className="font-extrabold text-deep-navy pb-2 border-b border-slate-100 text-xs">CareFlow Account Credentials</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Patient Account ID</p>
                      <p className="font-bold text-deep-navy mt-0.5">CF-2026-00125</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">System Registration Date</p>
                      <p className="font-bold text-deep-navy mt-0.5">18 Aug 2026</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right settings column */}
          <div className="space-y-6">
            
            {/* Account Settings / change password panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-extrabold text-deep-navy pb-2 border-b border-slate-100 text-xs">Update Account Password</h3>
              
              {passwordSuccessMsg && (
                <div className="my-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-semibold">
                  {passwordSuccessMsg}
                </div>
              )}
              {passwordErrorMsg && (
                <div className="my-2 bg-red-50 text-red px-3 py-1.5 rounded-xl text-[11px] font-semibold">
                  {passwordErrorMsg}
                </div>
              )}

              <form className="mt-3 space-y-3" onSubmit={handleSavePassword}>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Current Password</label>
                  <input
                    required
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="clinical-input w-full h-10 px-3 mt-1 rounded-xl outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">New Password</label>
                  <input
                    required
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="clinical-input w-full h-10 px-3 mt-1 rounded-xl outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Confirm New Password</label>
                  <input
                    required
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="clinical-input w-full h-10 px-3 mt-1 rounded-xl outline-none text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl premium-button text-xs font-bold cursor-pointer"
                >
                  Change Password
                </button>
              </form>
            </div>

            {/* Notification settings preferences */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-xs">
              <h3 className="font-extrabold text-deep-navy pb-2 border-b border-slate-100 text-xs">Alert Channels</h3>
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileData.notifEmail}
                    onChange={(e) => setProfileData({ ...profileData, notifEmail: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-200 text-primary cursor-pointer"
                  />
                  <span className="font-medium text-slate-700">Receive verified PDF lab reports via Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileData.notifSms}
                    onChange={(e) => setProfileData({ ...profileData, notifSms: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-200 text-primary cursor-pointer"
                  />
                  <span className="font-medium text-slate-700">Receive SMS appointment schedules</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileData.notifPush}
                    onChange={(e) => setProfileData({ ...profileData, notifPush: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-200 text-primary cursor-pointer"
                  />
                  <span className="font-medium text-slate-700">Enable dashboard push alerts</span>
                </label>
              </div>
            </div>

            {/* Log Out destructions card */}
            <div className="bg-red-50/20 border border-red-150 p-6 rounded-2xl">
              <h4 className="text-xs font-bold text-red">Danger Area</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Log out of the system session immediately. You will need to type credentials again.
              </p>
              <button
                onClick={() => setActiveModal('logout-confirm')}
                className="mt-3 w-full h-9 rounded-xl bg-red text-white hover:bg-red-750 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Log Out CareFlow Account
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==================== DIALOGS & OVERLAY SCREENS ====================

  function renderModals() {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        
        {/* Modal wrapper card */}
        <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-deep-navy capitalize">
              {activeModal.replace('-', ' ')}
            </h3>
            <button className="text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setActiveModal(null); setSelectedItem(null); }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 overflow-y-auto flex-1 text-xs">
            
            {/* 15. Appointment Details View */}
            {activeModal === 'appointment-details' && selectedItem && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appointment ID</p>
                  <p className="text-sm font-bold text-deep-navy">{selectedItem.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 font-semibold">Doctor Consultant</p>
                    <p className="font-bold text-deep-navy">{selectedItem.doctor}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Clinic Department</p>
                    <p className="font-bold text-deep-navy">{selectedItem.dept}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Scheduled Date</p>
                    <p className="font-bold text-deep-navy">{selectedItem.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Slot Time</p>
                    <p className="font-bold text-deep-navy">{selectedItem.time}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-semibold">Current Diagnostic Visit Status</p>
                  <p className="font-bold text-primary mt-0.5">{selectedItem.visitStatus}</p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-semibold">Stated Reason for Visit</p>
                  <p className="text-slate-600 mt-1 leading-relaxed font-light">{selectedItem.reason}</p>
                </div>

                {selectedItem.status === 'Confirmed' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        // Cancel simulation
                        setAppointmentsList(appointmentsList.map(a => a.id === selectedItem.id ? { ...a, status: 'Cancelled', visitStatus: 'Cancelled' } : a));
                        setActiveModal(null);
                      }}
                      className="h-10 px-4 rounded-xl text-xs font-bold text-red hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer ml-auto"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 20. Medical Record Details View */}
            {activeModal === 'record-details' && selectedItem && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Record Reference ID</p>
                    <p className="text-sm font-bold text-deep-navy">{selectedItem.id}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-primary px-2.5 py-0.5 rounded-full uppercase">
                    {selectedItem.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 font-semibold">Physician</p>
                    <p className="font-bold text-deep-navy">{selectedItem.doctor}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Specialization</p>
                    <p className="font-bold text-deep-navy">{selectedItem.dept}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 text-xs">
                  <p className="text-slate-400 font-semibold">Diagnosis Stated</p>
                  <p className="font-bold text-deep-navy mt-0.5">{selectedItem.diagnosis}</p>
                </div>

                {/* Vitals breakdown */}
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-semibold mb-2">Patient Vitals Profile</p>
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl">
                    {Object.entries(selectedItem.vitals).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{k}</p>
                        <p className="text-xs font-bold text-deep-navy mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-semibold">Clinical Review Summary Notes</p>
                  <p className="text-slate-600 mt-1 leading-relaxed font-light">{selectedItem.notes}</p>
                </div>

                {selectedItem.prescriptions.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-slate-400 font-semibold mb-1.5">Prescribed Medicines</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.prescriptions.map((p, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 22. Lab Report Details View */}
            {activeModal === 'report-details' && selectedItem && (
              <div className="space-y-5">
                
                {/* Laboratory header */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-teal">CareFlow Diagnostic Labs</h4>
                    <h3 className="font-extrabold text-sm mt-0.5">{selectedItem.testName}</h3>
                  </div>
                  <span className="bg-teal-500/10 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/20">
                    Verified Result
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Ordering Doctor</p>
                    <p className="font-bold text-deep-navy">{selectedItem.doctor}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Department</p>
                    <p className="font-bold text-deep-navy">{selectedItem.dept}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Collected Time</p>
                    <p className="font-medium text-slate-600">{selectedItem.collectedAt}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Verification Time</p>
                    <p className="font-medium text-slate-650">{selectedItem.verifiedAt}</p>
                  </div>
                </div>

                {/* Pathology quantitative table results */}
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-bold mb-2 uppercase text-[9px] tracking-wider">Quantitative Readings</p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200">
                          <th className="p-3">Parameter Test</th>
                          <th className="p-3">Result</th>
                          <th className="p-3">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedItem.results?.map((res, idx) => (
                          <tr key={idx}>
                            <td className="p-3 text-deep-navy font-bold">{res.param}</td>
                            <td className="p-3 text-primary font-extrabold">{res.value} <span className="text-[10px] text-slate-400 font-normal">{res.unit}</span></td>
                            <td className="p-3 text-slate-500">{res.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 italic">
                  Verified by: {selectedItem.verifiedBy}
                </div>
              </div>
            )}

            {/* 24. Prescription Details View */}
            {activeModal === 'prescription-details' && selectedItem && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescription reference ID</p>
                  <p className="text-sm font-bold text-deep-navy">{selectedItem.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 font-semibold">Ordering Doctor</p>
                    <p className="font-bold text-deep-navy">{selectedItem.doctor}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Clinic Department</p>
                    <p className="font-bold text-deep-navy">{selectedItem.dept}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-semibold mb-2">Medication Instructions</p>
                  <div className="space-y-3">
                    {selectedItem.medicines.map((med, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-deep-navy">{med.name} {med.strength}</h4>
                          <span className="text-[9px] font-bold text-teal bg-teal-50 px-2 py-0.5 rounded-full">
                            {med.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500">
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase">Dosage</span>
                            <span className="font-bold text-deep-navy">{med.dosage}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase">Frequency</span>
                            <span className="font-bold text-deep-navy">{med.freq}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase">Duration</span>
                            <span className="font-bold text-deep-navy">{med.dur}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-teal-600 font-semibold bg-teal-50/50 p-1.5 rounded-lg w-fit">
                          💡 Note: {med.inst}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 26. Invoice Details View */}
            {activeModal === 'invoice-details' && selectedItem && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Statement ID</p>
                    <p className="text-sm font-bold text-deep-navy">{selectedItem.id}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${selectedItem.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red'}`}>
                    {selectedItem.status}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-slate-400 font-bold mb-2 uppercase text-[9px] tracking-wider">Consolidated Items</p>
                  <div className="space-y-2">
                    {selectedItem.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-1">
                        <span className="text-slate-500 font-light">{it.desc}</span>
                        <span className="font-bold text-deep-navy">₹{it.cost}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-extrabold text-deep-navy">
                      <span>Total Amount:</span>
                      <span>₹{selectedItem.total}</span>
                    </div>
                  </div>
                </div>

                {selectedItem.status === 'Paid' ? (
                  <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-450 space-y-1">
                    <p>Transaction Reference: <span className="font-bold text-deep-navy">{selectedItem.txn}</span></p>
                    <p>Paid On: <span className="font-bold text-deep-navy">{selectedItem.paidAt}</span></p>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveModal('payment')}
                    className="w-full h-10 rounded-xl premium-button text-xs font-bold mt-4 cursor-pointer"
                  >
                    Pay Unpaid Balance Now
                  </button>
                )}
              </div>
            )}

            {/* 27. Payment QR code Screen */}
            {activeModal === 'payment' && selectedItem && (
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="font-extrabold text-base text-deep-navy">Scan to Pay Invoice Balance</h3>
                  <p className="text-xs text-slate-500 mt-1">CareFlow simulated academic transaction flow.</p>
                </div>

                {/* Simulated QR Code SVG */}
                <div className="flex justify-center py-2">
                  <div className="h-44 w-44 border-2 border-slate-100 bg-white p-3 rounded-2xl flex items-center justify-center shadow-md">
                    <svg className="h-36 w-36 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                      {/* Stylized QR patterns */}
                      <path d="M2 2h6v6H2V2zm8 0h6v6h-6V2zm0 8h6v6h-6v-6zM2 10h6v6H2v-6zm8 8h6v6h-6v-6zM2 18h6v6H2v-6zm16-16h6v6h-6V2zm0 8h6v6h-6v-6zm0 8h6v6h-6v-6z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Invoice:</span>
                    <span className="font-bold text-deep-navy">{selectedItem.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Due Amount:</span>
                    <span className="font-extrabold text-red">₹{selectedItem.total}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSimulatePayment(selectedItem.id)}
                    className="h-10 px-5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer w-1/2"
                  >
                    Payment Completed
                  </button>
                </div>
              </div>
            )}

            {/* 32. Log Out confirmation Modal */}
            {activeModal === 'logout-confirm' && (
              <div className="space-y-4 text-center">
                <div className="h-12 w-12 rounded-full bg-red/10 text-red flex items-center justify-center mx-auto">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-deep-navy">Sign out of CareFlow?</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    You will need to enter your login credentials again to access your patient medical files.
                  </p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="h-10 px-5 rounded-xl text-xs font-bold bg-red text-white hover:bg-red-750 cursor-pointer w-1/2"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    );
  }
};

export default PatientPortal;
