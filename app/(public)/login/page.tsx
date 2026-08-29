'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    const res = await login(email, password);
    if (res.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(res.message || 'Invalid credentials.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="font-body-md text-on-surface min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 w-full bg-mesh">
      {/* Google fonts material symbols */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      
      <div className="clinical-card w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[650px]">
        
        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-8 md:p-12 bg-white relative z-10 overflow-y-auto">
          <div className="w-full mx-auto flex flex-col gap-6 my-auto">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-teal-400 text-white shadow-[0_4px_12px_rgba(0,74,198,0.2)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="font-title-lg text-title-lg text-deep-navy font-bold tracking-tight">CareFlow</span>
            </div>

            {/* Header */}
            <div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-1">
                Welcome Back <span className="text-xl">👋</span>
              </h1>
              <p className="text-sm text-muted-slate leading-relaxed">Enter your details to access your clinical workspace.</p>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="glass-button-secondary w-full h-11 rounded-xl flex items-center justify-center gap-3 font-label-md text-xs text-on-surface hover:text-primary-container cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="flex items-center">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="font-label-md text-[10px] text-muted-slate uppercase px-3 tracking-wider">Or continue with email</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 p-3.5 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="email">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                    mail
                  </span>
                  <input
                    required
                    id="email"
                    type="email"
                    placeholder="dr.smith@careflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl font-body-md text-body-md text-on-surface placeholder-muted-slate/40 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                    lock
                  </span>
                  <input
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-10 rounded-xl font-body-md text-body-md text-on-surface placeholder-muted-slate/40 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary/20 focus:ring-offset-0 bg-slate-50 transition-colors cursor-pointer"
                  />
                  <span className="text-xs text-muted-slate group-hover:text-primary transition-colors select-none font-medium">
                    Remember me
                  </span>
                </label>
                <Link href="/forgot-password" className="font-label-md text-xs text-primary hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 premium-button font-title-lg text-sm rounded-xl flex items-center justify-center mt-2 cursor-pointer disabled:opacity-75 font-semibold"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-xs text-muted-slate mt-2 font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                Request access
              </Link>
            </p>
          </div>

          {/* Minimal Footer */}
          <div className="text-center mt-auto pt-6 border-t border-slate-50">
            <p className="font-label-md text-[9px] text-muted-slate/70 uppercase tracking-widest">© 2026 CareFlow Health</p>
          </div>
        </div>

        {/* Right Side: Brand Area (Hidden on Mobile) */}
        <div className="hidden md:flex w-1/2 relative bg-deep-navy overflow-hidden">
          {/* Background Image */}
          <img
            alt="DNA Helix"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            src="/images/dna.jpg"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0"></div>
          
          {/* Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-20 px-8 text-white">
            <h2 className="font-display-lg text-4xl text-center tracking-tight leading-tight font-extrabold drop-shadow-md">
              Clinical Precision,<br />
              <span className="text-secondary-fixed drop-shadow-[0_2px_10px_rgba(113,248,228,0.3)]">Elevated.</span>
            </h2>
            <p className="text-sm text-white/95 text-center mt-4 max-w-sm drop-shadow leading-relaxed font-light">
              Experience the next generation of healthcare management. Secure, seamless, and designed for modern medical professionals.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
