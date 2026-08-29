'use client';

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
  Activity,
  UserCheck,
  Heart,
  Thermometer,
  Scale,
  Smile,
  FileText
} from 'lucide-react';

const NursePortal = ({ user, logout }) => {
  // Mobile sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation active state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'mypatients', 'queue', 'vitals', 'records', 'notifications', 'myprofile'

  // Workspace active patient (null when in list views, holds patient object when editing vitals/assessments)
  const [activePatient, setActivePatient] = useState(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications operational log
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'New patient waiting for nursing assessment', desc: 'Rahul Verma checked in and waiting at Cardiology.', time: '5 mins ago', read: false },
    { id: 'notif-2', title: 'Priority patient added to queue', desc: 'Sara Thomas checked in (Orthopedics) with priority status.', time: '12 mins ago', read: false },
    { id: 'notif-3', title: 'Reassessment requested by Doctor', desc: 'Dr. Mehta requested BP vitals check for Arjun Kumar.', time: '30 mins ago', read: true },
  ]);

  // General temporary success notices
  const [successBanner, setSuccessBanner] = useState('');

  // Unsaved changes confirmation check
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState(null);

  // 1. Initial Mock Patients waiting for Nurse attention
  const [patients, setPatients] = useState([
    { id: 'CF-2026-00125', token: 'C-021', name: 'Rahul Verma', phone: '+91 98765 43210', email: 'rahul.verma@gmail.com', dob: '1994-08-15', gender: 'Male', address: 'Flat 402, Block C, Green Meadows, Bengaluru, KA - 560037', priority: 'Normal', status: 'Waiting for Nurse', doctor: 'Dr. Anjali Mehta', department: 'Cardiology', timeSlot: '10:30 AM' },
    { id: 'CF-2026-00141', token: 'C-022', name: 'Arjun Kumar', phone: '+91 87654 32109', email: 'arjun.kumar@yahoo.com', dob: '1988-12-03', gender: 'Male', address: 'No. 15, 3rd Cross, HSR Layout, Bengaluru, KA - 560102', priority: 'Priority', status: 'Waiting for Nurse', doctor: 'Dr. Rahul Kumar', department: 'General Medicine', timeSlot: '10:45 AM' },
    { id: 'CF-2026-00188', token: 'C-023', name: 'Sara Thomas', phone: '+91 76543 21098', email: 'sara.t@outlook.com', dob: '1991-04-22', gender: 'Female', address: '4B Orchid Towers, Whitefield, Bengaluru, KA - 560066', priority: 'High Priority', status: 'Waiting for Nurse', doctor: 'Dr. Thomas', department: 'Orthopedics', timeSlot: '11:00 AM' },
  ]);

  // Vitals form data
  const [vitalsData, setVitalsData] = useState({
    bpSystolic: '',
    bpDiastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    spo2: '',
    weight: '',
    height: '',
    painScore: '0'
  });

  // Nursing Assessment Form Data
  const [assessmentData, setAssessmentData] = useState({
    chiefComplaint: '',
    appearance: 'Good',
    mobility: 'Independent',
    notes: ''
  });

  // Records database history log
  const [nursingRecords, setNursingRecords] = useState([
    { date: '2026-08-26', patientName: 'Rahul Verma', patientId: 'CF-2026-00125', doctor: 'Dr. Anjali Mehta', department: 'Cardiology', bp: '122/82', pulse: '76', spo2: '97%', temp: '98.4°F', notes: 'Routine checkup. Patient complained of mild chest flutters last week.', recordedBy: 'Anjali' },
    { date: '2026-08-25', patientName: 'Sara Thomas', patientId: 'CF-2026-00188', doctor: 'Dr. Thomas', department: 'Orthopedics', bp: '118/78', pulse: '70', spo2: '99%', temp: '98.6°F', notes: 'Ankle recovery assessment. Sutures look clean.', recordedBy: 'Anjali' },
  ]);

  // Tasks log
  const [tasks, setTasks] = useState([
    { id: 'task-1', text: 'Record vitals — Rahul Verma', patientId: 'CF-2026-00125', done: false },
    { id: 'task-2', text: 'Recheck BP vitals — Sara Thomas', patientId: 'CF-2026-00188', done: false },
    { id: 'task-3', text: 'Complete assessment — Arjun Kumar', patientId: 'CF-2026-00141', done: false },
  ]);

  // Activity logs
  const [activities, setActivities] = useState([
    { text: "Rahul Verma vitals completed & saved", time: "2 mins ago" },
    { text: "Sara Thomas marked ready for doctor consultation", time: "8 mins ago" },
    { text: "New patient added to Cardiology nursing queue", time: "12 mins ago" },
    { text: "BP reassessment requested by Dr. Rahul Kumar", time: "20 mins ago" }
  ]);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Anjali Kumar',
    email: user?.email || 'anjali.k@careflow.com',
    phone: user?.phone || '+91 95555 12345',
    employeeId: 'NUR-00125',
    department: 'Cardiology & Triage',
    notifQueue: true,
    notifDoctor: true,
    notifTask: true
  });

  // Banner notifier
  const triggerBanner = (msg) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  // Safe checks before leaving workspace
  const isWorkspaceDirty = () => {
    return (
      vitalsData.bpSystolic !== '' ||
      vitalsData.bpDiastolic !== '' ||
      vitalsData.heartRate !== '' ||
      vitalsData.temperature !== '' ||
      vitalsData.respiratoryRate !== '' ||
      vitalsData.spo2 !== '' ||
      vitalsData.weight !== '' ||
      vitalsData.height !== '' ||
      assessmentData.chiefComplaint !== '' ||
      assessmentData.notes !== ''
    );
  };

  // Safe tab switcher
  const handleTabClick = (tabId) => {
    if (activePatient && isWorkspaceDirty()) {
      setPendingTabChange(tabId);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(tabId);
      setActivePatient(null);
    }
  };

  // Return to queue safely
  const handleReturnToQueue = () => {
    if (isWorkspaceDirty()) {
      setPendingTabChange('queue');
      setShowUnsavedModal(true);
    } else {
      setActivePatient(null);
      setActiveTab('queue');
    }
  };

  // Start patient workspace assessment
  const startAssessment = (patient) => {
    setActivePatient(patient);
    setActiveTab('vitals'); // Open workspaces

    // Load initial empty values
    setVitalsData({
      bpSystolic: '',
      bpDiastolic: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      spo2: '',
      weight: '',
      height: '',
      painScore: '0'
    });
    setAssessmentData({
      chiefComplaint: '',
      appearance: 'Good',
      mobility: 'Independent',
      notes: ''
    });
  };

  // Handle vitals and assessments save
  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!activePatient) return;

    // Validate inputs
    if (!vitalsData.bpSystolic || !vitalsData.bpDiastolic || !vitalsData.heartRate || !vitalsData.spo2) {
      alert('Please fill core vitals fields (BP, Heart Rate, and SpO2).');
      return;
    }

    // Add to records
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      patientName: activePatient.name,
      patientId: activePatient.id,
      doctor: activePatient.doctor,
      department: activePatient.department,
      bp: `${vitalsData.bpSystolic}/${vitalsData.bpDiastolic}`,
      pulse: vitalsData.heartRate,
      spo2: `${vitalsData.spo2}%`,
      temp: vitalsData.temperature ? `${vitalsData.temperature}°F` : 'N/A',
      notes: `${assessmentData.chiefComplaint ? `Complaint: ${assessmentData.chiefComplaint}. ` : ''}${assessmentData.notes}`,
      recordedBy: profileData.name
    };

    setNursingRecords(prev => [newRecord, ...prev]);

    // Update patient status to Vitals Completed
    setPatients(prev => prev.map(p => 
      p.id === activePatient.id ? { ...p, status: 'Vitals Completed' } : p
    ));

    // Update task list
    setTasks(prev => prev.map(t => 
      t.patientId === activePatient.id ? { ...t, done: true } : t
    ));

    setActivities(prev => [{ text: `${activePatient.name} vitals recorded successfully`, time: 'Just now' }, ...prev]);
    
    // Update active patient reference status
    setActivePatient(prev => ({ ...prev, status: 'Vitals Completed' }));

    // Reset workspace dirty check fields
    setVitalsData({ bpSystolic: '', bpDiastolic: '', heartRate: '', temperature: '', respiratoryRate: '', spo2: '', weight: '', height: '', painScore: '0' });
    setAssessmentData({ chiefComplaint: '', appearance: 'Good', mobility: 'Independent', notes: '' });

    triggerBanner(`Vitals & Assessment saved for ${activePatient.name}!`);
  };

  // Hand patient off to doctor
  const handleHandoff = () => {
    if (!activePatient) return;

    // Update patient status in list
    setPatients(prev => prev.map(p => 
      p.id === activePatient.id ? { ...p, status: 'Ready for Doctor' } : p
    ));

    // Add activity
    setActivities(prev => [{ text: `${activePatient.name} marked ready for doctor consultation`, time: 'Just now' }, ...prev]);
    
    const patientName = activePatient.name;
    setActivePatient(null);
    setActiveTab('queue');
    triggerBanner(`${patientName} marked ready for doctor. Consultation workflow updated.`);
  };

  // Sidebar config
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'mypatients', label: 'My Patients', icon: Users },
    { id: 'queue', label: 'Patient Queue', icon: ClipboardList, badge: patients.filter(p => p.status === 'Waiting for Nurse').length },
    { id: 'vitals', label: 'Vitals & Assessment', icon: Activity },
    { id: 'records', label: 'Nursing Records', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { id: 'myprofile', label: 'My Profile', icon: Settings },
  ];

  // Search filtered patients list
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onClick={() => handleTabClick(item.id)}
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
          <div className="h-9 w-9 rounded-xl bg-teal-650 text-white flex items-center justify-center font-bold text-xs uppercase">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{profileData.name}</h4>
            <span className="text-[10px] text-slate-400 font-medium truncate block capitalize">Nurse Station</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-on-surface font-sans flex">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar drawer Backdrop */}
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

      {/* Main Content Viewport */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-extrabold text-base sm:text-lg text-deep-navy capitalize">
              {activeTab === 'myprofile' ? 'My Profile' : activeTab === 'vitals' ? 'Vitals & Assessment' : activeTab === 'records' ? 'Nursing Records' : activeTab === 'queue' ? 'Patient Queue' : activeTab === 'mypatients' ? 'My Patients' : activeTab}
            </h2>
          </div>

          {/* Central search bar */}
          <div className="relative w-full max-w-sm mx-4 hidden md:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search patient by name or Patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="clinical-input w-full h-10 pl-10 pr-4 rounded-xl outline-none font-body-md text-xs placeholder-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Right notifications + avatar */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleTabClick('notifications')}
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
                <span className="text-[9px] text-slate-400 font-medium block mt-1 uppercase">Cardiology Triage</span>
              </div>
              <div 
                className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-teal-200 transition-colors"
                onClick={() => handleTabClick('myprofile')}
              >
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Success alert banner */}
        {successBanner && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-3 text-xs font-bold animate-slide-in relative z-25">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <p>{successBanner}</p>
            <button onClick={() => setSuccessBanner('')} className="ml-auto hover:text-emerald-250 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tab Page views */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {/* ======================================================== */}
          {/* TAB 1: NURSE DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-2xl font-extrabold text-deep-navy">Good Morning, {profileData.name.split(' ')[0]} 👋</h1>
                <p className="text-sm text-slate-500 mt-0.5">Here's your nursing overview for today.</p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waiting Assessment</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{patients.filter(p => p.status === 'Waiting for Nurse').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vitals Pending</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{patients.filter(p => p.status !== 'Vitals Completed' && p.status !== 'Ready for Doctor').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ready for Doctor</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{patients.filter(p => p.status === 'Ready for Doctor').length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Tasks</span>
                    <p className="text-xl font-extrabold text-deep-navy mt-0.5">{tasks.filter(t => !t.done).length}</p>
                  </div>
                </div>
              </div>

              {/* Waiting queue list */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-deep-navy">Patients Waiting for Nursing Assessment</h3>
                    <p className="text-xs text-slate-400">Incoming check-ins requiring vitals and complaints logs</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    View Queue →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 pl-4 pr-3">Token No</th>
                        <th className="py-3 px-3">Patient</th>
                        <th className="py-3 px-3">Appointment</th>
                        <th className="py-3 px-3">Assigned Clinic / Doctor</th>
                        <th className="py-3 px-3">Priority</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {patients.filter(p => p.status === 'Waiting for Nurse').length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-xs text-slate-400 font-medium">
                            <Check className="h-6 w-6 text-emerald-600 mx-auto" />
                            <p className="font-bold text-deep-navy mt-2">No patients waiting</p>
                            <p className="text-[11px] mt-0.5">Your nursing assessment queue is currently clear.</p>
                          </td>
                        </tr>
                      ) : (
                        patients.filter(p => p.status === 'Waiting for Nurse').map(p => (
                          <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 pl-4 pr-3 text-xs font-extrabold text-primary">{p.token}</td>
                            <td className="py-3.5 px-3 text-xs">
                              <div>
                                <p className="font-bold text-deep-navy">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">ID: {p.id}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-xs font-semibold text-deep-navy">{p.timeSlot}</td>
                            <td className="py-3.5 px-3 text-xs">
                              <div>
                                <p className="font-bold text-deep-navy">{p.doctor}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{p.department}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-xs">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.priority === 'High Priority' ? 'text-rose-700 bg-rose-50 border border-rose-100' : p.priority === 'Priority' ? 'text-amber-700 bg-amber-50 border border-amber-100' : 'text-blue-700 bg-blue-50 border border-blue-100'}`}>
                                {p.priority}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-xs">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-650 text-[9px] font-bold">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 pl-3 pr-4 text-xs text-right">
                              <button
                                onClick={() => startAssessment(p)}
                                className="h-8 px-3.5 bg-primary hover:bg-primary-container text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                              >
                                Start Assessment
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tasks and Activity Feed bottom grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Nursing Tasks checklist */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Pending Nursing Tasks
                  </h3>

                  <div className="space-y-3">
                    {tasks.filter(t => !t.done).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">All tasks completed!</p>
                    ) : (
                      tasks.filter(t => !t.done).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                          <span className="text-xs text-deep-navy font-semibold">{t.text}</span>
                          <button
                            onClick={() => {
                              const pat = patients.find(p => p.id === t.patientId);
                              if (pat) startAssessment(pat);
                            }}
                            className="h-7 px-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 cursor-pointer"
                          >
                            Complete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Activity log */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Recent Activity
                  </h3>

                  <div className="space-y-4 pl-2 relative">
                    <div className="absolute left-3 top-1.5 bottom-1.5 w-0.5 bg-slate-100"></div>
                    {activities.map((act, idx) => (
                      <div key={idx} className="flex gap-3 relative z-10">
                        <div className="h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-350 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-xs font-semibold text-deep-navy leading-snug">{act.text}</p>
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
          {/* TAB 2: MY PATIENTS */}
          {/* ======================================================== */}
          {activeTab === 'mypatients' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Assigned Patient List</h1>
                <p className="text-xs text-slate-500">Track and filter profiles assigned to you today.</p>
              </div>

              {/* Patient search & filter bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search patients by name or Patient ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl outline-none font-body-md text-xs placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Patient list cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredPatients.length === 0 ? (
                  <div className="col-span-3 py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
                    <Users className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-deep-navy mt-3">No patients found</p>
                  </div>
                ) : (
                  filteredPatients.map(p => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-4">
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-primary block leading-none mb-1">{p.token}</span>
                            <h3 className="text-sm font-extrabold text-deep-navy leading-none">{p.name}</h3>
                            <span className="text-[10px] text-slate-400 block mt-1">ID: {p.id}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.priority === 'High Priority' ? 'text-rose-700 bg-rose-50 border border-rose-100' : p.priority === 'Priority' ? 'text-amber-700 bg-amber-50 border border-amber-100' : 'text-blue-700 bg-blue-50 border border-blue-100'}`}>
                            {p.priority}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-500 font-medium">
                          <div>
                            <p>Department</p>
                            <p className="text-deep-navy font-bold">{p.department}</p>
                          </div>
                          <div>
                            <p>Physician</p>
                            <p className="text-deep-navy font-bold">{p.doctor}</p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100 my-4"></div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${p.status === 'Vitals Completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : p.status === 'Ready for Doctor' ? 'text-primary bg-primary/5 border-primary/10' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {p.status === 'Waiting for Nurse' && (
                          <button
                            onClick={() => startAssessment(p)}
                            className="w-full h-8 bg-primary hover:bg-primary-container text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                          >
                            Start Assessment
                          </button>
                        )}
                        {p.status === 'Vitals Completed' && (
                          <button
                            onClick={() => startAssessment(p)} // Re-open
                            className="w-full h-8 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Review Assessment
                          </button>
                        )}
                        {p.status === 'Ready for Doctor' && (
                          <span className="text-[10px] text-slate-400 block text-center font-bold italic select-none">Handoff complete</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PATIENT QUEUE */}
          {/* ======================================================== */}
          {activeTab === 'queue' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Nursing Assessment Queue</h1>
                <p className="text-xs text-slate-500">Monitor incoming patient checkout diagnostics and vitals triage.</p>
              </div>

              {/* Triage Queue details */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-deep-navy">Front-Desk Triage List</h3>
                  <p className="text-xs text-slate-400">Chronological patient entry wait slots</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 pl-4 pr-3">Token No.</th>
                        <th className="py-3 px-3">Patient</th>
                        <th className="py-3 px-3">Time slot</th>
                        <th className="py-3 px-3">Clinic Room / Doctor</th>
                        <th className="py-3 px-3">Triage Priority</th>
                        <th className="py-3 px-3">Triage Status</th>
                        <th className="py-3 pl-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {patients.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 pl-4 pr-3 text-xs font-extrabold text-primary">{p.token}</td>
                          <td className="py-3.5 px-3 text-xs">
                            <div>
                              <p className="font-bold text-deep-navy">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs font-semibold text-deep-navy">{p.timeSlot}</td>
                          <td className="py-3.5 px-3 text-xs font-medium text-slate-500">{p.doctor} ({p.department})</td>
                          <td className="py-3.5 px-3 text-xs">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.priority === 'High Priority' ? 'text-rose-700 bg-rose-50 border border-rose-100' : p.priority === 'Priority' ? 'text-amber-700 bg-amber-50 border border-amber-100' : 'text-blue-700 bg-blue-50 border border-blue-100'}`}>
                              {p.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-xs">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${p.status === 'Vitals Completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : p.status === 'Ready for Doctor' ? 'text-primary bg-primary/5 border-primary/10' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 pl-3 pr-4 text-xs text-right">
                            {p.status === 'Waiting for Nurse' ? (
                              <button
                                onClick={() => startAssessment(p)}
                                className="h-8 px-3 bg-primary hover:bg-primary-container text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                              >
                                Start Assessment
                              </button>
                            ) : (
                              <button
                                onClick={() => startAssessment(p)}
                                className="h-8 px-3 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                              >
                                View / Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: VITALS & ASSESSMENT CLINICAL WORKSPACE */}
          {/* ======================================================== */}
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              
              {!activePatient ? (
                <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto">
                  <ClipboardList className="h-10 w-10 text-slate-300 mx-auto" />
                  <h3 className="font-extrabold text-deep-navy text-sm mt-3">Clinical Workspace Idle</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Select a patient from the active waiting queue to log vitals and start clinical assessments.</p>
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="mt-4 h-9 px-4 rounded-xl text-xs font-bold premium-button cursor-pointer"
                  >
                    Open Patient Queue
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Workspace Patient Header Context */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase block mb-1">Active Patient Workspace</span>
                      <h2 className="text-lg font-extrabold text-deep-navy flex items-center gap-2">
                        {activePatient.name} 
                        <span className="text-xs text-slate-400 font-semibold">(ID: {activePatient.id} • DOB: {activePatient.dob})</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        Assigned: {activePatient.doctor} ({activePatient.department})
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleReturnToQueue}
                        className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Return to Queue</span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Patient Workspace grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Forms area (Span 2) */}
                    <form onSubmit={handleSaveAssessment} className="lg:col-span-2 space-y-6">
                      
                      {/* Vitals inputs */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100 flex items-center gap-2">
                          <Activity className="h-4.5 w-4.5 text-primary" />
                          <span>Record Patient Vitals</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Blood Pressure Systolic *</label>
                            <div className="relative mt-1">
                              <input
                                required
                                type="number"
                                placeholder="120"
                                value={vitalsData.bpSystolic}
                                onChange={(e) => setVitalsData({ ...vitalsData, bpSystolic: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">mmHg</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Blood Pressure Diastolic *</label>
                            <div className="relative mt-1">
                              <input
                                required
                                type="number"
                                placeholder="80"
                                value={vitalsData.bpDiastolic}
                                onChange={(e) => setVitalsData({ ...vitalsData, bpDiastolic: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">mmHg</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Heart Rate / Pulse *</label>
                            <div className="relative mt-1">
                              <input
                                required
                                type="number"
                                placeholder="72"
                                value={vitalsData.heartRate}
                                onChange={(e) => setVitalsData({ ...vitalsData, heartRate: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">bpm</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Oxygen Saturation (SpO₂)*</label>
                            <div className="relative mt-1">
                              <input
                                required
                                type="number"
                                placeholder="98"
                                value={vitalsData.spo2}
                                onChange={(e) => setVitalsData({ ...vitalsData, spo2: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Body Temperature</label>
                            <div className="relative mt-1">
                              <input
                                type="text"
                                placeholder="98.6"
                                value={vitalsData.temperature}
                                onChange={(e) => setVitalsData({ ...vitalsData, temperature: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">°F</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Respiratory Rate</label>
                            <div className="relative mt-1">
                              <input
                                type="number"
                                placeholder="18"
                                value={vitalsData.respiratoryRate}
                                onChange={(e) => setVitalsData({ ...vitalsData, respiratoryRate: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">/min</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Weight</label>
                            <div className="relative mt-1">
                              <input
                                type="number"
                                placeholder="68"
                                value={vitalsData.weight}
                                onChange={(e) => setVitalsData({ ...vitalsData, weight: e.target.value })}
                                className="clinical-input w-full h-10 px-3 rounded-lg outline-none text-xs text-deep-navy"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">kg</span>
                            </div>
                          </div>
                          <div>
                            <label className="font-label-md text-[11px] text-slate-500 pl-0.5">Pain Scale (0-10)</label>
                            <select
                              value={vitalsData.painScore}
                              onChange={(e) => setVitalsData({ ...vitalsData, painScore: e.target.value })}
                              className="clinical-input w-full h-10 px-3 mt-1 rounded-lg outline-none text-xs text-deep-navy cursor-pointer"
                            >
                              {[0,1,2,3,4,5,6,7,8,9,10].map(s => (
                                <option key={s} value={s}>{s} / 10</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Nursing Assessment & Notes */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100 flex items-center gap-2">
                          <ClipboardList className="h-4.5 w-4.5 text-primary" />
                          <span>Nursing Assessment & Complaints</span>
                        </h3>

                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Chief Complaint / Reported Concern</label>
                          <input
                            type="text"
                            placeholder="Mild headache, chest compression check follow-up..."
                            value={assessmentData.chiefComplaint}
                            onChange={(e) => setAssessmentData({ ...assessmentData, chiefComplaint: e.target.value })}
                            className="clinical-input w-full h-10 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>

                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Observations / Nursing Notes *</label>
                          <textarea
                            required
                            placeholder="Patient reports mild chest flutter since yesterday. Blood pressure within normal bounds..."
                            value={assessmentData.notes}
                            onChange={(e) => setAssessmentData({ ...assessmentData, notes: e.target.value })}
                            rows="4"
                            maxLength="500"
                            className="clinical-input w-full p-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy resize-none"
                          />
                          <span className="text-[10px] text-slate-400 font-bold block text-right mt-1">{assessmentData.notes.length} / 500 characters</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={handleReturnToQueue}
                          className="h-10 px-5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="h-10 px-6 rounded-xl font-bold text-xs premium-button cursor-pointer shadow-sm"
                        >
                          Save Vitals & Notes
                        </button>
                      </div>

                    </form>

                    {/* Right column context panel (Span 1) */}
                    <div className="space-y-6">
                      
                      {/* Visit Status Timeline */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                          Visit Timeline
                        </h3>

                        <div className="space-y-4 pl-2 relative">
                          <div className="absolute left-3.5 top-1 bottom-1 w-0.5 bg-slate-100"></div>

                          {[
                            { label: 'Checked In', done: true },
                            { label: 'Nursing Assessment', done: activePatient.status === 'Vitals Completed' || activePatient.status === 'Ready for Doctor', active: activePatient.status === 'Waiting for Nurse' },
                            { label: 'Ready for Doctor', done: activePatient.status === 'Ready for Doctor', active: activePatient.status === 'Vitals Completed' },
                            { label: 'Doctor Consultation', done: false }
                          ].map((step, idx) => (
                            <div key={idx} className="flex gap-3 relative z-10">
                              <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${step.done ? 'bg-primary text-white border-primary' : step.active ? 'bg-teal text-white border-teal ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {step.done ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                              </div>
                              <span className={`text-xs font-bold self-center ${step.active ? 'text-teal' : step.done ? 'text-deep-navy' : 'text-slate-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Doctor handoff trigger */}
                      {activePatient.status === 'Vitals Completed' && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                            Doctor Handoff
                          </h3>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Patient vitals are logged. Mark the patient ready so they appear in the Doctor's consultation wait list.
                          </p>
                          <button
                            onClick={handleHandoff}
                            className="w-full h-10 bg-teal hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                          >
                            <UserCheck className="h-4.5 w-4.5" />
                            <span>Mark Ready for Doctor</span>
                          </button>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: NURSING RECORDS HISTORY */}
          {/* ======================================================== */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Clinical Triage Ledger</h1>
                <p className="text-xs text-slate-500">View chronological history of all vitals and assessments logged.</p>
              </div>

              {/* Records List Cards */}
              <div className="space-y-4">
                {nursingRecords.map((rec, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5">{rec.date}</span>
                        <h3 className="text-sm font-extrabold text-deep-navy">{rec.patientName}</h3>
                        <p className="text-[10px] text-slate-450 font-semibold">ID: {rec.patientId}</p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-semibold text-slate-700">{rec.doctor}</span>
                        <p className="text-[10px] text-slate-400">{rec.department}</p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Vitals Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-1 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Blood Pressure</span>
                        <p className="text-deep-navy font-bold">{rec.bp} mmHg</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Heart Rate</span>
                        <p className="text-deep-navy font-bold">{rec.pulse} bpm</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">SpO₂</span>
                        <p className="text-deep-navy font-bold">{rec.spo2}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Temperature</span>
                        <p className="text-deep-navy font-bold">{rec.temp}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Recorded By</span>
                        <p className="text-deep-navy font-bold">Nurse {rec.recordedBy}</p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Notes summary */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
                      <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-1">Nursing Notes</span>
                      "{rec.notes}"
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: NOTIFICATIONS */}
          {/* ======================================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">Triage Alerts Center</h1>
                  <p className="text-xs text-slate-500">Nurse logs and waiting list alerts.</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* Notifications list */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                {notifications.map(item => (
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
                ))}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PROFILE SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'myprofile' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-xl font-extrabold text-deep-navy">Nurse Profile settings</h1>
                <p className="text-xs text-slate-500">Edit employee details and clinical preferences.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left profile edits */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Personal Details</h3>
                    
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); triggerBanner('Profile saved successfully.'); }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Nurse Name</label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Employee ID</label>
                          <input
                            disabled
                            type="text"
                            value={profileData.employeeId}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-slate-400 bg-slate-100 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Email Address</label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                        <div>
                          <label className="font-label-md text-xs text-on-surface pl-0.5">Phone Number</label>
                          <input
                            type="text"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-deep-navy"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-label-md text-xs text-on-surface pl-0.5">Assigned Clinical Department</label>
                        <input
                          disabled
                          type="text"
                          value={profileData.department}
                          className="clinical-input w-full h-11 px-4 mt-1.5 rounded-xl font-body-md text-xs outline-none text-slate-400 bg-slate-100 cursor-not-allowed"
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

                {/* Right settings preference */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Preferences */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Preferences</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifQueue}
                          onChange={(e) => setProfileData({ ...profileData, notifQueue: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">Incoming Queue Alert</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifDoctor}
                          onChange={(e) => setProfileData({ ...profileData, notifDoctor: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">Doctor consultation handoffs</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={profileData.notifTask}
                          onChange={(e) => setProfileData({ ...profileData, notifTask: e.target.checked })}
                          className="h-4 w-4 rounded text-primary border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs text-deep-navy font-semibold">Pending triage task reminders</span>
                      </label>
                    </div>
                  </div>

                  {/* Log Out card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-extrabold text-sm text-deep-navy pb-2 border-b border-slate-100">Access Account</h3>
                    <p className="text-[11px] text-slate-400 leading-normal">Exit your clinical triage session. Ensure any active vitals logs are saved.</p>
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

        {/* Footer */}
        <footer className="h-10 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex items-center justify-center shrink-0">
          © 2026 CareFlow Health • Nurse Station Triage
        </footer>

        {/* Mobile bottom navigation */}
        <nav className="h-14 bg-white border-t border-slate-200 grid grid-cols-5 lg:hidden sticky bottom-0 z-40 shadow-[0_-1px_4px_rgba(0,0,0,0.03)]">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
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
      {/* 2. CONVERTIBLE DIALOG MODALS VIEW */}
      {/* ======================================================== */}

      {/* UNSAVED CHANGES WARNING MODAL */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowUnsavedModal(false); setPendingTabChange(null); }} />

          {/* Dialog Card */}
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative z-10 animate-scale-in">
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center gap-3 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <h3 className="font-extrabold text-sm">Unsaved Changes</h3>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                You have unsaved clinical information in your workspace. Are you sure you want to leave without saving?
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUnsavedModal(false); setPendingTabChange(null); }}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-150 cursor-pointer"
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    // Reset workspace dirty check fields
                    setVitalsData({ bpSystolic: '', bpDiastolic: '', heartRate: '', temperature: '', respiratoryRate: '', spo2: '', weight: '', height: '', painScore: '0' });
                    setAssessmentData({ chiefComplaint: '', appearance: 'Good', mobility: 'Independent', notes: '' });
                    
                    if (pendingTabChange === 'queue') {
                      setActivePatient(null);
                      setActiveTab('queue');
                    } else {
                      setActiveTab(pendingTabChange);
                      setActivePatient(null);
                    }
                    setPendingTabChange(null);
                  }}
                  className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Leave Without Saving
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NursePortal;
