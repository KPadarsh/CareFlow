import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dnaImage from '../assets/dna.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(`A password reset link has been sent to ${email} (Simulation).`);
    }, 1000);
  };

  return (
    <div className="font-body-md text-on-surface min-h-screen flex items-center justify-center p-4 md:p-8 w-full bg-mesh">
      <div className="clinical-card w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[650px]">
        
        {/* Left Side: Form Area */}
        <section className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 bg-white relative z-10">
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
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-2 mb-1">
                Reset Password{' '}
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  key
                </span>
              </h1>
              <p className="text-sm text-muted-slate leading-relaxed">
                Enter your email address and we'll send you a link to securely reset your password.
              </p>
            </div>

            {success && (
              <div className="flex items-center gap-3 rounded-lg border border-teal-500/20 bg-teal-500/10 p-3.5 text-xs text-teal-600">
                <span className="material-symbols-outlined text-teal-400 text-[18px]">check_circle</span>
                <p>{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5 relative">
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="email">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate pointer-events-none text-[18px]">
                    mail
                  </span>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    placeholder="oriondoc@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl font-body-md text-body-md text-on-surface placeholder-muted-slate/40 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 premium-button font-title-lg text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-semibold"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <Link
                  to="/login"
                  className="w-full h-11 glass-button-secondary text-primary font-title-lg text-sm rounded-xl flex items-center justify-center gap-2 text-center font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>

          {/* Minimal Footer Links */}
          <div className="flex justify-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-muted-slate mt-auto pt-6 border-t border-slate-50">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Help</a>
          </div>
        </section>

        {/* Right Side: Brand Area */}
        <section className="hidden md:flex w-1/2 relative bg-deep-navy overflow-hidden flex-col justify-end">
          {/* Full Bleed Image Background */}
          <img
            alt="DNA Helix representing secure access recovery"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            src={dnaImage}
          />
          {/* Dark Gradient Backdrop for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          
          {/* Brand Messaging */}
          <div className="relative z-20 p-8 w-full text-center mb-16 text-white">
            <h2 className="font-display-lg text-4xl text-white font-extrabold leading-tight mb-4 drop-shadow-md">
              Secure Access
              <br />
              Recovery
            </h2>
            <p className="text-sm text-gray-200 max-w-xs mx-auto font-light leading-relaxed drop-shadow">
              Regain access to your clinical workspace with institutional-grade security and uncompromising clarity.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ForgotPassword;
