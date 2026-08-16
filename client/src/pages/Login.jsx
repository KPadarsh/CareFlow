import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-450 bg-clip-text text-transparent">
            CareFlow Portal
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Hospital Operations & Management System
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="name@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-650 outline-none ring-teal-500/10 transition-all focus:border-teal-500 focus:ring-4"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/10 transition duration-150 hover:brightness-110 active:scale-98 focus:outline-none"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 transition duration-150 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-400 mt-6">
          New to CareFlow?{' '}
          <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
