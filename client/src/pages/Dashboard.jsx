import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  User,
  Shield,
  Smartphone,
  Mail,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  TestTube,
  FileBadge,
  Pill,
  CreditCard,
  Settings,
  HeartPulse
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  // Retrieve custom dashboard settings and content based on user role
  const getRoleConfig = (role) => {
    switch (role) {
      case 'patient':
        return {
          title: 'Patient Portal',
          color: 'from-blue-500 to-indigo-500',
          textColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          icon: HeartPulse,
          actions: [
            { label: 'Book Appointment', icon: Calendar, desc: 'Schedule a session with a specialist.' },
            { label: 'My Prescriptions', icon: Pill, desc: 'View drugs prescribed by your doctor.' },
            { label: 'Lab Test Reports', icon: TestTube, desc: 'Check status and download reports.' },
          ],
          stats: [
            { label: 'Next Appointment', value: 'Aug 20, 10:00 AM' },
            { label: 'Active Prescriptions', value: '2 Drugs' },
            { label: 'Completed Lab Tests', value: '4 Reports' },
          ],
        };
      case 'receptionist':
        return {
          title: 'Receptionist Panel',
          color: 'from-violet-500 to-purple-500',
          textColor: 'text-violet-400',
          bgColor: 'bg-violet-500/10',
          borderColor: 'border-violet-500/20',
          icon: Users,
          actions: [
            { label: 'Register New Patient', icon: User, desc: 'Add new patient demographics and details.' },
            { label: 'Schedule Appointment', icon: Calendar, desc: 'Map patient to doctor slots.' },
            { label: 'Queue Check-ins', icon: ClipboardList, desc: 'Manage incoming daily consultations.' },
          ],
          stats: [
            { label: 'Registered Today', value: '18 Patients' },
            { label: 'Scheduled Slots', value: '45 Sessions' },
            { label: 'Waiting Room Queue', value: '7 Patients' },
          ],
        };
      case 'nurse':
        return {
          title: 'Nursing Station',
          color: 'from-pink-500 to-rose-500',
          textColor: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/20',
          icon: ClipboardList,
          actions: [
            { label: 'Log Patient Vitals', icon: Activity, desc: 'Record BP, heart rate, temperature.' },
            { label: 'Triage Dashboard', icon: ClipboardList, desc: 'Assess and prioritize incoming emergencies.' },
            { label: 'Ward Occupancy', icon: Users, desc: 'Manage bed allocations and transfers.' },
          ],
          stats: [
            { label: 'Triage Pending', value: '3 Patients' },
            { label: 'Bed Occupancy', value: '82% (41/50)' },
            { label: 'Active Shifts', value: 'N-Ward B' },
          ],
        };
      case 'doctor':
        return {
          title: 'Physician Consultation Dashboard',
          color: 'from-teal-500 to-emerald-500',
          textColor: 'text-teal-400',
          bgColor: 'bg-teal-500/10',
          borderColor: 'border-teal-500/20',
          icon: Activity,
          actions: [
            { label: 'Consult Patient', icon: ClipboardList, desc: 'Open patient records, add medical notes.' },
            { label: 'Prescribe Medication', icon: Pill, desc: 'Issue digital prescriptions directly to pharmacy.' },
            { label: 'Order Laboratory Test', icon: TestTube, desc: 'Request blood, tissue, or image diagnostics.' },
          ],
          stats: [
            { label: "Today's Appointments", value: '12 Patients' },
            { label: 'Consulted Today', value: '8 Patients' },
            { label: 'Pending Review', value: '3 Test Results' },
          ],
        };
      case 'lab_technician':
        return {
          title: 'Laboratory Operations',
          color: 'from-cyan-500 to-blue-500',
          textColor: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20',
          icon: TestTube,
          actions: [
            { label: 'Pending Lab Samples', icon: ClipboardList, desc: 'Log blood, urine, or swab samples.' },
            { label: 'Enter Test Results', icon: FileText, desc: 'Input biochemical or quantitative values.' },
            { label: 'Equipment Calibration', icon: Settings, desc: 'Run routine system maintenance protocols.' },
          ],
          stats: [
            { label: 'Pending Samples', value: '14 Orders' },
            { label: 'Results Logged Today', value: '32 Tests' },
            { label: 'Lab Status', value: 'Fully Functional' },
          ],
        };
      case 'pathologist':
        return {
          title: 'Pathology Diagnostics',
          color: 'from-amber-500 to-orange-500',
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/20',
          icon: FileBadge,
          actions: [
            { label: 'Analyze Tissue Reports', icon: TestTube, desc: 'Inspect cellular histology and structures.' },
            { label: 'Sign-off Lab Reports', icon: FileBadge, desc: 'Verify and authorize final patient diagnostics.' },
            { label: 'Critical Alert Dispatch', icon: Activity, desc: 'Notify doctors of anomalous findings.' },
          ],
          stats: [
            { label: 'Pending Reviews', value: '6 Reports' },
            { label: 'Signed off Today', value: '19 Reports' },
            { label: 'High Priority Alerts', value: '1 Active' },
          ],
        };
      case 'pharmacist':
        return {
          title: 'Pharmacy Dispensing System',
          color: 'from-emerald-500 to-lime-500',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          icon: Pill,
          actions: [
            { label: 'Dispense Medicines', icon: Pill, desc: 'Verify doctor prescription and dispense drugs.' },
            { label: 'Inventory Management', icon: ClipboardList, desc: 'Track stock levels, record new batches.' },
            { label: 'Expired Drugs Log', icon: FileText, desc: 'Audit and record drug deprecations.' },
          ],
          stats: [
            { label: 'Pending Dispenses', value: '9 Invoices' },
            { label: 'Low Stock Warnings', value: '4 Items' },
            { label: 'Dispensed Today', value: '124 Items' },
          ],
        };
      case 'billing_officer':
        return {
          title: 'Billing & Invoicing System',
          color: 'from-sky-500 to-indigo-500',
          textColor: 'text-sky-400',
          bgColor: 'bg-sky-500/10',
          borderColor: 'border-sky-500/20',
          icon: CreditCard,
          actions: [
            { label: 'Create Invoice', icon: CreditCard, desc: 'Consolidate doctor charges, ward bills, pharmacy.' },
            { label: 'Process Payments', icon: CreditCard, desc: 'Record card, cash, or UPI payments.' },
            { label: 'Insurance Claims', icon: FileText, desc: 'Send claims to partnered insurance agencies.' },
          ],
          stats: [
            { label: 'Pending Invoices', value: '11 Patients' },
            { label: 'Settled Today', value: '$8,450.00' },
            { label: 'Unprocessed Claims', value: '15 Claims' },
          ],
        };
      case 'admin':
      default:
        return {
          title: 'Administration Control Center',
          color: 'from-red-500 to-orange-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          icon: Settings,
          actions: [
            { label: 'Manage User Accounts', icon: Users, desc: 'Create, modify, and delete hospital staff logins.' },
            { label: 'System Audit Logs', icon: FileText, desc: 'Monitor API activities and access security logs.' },
            { label: 'Resource Configuration', icon: Settings, desc: 'Set up departments, wards, and consult fees.' },
          ],
          stats: [
            { label: 'Active Logins', value: '38 Staff' },
            { label: 'System Status', value: 'All Services Up' },
            { label: 'Security Incidents', value: '0 Logged' },
          ],
        };
    }
  };

  const config = getRoleConfig(user.role);
  const BannerIcon = config.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-900 bg-slate-900/35 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-emerald-450 bg-clip-text text-transparent">
              CareFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-200">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition duration-155"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Card */}
        <div className={`rounded-3xl bg-gradient-to-r ${config.color} p-8 text-slate-950 shadow-xl shadow-teal-950/5 relative overflow-hidden mb-8`}>
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15">
            <BannerIcon className="h-64 w-64" />
          </div>
          <span className="inline-block rounded-full bg-slate-950/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-3">
            Welcome Back
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Hello, {user.name}
          </h1>
          <p className="text-slate-900/80 font-medium max-w-lg">
            You are logged in as a <span className="font-bold capitalize">{user.role.replace('_', ' ')}</span> with access to {config.title}.
          </p>
        </div>

        {/* Profile Card & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-6 backdrop-blur-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-900">
              <User className="h-5 w-5 text-teal-400" />
              Account Profile
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500 text-xs">Email Address</p>
                  <p className="text-slate-200 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500 text-xs">Permissions Role</p>
                  <p className="text-slate-200 font-medium capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500 text-xs">Phone Number</p>
                  <p className="text-slate-200 font-medium">{user.phone || 'Not Specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {config.stats.map((stat, idx) => (
                <div key={idx} className="rounded-xl border border-slate-900 bg-slate-900/10 p-5">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-slate-100 text-lg font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions List */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-150 mb-4">Quick Operations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.actions.map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <button
                      key={idx}
                      className={`group flex items-start text-left p-5 rounded-2xl border ${config.borderColor} ${config.bgColor} transition duration-150 hover:brightness-110 active:scale-99`}
                    >
                      <div className={`p-3 rounded-xl bg-slate-950/40 ${config.textColor} mr-4`}>
                        <ActIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">{act.label}</h3>
                        <p className="text-xs text-slate-400 mt-1">{act.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
