import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  Phone,
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
  PlusCircle,
  UserCheck,
  UserPlus,
  HelpCircle,
  Info
} from 'lucide-react';

const ReceptionPortal = ({ user, logout }) => {
  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation active state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'patients', 'appointments', 'queue', 'followups', 'notifications', 'myprofile'

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'register-patient', 'book-appointment', 'walk-in', 'cancel-confirm'
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Temporary success messages
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Initial Mock Patients Database
  const [patients, setPatients] = useState([
    { id: 'CF-2026-00125', name: 'Rahul Verma', phone: '+91 98765 43210', email: 'rahul.verma@gmail.com', dob: '1994-08-15', gender: 'male', address: 'Flat 402, Block C, Green Meadows, Bengaluru, KA - 560037' },
    { id: 'CF-2026-00141', name: 'Arjun Kumar', phone: '+91 87654 32109', email: 'arjun.kumar@yahoo.com', dob: '1988-12-03', gender: 'male', address: 'No. 15, 3rd Cross, HSR Layout, Bengaluru, KA - 560102' },
    { id: 'CF-2026-00188', name: 'Sara Thomas', phone: '+91 76543 21098', email: 'sara.t@outlook.com', dob: '1991-04-22', gender: 'female', address: '4B Orchid Towers, Whitefield, Bengaluru, KA - 560066' },
    { id: 'CF-2026-00201', name: 'Neha Das', phone: '+91 95432 10987', email: 'neha.das@gmail.com', dob: '1996-10-09', gender: 'female', address: '302 Sunrise Apts, Indiranagar, Bengaluru, KA - 560008' },
  ]);

  // 2. Initial Mock Appointments List (Unified model shared in concept)
  const [appointments, setAppointments] = useState([
    { id: 'APT-2026-00451', patientId: 'CF-2026-00125', patientName: 'Rahul Verma', doctor: 'Dr. Anjali Mehta', department: 'Cardiology', timeSlot: '09:00 AM', date: '2026-08-27', status: 'Checked In', type: 'Consultation', createdBy: 'Patient', reason: 'Routine checkup for heart palpitation follow-up.' },
    { id: 'APT-2026-00452', patientId: 'CF-2026-00141', patientName: 'Arjun Kumar', doctor: 'Dr. Rahul Kumar', department: 'General Medicine', timeSlot: '09:30 AM', date: '2026-08-27', status: 'Waiting', type: 'Walk-In', createdBy: 'Receptionist — Anjali', reason: 'High fever and cold since yesterday.' },
    { id: 'APT-2026-00453', patientId: 'CF-2026-00188', patientName: 'Sara Thomas', doctor: 'Dr. Thomas', department: 'Orthopedics', timeSlot: '10:00 AM', date: '2026-08-27', status: 'Confirmed', type: 'Consultation', createdBy: 'Patient', reason: 'Ankle pain inspection after sports practice.' },
    { id: 'APT-2026-00454', patientId: 'CF-2026-00201', patientName: 'Neha Das', doctor: 'Dr. Anjali Mehta', department: 'Cardiology', timeSlot: '10:30 AM', date: '2026-08-27', status: 'Confirmed', type: 'Consultation', createdBy: 'Patient', reason: 'Chest compression follow-up check.' }
  ]);

  // 3. Initial Mock Active Queue
  const [queue, setQueue] = useState([
    { token: 'C-021', patientName: 'Rahul Verma', doctor: 'Dr. Anjali Mehta', status: 'With Doctor', department: 'Cardiology' },
    { token: 'C-022', patientName: 'Arjun Kumar', doctor: 'Dr. Rahul Kumar', status: 'Waiting', department: 'General Medicine' }
  ]);

  // 4. Doctor Availability Status (Driven by doctors actual state)
  const [doctors, setDoctors] = useState([
    { name: 'Dr. Anjali Mehta', department: 'Cardiology', status: 'Available', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Dr. Rahul Kumar', department: 'General Medicine', status: 'In Consultation', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'Dr. Thomas', department: 'Orthopedics', status: 'Available', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Dr. Sara', department: 'Pediatrics', status: 'Unavailable', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  ]);

  // 5. Follow-Up Requests recommended by Doctors
  const [followups, setFollowups] = useState([
    { id: 'FU-001', patientId: 'CF-2026-00125', patientName: 'Rahul Verma', doctor: 'Dr. Anjali Mehta', department: 'Cardiology', suggestedDate: '2026-09-03', reason: 'Biweekly vitals check.' },
    { id: 'FU-002', patientId: 'CF-2026-00188', patientName: 'Sara Thomas', doctor: 'Dr. Thomas', department: 'Orthopedics', suggestedDate: '2026-09-10', reason: 'Suture removal and ankle scan.' }
  ]);

  // 6. Recent Operational Notifications
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'New appointment booked by patient', desc: 'Sara Thomas booked Dr. Thomas at 10:00 AM.', time: '10 mins ago', read: false },
    { id: 'notif-2', title: 'Follow-up requested by Doctor', desc: 'Dr. Mehta logged follow-up check for Rahul Verma.', time: '1 hour ago', read: false },
    { id: 'notif-3', title: 'Doctor became available', desc: 'Dr. Anjali Mehta set active duty status.', time: '2 hours ago', read: true },
  ]);

  // 7. Recent Dashboard Timeline Activity Feed
  const [activities, setActivities] = useState([
    { text: 'Rahul Verma checked in to queue', time: '2 mins ago' },
    { text: 'New booking by Sara Thomas (Patient Portal)', time: '10 mins ago' },
    { text: 'Dr. Anjali Mehta updated status to Available', time: '1 hour ago' },
    { text: 'Walk-In patient Arjun Kumar added to queue', time: '1.5 hours ago' }
  ]);

  // Booking Form State Wizard
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    patientId: '',
    department: '',
    doctor: '',
    date: '2026-08-27',
    timeSlot: '',
    reason: ''
  });

  // Patient Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    dob: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    emergencyContact: ''
  });

  // Duplicate Check warning
  const [possibleDuplicate, setPossibleDuplicate] = useState(null);

  // Walk-In Patient Form State
  const [walkinData, setWalkinData] = useState({
    patientId: '',
    department: '',
    doctor: '',
    reason: ''
  });

  // Filters for Queue & Check-In
  const [queueFilter, setQueueFilter] = useState('All');
  const [queueDeptFilter, setQueueDeptFilter] = useState('All');

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Anjali Sharma',
    email: user?.email || 'anjali.s@careflow.com',
    phone: user?.phone || '+91 91234 56789',
    gender: 'female',
    address: 'Vasanth Nagar, Bengaluru, KA - 560001',
    notifBooking: true,
    notifCheckin: true,
    notifDoctor: true
  });

  // Auto-clear notification helper
  const showBanner = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Helper search patients
  const getFilteredPatients = (query) => {
    if (!query) return [];
    return patients.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.phone.includes(query) || 
      p.id.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Shared availability slot checks (Simulates real-time double booking prevention)
  const getUnavailableSlots = (doctor, date) => {
    return appointments
      .filter(a => a.doctor === doctor && a.date === date && a.status !== 'Cancelled')
      .map(a => a.timeSlot);
  };

  // Handle patient check-in
  const handleCheckIn = (aptId) => {
    const apt = appointments.find(a => a.id === aptId);
    if (!apt) return;

    // Update appointment status
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Checked In' } : a));

    // Generate token and add to Queue
    const tokenNumber = `C-0${queue.length + 21}`;
    const newQueueItem = {
      token: tokenNumber,
      patientName: apt.patientName,
      doctor: apt.doctor,
      status: 'Waiting',
      department: apt.department
    };
    setQueue(prev => [...prev, newQueueItem]);

    // Add activity
    setActivities(prev => [{ text: `${apt.patientName} checked in to queue (${tokenNumber})`, time: 'Just now' }, ...prev]);
    showBanner(`Checked in ${apt.patientName} successfully. Generated Token: ${tokenNumber}`);
  };

  // Handle walk-in creation
  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === walkinData.patientId);
    if (!patientObj) return;

    // Create a mock appointment
    const newAptId = `APT-2026-00${appointments.length + 451}`;
    const newApt = {
      id: newAptId,
      patientId: patientObj.id,
      patientName: patientObj.name,
      doctor: walkinData.doctor,
      department: walkinData.department,
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: '2026-08-27',
      status: 'Checked In',
      type: 'Walk-In',
      createdBy: `Receptionist — ${profileData.name}`,
      reason: walkinData.reason
    };

    setAppointments(prev => [newApt, ...prev]);

    // Add to Queue directly
    const tokenNumber = `C-0${queue.length + 21}`;
    const newQueueItem = {
      token: tokenNumber,
      patientName: patientObj.name,
      doctor: walkinData.doctor,
      status: 'Waiting',
      department: walkinData.department
    };
    setQueue(prev => [...prev, newQueueItem]);

    setActivities(prev => [{ text: `Walk-In patient ${patientObj.name} added to queue (${tokenNumber})`, time: 'Just now' }, ...prev]);
    setActiveModal(null);
    setWalkinData({ patientId: '', department: '', doctor: '', reason: '' });
    showBanner(`Walk-In registered for ${patientObj.name}! Token: ${tokenNumber}`);
  };

  // Handle patient registration with duplicate checks
  const handleRegSubmit = (e) => {
    e.preventDefault();
    
    // Perform duplicate search first
    const duplicate = patients.find(p => 
      p.name.toLowerCase() === regData.name.toLowerCase() || 
      p.phone === regData.phone
    );

    if (duplicate && !possibleDuplicate) {
      setPossibleDuplicate(duplicate);
      return; // Stop and warn user
    }

    // Complete creation
    const newPatId = `CF-2026-00${patients.length + 125}`;
    const newPatient = {
      id: newPatId,
      name: regData.name,
      dob: regData.dob,
      gender: regData.gender,
      phone: regData.phone,
      email: regData.email || 'N/A',
      address: regData.address,
      emergencyContact: regData.emergencyContact || 'N/A'
    };

    setPatients(prev => [...prev, newPatient]);
    setActivities(prev => [{ text: `Registered new patient: ${regData.name}`, time: 'Just now' }, ...prev]);
    setActiveModal(null);
    setPossibleDuplicate(null);
    
    // Prefill booking wizard with this patient
    setBookingData(prev => ({ ...prev, patientId: newPatId }));
    setBookingStep(1);
    
    setRegData({ name: '', dob: '', gender: 'male', phone: '', email: '', address: '', emergencyContact: '' });
    showBanner(`Patient ${newPatient.name} registered! ID: ${newPatId}. Schedulers open.`);
    setActiveModal('book-appointment');
  };

  // Handle appointment booking wizard confirm
  const handleBookingSubmit = () => {
    const pat = patients.find(p => p.id === bookingData.patientId);
    if (!pat) return;

    const newAptId = `APT-2026-00${appointments.length + 451}`;
    const newApt = {
      id: newAptId,
      patientId: pat.id,
      patientName: pat.name,
      doctor: bookingData.doctor,
      department: bookingData.department,
      timeSlot: bookingData.timeSlot,
      date: bookingData.date,
      status: 'Confirmed',
      type: 'Consultation',
      createdBy: `Receptionist — ${profileData.name}`,
      reason: bookingData.reason
    };

    setAppointments(prev => [newApt, ...prev]);
    setActivities(prev => [{ text: `Scheduled appointment for ${pat.name} with ${bookingData.doctor}`, time: 'Just now' }, ...prev]);
    
    // Clear follow-ups if matching this scheduling action
    const matchedFollowup = followups.find(f => f.patientId === pat.id && f.doctor === bookingData.doctor);
    if (matchedFollowup) {
      setFollowups(prev => prev.filter(f => f.id !== matchedFollowup.id));
    }

    setActiveModal(null);
    setBookingStep(1);
    setBookingData({ patientId: '', department: '', doctor: '', date: '2026-08-27', timeSlot: '', reason: '' });
    showBanner(`Appointment successfully scheduled for ${pat.name}!`);
  };

  // Handle appointment cancellation
  const handleCancelConfirm = () => {
    if (!selectedAppointment) return;
    
    setAppointments(prev => prev.map(a => 
      a.id === selectedAppointment.id ? { ...a, status: 'Cancelled' } : a
    ));
    setActivities(prev => [{ text: `Cancelled appointment ${selectedAppointment.id} (${selectedAppointment.patientName})`, time: 'Just now' }, ...prev]);
    
    setActiveModal(null);
    setSelectedAppointment(null);
    showBanner('Appointment cancelled successfully.');
  };

  // Navigation Links array
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'queue', label: 'Queue & Check-In', icon: ClipboardList },
    { id: 'followups', label: 'Follow-Ups', icon: Phone },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { id: 'myprofile', label: 'My Profile', icon: Settings },
  ];

  // Search Results dropdown list
  const searchResults = getFilteredPatients(searchQuery);

  // Helper doctor filters options
  const getDoctorsForDept = (dept) => {
    return doctors.filter(d => d.department === dept);
  };

  // Render Sidebar component
  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-slate-900 text-white p-5 border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 py-3 pb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-teal-400 text-white shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight leading-none text-white">CareFlow</h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Care. Connect. Cure.</span>
          </div>
        </div>

        {/* Separator line */}
        <div className="h-px bg-slate-800 mb-6"></div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-body-md text-xs cursor-pointer transition-all duration-200 ${isActive ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-red text-[10px] font-bold text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="h-px bg-slate-800 my-4"></div>
        {/* Profile / Bottom Area */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{profileData.name}</h4>
            <span className="text-[10px] text-slate-400 font-medium truncate block capitalize">Receptionist</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Today's Appointments table rows rendering
  const renderAppointmentRows = (list) => {
    if (list.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="py-12 text-center">
            <div className="max-w-xs mx-auto flex flex-col items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-slate-300" />
              <p className="text-xs font-bold text-deep-navy">No appointments scheduled</p>
              <p className="text-[11px] text-slate-400">There are no consultations scheduled for the selected criteria.</p>
              <button
                onClick={() => {
                  setBookingStep(1);
                  setActiveModal('book-appointment');
                }}
                className="mt-2 h-8 px-3 rounded-lg text-[10px] font-bold premium-button cursor-pointer"
              >
                + Book Appointment
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return list.map(apt => {
      // Style badge according to status
      const getStatusBadge = (status) => {
        let colors = 'text-primary bg-blue-50 border-blue-100';
        if (status === 'Checked In') colors = 'text-emerald-700 bg-emerald-50 border-emerald-100';
        if (status === 'Waiting') colors = 'text-amber-700 bg-amber-50 border-amber-100';
        if (status === 'With Nurse') colors = 'text-teal-700 bg-teal-50 border-teal-100';
        if (status === 'With Doctor') colors = 'text-primary bg-primary/5 border-primary/10';
        if (status === 'Cancelled') colors = 'text-rose-700 bg-rose-50 border-rose-100';
        return (
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${colors}`}>
            {status}
          </span>
        );
      };

      return (
        <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          <td className="py-3.5 pl-4 pr-3 text-xs font-bold text-deep-navy">{apt.timeSlot}</td>
          <td className="py-3.5 px-3 text-xs">
            <div>
              <p className="font-bold text-deep-navy">{apt.patientName}</p>
              <p className="text-[10px] text-slate-400 font-medium">ID: {apt.patientId}</p>
            </div>
          </td>
          <td className="py-3.5 px-3 text-xs font-semibold text-deep-navy">{apt.doctor}</td>
          <td className="py-3.5 px-3 text-xs font-medium text-slate-500">{apt.department}</td>
          <td className="py-3.5 px-3 text-xs">
            <span className="text-[11px] text-slate-600 font-medium">{apt.type}</span>
          </td>
          <td className="py-3.5 px-3 text-xs">{getStatusBadge(apt.status)}</td>
          <td className="py-3.5 pl-3 pr-4 text-xs">
            <div className="flex gap-2 justify-end">
              {apt.status === 'Confirmed' && (
                <button
                  onClick={() => handleCheckIn(apt.id)}
                  className="h-8 px-3 border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Check In
                </button>
              )}
              {apt.status !== 'Cancelled' && apt.status !== 'Checked In' && apt.status !== 'Waiting' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setActiveModal('cancel-confirm');
                  }}
                  className="h-8 px-2.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50/40 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-on-surface font-sans flex">
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {renderSidebarContent()}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-extrabold text-base sm:text-lg text-deep-navy capitalize">
              {activeTab === 'myprofile' ? 'My Profile' : activeTab === 'followups' ? 'Follow-Ups' : activeTab === 'queue' ? 'Queue & Check-In' : activeTab}
            </h2>
          </div>

          {/* Central Patient Search bar */}
          <div className="relative w-full max-w-md mx-4 hidden md:block">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search patient by name, phone or Patient ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="clinical-input w-full h-10 pl-10 pr-4 rounded-xl outline-none font-body-md text-xs placeholder-slate-400 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Search Suggestions Dropdown */}
            {showSearchDropdown && searchQuery && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                    {searchResults.length} patients found
                  </span>
                  <button 
                    onClick={() => setShowSearchDropdown(false)} 
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">No patients found matching "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setRegData(prev => ({ ...prev, name: searchQuery }));
                        setShowSearchDropdown(false);
                        setActiveModal('register-patient');
                      }}
                      className="mt-2 text-xs text-primary font-bold hover:underline cursor-pointer"
                    >
                      + Register "{searchQuery}" New Patient
                    </button>
                  </div>
                ) : (
                  searchResults.map(p => {
                    // Check if they have an appointment today
                    const todayApt = appointments.find(a => a.patientId === p.id && a.date === '2026-08-27');
                    return (
                      <div key={p.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-deep-navy truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">ID: {p.id} • Phone: {p.phone}</p>
                          {todayApt && (
                            <p className="text-[9px] text-emerald-600 font-bold mt-0.5">
                              Today: {todayApt.timeSlot} • {todayApt.doctor} ({todayApt.status})
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchDropdown(false);
                              setActiveTab('patients');
                              // Pre-fill selection or just let user focus on patient row
                            }}
                            className="h-7 px-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-md text-[10px] font-bold cursor-pointer"
                          >
                            Open
                          </button>
                          {todayApt && todayApt.status === 'Confirmed' && (
                            <button
                              onClick={() => {
                                handleCheckIn(todayApt.id);
                                setSearchQuery('');
                                setShowSearchDropdown(false);
                              }}
                              className="h-7 px-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md text-[10px] font-bold cursor-pointer"
                            >
                              Check In
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* User profile dropdown info */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('notifications')}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 relative cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red"></span>
              )}
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 h-8">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-deep-navy leading-none">{profileData.name}</p>
                <span className="text-[9px] text-slate-400 font-medium capitalize mt-1 block">Front-Desk Desk A</span>
              </div>
              <div 
                className="h-9 w-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-violet-200 transition-colors"
                onClick={() => setActiveTab('myprofile')}
              >
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Global Success Notification banner */}
        {successMessage && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-3 text-xs font-bold animate-slide-in relative z-20">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <p>{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="ml-auto hover:text-emerald-200 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Tabs Container */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {/* ======================================================== */}
          {/* TAB 1: RECEPTIONIST DASHBOARD VIEW */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Header Greeting */}
              <div>
                <h1 className="text-2xl font-extrabold text-deep-navy">Good Morning, {profileData.name.split(' ')[0]} 👋</h1>
                <p className="text-sm text-slate-500 mt-0.5">Here's today's front-desk overview.</p>
              </div>

              {/* KPI Cards (4 Column Grid) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Appts</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{appointments.filter(a => a.status !== 'Cancelled').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{appointments.filter(a => a.status === 'Checked In').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Waiting</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{queue.filter(q => q.status === 'Waiting').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Patients</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">18</p>
                  </div>
                </div>
              </div>

              {/* Primary Patient Search component */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Patient</h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search patient by name, phone number or Patient ID..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl outline-none font-body-md text-xs placeholder-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => setActiveModal('register-patient')}
                    className="h-11 px-5 rounded-xl font-semibold text-xs premium-button flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>+ Register New Patient</span>
                  </button>
                </div>

                {/* Dashboard-centric search matches layout */}
                {searchQuery && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden mt-2 bg-slate-50/50">
                    <div className="p-3 bg-slate-100/60 font-semibold text-[10px] text-slate-500 uppercase">Search results list</div>
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No matches. Use the registration button to create a new profile.</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {searchResults.slice(0, 3).map(p => (
                          <div key={p.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                            <div>
                              <p className="text-xs font-bold text-deep-navy">{p.name}</p>
                              <p className="text-[10px] text-slate-500">ID: {p.id} • Phone: {p.phone} • DOB: {p.dob}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setBookingData(prev => ({ ...prev, patientId: p.id }));
                                  setBookingStep(1);
                                  setActiveModal('book-appointment');
                                }}
                                className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-100 cursor-pointer text-slate-700 bg-white"
                              >
                                Book Slot
                              </button>
                              {appointments.find(a => a.patientId === p.id && a.date === '2026-08-27' && a.status === 'Confirmed') && (
                                <button
                                  onClick={() => {
                                    const matched = appointments.find(a => a.patientId === p.id && a.date === '2026-08-27' && a.status === 'Confirmed');
                                    handleCheckIn(matched.id);
                                  }}
                                  className="h-8 px-3 rounded-lg text-xs font-semibold premium-button cursor-pointer"
                                >
                                  Check In
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Today's Appointments Table Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-deep-navy">Today's Appointments</h3>
                    <p className="text-xs text-slate-400">Scheduled consultations and front-desk statuses</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    View All Appointments →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 pl-4 pr-3">Time</th>
                        <th className="py-3 px-3">Patient</th>
                        <th className="py-3 px-3">Doctor</th>
                        <th className="py-3 px-3">Department</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {renderAppointmentRows(appointments.slice(0, 4))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Layout: Queue & Availability Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Current Queue Panel */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Current Queue</h3>
                    <button 
                      onClick={() => setActiveTab('queue')}
                      className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Manage Queue
                    </button>
                  </div>

                  <div className="mt-4 space-y-3.5 flex-grow">
                    {queue.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">Queue is clear. No waiting patients.</div>
                    ) : (
                      queue.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                          <div>
                            <span className="text-[10px] font-bold text-primary block leading-none">{item.token}</span>
                            <p className="text-xs font-bold text-deep-navy mt-1">{item.patientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{item.doctor} ({item.department})</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.status === 'Waiting' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-primary bg-primary/5 border-primary/10'}`}>
                            {item.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Doctor Availability Panel */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                    Doctor Availability
                  </h3>

                  <div className="mt-4 space-y-3 flex-grow">
                    {doctors.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-xs font-bold text-deep-navy">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{doc.department}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${doc.status === 'Available' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : doc.status === 'In Consultation' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Timeline Feed */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                    Recent Activity
                  </h3>

                  <div className="mt-4 space-y-4 flex-grow relative pl-2">
                    {/* Vertical Timeline line */}
                    <div className="absolute left-3.5 top-1 bottom-1 w-0.5 bg-slate-100"></div>

                    {activities.slice(0, 4).map((act, idx) => (
                      <div key={idx} className="flex gap-3 relative z-10">
                        <div className="h-3 w-3 rounded-full bg-slate-350 border-2 border-white mt-1 shrink-0"></div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-deep-navy leading-normal">{act.text}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: PATIENTS DIRECTORY & REGISTRATION */}
          {/* ======================================================== */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">Patients Database</h1>
                  <p className="text-xs text-slate-500">Manage patient directories and registrations.</p>
                </div>
                <button
                  onClick={() => setActiveModal('register-patient')}
                  className="h-10 px-4 rounded-xl text-xs font-bold premium-button flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>+ Register New Patient</span>
                </button>
              </div>

              {/* Patient Search bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search patients by name, phone or Patient ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl outline-none font-body-md text-xs placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Patients List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.filter(p => 
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  p.phone.includes(searchQuery) ||
                  p.id.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="col-span-2 py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
                    <Users className="h-10 w-10 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-deep-navy text-sm mt-3">No patient profiles found</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">We couldn't find any patient matching your query. Create a new record.</p>
                    <button
                      onClick={() => setActiveModal('register-patient')}
                      className="mt-4 h-9 px-4 rounded-xl text-xs font-bold premium-button cursor-pointer"
                    >
                      Register New Patient
                    </button>
                  </div>
                ) : (
                  patients.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    p.phone.includes(searchQuery) ||
                    p.id.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(pat => (
                    <div key={pat.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-primary block leading-none mb-1">{pat.id}</span>
                          <h3 className="text-sm font-extrabold text-deep-navy leading-snug">{pat.name}</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-500 font-medium">
                            <p>DOB: <span className="text-deep-navy font-semibold">{pat.dob}</span></p>
                            <p>Gender: <span className="text-deep-navy font-semibold capitalize">{pat.gender}</span></p>
                            <p className="col-span-2">Phone: <span className="text-deep-navy font-semibold">{pat.phone}</span></p>
                            <p className="col-span-2">Email: <span className="text-deep-navy font-semibold">{pat.email}</span></p>
                          </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                          {pat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 my-4"></div>

                      <div className="text-[11px] text-slate-500 font-medium">
                        <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-1">Residential Address</span>
                        <p className="text-deep-navy leading-relaxed">{pat.address}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setBookingData(prev => ({ ...prev, patientId: pat.id }));
                            setBookingStep(1);
                            setActiveModal('book-appointment');
                          }}
                          className="h-8 px-3.5 bg-primary hover:bg-primary-container text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                        >
                          Book Slot
                        </button>
                        <button
                          onClick={() => {
                            // Quick checkin walk-in slot simulation
                            setWalkinData(prev => ({ ...prev, patientId: pat.id }));
                            setActiveModal('walk-in');
                          }}
                          className="h-8 px-3.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Walk-In Check In
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: APPOINTMENTS & SCHEDULER WIZARD */}
          {/* ======================================================== */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">Consultations Scheduler</h1>
                  <p className="text-xs text-slate-500">Manage patient reservations and doctor slots.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBookingStep(1);
                      setActiveModal('book-appointment');
                    }}
                    className="h-10 px-4 rounded-xl text-xs font-bold premium-button flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>+ Book Appointment</span>
                  </button>
                </div>
              </div>

              {/* Appointments List filters & table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-deep-navy">Appointments Ledger</h3>
                  <p className="text-xs text-slate-400">All registered appointments and scheduling origin details</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 pl-4 pr-3">Time</th>
                        <th className="py-3 px-3">Patient</th>
                        <th className="py-3 px-3">Doctor</th>
                        <th className="py-3 px-3">Department</th>
                        <th className="py-3 px-3">Scheduled By</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-xs text-slate-400 font-medium">No appointments logged.</td>
                        </tr>
                      ) : (
                        appointments.map(apt => (
                          <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 pl-4 pr-3 text-xs font-bold text-deep-navy">{apt.timeSlot}</td>
                            <td className="py-3.5 px-3 text-xs">
                              <div>
                                <p className="font-bold text-deep-navy">{apt.patientName}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">ID: {apt.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-xs font-semibold text-deep-navy">{apt.doctor}</td>
                            <td className="py-3.5 px-3 text-xs font-medium text-slate-500">{apt.department}</td>
                            <td className="py-3.5 px-3 text-xs">
                              <div>
                                <span className="text-[11px] font-bold text-slate-700 block">{apt.createdBy}</span>
                                <span className="text-[9px] text-slate-400 block">{apt.type}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-xs">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${apt.status === 'Checked In' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : apt.status === 'Waiting' ? 'text-amber-700 bg-amber-50 border-amber-100' : apt.status === 'Cancelled' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-primary bg-blue-50 border-blue-100'}`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-3.5 pl-3 pr-4 text-xs">
                              <div className="flex gap-2 justify-end">
                                {apt.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleCheckIn(apt.id)}
                                    className="h-8 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    Check In
                                  </button>
                                )}
                                {apt.status !== 'Cancelled' && apt.status !== 'Checked In' && apt.status !== 'Waiting' && (
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(apt);
                                      setActiveModal('cancel-confirm');
                                    }}
                                    className="h-8 px-2.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50/40 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: QUEUE & CHECK-IN SYSTEM */}
          {/* ======================================================== */}
          {activeTab === 'queue' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">Queue & Check-In Tracker</h1>
                  <p className="text-xs text-slate-500">Monitor live patient checks and active consulting statuses.</p>
                </div>
                <button
                  onClick={() => setActiveModal('walk-in')}
                  className="h-10 px-4 rounded-xl text-xs font-bold premium-button flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>+ Walk-In Check In</span>
                </button>
              </div>

              {/* Filters Header toolbar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Status Tabs */}
                <div className="flex gap-1.5 flex-wrap w-full sm:w-auto">
                  {['All', 'Waiting', 'With Nurse', 'With Doctor', 'Completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setQueueFilter(f)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${queueFilter === f ? 'bg-primary text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Department dropdown filter */}
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={queueDeptFilter}
                    onChange={(e) => setQueueDeptFilter(e.target.value)}
                    className="clinical-input w-full h-9 px-3 rounded-xl text-xs outline-none bg-slate-50 cursor-pointer"
                  >
                    <option value="All">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                </div>

              </div>

              {/* Queue Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 pl-4 pr-3">Token No.</th>
                        <th className="py-3 px-3">Patient</th>
                        <th className="py-3 px-3">Assigned Physician</th>
                        <th className="py-3 px-3">Department</th>
                        <th className="py-3 px-3">Queue Status</th>
                        <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {queue.filter(q => {
                        const matchStatus = queueFilter === 'All' || q.status === queueFilter;
                        const matchDept = queueDeptFilter === 'All' || q.department === queueDeptFilter;
                        return matchStatus && matchDept;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-xs text-slate-400 font-medium">Queue is clear. No waiting patients match your filter.</td>
                        </tr>
                      ) : (
                        queue.filter(q => {
                          const matchStatus = queueFilter === 'All' || q.status === queueFilter;
                          const matchDept = queueDeptFilter === 'All' || q.department === queueDeptFilter;
                          return matchStatus && matchDept;
                        }).map(item => (
                          <tr key={item.token} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 pl-4 pr-3 text-xs font-extrabold text-primary">{item.token}</td>
                            <td className="py-3.5 px-3 text-xs font-bold text-deep-navy">{item.patientName}</td>
                            <td className="py-3.5 px-3 text-xs font-semibold text-deep-navy">{item.doctor}</td>
                            <td className="py-3.5 px-3 text-xs font-medium text-slate-500">{item.department}</td>
                            <td className="py-3.5 px-3 text-xs">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${item.status === 'Waiting' ? 'text-amber-700 bg-amber-50 border-amber-100' : item.status === 'With Nurse' ? 'text-teal-700 bg-teal-50 border-teal-100' : item.status === 'With Doctor' ? 'text-primary bg-blue-50 border-blue-100' : 'text-emerald-700 bg-emerald-50 border-emerald-100'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 pl-3 pr-4 text-xs text-right">
                              <span className="text-[10px] text-slate-400 font-semibold select-none italic">Controlled by Clinical Station</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: FOLLOW-UPS MANAGER */}
          {/* ======================================================== */}
          {activeTab === 'followups' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Follow-Up Consultations</h1>
                <p className="text-xs text-slate-500">Schedule appointments requested by doctor consultations.</p>
              </div>

              {/* Followup cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followups.length === 0 ? (
                  <div className="col-span-2 py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
                    <Phone className="h-10 w-10 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-deep-navy text-sm mt-3">No pending follow-ups</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">There are no pending doctor recommendations awaiting follow-up scheduling.</p>
                  </div>
                ) : (
                  followups.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase leading-none mb-1">Recommended Appointment</span>
                            <h3 className="text-sm font-extrabold text-deep-navy">{item.patientName}</h3>
                            <p className="text-[10px] text-slate-400 font-semibold">Patient ID: {item.patientId}</p>
                          </div>
                          <span className="h-8 w-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                            <Phone className="h-4.5 w-4.5" />
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] text-slate-500 font-medium">
                          <div>
                            <p>Recommended Date</p>
                            <p className="text-deep-navy font-bold">{item.suggestedDate}</p>
                          </div>
                          <div>
                            <p>Physician / Department</p>
                            <p className="text-deep-navy font-bold">{item.doctor} ({item.department})</p>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-medium leading-relaxed">
                          <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5">Doctor Diagnosis Note</span>
                          "{item.reason}"
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setBookingData(prev => ({ 
                              ...prev, 
                              patientId: item.patientId, 
                              department: item.department,
                              doctor: item.doctor,
                              date: item.suggestedDate,
                              reason: `Follow-up requested by Doctor: ${item.reason}`
                            }));
                            setBookingStep(4); // Direct to select slot
                            setActiveModal('book-appointment');
                          }}
                          className="h-8 px-4 bg-primary hover:bg-primary-container text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                        >
                          Schedule Slot
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: NOTIFICATIONS LOG */}
          {/* ======================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">Front-Desk Notifications</h1>
                  <p className="text-xs text-slate-500">Hearbeat notifications and operational logging events.</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* Notifications List */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">No notifications logged.</div>
                ) : (
                  notifications.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 flex gap-4 transition-colors hover:bg-slate-50/50 ${!item.read ? 'bg-blue-50/20' : ''}`}
                      onClick={() => setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n))}
                    >
                      <div className={`h-8.5 w-8.5 rounded-lg flex items-center justify-center shrink-0 ${!item.read ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                        <Bell className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className={`text-xs font-bold ${!item.read ? 'text-primary' : 'text-deep-navy'}`}>{item.title}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PROFILE SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'myprofile' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Anjali Sharma Profile</h1>
                <p className="text-xs text-slate-500">Edit administrative user details and notifications settings.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Profile details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Personal Details</h3>
                    
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showBanner('Profile saved successfully.'); }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Full Name</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Work Email</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Phone Number</label>
                          <input
                            type="text"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Gender</label>
                          <select
                            value={profileData.gender}
                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                            className="clinical-input w-full h-11 px-3 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-label-md text-xs text-on-surface pl-0.5">Residential Address</label>
                        <textarea
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          rows="3"
                          className="clinical-input w-full p-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="h-10 px-5 rounded-xl font-semibold text-xs premium-button flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Settings Cards */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Preferences Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Preferences</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifBooking}
                          onChange={(e) => setProfileData({ ...profileData, notifBooking: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">New Patient Bookings</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifCheckin}
                          onChange={(e) => setProfileData({ ...profileData, notifCheckin: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">Patient Check-in Vitals</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifDoctor}
                          onChange={(e) => setProfileData({ ...profileData, notifDoctor: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">Doctor Status heartbeats</span>
                      </label>
                    </div>
                  </div>

                  {/* Log Out card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Access Account</h3>
                    <p className="text-[11px] text-slate-400 leading-normal">Exit your front-desk credentials. Ensure any waiting list logs are saved.</p>
                    <button
                      onClick={logout}
                      className="w-full h-10 border border-rose-250 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out System</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>

        {/* Desktop Sticky Footer banner */}
        <footer className="h-10 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex items-center justify-center shrink-0">
          © 2026 CareFlow Health • Desk A Operations
        </footer>

        {/* 2. Mobile Bottom Navigation Bar (Hidden on desktop) */}
        <nav className="h-14 bg-white border-t border-slate-200 grid grid-cols-5 lg:hidden sticky bottom-0 z-45 shadow-[0_-1px_4px_rgba(0,0,0,0.03)]">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[9px] font-bold tracking-tight">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* ======================================================== */}
      {/* 3. CONVERTIBLE DIALOG MODALS VIEW */}
      {/* ======================================================== */}

      {/* MODAL A: NEW PATIENT REGISTRATION */}
      {activeModal === 'register-patient' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setActiveModal(null); setPossibleDuplicate(null); }} />

          {/* Dialog Card */}
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden relative z-10 animate-scale-in">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-deep-navy">Register New Patient</h3>
                <p className="text-xs text-slate-400">Add credentials to system records database.</p>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setPossibleDuplicate(null); }}
                className="h-8 w-8 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {possibleDuplicate && (
                <div className="flex flex-col gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="h-4 w-4" />
                    <span>Possible Existing Patient Profile</span>
                  </div>
                  <p className="leading-relaxed">
                    A patient named <strong>{possibleDuplicate.name}</strong> with phone <strong>{possibleDuplicate.phone}</strong> is already registered. 
                    Adding a duplicate record may affect electronic health records.
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingData(prev => ({ ...prev, patientId: possibleDuplicate.id }));
                        setBookingStep(1);
                        setPossibleDuplicate(null);
                        setActiveModal('book-appointment');
                      }}
                      className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px]"
                    >
                      Book For Existing Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setPossibleDuplicate(null)}
                      className="h-8 px-3 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 font-bold text-[10px]"
                    >
                      Correct Registration details
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                  />
                </div>
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Date of Birth *</label>
                  <input
                    required
                    type="date"
                    value={regData.dob}
                    onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                    className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Gender *</label>
                  <div className="flex gap-3 mt-1.5">
                    {['male', 'female'].map(g => (
                      <label 
                        key={g} 
                        className={`flex-grow h-10 border rounded-xl flex items-center justify-center text-xs font-bold capitalize cursor-pointer transition-all ${regData.gender === g ? 'border-primary bg-blue-50/50 text-primary' : 'border-slate-200 bg-slate-50'}`}
                      >
                        <input
                          type="radio"
                          name="regGender"
                          value={g}
                          checked={regData.gender === g}
                          onChange={() => setRegData({ ...regData, gender: g })}
                          className="hidden"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Phone Number *</label>
                  <input
                    required
                    type="text"
                    placeholder="+91 98765 XXXXX"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane.doe@email.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                  />
                </div>
                <div>
                  <label className="font-label-md text-xs text-on-surface pl-0.5">Emergency Contact Number</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={regData.emergencyContact}
                    onChange={(e) => setRegData({ ...regData, emergencyContact: e.target.value })}
                    className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">Residential Address *</label>
                <textarea
                  required
                  placeholder="Enter full billing & residential address"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                  rows="2"
                  className="clinical-input w-full p-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy resize-none"
                />
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setPossibleDuplicate(null); }}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl font-semibold text-xs premium-button cursor-pointer"
                >
                  {possibleDuplicate ? 'Ignore Warning & Register' : 'Create Patient'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL B: BOOK APPOINTMENT WIZARD */}
      {activeModal === 'book-appointment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setActiveModal(null); setBookingStep(1); }} />

          {/* Dialog Card */}
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden relative z-10 animate-scale-in">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-deep-navy">Book Consultation Appointment</h3>
                <p className="text-xs text-slate-400">Step {bookingStep} of 6 — Fill scheduling info</p>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setBookingStep(1); }}
                className="h-8 w-8 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Wizard Form fields (Left side 2 columns) */}
              <div className="md:col-span-2 space-y-4">
                
                {bookingStep === 1 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Select Patient Profile</label>
                    <select
                      value={bookingData.patientId}
                      onChange={(e) => setBookingData({ ...bookingData, patientId: e.target.value })}
                      className="clinical-input w-full h-11 px-3 rounded-xl text-xs outline-none bg-slate-50 cursor-pointer"
                    >
                      <option value="">-- Choose Patient --</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                    <div className="p-3 bg-blue-50/50 rounded-xl text-[10px] text-slate-500 flex items-center gap-2 border border-blue-100/30">
                      <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                      <p>Not registered? Cancel scheduler and register them first.</p>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Select Medical Department</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Cardiology', 'General Medicine', 'Orthopedics', 'Pediatrics'].map(dept => (
                        <button
                          type="button"
                          key={dept}
                          onClick={() => setBookingData({ ...bookingData, department: dept, doctor: '', timeSlot: '' })}
                          className={`h-12 border text-xs font-bold rounded-xl transition-all cursor-pointer ${bookingData.department === dept ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Select Clinical Physician</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getDoctorsForDept(bookingData.department).length === 0 ? (
                        <p className="text-xs text-slate-500 col-span-2">Please select a department first.</p>
                      ) : (
                        getDoctorsForDept(bookingData.department).map(d => (
                          <button
                            type="button"
                            key={d.name}
                            onClick={() => setBookingData({ ...bookingData, doctor: d.name, timeSlot: '' })}
                            className={`h-12 border text-xs font-bold rounded-xl transition-all cursor-pointer ${bookingData.doctor === d.name ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                          >
                            {d.name} ({d.status})
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {bookingStep === 4 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Select Consult Date</label>
                    <input
                      type="date"
                      min="2026-08-27"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="clinical-input w-full h-11 px-4 rounded-xl outline-none text-xs text-deep-navy"
                    />
                  </div>
                )}

                {bookingStep === 5 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Select Time Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'].map(slot => {
                        const isBooked = getUnavailableSlots(bookingData.doctor, bookingData.date).includes(slot);
                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                            className={`h-10 border text-[11px] font-bold rounded-xl transition-all cursor-pointer ${isBooked ? 'bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed line-through' : bookingData.timeSlot === slot ? 'border-primary bg-blue-50/50 text-primary ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                          >
                            {slot} {isBooked && '(Booked)'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {bookingStep === 6 && (
                  <div className="space-y-3">
                    <label className="font-label-md text-xs text-on-surface pl-0.5">Reason for Visit</label>
                    <textarea
                      required
                      placeholder="Symptoms or checkup guidelines description..."
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      rows="3"
                      className="clinical-input w-full p-4 rounded-xl font-body-md text-xs outline-none text-deep-navy resize-none"
                    />
                  </div>
                )}

                {/* Back / Next Buttons */}
                <div className="flex gap-2 pt-4">
                  {bookingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setBookingStep(prev => prev - 1)}
                      className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {bookingStep < 6 ? (
                    <button
                      type="button"
                      disabled={
                        (bookingStep === 1 && !bookingData.patientId) ||
                        (bookingStep === 2 && !bookingData.department) ||
                        (bookingStep === 3 && !bookingData.doctor) ||
                        (bookingStep === 4 && !bookingData.date) ||
                        (bookingStep === 5 && !bookingData.timeSlot)
                      }
                      onClick={() => setBookingStep(prev => prev + 1)}
                      className="h-10 px-5 rounded-xl font-semibold text-xs premium-button ml-auto cursor-pointer disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!bookingData.reason}
                      onClick={handleBookingSubmit}
                      className="h-10 px-5 rounded-xl font-semibold text-xs premium-button ml-auto cursor-pointer disabled:opacity-50"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>

              </div>

              {/* Wizard Status Preview (Right side 1 column) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-3 shrink-0 h-fit self-start">
                <h4 className="font-bold text-deep-navy pb-1.5 border-b border-slate-200 uppercase tracking-wide text-[10px]">Booking Summary</h4>
                
                <div className="space-y-2.5 font-medium text-slate-500">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Patient</span>
                    <span className="text-deep-navy font-bold">{patients.find(p => p.id === bookingData.patientId)?.name || 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Department</span>
                    <span className="text-deep-navy font-bold">{bookingData.department || 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Doctor</span>
                    <span className="text-deep-navy font-bold">{bookingData.doctor || 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Slot & Date</span>
                    <span className="text-deep-navy font-bold">
                      {bookingData.timeSlot ? `${bookingData.timeSlot} • ` : ''} {bookingData.date || 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL C: WALK-IN PATIENT REGISTRATION TO QUEUE */}
      {activeModal === 'walk-in' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />

          {/* Dialog Card */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10 animate-scale-in">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-deep-navy">Walk-In Patient Check In</h3>
                <p className="text-xs text-slate-400">Bypass scheduling and add patient directly to queue.</p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">Select Patient Profile</label>
                <select
                  required
                  value={walkinData.patientId}
                  onChange={(e) => setWalkinData({ ...walkinData, patientId: e.target.value })}
                  className="clinical-input w-full h-11 px-3 mt-1.5 rounded-xl text-xs outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">Select Department</label>
                <select
                  required
                  value={walkinData.department}
                  onChange={(e) => setWalkinData({ ...walkinData, department: e.target.value, doctor: '' })}
                  className="clinical-input w-full h-11 px-3 mt-1.5 rounded-xl text-xs outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="">-- Choose Department --</option>
                  {['Cardiology', 'General Medicine', 'Orthopedics', 'Pediatrics'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">Select Physician Representative</label>
                <select
                  required
                  value={walkinData.doctor}
                  onChange={(e) => setWalkinData({ ...walkinData, doctor: e.target.value })}
                  className="clinical-input w-full h-11 px-3 mt-1.5 rounded-xl text-xs outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="">-- Choose Doctor --</option>
                  {getDoctorsForDept(walkinData.department).map(d => (
                    <option key={d.name} value={d.name}>{d.name} ({d.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">Reason for Walk-In</label>
                <input
                  required
                  type="text"
                  placeholder="Fever checkup, emergency consult, etc."
                  value={walkinData.reason}
                  onChange={(e) => setWalkinData({ ...walkinData, reason: e.target.value })}
                  className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                />
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl font-semibold text-xs premium-button cursor-pointer"
                >
                  Add to Queue
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL D: CANCELLATION CONFIRMATION */}
      {activeModal === 'cancel-confirm' && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setActiveModal(null); setSelectedAppointment(null); }} />

          {/* Dialog Card */}
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative z-10 animate-scale-in">
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center gap-3 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-extrabold text-sm">Cancel Appointment?</h3>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel the appointment for <strong>{selectedAppointment.patientName}</strong> with <strong>{selectedAppointment.doctor}</strong> today at <strong>{selectedAppointment.timeSlot}</strong>?
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveModal(null); setSelectedAppointment(null); }}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-150 cursor-pointer"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleCancelConfirm}
                  className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionPortal;
