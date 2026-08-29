import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import dnaImage from '../assets/dna.jpg';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await register(fullName, email, password, '', gender, address);

    if (res.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-mesh text-on-background font-body-md min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 relative">
      <div className="clinical-card w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[650px] relative z-10">
        
        {/* Left Panel: Form Area */}
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
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-1">Create Account</h1>
              <p className="text-sm text-muted-slate leading-relaxed">Enter details to set up your clinical workspace.</p>
            </div>

            {/* Social Auth */}
            <button
              type="button"
              className="glass-button-secondary w-full h-11 rounded-xl flex items-center justify-center gap-3 font-label-md text-xs text-on-surface hover:text-primary-container cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.74 17.56V20.32H19.31C21.4 18.39 22.56 15.58 22.56 12.25Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23C14.97 23 17.46 22.02 19.31 20.32L15.74 17.56C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.12H2.15V16.97C3.96 20.57 7.68 23 12 23Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.82 14.12C5.6 13.45 5.47 12.74 5.47 12C5.47 11.26 5.6 10.55 5.82 9.88V7.03H2.15C1.41 8.5 1 10.21 1 12C1 13.79 1.41 15.5 2.15 16.97L5.82 14.12Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38C13.62 5.38 15.07 5.94 16.22 7.02L19.4 3.84C17.46 2.03 14.97 1 12 1C7.68 1 3.96 3.43 2.15 7.03L5.82 9.88C6.7 7.31 9.13 5.38 12 5.38Z"
                  fill="#EA4335"
                ></path>
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow h-px bg-slate-100"></div>
              <span className="px-3 font-label-md text-[10px] text-muted-slate uppercase tracking-wider">Or continue with email</span>
              <div className="flex-grow h-px bg-slate-100"></div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-error/20 bg-error/10 p-3.5 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 rounded-lg border border-teal-500/20 bg-teal-500/10 p-3.5 text-xs text-teal-600">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="firstName">
                    First name
                  </label>
                  <div className="relative mt-1.5">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                      person
                    </span>
                    <input
                      required
                      id="firstName"
                      placeholder="Jane"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl font-body-md text-body-md text-on-background placeholder-muted-slate/40 outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="lastName">
                    Last name
                  </label>
                  <div className="relative mt-1.5">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                      person
                    </span>
                    <input
                      required
                      id="lastName"
                      placeholder="Doe"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl font-body-md text-body-md text-on-background placeholder-muted-slate/40 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="email">
                  Work Email
                </label>
                <div className="relative mt-1.5">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                    mail
                  </span>
                  <input
                    required
                    id="email"
                    placeholder="dr.jane@clinic.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-4 rounded-xl font-body-md text-body-md text-on-background placeholder-muted-slate/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="password">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-slate/80 select-none text-[18px]">
                    lock
                  </span>
                  <input
                    required
                    id="password"
                    placeholder="Min. 6 characters"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="clinical-input w-full h-11 pl-11 pr-10 rounded-xl font-body-md text-body-md text-on-background placeholder-muted-slate/40 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-slate hover:text-on-surface-variant transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5">
                  Gender
                </label>
                <div className="flex gap-4 mt-1.5">
                  <label className={`flex-1 flex items-center justify-between h-11 px-4 rounded-xl border cursor-pointer transition-all duration-200 group ${gender === 'male' ? 'border-primary bg-primary/5 shadow-[0_2px_8px_rgba(37,99,235,0.06)]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}>
                    <span className="text-xs text-on-surface font-medium select-none flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] transition-colors ${gender === 'male' ? 'text-primary' : 'text-muted-slate group-hover:text-primary'}`}>
                        male
                      </span>
                      Male
                    </span>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="h-4 w-4 rounded-full border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </label>
                  <label className={`flex-1 flex items-center justify-between h-11 px-4 rounded-xl border cursor-pointer transition-all duration-200 group ${gender === 'female' ? 'border-primary bg-primary/5 shadow-[0_2px_8px_rgba(37,99,235,0.06)]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'}`}>
                    <span className="text-xs text-on-surface font-medium select-none flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] transition-colors ${gender === 'female' ? 'text-primary' : 'text-muted-slate group-hover:text-primary'}`}>
                        female
                      </span>
                      Female
                    </span>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="h-4 w-4 rounded-full border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface pl-0.5" htmlFor="address">
                  Address
                </label>
                <div className="relative mt-1.5">
                  <span className="material-symbols-outlined absolute left-4 top-3 text-muted-slate/80 select-none text-[18px]">
                    home
                  </span>
                  <textarea
                    required
                    id="address"
                    placeholder="Enter your residential address"
                    rows="2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="clinical-input w-full pl-11 pr-4 py-2.5 rounded-xl font-body-md text-body-md text-on-background placeholder-muted-slate/40 outline-none resize-none min-h-[70px]"
                  />
                </div>
              </div>

              <div className="flex items-center mt-3 mb-4">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-200 text-primary focus:ring-primary/20 bg-slate-50 cursor-pointer"
                />
                <label className="ml-2 block text-xs text-muted-slate select-none cursor-pointer" htmlFor="terms">
                  I agree to the <a className="text-primary hover:underline font-semibold" href="#">Terms of Service</a> and{' '}
                  <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="premium-button w-full h-11 rounded-xl font-label-md text-sm flex items-center justify-center cursor-pointer disabled:opacity-75 font-semibold"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-xs text-muted-slate mt-2 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                Sign in
              </Link>
            </div>
          </div>

          {/* Minimal Footer */}
          <div className="py-4 text-center mt-auto border-t border-slate-50">
            <p className="font-label-md text-[9px] text-muted-slate/70 uppercase tracking-widest">© 2026 CareFlow Health</p>
          </div>
        </div>

        {/* Right Panel: Brand Area (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 relative bg-deep-navy overflow-hidden">
          {/* Full-bleed background image */}
          <img
            alt="DNA Helix"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            src={dnaImage}
          />
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0"></div>
          
          {/* Content Overlay */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-20 px-8 text-white text-center">
            <h2 className="font-display-lg text-4xl text-white mb-4 tracking-tight leading-tight font-extrabold drop-shadow-md">
              Join the Future of Care.
            </h2>
            <p className="text-sm text-white/95 max-w-xs mx-auto leading-relaxed font-light drop-shadow">
              Streamline your clinical workflow with an interface designed for clarity, precision, and elite performance.
            </p>
          </div>

          {/* Decorative grid overlay preserved */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none opacity-30 mix-blend-overlay z-20"></div>
        </div>

      </div>
    </div>
  );
};

export default Register;
