import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, User, Mail, Lock, Phone, Tag, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password, role, phone);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const roles = [
    { value: 'patient', label: 'Patient' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'lab_technician', label: 'Lab Technician' },
    { value: 'pathologist', label: 'Pathologist' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'billing_officer', label: 'Billing Officer' },
    { value: 'admin', label: 'Administrator' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-450 bg-clip-text text-transparent">
            Join CareFlow
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create an account to access the hospital services
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="john@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="•••••••• (Min 6 chars)"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Account Role
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Tag className="h-5 w-5" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4 appearance-none"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="bg-slate-900 text-slate-200">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/10 transition duration-150 hover:brightness-110 active:scale-98 focus:outline-none"
            >
              Register Account
              <ArrowRight className="ml-2 h-5 w-5 transition duration-150 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
